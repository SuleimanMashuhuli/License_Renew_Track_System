import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const isAuthenticated = !!sessionStorage.getItem("token");

    return isAuthenticated ? <Outlet /> : <Navigate to="/sign_in" />;
};

export default ProtectedRoute;
