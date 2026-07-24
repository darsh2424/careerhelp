import { createAsyncThunk } from "@reduxjs/toolkit"
import { axiosClient } from "../../api/axiosClient"

export const loginThunk = createAsyncThunk("auth/login", async (formData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/login", formData, { requireAuth: false });
        // console.log(response);

        return response
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
})

export const registerThunk = createAsyncThunk("auth/register", async (formData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/register", formData, { requireAuth: false });
        // console.log(response);

        return response
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
})

export const verifyOtpThunk = createAsyncThunk("auth/verify-otp", async (formData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/verify-otp", formData, { requireAuth: false })
        return response
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
})

export const resendOtpThunk = createAsyncThunk("auth/resend-otp", async (formData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/resend-otp", formData, { requireAuth: false })
        return response
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
})

export const createProfileThunk = createAsyncThunk(
    "auth/createProfile",
    async (formData, thunkApi) => {

        try {
            const response =
                await axiosClient.post(
                    "/auth/create-profile",
                    formData,
                    {
                        requireAuth: false,
                    }
                );
            return response;

        }
        catch (error) {
            return thunkApi.rejectWithValue(error);
        }

    }
);

export const forgotPasswordThunk = createAsyncThunk("auth/forgot-password", async (formData, thunkApi) => {
    try {
        const response = await axiosClient.post("/auth/forgot-password", formData, { requireAuth: false });
        return response
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
})

export const resetPasswordThunk = createAsyncThunk("auth/reset-password", async (formData, thunkApi) => {
    try{
        const response = await axiosClient.post("/auth/reset-password", formData, { requireAuth: false });
        return response
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
})

export const logoutThunk = createAsyncThunk("auth/logout", async (_, thunkApi) => {
    try {
        const response = await axiosClient.get("/auth/logout", { requireAuth: true });
        return response;
    } catch (error) {
        return thunkApi.rejectWithValue(
            error?.response?.data ??
            error ??
            { message: "Something went wrong." }
        );
    }
});
