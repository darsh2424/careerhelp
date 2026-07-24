import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux"

import { resetPasswordSchema } from "../../validations/authValidation";
import { resetPasswordThunk } from "../../redux/auth/authThunk";
import Modal from "../../components/ui/Modal";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";

export default function ResetPassword() {
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const { email } = location.state || {};

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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);
  const onSubmit = async (values) => {
    const { confirmPassword, ...payload } = values;

    try {
      await dispatch(resetPasswordThunk({ email, ...payload })).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      setModal({
        open: true,
        type: "error",
        title: "Error",
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
          Reset Password
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

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
                disabled:bg-gray-300
              "
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>

        {/* <p className="text-center">
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Return To Login
          </Link>
        </p> */}
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
