const express = require("express")
const { checkApi, validateJoi } = require("../../utils/middleware")
const joi = require("joi")
const { list_jobs, detail_job } = require("../models/job_model")

const router = express.Router()

router.post("/list", checkApi, validateJoi(joi.object({
    search: joi.string().optional(),
    city: joi.string().optional(),
    state: joi.string().optional(),
    country: joi.string().optional(),
    industries: joi.array().items(joi.number().required()).optional(),
    job_types: joi.array().items(joi.number().required()).optional(),
    work_modes: joi.array().items(joi.number().required()).optional(),
    employment_levels: joi.array().items(joi.number().required()).optional(),
    skills: joi.array().items(joi.number().required()).optional(),
    roles: joi.array().items(joi.number().required()).optional(),
    salary_period: joi.string().allow("hour,day,week,month,year").optional(),
    min_salary: joi.number().optional(),
    max_salary: joi.number().optional(),
    sort: joi.string().allow("date_asc,date_desc").optional(),
    page: joi.number().optional(),
    limit: joi.number().optional(),
}), true), list_jobs)

router.get("/detail/:id", checkApi, detail_job)



module.exports = router