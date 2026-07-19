import { Routes, Route } from "react-router-dom"
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import JobListing from "../pages/JobListing";
import JobDetail from "../pages/JobDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import AuthLayout from "../layouts/AuthLayout";

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

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Route>
                <Route element={<AuthLayout />}>
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
                    />
                </Route>
            </Routes>
        </>
    )
}
