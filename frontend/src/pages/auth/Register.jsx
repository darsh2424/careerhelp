import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux"


import RoleSelector from "../../components/auth/RoleSelector";
import { RegisterSchema } from "../../validations/authValidation";
import { registerThunk } from "../../redux/auth/authThunk";
import Modal from "../../components/ui/Modal";

export default function Register() {
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
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      role: "candidate",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const onSubmit = async (values) => {
    const { confirmPassword, ...payload } = values;

    try {
      const response = await dispatch(registerThunk(payload)).unwrap();

      // success
      navigate("/verify-otp", {
        state: {
          email: payload.email,
          role: payload.role,
          purpose:"signup"
        },
        replace:true
      });

    } catch (error) {
      // console.error(error);

      setModal({
        open: true,
        type: "error",
        title: "Registration Failed",
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
  };

  return (
    <>
      {/* Heading */}
      <div className="text-center">

        <h1 className="text-3xl font-bold text-gray-900">
          Create Your Account
        </h1>
        {/* 
        <p className="mt-3 text-gray-500">
          Join CareerHelp and take the next step towards your dream career.
        </p> */}

      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-2">

        {/* Role */}
        <div>

          <label className="mb-3 block font-medium text-gray-700">
            I want to join as
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

        {/* Confirm Password */}
        <div>

          <label className="mb-2 block font-medium text-gray-700">
            Confirm Password
          </label>

          <div className="relative">

            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
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
              onClick={() => setConfirmShowPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword.message}
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
          "
          disabled={loading}
        >
          {loading ? "Creating Account.." : "Create Account"}
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
        <p className="text-center">
          <Link
            to="/"
            className="font-semibold text-blue-600 hover:underline"
          >
            Return To Home
          </Link>
        </p>
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
