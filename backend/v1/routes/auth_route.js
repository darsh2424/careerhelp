const express = require('express');
const joi = require("joi")
const { checkApi, validateJoi, checkToken } = require('../../utils/middleware');
const { registerModel,
    resendOtpModel,
    verifyOtpModel,
    createProfileModel,
    loginModel,
    forgotPasswordModel,
    resetPasswordModel,
    logoutModel,
    meModel
} = require("../models/auth_model")

const router = express.Router();

router.post(
    "/register",
    checkApi,
    validateJoi(joi.object({
        email: joi.string().trim().lowercase().email().required(),

        password: joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required(),

        role: joi.string()
            .valid("candidate", "recruiter")
            .required()
    })),
    registerModel
)

router.post(
    "/resend-otp",
    checkApi,
    validateJoi(joi.object({
        email: joi.string()
            .trim()
            .lowercase()
            .email()
            .required(),

        purpose: joi.string()
            .valid("signup", "forgot_password")
            .required()
    })),
    resendOtpModel
)

router.post(
    "/verify-otp",
    checkApi,
    validateJoi(joi.object({
        email: joi.string()
            .trim()
            .lowercase()
            .email()
            .required(),

        purpose: joi.string()
            .valid("signup", "forgot_password")
            .required(),

        otp: joi.string()
            .length(6)
            .pattern(/^[0-9]+$/)
            .required()
    })),
    verifyOtpModel
)

router.post(
    "/create-profile",
    checkApi,
    validateJoi(joi.object({

        email: joi.string()
            .trim()
            .lowercase()
            .email()
            .required(),

        role: joi.string()
            .valid("candidate", "recruiter")
            .required(),

        // Candidate

        candidate_full_name: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        candidate_country_code: joi.string()
            .pattern(/^\+\d{1,4}$/)
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        candidate_mobile_number: joi.string()
            .pattern(/^[0-9]{10}$/)
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        candidate_city: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        candidate_state: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        candidate_country: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        candidate_resume_url: joi.string()
            .uri()
            .when("role", {
                is: "candidate",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        // Recruiter

        recruiter_full_name: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        recruiter_country_code: joi.string()
            .pattern(/^\+\d{1,4}$/)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        recruiter_mobile_number: joi.string()
            .pattern(/^[0-9]{10}$/)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        recruiter_designation: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        company_name: joi.string()
            .trim()
            .min(2)
            .max(150)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        company_description: joi.string()
            .trim()
            .min(20)
            .max(1000)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        company_website: joi.string()
            .uri()
            .allow("")
            .optional()
            .when("role", {
                is: "recruiter",
                otherwise: joi.forbidden()
            }),

        company_logo_url: joi.string()
            .uri()
            .allow("")
            .optional()
            .when("role", {
                is: "recruiter",
                otherwise: joi.forbidden()
            }),

        company_city: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        company_state: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            }),

        company_country: joi.string()
            .trim()
            .min(2)
            .max(100)
            .when("role", {
                is: "recruiter",
                then: joi.required(),
                otherwise: joi.forbidden()
            })

    })),
    createProfileModel
)

router.post(
    "/login",
    checkApi,
    validateJoi(joi.object({

        email: joi.string()
            .trim()
            .lowercase()
            .email()
            .required(),

        password: joi.string().required(), 
        role: joi.string()
            .valid("candidate", "recruiter")
            .required()

    })),
    loginModel
)

router.post("/forgot-password", 
checkApi,
validateJoi(joi.object({
    email: joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
})), forgotPasswordModel)

router.post("/reset-password",
checkApi,
validateJoi(joi.object({
    email: joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),
    password: joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
})), resetPasswordModel)

router.get("/me",checkApi, checkToken, meModel)

router.get("/logout", checkApi, checkToken, logoutModel)

module.exports = router;