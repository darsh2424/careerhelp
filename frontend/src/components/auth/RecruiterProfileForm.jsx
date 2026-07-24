import { useState } from "react";
import RecruiterEmployeeForm from "./RecruiterEmployeeForm";
import RecruiterCompanyForm from "./RecruiterCompanyForm";
import { Check } from "lucide-react";

export default function RecruiterProfileForm({
    payload,
    setPayload,
    onSubmit,
}) {

    const [step, setStep] = useState("employee");

    const handleNext = (updatedPayload) => {
        setPayload(updatedPayload);
        setStep("company");
    };

    return (
        <>

            {/* Progress */}

            <div className="mb-10 flex gap-4">

                <button
                    type="button"
                    disabled
                    className={`
                        flex-1
                        rounded-xl
                        border
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition

                        ${
                            step === "employee"
                                ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                                : "border-green-300 bg-green-100 text-green-700"
                        }
                    `}
                >

                    <div className="flex items-center justify-center gap-2">

                        {step === "company" && <Check size={18} />}

                        Employee Details

                    </div>

                </button>

                <button
                    type="button"
                    disabled
                    className={`
                        flex-1
                        rounded-xl
                        border
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition

                        ${
                            step === "company"
                                ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                                : "border-gray-300 bg-gray-100 text-gray-500"
                        }
                    `}
                >

                    Company Details

                </button>

            </div>

            {
                step === "employee" ? (

                    <RecruiterEmployeeForm
                        payload={payload}
                        setPayload={setPayload}
                        onNext={handleNext}
                    />

                ) : (

                    <RecruiterCompanyForm
                        payload={payload}
                        setPayload={setPayload}
                        onSubmit={onSubmit}
                    />

                )
            }

        </>
    );
}