import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux"

import { useAuth } from "../../context/AuthContext"
import RoleSelector from "../../components/auth/RoleSelector";
import { loginSchema } from "../../validations/authValidation";
import { loginThunk, resendOtpThunk } from "../../redux/auth/authThunk";
import Modal from "../../components/ui/Modal";

export default function Login() {
    const [modal, setModal] = useState({
        open: false,
        type: "error",
        title: "",
        message: "",
        primaryText: "OK",
        secondaryText: null,
        onPrimary: null,
        onSecondary: null,
    });

    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            role: "candidate",
            email: "",
            password: ""
        }
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { login } = useAuth()
    const { loading } = useSelector((state) => state.auth)

    const onSubmit = async (values) => {
        try {
            const { email, role } = values

            const response = await dispatch(loginThunk(values)).unwrap()
            login(response?.data?.user, response?.data?.token)
            navigate("/jobs", { replace: true })
        } catch (error) {

            const { email, role } = values
            if (error?.code == 4) {
                setModal({
                    open: true,
                    type: "error",
                    title: "Login Failed",
                    message: error.message,
                    primaryText: "OK",
                    secondaryText: null,

                    onPrimary: async () => {
                        try {
                            await dispatch(resendOtpThunk({ email,purpose: "signup" })).unwrap();

                            setModal(prev => ({
                                ...prev,
                                open: false
                            }));
                            navigate("/verify-otp", {
                                state: { email, role, purpose: "login" },
                                replace: true,
                            });
                        } catch (error) {
                            setModal({
                                open: true,
                                type: "error",
                                title: "Unable to Send OTP",
                                message: error.message,
                                primaryText: "OK",
                                onPrimary: () =>
                                    setModal(prev => ({
                                        ...prev,
                                        open: false,
                                    })),
                            });
                        }
                    }
                });
            }
            else if (error?.code == 5) {
                setModal({
                    open: true,
                    type: "error",
                    title: "Login Failed",
                    message: error.message,
                    primaryText: "OK",
                    secondaryText: null,

                    onPrimary: () => {
                        setModal(prev => ({
                            ...prev,
                            open: false
                        }));
                        navigate("/profile-setup", { state: { email, role }, replace: true })
                    }
                });
            } else {
                setModal({
                    open: true,
                    type: "error",
                    title: "Login Failed",
                    message: error.message,
                    primaryText: "OK",
                    secondaryText: null,

                    onPrimary: () =>
                        setModal(prev => ({
                            ...prev,
                            open: false,
                        })),
                });
            }

        }
    }

    return (
        <>
            {/* Heading */}
            <div className="text-center">

                <h1 className="text-3xl font-bold text-gray-900">
                    Login With Your Account
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3">
                {/* Role */}
                <div>

                    <label className="mb-3 block font-medium text-gray-700">
                        I want to login as
                    </label>

                    <RoleSelector
                        value={watch("role")}
                        onChange={(role) => setValue("role", role)}
                    />

                    {errors.role && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.role.message}
                        </p>
                    )}

                </div>
                {/* Email */}
                <div>

                    <label className="mb-2 block font-medium text-gray-700">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className="
                                w-full
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                    />

                    {errors.email && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}

                </div>

                {/* Password */}
                <div>

                    <label className="mb-2 block font-medium text-gray-700">
                        Password
                    </label>

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                py-3
                                pr-12
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-4
                                focus:ring-blue-100
                            "
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>

                    </div>

                    {errors.password && (
                        <p className="mt-2 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}

                </div>

                <button
                    type="submit"
                    className="
                        w-full
                        rounded-xl
                        bg-blue-600
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                        active:scale-[0.98]
                        disabled:bg-gray-300
                    "
                    disabled={loading}
                >
                    Login
                </button>
                <p className="text-center text-gray-600">
                    Not Having an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register Yourself First
                    </Link>
                </p>

                <div className="flex items-center justify-center gap-2 mt-2 text-center">
                    <Link
                        to="/forgot-password"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                    <div className="text-gray-400">|</div>
                    <p>
                        <Link
                            to="/"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Return To Home
                        </Link>
                    </p>
                </div>
            </form>

            <Modal
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                primaryText={modal.primaryText}
                secondaryText={modal.secondaryText}
                onPrimary={modal.onPrimary}
                onSecondary={modal.onSecondary}
            />
        </>
    )
} 