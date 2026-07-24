import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

import { recruiterCompanySchema } from "../../validations/authValidation";

export default function RecruiterCompanyForm({
    payload,
    setPayload,
    onSubmit,
}) {

    const { loading } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(recruiterCompanySchema),
        defaultValues: payload,
    });

    const submitHandler = (values) => {

        const updatedPayload = {
            ...payload,
            ...values,
        };

        setPayload(updatedPayload);

        onSubmit(updatedPayload);

    };

    return (

        <>
            <div className="text-center">

                <h2 className="text-2xl font-bold">

                    Company Details

                </h2>

                <p className="mt-2 text-gray-500">

                    Tell candidates about your company.

                </p>

            </div>

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="mt-8 space-y-4"
            >

                {/* Company Name */}

                <div>

                    <label className="mb-2 block font-medium">

                        Company Name

                    </label>

                    <input
                        {...register("company_name")}
                        placeholder="TechNova Pvt Ltd"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_name &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_name.message}

                        </p>

                    }

                </div>

                {/* Description */}

                <div>

                    <label className="mb-2 block font-medium">

                        Company Description

                    </label>

                    <textarea
                        rows={5}
                        {...register("company_description")}
                        placeholder="Describe your company..."
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_description &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_description.message}

                        </p>

                    }

                </div>

                {/* Website */}

                <div>

                    <label className="mb-2 block font-medium">

                        Company Website (Optional)

                    </label>

                    <input
                        {...register("company_website")}
                        placeholder="https://example.com"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_website &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_website.message}

                        </p>

                    }

                </div>

                {/* Logo */}

                <div>

                    <label className="mb-2 block font-medium">

                        Company Logo URL (Optional)

                    </label>

                    <input
                        {...register("company_logo_url")}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_logo_url &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_logo_url.message}

                        </p>

                    }

                </div>

                {/* City */}

                <div>

                    <label className="mb-2 block font-medium">

                        City

                    </label>

                    <input
                        {...register("company_city")}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_city &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_city.message}

                        </p>

                    }

                </div>

                {/* State */}

                <div>

                    <label className="mb-2 block font-medium">

                        State

                    </label>

                    <input
                        {...register("company_state")}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_state &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_state.message}

                        </p>

                    }

                </div>

                {/* Country */}

                <div>

                    <label className="mb-2 block font-medium">

                        Country

                    </label>

                    <input
                        {...register("company_country")}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.company_country &&

                        <p className="mt-2 text-sm text-red-500">

                            {errors.company_country.message}

                        </p>

                    }

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-300"
                >

                    {loading
                        ? "Creating Profile..."
                        : "Complete Profile"}

                </button>

            </form>

        </>

    );

}