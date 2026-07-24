const db = require("../../config/db")
const { statusCode, responseCode } = require("../../utils/common")
const common = require("../../utils/common")
const otpTemplateEmail = require("../../template/otpTemplateEmail")
const { sendResponse } = require("../../utils/middleware")
const bcrypt = require("bcrypt")

const registerModel = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { email, password, role } = req.body

        await connection.beginTransaction();

        const [existingUser] = await connection.query("SELECT * FROM users WHERE email = ?", [email])
        if (existingUser.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "EMAIL_ALREADY_EXISTS", {})
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        const [newUser] = await connection.query("INSERT INTO users(email,password,role) VALUES(?,?,?)", [email, encryptedPassword, role])

        const otp = Math.floor(100000 + Math.random() * 900000)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes

        const [otpEntry] = await connection.query("INSERT INTO tbl_otp(email, otp, purpose, expires_at) VALUES(?,?,?,?)", [email, otp, "signup", expiresAt])
        await connection.commit();

        // Send OTP email After Commit
        await common.sendMail(email, "Your OTP Code", `Your OTP code is ${otp}.`, otpTemplateEmail(otp, expiresAt.toLocaleTimeString()))

        return sendResponse(req, res, statusCode.success, responseCode.success, "OTP_SENT_SUCCESSFULLY", {})

    }
    catch (e) {
        await connection.rollback();
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Registration" } }, {})
    } finally {
        await connection.release();
    }
}

const resendOtpModel = async (req, res) => {
    try {
        const { email, purpose } = req.body

        const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email])
        if (existingEmail.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "EMAIL_NOT_FOUND", {})
        }
        if (purpose === "signup" && existingEmail[0].is_verified) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "USER_ALREADY_VERIFIED", {})
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
        await common.sendMail(email, "Your OTP Code", `Your OTP code is ${otp}.`, otpTemplateEmail(otp, expiresAt.toLocaleTimeString()))

        const [otpEntry] = await db.query("INSERT INTO tbl_otp(email, otp, purpose, expires_at) VALUES(?,?,?,?)", [email, otp, purpose, expiresAt])

        return sendResponse(req, res, statusCode.success, responseCode.success, "OTP_SENT_SUCCESSFULLY", {})
    }
    catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Resend OTP" } }, {})
    }
}
const verifyOtpModel = async (req, res) => {
    try {
        const { email, purpose, otp } = req.body

        const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email])
        if (existingEmail.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "EMAIL_NOT_FOUND", {})
        }

        if (purpose === "signup" && existingEmail[0].is_verified) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "USER_ALREADY_VERIFIED", {})
        }

        const [existingOtp] = await db.query("SELECT * FROM tbl_otp WHERE email = ? AND purpose = ? AND otp = ? AND expires_at > NOW() AND is_used = 0", [email, purpose, otp])
        if (existingOtp.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "INVALID_OTP", {})
        }

        const [otpEntry] = await db.query("UPDATE tbl_otp SET is_used = 1 WHERE email = ? AND purpose = ? AND otp = ? AND expires_at > NOW() AND is_used = 0", [email, purpose, otp])
        if (otpEntry.affectedRows === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "INVALID_OTP", {})
        }

        const [user] = await db.query("UPDATE users SET is_verified = 1 WHERE email = ?", [email])

        return sendResponse(req, res, statusCode.success, responseCode.success, "OTP_VERIFIED_SUCCESSFULLY", {})
    }
    catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Verify OTP" } }, {})
    }
}

