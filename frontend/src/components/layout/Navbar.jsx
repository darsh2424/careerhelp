import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { logoutThunk } from "../../redux/auth/authThunk";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const isCandidate = user?.role === "candidate";
    const isRecruiter = user?.role === "recruiter";

    const handleLogout = async () => {
        try {
            // Later
            await dispatch(logoutThunk())

            logout();
            navigate("/", {
                replace: true,
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <nav className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    CareerHelp
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/">Home</Link>
                    <Link to="/jobs">Jobs</Link>
                     {!isAuthenticated && (
                        <>
                            <Link to="/login">
                                Login
                            </Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            {isCandidate && (
                                <Link to="/my-applications">
                                    My Applications
                                </Link>
                            )}

                            {isRecruiter && (
                                <>
                                    <Link to="/post-job">
                                        Post Job
                                    </Link>

                                    <Link to="/manage-jobs">
                                        Manage Jobs
                                    </Link>
                                </>
                            )}

                            <Link to="/profile">
                                Profile
                            </Link>

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
