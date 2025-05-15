import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Reports from './pages/Reports';
import Renew from './pages/Renew';
import SignOut from './pages/SignOut';
import ViewDetails from "./components/ViewDetails.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Layout from "./components/Layout.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Employee from "./pages/Employees.jsx";
import Renewing from "./pages/Renewing.jsx";
import Admins from "./pages/Admins.jsx"
import Logs from "./pages/Logs.jsx"
import GetHelp from "./components/GetHelp.jsx"
import Settings from "./pages/Settings.jsx";
import OTPPage from "./pages/OTPPage.jsx";
import SetPassword from "./components/Setpassword.jsx";



function App() {
    return(
      <Routes>
            {/* ---------VERSION 2------------- */}
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/sign_in" replace />} />

            <Route path="/sign_in" element={<SignIn />} />
            <Route path="/otp"   element={<OTPPage />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/sign_up" element={<SignUp />} />
            <Route path="/logout" element={<SignOut />} />

            {/* Forgot/Reset Password Routes */}
            <Route path="/forgot_password" element={<ForgotPassword />} />
            <Route path="/reset_password/:uidb64/:token" element={<ResetPassword />} />
           
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
             
                <Route path="/view-details/:id" element={<ViewDetails />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/renew/:id" element={<Renew />} />

                <Route path="/layout" element={<Layout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="dashboard" element={<DashboardHome />} />
                    <Route path="subscription" element={<Subscriptions />} />
                    <Route path="employees" element={<Employee />} />
                    <Route path="renewing" element={<Renewing />} />
                    <Route path="admins/manage" element={<Admins />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="admins/logs" element={<Logs />} />
                    <Route path="help" element={<GetHelp />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