const createProfileModel = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const { email, role, candidate_full_name, candidate_country_code, candidate_mobile_number, candidate_city, candidate_state, candidate_country, candidate_resume_url, recruiter_full_name, recruiter_country_code, recruiter_mobile_number, recruiter_designation, company_name, company_description, company_website, company_logo_url, company_city, company_state, company_country } = req.body

        await connection.beginTransaction();
        const [existingUser] = await connection.query("SELECT * FROM users WHERE email = ? and role = ?", [email, role])
        if (existingUser.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "EMAIL_NOT_FOUND", {})
        }
        if (!existingUser[0].is_verified) {
            return sendResponse(req, res, statusCode.success, responseCode.user_not_verified, "USER_NOT_VERIFIED", {})
        }

        if (role === "candidate") {
            const [alreadyExists] = await connection.query("SELECT * FROM candidate_profiles WHERE user_id = ?", [existingUser[0].id])
            if (alreadyExists.length > 0) {
                return sendResponse(req, res, statusCode.success, responseCode.error, "PROFILE_ALREADY_EXISTS", {})
            }
            const [profile] = await connection.query("INSERT INTO candidate_profiles(user_id, full_name, country_code, mobile_number, city, state, country, resume_url) VALUES(?,?,?,?,?,?,?,?)", [existingUser[0].id, candidate_full_name, candidate_country_code, candidate_mobile_number, candidate_city, candidate_state, candidate_country, candidate_resume_url])

            await connection.commit();
            return sendResponse(req, res, statusCode.success, responseCode.success, "CANDIDATE_PROFILE_CREATED_SUCCESSFULLY", {})
        } else if (role === "recruiter") {
            const [alreadyExists] = await connection.query("SELECT * FROM recruiter_profiles WHERE user_id = ?", [existingUser[0].id])
            if (alreadyExists.length > 0) {
                return sendResponse(req, res, statusCode.success, responseCode.error, "PROFILE_ALREADY_EXISTS", {})
            }

            const [newCompany] = await connection.query("INSERT INTO companies(company_name, company_description, company_website, company_logo_url, company_city, company_state, company_country, created_by) VALUES(?,?,?,?,?,?,?,?)", [company_name, company_description, company_website, company_logo_url, company_city, company_state, company_country, existingUser[0].id])

            const [profile] = await connection.query("INSERT INTO recruiter_profiles(user_id, company_id, full_name, designation, country_code, mobile_number) VALUES(?,?,?,?,?,?)", [existingUser[0].id, newCompany[0].insertId, recruiter_full_name, recruiter_designation, recruiter_country_code, recruiter_mobile_number])

            await connection.commit();
            return sendResponse(req, res, statusCode.success, responseCode.success, "RECRUITER_PROFILE_CREATED_SUCCESSFULLY", {})
        }

        return sendResponse(req, res, statusCode.success, responseCode.error, "INVALID_REQUEST", {})
    }
    catch (e) {
        await connection.rollback();
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Create Profile" } }, {})
    }
    finally {
        await connection.release();
    }
}

const loginModel = async (req, res) => {
    try {
        const { email, password, role } = req.body
        const [user] = await db.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role])
        if (!user || user.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "REGISTER_YOURSELF", {})
        }
        const isMatch = await bcrypt.compare(password, user[0].password)
        if (!isMatch) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "INVALID_CREDENTIALS", {})
        }

        if (!user[0].is_verified) {
            return sendResponse(req, res, statusCode.success, responseCode.user_not_verified, "USER_NOT_VERIFIED", {})
        }

        if (user[0].role === "candidate") {
            const [isProfileExists] = await db.query("SELECT * FROM candidate_profiles WHERE user_id = ?", [user[0].id])
            if (!isProfileExists || isProfileExists.length === 0) {
                return sendResponse(req, res, statusCode.success, responseCode.profile_not_found, "PROFILE_STEPUP_INCOMPLETE", {})
            }
        } else if (user[0].role === "recruiter") {
            const [isProfileExists] = await db.query("SELECT * FROM recruiter_profiles WHERE user_id = ?", [user[0].id])
            if (!isProfileExists || isProfileExists.length === 0) {
                return sendResponse(req, res, statusCode.success, responseCode.profile_not_found, "PROFILE_STEPUP_INCOMPLETE", {})
            }
        }

        const token = common.jwt_sign({ id: user[0].id, email: user[0].email, role: user[0].role })
        await db.query("INSERT INTO tbl_login_tokens (user_id, token) VALUES(?,?)", [user[0].id, token])

        if(user[0].role === "candidate") {
            const candidateProfile = await common.getCandidate(user[0].id);
            return sendResponse(req, res, statusCode.success, responseCode.success, "LOGIN_SUCCESSFUL", { token, user: candidateProfile });
        } else if(user[0].role === "recruiter") {
            const recruiterProfile = await common.getRecruiter(user[0].id);
            return sendResponse(req, res, statusCode.success, responseCode.success, "LOGIN_SUCCESSFUL", { token, user: recruiterProfile });
        }

        return sendResponse(req, res, statusCode.success, responseCode.success, "LOGIN_SUCCESSFUL", { token,user: { id: user[0].id, email: user[0].email, role: user[0].role } });
    } catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Login" } }, {})
    }
}

