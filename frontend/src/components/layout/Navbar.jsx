import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                CareerHelp
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/">Home</Link>
                <Link to="/jobs">Jobs</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </div>
    </nav>
  )
}
