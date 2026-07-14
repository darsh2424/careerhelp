const express = require("express")
const { checkApi, validateJoi } = require("../../utils/middleware")
const joi = require("joi")
const { list_industries,list_job_types,list_work_modes,list_employment_levels,list_skills,list_roles } = require("../models/helper_model")

const router = express.Router()

router.get("/industries/list", checkApi,list_industries)
router.get("/job_types/list", checkApi,list_job_types)
router.get("/work_modes/list", checkApi,list_work_modes)
router.get("/employment_levels/list", checkApi,list_employment_levels)
router.get("/skills/list", checkApi,list_skills)
router.get("/roles/list", checkApi,list_roles)

module.exports = router