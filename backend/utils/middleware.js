const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const db = require("../config/db");
const {getData,statusCode,responseCode} = require("./common");
const { default: localizify, t } = require("localizify")
const CryptoJS = require("crypto-js")
const key = process.env.KEY || "";
const iv = process.env.IV || "";

const en = require('../languages/en')
dotenv.config({ path: "../.env" });

const multer = require("multer");

const checkApi = function (req, res, next) {
    if (req.headers['api-key'] == process.env.API_KEY) {
        next()
    } else {
        return sendResponse(req, res, 401, -1, "INVALID_API_KEY", {})
    }
}

const checkToken = async function (req, res, next) {
    try {

        req.loginUser = false;

        const token = req.headers['token'];
        if (!token) {
            return sendResponse(req, res, 401, 0, "TOKEN_MISSING", {})
            // return res.status(401).json({ message: "Token missing" });
        }

        // console.log(token)
        const bearerToken = token.replace("Bearer ", "").trim();

        let decoded;
        try {
            decoded = jwt.verify(bearerToken, process.env.JWT_WEB_TOKEN);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return sendResponse(req, res, 401, -1, "TOKEN_EXPIRED", {});
            }
            return sendResponse(req, res, 401, -1, "INVALID_TOKEN", {});
        }

        // console.log(decoded)
        let userToken = await db.query(
            `SELECT id FROM tbl_user 
             WHERE id=? AND token=? AND is_active=1 AND is_delete=0`,
            [decoded.data.id, bearerToken]
        );

        if (!userToken[0] || userToken[0].length === 0) {
            return sendResponse(req, res, 401, -1, "TOKEN_EXPIRED", {});
        }

        if (userToken[0] && userToken[0][0] && userToken[0][0].id) {
            const user = await getData("tbl_user", { id: decoded.data.id })
            if (user[0].is_active == 0 || user[0].is_deleted == 1) {
                return sendResponse(req, res, 401, -1, "USER_LOCKED", {});
            }
        }

        // decoded.id = decoded?.data?.id || null;
        req.loginUser = decoded?.data;
        next();

    } catch (error) {
        console.log(error);
        return sendResponse(req, res, 401, -1, "UNAUTHORIZED", {});
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            const loggedInRole = req.loginUser?.role || null
            if (roles.includes(loggedInRole)) {
                next()
            } else {
                return sendResponse(req, res, 401, -1, "UNAUTHORIZED", {});
            }
        } catch (error) {
            console.log(error);
            return sendResponse(req, res, 401, -1, "UNAUTHORIZED", {});
        }
    }
};

const sendResponse = function (req, res, statuscode, responsecode, messagePayload = 'failed', responsedata = {}) {
    const reqLang = req?.headers?.['Accept-Language'] || req?.headers?.['accept-language'] || 'en'

    let formatMsg = messagePayload
    if (typeof messagePayload === 'string') {
        formatMsg = getMessage(reqLang, messagePayload, {})
    } else if (messagePayload && typeof messagePayload === 'object' && messagePayload.keyword) {
        formatMsg = getMessage(reqLang, messagePayload.keyword, messagePayload.components || {})
    }
    // console.log(statuscode,responsecode,messagePayload,responsedata)
    let data = {
        code: responsecode,
        message: formatMsg,
        data: responsedata
    }

    // data = encryption(data)
    // console.log(data)

    return res.status(statuscode).send(data)
}

const getMessage = (reqLang = 'en', key, value) => {
    try {

        localizify
            .add('en', en)
            .setLocale(reqLang)

        const msg = t(key, value || {})
        return msg || key
    } catch (err) {
        console.log(err)
        return 'Something Went Wrong At Message Creation'
    }
}

const validateJoi = (schema, allowEmpty = false) => {

    const formatFieldName = (fieldName) => {
        return fieldName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const formatErrorMessage = (message, fieldName) => {
        // Remove quotes from the message
        let cleanMessage = message.replace(/"/g, '');

        // Get formatted field name
        const formattedField = formatFieldName(fieldName);

        // Extract just the error part (e.g., "is required", "must be a valid email")
        // If message starts with fieldname, remove it
        if (cleanMessage.startsWith(fieldName)) {
            cleanMessage = cleanMessage.substring(fieldName.length).trim();
        }

        return `${formattedField} ${cleanMessage}`;
    };

    return (req, res, next) => {

        if (allowEmpty) {
            next()
        } else {
            if (!allowEmpty && (!req.body || Object.keys(req.body).length === 0)) {
                return sendResponse(req, res, statusCode.badRequest, responseCode.validation_error, "FIELDS_ARE_EMPTY", {});
            }
            const { error } = schema.validate(req.body, {
                abortEarly: false
            });


            if (error) {

                const errors = {};

                error.details.forEach(err => {
                    const fieldName = err.path[0];
                    errors[fieldName] = formatErrorMessage(err.message, fieldName);
                });

                return sendResponse(req, res, statusCode.badRequest, responseCode.validation_error, "VALIDATION_ERROR", { errors });
            }

            next();
        }
    };
};


const encryption = (data) => {
    // Implement your encryption logic here
    try {
        const key = CryptoJS.enc.Utf8.parse(process.env.KEY || "");
        const iv = CryptoJS.enc.Utf8.parse(process.env.IV || "");

        if (!process.env.KEY || !process.env.IV) {
            throw new Error("Missing KEY or IV in environment variables");
        }

        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        const encryptedData = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
        }).toString();
        return encryptedData;
    } catch (error) {
        console.log("Error in encryption: ", error);
        throw new Error("Encryption failed");
    }
}

const decryption = (req, res, next) => {
    if (req.body && Object.keys(req.body).length !== 0) {
        let encryptedBody = "";
        if (typeof req.body === "string") {
            encryptedBody = req.body;
        } else if (typeof req.body.data === "string") {
            encryptedBody = req.body.data;
        } else if (typeof req.body.payload === "string") {
            encryptedBody = req.body.payload;
        } else {
            // Request body is plain JSON, so skip AES decryption.
            return next();
        }
        const decryptedData = CryptoJS.AES.decrypt(
            encryptedBody,
            CryptoJS.enc.Utf8.parse(key),
            { iv: CryptoJS.enc.Utf8.parse(iv) },
        ).toString(CryptoJS.enc.Utf8);
       
        let decryptionSend;

        try {
            decryptionSend = JSON.parse(decryptedData);
        } catch (error) {
            console.log("Error parsing decrypted data:", error.message);
            return sendResponse(req, res, 500, 0, "SERVER_ERROR", { error });
        }

        req.body = decryptionSend;
        return next();
    } else {
        req.body = null
    }

    return next();
};

// Multer storage configuration - using memory storage
const storage = multer.memoryStorage();

// Multer upload configurations - captures file and form fields
const upload = multer({ storage }).fields([
    { name: 'file', maxCount: 1 },
    { name: 'file_type', maxCount: 1 }
]);


module.exports = {
    checkApi,
    checkToken,
    sendResponse,
    getMessage,
    encryption,
    decryption,
    validateJoi,
    upload,
    checkRole
}