const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("../config/database")
dotenv.config()

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
    getUser: async(userId) => {
        try{
            let [user] = await db.query(`
                SELECT u.id,p.full_name,u.email,p.mobile_number,p.job_role,
                CASE 
                    WHEN is_admin=1 THEN "admin"
                    ELSE "user"
                END as role
                FROM tbl_user as u
                JOIN tbl_user_profile as p 
                ON u.id=p.user_id and p.is_active=1 and p.is_delete=0
                where u.id=? and u.is_active=1 and u.is_delete=0 and u.is_admin=0    
            `, [userId])
            
            if(!user || !user[0]) return null
            return user[0]
        }catch (err) {
            console.log(err)
            return null
        }
    },
    getAdmin: async(adminId) => {
        try{
            let [user] = await db.query(`
                SELECT u.id,u.email,
                CASE 
                    WHEN is_admin=1 THEN "admin"
                    ELSE "user"
                END as role
                FROM tbl_user as u
                where u.id=? and u.is_active=1 and u.is_delete=0 and u.is_admin=1   
            `, [adminId])

            if(!user || !user[0]) return null
            return user[0]
        }catch (err) {
            console.log(err)
            return null
        }
    }
}

module.exports = common