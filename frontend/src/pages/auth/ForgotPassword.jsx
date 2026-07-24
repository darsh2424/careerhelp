import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux"

import { forgotPasswordSchema } from "../../validations/authValidation";
import { forgotPasswordThunk } from "../../redux/auth/authThunk";
import Modal from "../../components/ui/Modal";

export default function ForgotPassword() {
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
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const onSubmit = async (data) => {
    try {
      await dispatch(forgotPasswordThunk(data)).unwrap();
      navigate("/verify-otp", { state: { email: data.email, purpose: "forgot_password" ,replace:true} });
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
          Forgot Password
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3">
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
          {loading ? "Checking..." : "Forgot Password"}
        </button>

        <p className="text-center">
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Return To Login
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
