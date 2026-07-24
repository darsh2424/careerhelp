import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

// This component is used to protect routes that should only be accessible to unauthenticated users. If the user is authenticated, they will be redirected to the "/jobs" page. If the authentication status is still loading, a loader will be displayed.

export default function PublicOnlyRoute() {

    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return <Loader/>
    }

    if (isAuthenticated) {
        return <Navigate to="/jobs" replace />;
    }

    return <Outlet />;
}