const forgotPasswordModel = async (req, res) => {
    try {
        const { email } = req.body

        const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email])
        if (existingEmail.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "EMAIL_NOT_FOUND", {})
        }

        const otp = Math.floor(100000 + Math.random() * 900000)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes

        const [otpEntry] = await db.query("INSERT INTO tbl_otp(email, otp, purpose, expires_at) VALUES(?,?,?,?)", [email, otp, "forgot_password", expiresAt])

        await common.sendMail(email, "Your OTP Code", `Your OTP code is ${otp}.`, otpTemplateEmail(otp, expiresAt.toLocaleTimeString()))

        return sendResponse(req, res, statusCode.success, responseCode.success, "OTP_SENT_SUCCESSFULLY_FOR_FORGOT_PASSWORD", {})

    }
    catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Forgot Password" } }, {})
    }
}

const resetPasswordModel = async (req, res) => {
    try {
        const { email, password } = req.body

        const [existingEmail] = await db.query("SELECT * FROM users WHERE email = ?", [email])
        if (existingEmail.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "EMAIL_NOT_FOUND", {})
        }

        const encryptedPassword = await bcrypt.hash(password, 10)
        const [updatePassword] = await db.query("UPDATE users SET password = ? WHERE email = ?", [encryptedPassword, email])

        return sendResponse(req, res, statusCode.success, responseCode.success, "PASSWORD_RESET_SUCCESSFUL", {})
    } catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Reset Password" } }, {})
    }
}

const meModel = async (req, res) => {
    try {
        const userId = req.loginUser?.id;
        if (!userId) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "INVALID_REQUEST", {});
        }

        const [user] = await db.query("SELECT id, email, role, is_verified FROM users WHERE id = ?", [userId]);
        if (!user || user.length === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "USER_NOT_FOUND", {});
        }
        if (!user[0].is_verified) {
            return sendResponse(req, res, statusCode.success, responseCode.user_not_verified, "USER_NOT_VERIFIED", {});
        }

        if (user[0].role === "candidate") {
            const candidateProfile = await common.getCandidate(userId);
            return sendResponse(req, res, statusCode.success, responseCode.success, "USER_FOUND", { user: candidateProfile });
        } else if (user[0].role === "recruiter") {
            const recruiterProfile = await common.getRecruiter(userId);
            return sendResponse(req, res, statusCode.success, responseCode.success, "USER_FOUND", { user: recruiterProfile });
        }

        return sendResponse(req, res, statusCode.success, responseCode.success, "USER_FOUND", { user: { id: user[0].id, email: user[0].email, role: user[0].role } });
    } catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Checking Session" } }, {})
    }
}

const logoutModel = async (req, res) => {
    try {
        const userId = req.loginUser?.id;
        const token = req.headers['token']?.split(' ')[1];

        if (!userId || !token) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "INVALID_REQUEST", {});
        }

        const [result] = await db.query("DELETE FROM tbl_login_tokens WHERE user_id = ? AND token = ?", [userId, token]);

        if (result.affectedRows === 0) {
            return sendResponse(req, res, statusCode.success, responseCode.error, "LOGOUT_FAILED", {});
        }

        return sendResponse(req, res, statusCode.success, responseCode.success, "LOGOUT_SUCCESSFUL", {});
    }
    catch (e) {
        console.log(e);
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Logout" } }, {});
    }
}

module.exports = {
    registerModel,
    resendOtpModel,
    verifyOtpModel,
    resetPasswordModel,
    createProfileModel,
    loginModel,
    forgotPasswordModel,
    logoutModel,
    meModel
}