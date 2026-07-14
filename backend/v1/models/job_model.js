const db = require("../../config/db")
const { statusCode, responseCode } = require("../../utils/common")
const { sendResponse } = require("../../utils/middleware")

const list_jobs = async(req, res) => {
    try {
        let { search, city, state, country, industries, job_types, work_modes, employment_levels, salary_period, min_salary, max_salary, skills, roles, sort, page = 1, limit = 10 } = req.body || {}

        if (industries && industries.length > 0) {
            for (industry of industries) {
                if (typeof industry !== "number") {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_INDUSTRY", components: { resource: "Job Listing" } }, {})
                }
                const industryExists = await db.query(`SELECT id FROM industries WHERE id=? AND is_active=1 AND is_delete=0`, [industry])
                if (!industryExists.length) {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_INDUSTRY", components: { resource: "Job Listing" } }, {})
                }
            }
            searchObj.industries = industries
        }
        if (job_types && job_types.length > 0) {
            for (job_type of job_types) {
                if (typeof job_type !== "number") {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_JOB_TYPE", components: { resource: "Job Listing" } }, {})
                }
                const jobTypeExists = await db.query(`SELECT id FROM job_types WHERE id=? AND is_active=1 AND is_delete=0`, [job_type])
                if (!jobTypeExists.length) {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_JOB_TYPE", components: { resource: "Job Listing" } }, {})
                }
            }
            searchObj.job_types = job_types
        }
        if (work_modes && work_modes.length > 0) {
            for (work_mode of work_modes) {
                if (typeof work_mode !== "number") {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_WORK_MODE", components: { resource: "Job Listing" } }, {})
                }
                const workModeExists = await db.query(`SELECT id FROM work_modes WHERE id=? AND is_active=1 AND is_delete=0`, [work_mode])
                if (!workModeExists.length) {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_WORK_MODE", components: { resource: "Job Listing" } }, {})
                }
            }
            searchObj.work_modes = work_modes
        }
        if (employment_levels && employment_levels.length > 0) {
            for (employment_level of employment_levels) {
                if (typeof employment_level !== "number") {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_EMPLOYMENT_LEVEL", components: { resource: "Job Listing" } }, {})
                }
                const employmentLevelExists = await db.query(`SELECT id FROM employment_levels WHERE id=? AND is_active=1 AND is_delete=0`, [employment_level])
                if (!employmentLevelExists.length) {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_EMPLOYMENT_LEVEL", components: { resource: "Job Listing" } }, {})
                }
            }
            searchObj.employment_levels = employment_levels
        }
        if (skills && skills.length > 0) {
            for (skill of skills) {
                if (typeof skill !== "number") {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_SKILL", components: { resource: "Job Listing" } }, {})
                }
                const skillExists = await db.query(`SELECT id FROM skills WHERE id=? AND is_active=1 AND is_delete=0`, [skill])
                if (!skillExists.length) {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_SKILL", components: { resource: "Job Listing" } }, {})
                }
            }
            searchObj.skills = skills
        }
        if (roles && roles.length > 0) {
            for (role of roles) {
                if (typeof role !== "number") {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_ROLE", components: { resource: "Job Listing" } }, {})
                }
                const roleExists = await db.query(`SELECT id FROM job_roles WHERE id=? AND is_active=1 AND is_delete=0`, [role])
                if (!roleExists.length) {
                    return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "INVALID_ROLE", components: { resource: "Job Listing" } }, {})
                }
            }
            searchObj.roles = roles
        }

        let searchObj = {}
        if (search && search.length > 0) {
            searchObj.search = search
        }
        if ((city && city.length > 0) && (state && state.length > 0) && (country && country.length > 0)) {
            searchObj.city = city
            searchObj.state = state
            searchObj.country = country
        }
        if ((salary_period && salary_period.length > 0) && (min_salary && min_salary > 0) && (max_salary && max_salary > 0)) {
            searchObj.salary_period = salary_period
            searchObj.min_salary = min_salary
            searchObj.max_salary = max_salary
        }

        page = parseInt(page)
        limit = parseInt(limit)
        const offset = (page - 1) * limit

        let baseQuery = `SELECT 
        j.id, j.title, c.name as company_name, i.name as industry_name, jt.name as job_type_name, wm.name as work_mode_name, el.name as employment_level_name
        FROM jobs as j
        JOIN companies as c ON j.company_id = c.id
        JOIN recruiter_profiles as r ON j.recruiter_id = r.id
        JOIN industries as i ON j.industry_id = i.id
        JOIN job_types as jt ON j.job_type_id = jt.id
        JOIN work_modes as wm ON j.work_mode_id = wm.id
        JOIN employment_levels as el ON j.employment_level_id = el.id
        WHERE j.is_active=1 AND j.is_deleted=0`

        let countQuery = `SELECT COUNT(*) as total FROM jobs as j
        JOIN companies as c ON j.company_id = c.id
        JOIN recruiter_profiles as r ON j.recruiter_id = r.id
        JOIN industries as i ON j.industry_id = i.id
        JOIN job_types as jt ON j.job_type_id = jt.id
        JOIN work_modes as wm ON j.work_mode_id = wm.id
        JOIN employment_levels as el ON j.employment_level_id = el.id
        WHERE j.is_active=1 AND j.is_deleted=0
        `
        let queryParams = []
        if (Object.keys(searchObj).length > 0) {
            if (searchObj.search) {
                baseQuery += ` AND (j.title LIKE ? OR j.description LIKE ? OR c.name LIKE ? OR r.full_name LIKE ? OR i.name LIKE ? OR jt.name LIKE ? OR wm.name LIKE ? OR el.name LIKE ? OR EXISTS (SELECT 1 FROM skills as s JOIN job_skills as js ON s.id=js.skill_id WHERE js.job_id=j.id AND s.name LIKE ?) OR EXISTS (SELECT 1 FROM job_roles as jr JOIN job_roles_map as jrm ON jr.id=jrm.role_id WHERE jrm.job_id=j.id AND jr.name LIKE ?))`
                countQuery += ` AND (j.title LIKE ? OR j.description LIKE ? OR c.name LIKE ? OR r.full_name LIKE ? OR i.name LIKE ? OR jt.name LIKE ? OR wm.name LIKE ? OR el.name LIKE ? OR EXISTS (SELECT 1 FROM skills as s JOIN job_skills as js ON s.id=js.skill_id WHERE js.job_id=j.id AND s.name LIKE ?) OR EXISTS (SELECT 1 FROM job_roles as jr JOIN job_roles_map as jrm ON jr.id=jrm.role_id WHERE jrm.job_id=j.id AND jr.name LIKE ?))`
                queryParams.push(`%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`, `%${searchObj.search}%`)
            }
            if (searchObj.city && searchObj.state && searchObj.country) {
                baseQuery += ` AND j.city = ? AND j.state = ? AND j.country = ?`
                countQuery += ` AND j.city = ? AND j.state = ? AND j.country = ?`
                queryParams.push(searchObj.city, searchObj.state, searchObj.country, searchObj.city, searchObj.state, searchObj.country)
            }
            if (searchObj.salary_period && searchObj.min_salary && searchObj.max_salary) {
                baseQuery += ` AND j.salary_period = ? AND j.salary_min >= ? AND j.salary_max <= ?`
                countQuery += ` AND j.salary_period = ? AND j.salary_min >= ? AND j.salary_max <= ?`
                queryParams.push(searchObj.salary_period, searchObj.min_salary, searchObj.max_salary, searchObj.salary_period, searchObj.min_salary, searchObj.max_salary)
            }
            if (searchObj.industries && searchObj.industries.length > 0) {
                baseQuery += ` AND j.industry_id IN (?)`
                countQuery += ` AND j.industry_id IN (?)`
                queryParams.push(searchObj.industries)
            }
            if (searchObj.job_types && searchObj.job_types.length > 0) {
                baseQuery += ` AND j.job_type_id IN (?)`
                countQuery += ` AND j.job_type_id IN (?)`
                queryParams.push(searchObj.job_types)
            }
            if (searchObj.work_modes && searchObj.work_modes.length > 0) {
                baseQuery += ` AND j.work_mode_id IN (?)`
                countQuery += ` AND j.work_mode_id IN (?)`
                queryParams.push(searchObj.work_modes)
            }
            if (searchObj.employment_levels && searchObj.employment_levels.length > 0) {
                baseQuery += ` AND j.employment_level_id IN (?)`
                countQuery += ` AND j.employment_level_id IN (?)`
                queryParams.push(searchObj.employment_levels, searchObj.employment_levels)
            }
            if (searchObj.skills && searchObj.skills.length > 0) {
                baseQuery += ` AND EXISTS (SELECT 1 FROM job_skills WHERE job_id = j.id AND skill_id IN (?))`
                countQuery += ` AND EXISTS (SELECT 1 FROM job_skills WHERE job_id = j.id AND skill_id IN (?))`
                queryParams.push(searchObj.skills, searchObj.skills)
            }
            if (searchObj.roles && searchObj.roles.length > 0) {
                baseQuery += ` AND EXISTS (SELECT 1 FROM job_roles_map WHERE job_id = j.id AND role_id IN (?))`
                countQuery += ` AND EXISTS (SELECT 1 FROM job_roles_map WHERE job_id = j.id AND role_id IN (?))`
                queryParams.push(searchObj.roles, searchObj.roles)
            }
        }

        if (sort && sort.length > 0) {
            if (sort === "date_asc") {
                baseQuery += ` ORDER BY j.created_at ASC`
            } else if (sort === "date_desc") {
                baseQuery += ` ORDER BY j.created_at DESC`
            }
        }
        baseQuery += ` LIMIT ? OFFSET ?`
        queryParams.push(limit, offset)

        const [jobs] = await db.query(baseQuery, queryParams)
        const [countResult] = await db.query(countQuery, queryParams.slice(0, -2))
        const totalCount = countResult[0].total
        const totalPages = Math.ceil(totalCount / limit)

        return sendResponse(req, res, statusCode.success, responseCode.success, { keyword: "DATA_FETCHED_SUCCESSFULLY", components: { resource: "Job Listing" } }, { jobs, pagination: { totalCount, totalPages, currentPage: page, limit } })
    } catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Job Listing" } }, {})
    }
}

