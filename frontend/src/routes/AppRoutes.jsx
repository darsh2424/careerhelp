import { Routes, Route } from "react-router-dom"
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/Home";
import JobListing from "../pages/JobListing";
import JobDetail from "../pages/JobDetail";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ProfileSetUp from "../pages/auth/ProfileSetUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PublicOnlyRoute from "./PublicOnlyRoute";


export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/jobs"
                        element={<JobListing />}
                    />

                    <Route
                        path="/job/:id"
                        element={<JobDetail />}
                    />

                </Route>
                <Route element={<PublicOnlyRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                        <Route
                            path="/register"
                            element={<Register />}
                        />
                        <Route
                            path="/verify-otp"
                            element={<VerifyOtp />}
                        />
                        <Route
                            path="/profile-setup"
                            element={<ProfileSetUp />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />
                    </Route>
                </Route>

                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </>
    )
}
