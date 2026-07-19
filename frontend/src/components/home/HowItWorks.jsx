import { useState } from "react";
import {
  UserPlus,
  UserCircle,
  Search,
  FileText,
  Briefcase,
  Building2,
  ClipboardList,
  Users,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";

const candidateSteps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up and join CareerHelp as a candidate.",
  },
  {
    icon: UserCircle,
    title: "Complete Your Profile",
    description: "Add your skills, education and experience.",
  },
  {
    icon: Search,
    title: "Search Jobs",
    description: "Discover jobs that match your interests.",
  },
  {
    icon: FileText,
    title: "Apply Easily",
    description: "Submit your application with just a few clicks.",
  },
  {
    icon: BadgeCheck,
    title: "Get Hired",
    description: "Connect with recruiters and begin your career.",
  },
];

const recruiterSteps = [
  {
    icon: UserPlus,
    title: "Create Recruiter Account",
    description: "Register as a recruiter on CareerHelp.",
  },
  {
    icon: Building2,
    title: "Setup Company Profile",
    description: "Showcase your company and hiring culture.",
  },
  {
    icon: Briefcase,
    title: "Post Jobs",
    description: "Publish job opportunities for candidates.",
  },
  {
    icon: ClipboardList,
    title: "Review Applications",
    description: "Manage and shortlist the best candidates.",
  },
  {
    icon: Users,
    title: "Hire Talent",
    description: "Connect with skilled professionals quickly.",
  },
];

export default function HowItWorks() {
  const [role, setRole] = useState("candidate");

  const steps =
    role === "candidate"
      ? candidateSteps
      : recruiterSteps;

  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-5xl px-6">

        {/* Heading */}

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Your Journey Starts Here
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Whether you're searching for your next opportunity
            or hiring your next teammate, CareerHelp keeps the
            process simple from start to finish.
          </p>

        </div>

        {/* Toggle */}

        <div className="mt-12 flex justify-center gap-4">

          <button
            onClick={() => setRole("candidate")}
            className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
              role === "candidate"
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-gray-300 bg-white text-gray-700 hover:border-blue-500"
            }`}
          >
            I'm a Candidate
          </button>

          <button
            onClick={() => setRole("recruiter")}
            className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${
              role === "recruiter"
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-gray-300 bg-white text-gray-700 hover:border-blue-500"
            }`}
          >
            I'm a Recruiter
          </button>

        </div>

        {/* Timeline */}

        <div className="mx-auto mt-6 max-w-3xl">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (
              <div key={step.title}>

                <div className="flex gap-6">

                  {/* Left */}

                  <div className="flex flex-col mt-7 items-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                      <Icon size={24} />
                    </div>

                    {index !== steps.length - 1 && (
                      <ChevronDown
                        className="my-4 text-gray-400"
                        size={28}
                      />
                    )}

                  </div>

                  {/* Right */}

                  <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">

                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>

                    <p className="mt-2 leading-12 text-gray-600">
                      {step.description}
                    </p>

                  </div>

                </div>

              </div>
            );

          })}

        </div>

      </div>
    </section>
  );
}