const detail_job = async(req, res) => {
    try {
        const jobId = req.params.id
        if (!jobId || isNaN(jobId)) {
            return sendResponse(req, res, statusCode.badRequest, responseCode.error, { keyword: "INVALID_REQUEST", components: { resource: "Job Detail" } }, {})
        }

        const [isJobExists] = await db.query(`SELECT id FROM jobs WHERE id=? AND is_active=1 AND is_deleted=0`, [jobId])
        if (!isJobExists.length) {
            return sendResponse(req, res, statusCode.error, responseCode.no_data_found, { keyword: "NO_DATA_FOUND", components: { resource: "Job Detail" } }, {})
        }

        const [jobDetails] = await db.query(`SELECT
            j.id, j.title, j.description, j.city, j.state, j.country, j.salary_period, j.salary_min, j.salary_max, c.id as company_id, c.name as company_name, c.logo_url as company_logo, r.id as recruiter_id, r.full_name as recruiter_name, i.id as industry_id, i.name as industry_name, jt.id as job_type_id, jt.name as job_type_name, wm.id as work_mode_id, wm.name as work_mode_name, el.id as employment_level_id, el.name as employment_level_name,
        (SELECT GROUP_CONCAT(s.id) FROM skills as s JOIN job_skills as js ON s.id=js.skill_id WHERE js.job_id=j.id) as skill_ids,
        (SELECT GROUP_CONCAT(s.name) FROM skills as s JOIN job_skills as js ON s.id=js.skill_id WHERE js.job_id=j.id) as skill_names,
        (SELECT GROUP_CONCAT(jr.id) FROM job_roles as jr JOIN job_roles_map as jrm ON jr.id=jrm.role_id WHERE jrm.job_id=j.id) as role_ids,
        (SELECT GROUP_CONCAT(jr.name) FROM job_roles as jr JOIN job_roles_map as jrm ON jr.id=jrm.role_id WHERE jrm.job_id=j.id) as role_names
        FROM jobs as j
        JOIN companies as c ON j.company_id = c.id
        JOIN recruiter_profiles as r ON j.recruiter_id = r.id
        JOIN industries as i ON j.industry_id = i.id
        JOIN job_types as jt ON j.job_type_id = jt.id
        JOIN work_modes as wm ON j.work_mode_id = wm.id
        JOIN employment_levels as el ON j.employment_level_id = el.id
        WHERE j.is_active=1 AND j.is_deleted=0`, [jobId])

        return sendResponse(req, res, statusCode.success, responseCode.success, { keyword: "DATA_FETCHED_SUCCESSFULLY", components: { resource: "Job Detail" } }, { jobDetails: jobDetails[0] })
    } catch (e) {
        console.log(e)
        return sendResponse(req, res, statusCode.error, responseCode.error, { keyword: "SOMETHING_WENT_WRONG", components: { resource: "Job Detail" } }, {})
    }
}


module.exports = { list_jobs, detail_job }