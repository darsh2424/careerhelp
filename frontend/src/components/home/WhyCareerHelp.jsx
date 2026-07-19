import {
  Search,
  Target,
  FileCheck,
  MessageCircle,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Fast Job Search",
    description:
      "Search opportunities using powerful filters and quickly discover relevant openings.",
  },
  {
    icon: Target,
    title: "Smart Matching",
    description:
      "CareerHelp helps candidates connect with recruiters through relevant skills and preferences.",
  },
  {
    icon: FileCheck,
    title: "One-click Apply",
    description:
      "Apply to multiple jobs with a streamlined application experience.",
  },
  {
    icon: MessageCircle,
    title: "Recruiter Chat",
    description:
      "Communicate directly with recruiters without leaving the platform.",
  },
  {
    icon: Smartphone,
    title: "Responsive Experience",
    description:
      "Access CareerHelp comfortably from desktop, tablet or mobile devices.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Accounts",
    description:
      "Authentication and protected routes keep candidate and recruiter data safe.",
  },
];

export default function WhyCareerHelp() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why CareerHelp?
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            Everything You Need To Find Is<br/>
            <span className="text-blue-600"> The Right Opportunity</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            CareerHelp simplifies hiring by bringing candidates and recruiters
            together through a clean, transparent and user-friendly platform.
          </p>

        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-blue-200
                  hover:shadow-xl
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-100
                    text-blue-600
                    transition-colors
                    group-hover:bg-blue-600
                    group-hover:text-white
                  "
                >
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}