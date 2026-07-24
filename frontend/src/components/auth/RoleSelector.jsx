import { User, Building2, CheckCircle2 } from "lucide-react"

const roles = [
    {
        value: "candidate",
        title: "Candidate",
        description: "Find jobs and apply with ease.",
        icon: User,
    },
    {
        value: "recruiter",
        title: "Recruiter",
        description: "Post jobs and hire great talent.",
        icon: Building2,
    }
]

export default function RoleSelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => {
                const Icon = role.icon;
                const active = value == role.value;

                return (
                    <button type="button" key={role.value} onClick={() => onChange(role.value)}
                        className={`relative rounded-2x1 border p-5 text-left transition-all duration-300 ${active ? "border-blu bg-blue-50 shadow-lg" : "border-gray-200 hover:border-blue-300 hover:shadow-md"}`}>
                        {active && (
                            <CheckCircle2
                                size={22}
                                className="absolute right-4 top-4 text-blue-600"
                            />
                        )}
                        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                            <Icon size={28} />
                        </div>

                        <h3 className="text-lg font-semibold">{role.title}</h3>

                        <p className="mt-2 text-sm text-gray-500">
                            {role.description}
                        </p>
                    </button>
                )
            })}
        </div>
    )
}