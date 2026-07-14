const db = require("../../config/db")
const { statusCode, responseCode } = require("../../utils/common")
const { sendResponse } = require("../../utils/middleware")

const list_industries = async (req, res) => {
    try {
        const [industries] = await db.query("SELECT id, name FROM industries")
        if(industries.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.success,{keyword:"DATA_FETCHED_SUCCESSFULLY",components:{"resource":"industries"}}, industries)
        } else {
            return sendResponse(req, res, statusCode.success, responseCode.no_data_found,{keyword:"NO_DATA_FOUND",components:{"resource":"industries"}}, [])
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, statusCode.error, responseCode.error,{keyword:"SOMETHING_WENT_WRONG",components:{"resource":"industries"}}, [])
    }
}

const list_job_types = async (req, res) => {
    try {
        const [job_types] = await db.query("SELECT id, name FROM job_types")
        if(job_types.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.success,{keyword:"DATA_FETCHED_SUCCESSFULLY",components:{"resource":"job types"}}, job_types)
        } else {
            return sendResponse(req, res, statusCode.success, responseCode.no_data_found,{keyword:"NO_DATA_FOUND",components:{"resource":"job types"}}, [])
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, statusCode.error, responseCode.error,{keyword:"SOMETHING_WENT_WRONG",components:{"resource":"job types"}}, [])
    }
}

const list_work_modes = async (req, res) => {
    try {
        const [work_modes] = await db.query("SELECT id, name FROM work_modes")
        if(work_modes.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.success,{keyword:"DATA_FETCHED_SUCCESSFULLY",components:{"resource":"work modes"}}, work_modes)
        }
        else {
            return sendResponse(req, res, statusCode.success, responseCode.no_data_found,{keyword:"NO_DATA_FOUND",components:{"resource":"work modes"}}, [])
        }
    } catch (err) { 
        console.log(err)
        return sendResponse(req, res, statusCode.error, responseCode.error,{keyword:"SOMETHING_WENT_WRONG",components:{"resource":"work modes"}}, [])
    }
}

const list_employment_levels = async (req, res) => {
    try {
        const [employment_levels] = await db.query("SELECT id, name FROM employment_levels")
        if(employment_levels.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.success,{keyword:"DATA_FETCHED_SUCCESSFULLY",components:{"resource":"employment levels"}}, employment_levels)
        }
        else {
            return sendResponse(req, res, statusCode.success, responseCode.no_data_found,{keyword:"NO_DATA_FOUND",components:{"resource":"employment levels"}}, [])
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, statusCode.error, responseCode.error,{keyword:"SOMETHING_WENT_WRONG",components:{"resource":"employment levels"}}, [])
    }
}

const list_skills = async (req, res) => {
    try {
        const [skills] = await db.query("SELECT id, name FROM skills")
        if(skills.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.success,{keyword:"DATA_FETCHED_SUCCESSFULLY",components:{"resource":"skills"}}, skills)
        }
        else {
            return sendResponse(req, res, statusCode.success, responseCode.no_data_found,{keyword:"NO_DATA_FOUND",components:{"resource":"skills"}}, [])
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, statusCode.error, responseCode.error,{keyword:"SOMETHING_WENT_WRONG",components:{"resource":"skills"}}, [])
    }
}

const list_roles = async (req, res) => {
    try {
        const [roles] = await db.query("SELECT id, name FROM job_roles")
        if(roles.length > 0) {
            return sendResponse(req, res, statusCode.success, responseCode.success,{keyword:"DATA_FETCHED_SUCCESSFULLY",components:{"resource":"roles"}}, roles)
        }
        else {
            return sendResponse(req, res, statusCode.success, responseCode.no_data_found,{keyword:"NO_DATA_FOUND",components:{"resource":"roles"}}, [])
        }
    } catch (err) {
        console.log(err)
        return sendResponse(req, res, statusCode.error, responseCode.error,{keyword:"SOMETHING_WENT_WRONG",components:{"resource":"roles"}}, [])
    }
}

module.exports = {
    list_industries,
    list_job_types,
    list_work_modes,
    list_employment_levels,
    list_skills,
    list_roles
}