import * as yup from "yup";

export const loginSchema = yup.object({
    role:yup.string().oneOf(["candidate","recruiter"]).required("Please Select a Role"),
    email:yup.string().trim().email("Invalid Email Address").required("Email is Required"),
    password: yup
        .string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number and special character"
        )
        .required("Password is required")
})

export const RegisterSchema = yup.object({
    role:yup.string().oneOf(["candidate","recruiter"]).required("Please Select a Role"),
    email:yup.string().trim().email("Invalid Email Address").required("Email is Required"),
    password: yup
        .string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number and special character"
        )
        .required("Password is required"),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match")
        .required("Confirm your password")
})

export const candidateProfileSchema = yup.object({

    candidate_full_name: yup
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters.")
        .max(100)
        .required("Full name is required."),

    candidate_country_code: yup
        .string()
        .matches(/^\+\d{1,4}$/, "Invalid country code.")
        .required(),

    candidate_mobile_number: yup
        .string()
        .matches(/^[0-9]{10}$/, "Enter a valid 10 digit mobile number.")
        .required(),

    candidate_city: yup
        .string()
        .trim()
        .required("City is required."),

    candidate_state: yup
        .string()
        .trim()
        .required("State is required."),

    candidate_country: yup
        .string()
        .trim()
        .required("Country is required."),

    candidate_resume_url: yup
        .string()
        .url("Enter a valid URL.")
        .required("Resume URL is required.")
});

export const recruiterEmployeeSchema = yup.object({

    recruiter_full_name: yup
        .string()
        .required("Full Name is required")
        .min(2),

    recruiter_country_code: yup
        .string()
        .matches(/^\+\d{1,4}$/, "Invalid Country Code")
        .required(),

    recruiter_mobile_number: yup
        .string()
        .matches(/^[0-9]{10}$/, "Enter Valid Mobile Number")
        .required(),

    recruiter_designation: yup
        .string()
        .required("Designation is required")
        .min(2),

});

export const recruiterCompanySchema = yup.object({

    company_name: yup
        .string()
        .required("Company Name is required")
        .min(2),

    company_description: yup
        .string()
        .required("Company Description is required")
        .min(20),

    company_website: yup
        .string()
        .url("Invalid URL")
        .nullable()
        .transform(v => v === "" ? null : v),

    company_logo_url: yup
        .string()
        .url("Invalid URL")
        .nullable()
        .transform(v => v === "" ? null : v),

    company_city: yup
        .string()
        .required("City is required"),

    company_state: yup
        .string()
        .required("State is required"),

    company_country: yup
        .string()
        .required("Country is required"),

});

export const forgotPasswordSchema = yup.object({
    email: yup.string().trim().email("Invalid Email Address").required("Email is Required"),
});

export const resetPasswordSchema = yup.object({
    password: yup
        .string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            "Password must contain uppercase, lowercase, number and special character"
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match")
        .required("Confirm your password")
});
