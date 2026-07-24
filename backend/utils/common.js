const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("../config/db")
const nodemailer = require("nodemailer")
dotenv.config()

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const common = {
    jwt_sign: (data, expiresIn = "365d") => {
        const token = jwt.sign(
            { data },
            process.env.JWT_WEB_TOKEN,
            { expiresIn }
        )

        return token
    },
    getData: async (table, whereObj) => {
        try {

            let query = `SELECT * FROM ${table} WHERE `
            const values = []

            for (const key in whereObj) {
                query += `${key} = ? AND `
                values.push(whereObj[key])
            }

            query = query.slice(0, -5)

            const result = await db.query(query, values)
            if (result && result[0] && result[0].length > 0) {


                return result[0]

            }
            return null
        } catch (err) {
            console.log(err)
            return null
        }
    },
    getCandidate: async (userId) => {
        try {
            let [user] = await db.query(`
                SELECT u.id,p.full_name,u.email,p.country_code,p.mobile_number,u.role,p.city,p.state,p.country
                FROM users as u
                JOIN candidate_profiles as p 
                ON u.id=p.user_id and p.is_active=1 and p.is_deleted=0
                where u.id=? and u.is_active=1 and u.is_deleted=0 and u.role="candidate"    
            `, [userId])

            if (!user || !user[0]) return null
            return user[0]
        } catch (err) {
            console.log(err)
            return null
        }
    },
    getRecruiter: async (userId) => {
        try {
            let [user] = await db.query(`
                SELECT u.id,u.email,r.company_name,r.full_name,r.country_code,r.mobile_number,u.role
                FROM users as u
                JOIN recruiter_profiles as r ON u.id = r.user_id
                where u.id=? and u.is_active=1 and u.is_deleted=0 and u.role="recruiter"   
            `, [userId])

            if (!user || !user[0]) return null
            return user[0]
        } catch (err) {
            console.log(err)
            return null
        }
    },
    statusCode: {
        error: 500,
        unauthorized: 401,
        badRequest: 400,
        success: 200
    },
    responseCode: {
        unauthorized: -1,
        error: 0,
        success: 1,
        validation_error: 2,
        no_data_found: 3,
        user_not_verified: 4,
        profile_not_found: 5,
    },
    sendMail: async(to,subject,template) => {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: subject,
                html: template
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
};

module.exports = common