import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

import { recruiterEmployeeSchema } from "../../validations/authValidation";

export default function RecruiterEmployeeForm({
    payload,
    setPayload,
    onNext,
}) {

    const { loading } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(recruiterEmployeeSchema),
        defaultValues: payload,
    });

    const submitHandler = (values) => {

        const updatedPayload = {
            ...payload,
            ...values,
        };

        setPayload(updatedPayload);

        onNext(updatedPayload);

    };

    return (

        <>

            <div className="text-center">

                <h2 className="text-2xl font-bold">

                    Employee Details

                </h2>

                <p className="mt-2 text-gray-500">

                    Tell us about yourself before setting up your company.

                </p>

            </div>

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="mt-8 space-y-4"
            >

                {/* Name */}

                <div>

                    <label className="mb-2 block font-medium text-gray-700">

                        Full Name

                    </label>

                    <input
                        {...register("recruiter_full_name")}
                        placeholder="Enter Full Name"
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

                    {errors.recruiter_full_name && (

                        <p className="mt-2 text-sm text-red-500">

                            {errors.recruiter_full_name.message}

                        </p>

                    )}

                </div>

                {/* Designation */}

                <div>

                    <label className="mb-2 block font-medium text-gray-700">

                        Designation

                    </label>

                    <input
                        {...register("recruiter_designation")}
                        placeholder="HR Manager"
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

                    {errors.recruiter_designation && (

                        <p className="mt-2 text-sm text-red-500">

                            {errors.recruiter_designation.message}

                        </p>

                    )}

                </div>

                {/* Phone */}

                <div>

                    <label className="mb-2 block font-medium text-gray-700">

                        Mobile Number

                    </label>

                    <div className="flex gap-3">

                        <input
                            {...register("recruiter_country_code")}
                            placeholder="+91"
                            className="
                                w-24
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

                        <input
                            {...register("recruiter_mobile_number")}
                            placeholder="9876543210"
                            className="
                                flex-1
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

                    </div>

                    {errors.recruiter_country_code && (

                        <p className="mt-2 text-sm text-red-500">

                            {errors.recruiter_country_code.message}

                        </p>

                    )}

                    {errors.recruiter_mobile_number && (

                        <p className="mt-2 text-sm text-red-500">

                            {errors.recruiter_mobile_number.message}

                        </p>

                    )}

                </div>

                <button
                    type="submit"
                    disabled={loading}
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
                >

                    {loading ? "Saving..." : "Save & Next"}

                </button>

            </form>

        </>

    );

}