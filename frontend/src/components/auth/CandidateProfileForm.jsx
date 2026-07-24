import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux"

import { candidateProfileSchema } from "../../validations/authValidation";

export default function CandidateProfileForm({ payload, setPayload, onSubmit }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(candidateProfileSchema),
    defaultValues: payload,
  });

  const { loading } = useSelector((state) => state.auth)

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

      {/* Form */}
      <form onSubmit={handleSubmit(submitHandler)} className="mt-8 space-y-3">

        {/* Full Name */}
        <div>

          <label className="mb-2 block font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter Your Full Name"
            {...register("candidate_full_name")}
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

          {errors.candidate_full_name && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_full_name.message}
            </p>
          )}

        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Phone
          </label>
          <div className="flex gap-3">
            {/* Country Code */}
            <input
              type="text"
              placeholder="+91"
              {...register("candidate_country_code")}
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
              type="text"
              placeholder="10 Digit Phone Number"
              {...register("candidate_mobile_number")}
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

          {errors.candidate_country_code && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_country_code.message}
            </p>
          )}
          {errors.candidate_mobile_number && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_mobile_number.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>

          <label className="mb-2 block font-medium text-gray-700">
            City
          </label>

          <input
            type="text"
            placeholder="Enter Your City"
            {...register("candidate_city")}
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

          {errors.candidate_city && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_city.message}
            </p>
          )}

        </div>

        {/* State */}
        <div>

          <label className="mb-2 block font-medium text-gray-700">
            State
          </label>

          <input
            type="text"
            placeholder="Enter Your State"
            {...register("candidate_state")}
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

          {errors.candidate_state && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_state.message}
            </p>
          )}

        </div>

        {/* Country */}
        <div>

          <label className="mb-2 block font-medium text-gray-700">
            Country
          </label>

          <input
            type="text"
            placeholder="Enter Your Country"
            {...register("candidate_country")}
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

          {errors.candidate_country && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_country.message}
            </p>
          )}

        </div>

        {/* Resume URL */}
        <div>

          <label className="mb-2 block font-medium text-gray-700">
            Resume File URL (Should Have Public File Access)
          </label>

          <input
            type="text"
            placeholder="Enter Resume URL"
            {...register("candidate_resume_url")}
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

          {errors.candidate_resume_url && (
            <p className="mt-2 text-sm text-red-500">
              {errors.candidate_resume_url.message}
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
          {
            loading
              ? "Saving..."
              : "Save & Continue"
          }
        </button>
      </form>
    </>
  )
}
