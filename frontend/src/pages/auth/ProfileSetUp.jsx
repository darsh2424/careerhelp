import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import CandidateProfileForm from "../../components/auth/CandidateProfileForm"
import RecruiterProfileForm from "../../components/auth/RecruiterProfileForm"
import { createProfileThunk } from "../../redux/auth/authThunk"
import { useDispatch } from "react-redux"
import Modal from "../../components/ui/Modal"

export default function ProfileSetUp() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { email, role } = location.state || {}

    useEffect(() => {
        if (!email || !role) {
            navigate("/", { replace: true });
        }
    }, [email, role, navigate]);

    const initialPayload = useMemo(() => {
        if (role === "candidate") {
            return {
                email,
                role,
                candidate_full_name: "",
                candidate_country_code: "+91",
                candidate_mobile_number: "",
                candidate_city: "",
                candidate_state: "",
                candidate_country: "",
                candidate_resume_url: "",
            }
        }

        return {
            email,
            role,

            recruiter_full_name: "",
            recruiter_country_code: "+91",
            recruiter_mobile_number: "",
            recruiter_designation: "",

            company_name: "",
            company_description: "",
            company_website: "",
            company_logo_url: "",
            company_city: "",
            company_state: "",
            company_country: "",
        };
    }, [email, role]);

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
    const [payload, setPayload] = useState(initialPayload);
    const { login } = useAuth();
    const handleSubmit = async (updatedPayload) => {
        // console.log(updatedPayload)

        // later
        // dispatch(createProfileThunk(data))
        try {

            const response = await dispatch(
                createProfileThunk(updatedPayload)
            ).unwrap();
            login(
                {
                    email,
                    role,
                },
                response.data.token
            );
            navigate("/jobs", {
                replace: true,
            });

        }
        catch (error) {

            setModal({

                open: true,
                type: "error",
                title: "Profile Creation Failed",
                message: error.message,
                primaryText: "OK",
                secondaryText: null,
                onPrimary: () =>
                    setModal(prev => ({
                        ...prev,
                        open: false,
                    }))

            });
        }

    };

    return (
        <>
            <div className="mb-10 text-center">

                <h1 className="text-3xl font-bold">
                    Complete Your Profile
                </h1>

                <p className="mt-3 text-gray-500">
                    Just one final step before getting started.
                </p>

            </div>
            {
                role === "candidate"
                    ? (
                        <CandidateProfileForm payload={payload} setPayload={setPayload} onSubmit={handleSubmit} />
                    )
                    : (
                        <RecruiterProfileForm payload={payload} setPayload={setPayload} onSubmit={handleSubmit} />
                    )
            }

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
