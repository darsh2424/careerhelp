import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { maskEmail } from "../../utils/helperFunctions";
import { useDispatch, useSelector } from "react-redux";
import { resendOtpThunk, verifyOtpThunk } from "../../redux/auth/authThunk";
import Modal from "../../components/ui/Modal";

const VALID_PURPOSES_FOR_BACKEND=["signup","login","forgot_password"]

export default function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { email, role, purpose } = location.state || {};

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

    const { loading } = useSelector((state) => state.auth)
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);

    const inputRefs = useRef([]);


    useEffect(() => {
        if (!email || !purpose || !VALID_PURPOSES_FOR_BACKEND.includes(purpose)) {
            navigate("/", { replace: true });
        }
    }, [email, purpose, navigate]);
    useEffect(() => {

        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);

    const handleVerify = async (e) => {
        try {
            e.preventDefault()
            const code = otp.join("");
            if(!VALID_PURPOSES_FOR_BACKEND.includes(purpose)){
                throw new Error("Invalid Request: Validation Issue for Purpose")
            }
            const reqPurpose = purpose === "login" ? "signup" : purpose; 
            await dispatch(verifyOtpThunk({ email, purpose: reqPurpose, otp: code })).unwrap();
            // success
            if(purpose === "forgot_password") {
                navigate("/reset-password", {
                    state: {
                        email
                    },
                    replace: true
                });
                return;
            }
            if(purpose === "signup" && role && ["candidate","recruiter"].includes(role)) {
                navigate("/profile-setup", {
                    state: {
                        email,role
                    },
                    replace: true
                });
                return;
            }
            navigate("/login",{replace:true});

        } catch (error) {
            // console.error(error);

            setModal({
                open: true,
                type: "error",
                title: "OTP Verification Failed",
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
    const handleResend = async () => {

        try {

            await dispatch(
                resendOtpThunk({ email,purpose })
            ).unwrap();

            setTimer(30);

            setModal({
                open: true,
                type: "success",
                title: "OTP Sent",
                message: "A new verification code has been sent to your email.",
                primaryText: "OK",

                onPrimary: () =>
                    setModal((prev) => ({
                        ...prev,
                        open: false,
                    })),
            });

        } catch (error) {

            setModal({
                open: true,
                type: "error",
                title: "Unable to Resend OTP",
                message: error.message,
                primaryText: "OK",

                onPrimary: () =>
                    setModal((prev) => ({
                        ...prev,
                        open: false,
                    })),
            });

        }

    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value

        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()

        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (!pasted) return

        const newOtp = [...otp]
        pasted.split("").forEach((digit, index) => {
            newOtp[index] = digit;
        });
        setOtp(newOtp);

        inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
    }

    return (
        <>
            {/* Heading */}
            <div className="text-center">

                <h1 className="text-3xl font-bold text-gray-900">
                    Verify Your Email
                </h1>

                <p className="mt-3 text-gray-500">
                    We Sent a Verification Code to {email && email.length>0 && maskEmail(email)}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleVerify} className="space-y-7">
                <div className="mt-10 flex justify-center gap-3">
                    {
                        otp.map((value, index) => {
                            return (

                                <input
                                    maxLength={1}
                                    inputMode="numeric"
                                    className="
                                    h-14
                                    w-14
                                    rounded-2xl
                                    border
                                    border-gray-300
                                    text-center
                                    text-xl
                                    font-bold
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                "
                                    key={index}
                                    ref={(element) => (inputRefs.current[index] = element)}
                                    value={otp[index]}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                />
                            )
                        })
                    }
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
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    disabled={
                        loading || !otp.every(digit => digit !== "")
                    }
                >
                    Verify
                </button>

                <div className="flex items-center justify-center gap-2 mt-6 text-center">
                    <p className="text-gray-500">
                         Didn't receive the code? 
                    </p>
                    <button 
                        type="button"
                        disabled={timer>0}
                        onClick={handleResend}
                        className={`
                            font-semibold
                            trasition
                            ${
                                timer>0 
                                ? "cursor-not-allowed text-gray-400"
                                : "text-blue-600 hover:text-blue-700 cursor-pointer"
                            }
                        `}
                    >
                        {
                            timer > 0 
                            ? `Resend OTP (${timer}s)`
                            : "Resend"
                        }
                    </button>
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
