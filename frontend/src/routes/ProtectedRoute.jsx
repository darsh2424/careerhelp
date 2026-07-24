import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

// This component is used to protect routes that should only be accessible to authenticated users. If the user is not authenticated, they will be redirected to the "/login" page. If the authentication status is still loading, a loader will be displayed.

export default function ProtectedRoute() {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet/>
}
