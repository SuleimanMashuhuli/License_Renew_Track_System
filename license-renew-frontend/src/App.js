import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home.jsx";
import About from './pages/About';
import Contacts from './pages/Contacts';
import Services from './pages/Services';
import Reports from './pages/Reports';
import NotificationsPage from './pages/NotificationsPage';
import Licenses from './pages/Licenses';
import Renew from './pages/Renew';
import Help from './pages/Help';
import LicenseList from './pages/LicenseList';
import Providers from './pages/Providers';
import Manage from './pages/Manage';
import Create from './pages/Create';
import SignOut from './pages/SignOut';
import ViewProfile from "./components/ViewProfile.jsx";
import ViewDetails from "./components/ViewDetails.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Renewals from "./pages/Renewals.jsx";
import Dash from "./pages/Dash.jsx";
import Layout from "./components/Layout.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Employee from "./pages/Employees.jsx";
import Renewing from "./pages/Renewing.jsx";
import Admins from "./pages/Admins.jsx"
import Logs from "./pages/Logs.jsx"
import Settings from "./pages/Settings.jsx";


function App() {
    return(
      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/sign_in" replace />} />

            <Route path="/sign_in" element={<SignIn />} />
            <Route path="/sign_up" element={<SignUp />} />
            <Route path="/logout" element={<SignOut />} />


            {/* Forgot/Reset Password Routes */}
            <Route path="/forgot_password" element={<ForgotPassword />} />
            <Route path="/reset_password/:uidb64/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/vprofile" element={<ViewProfile />} />
                <Route path="/view-details/:id" element={<ViewDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/services" element={<Services />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/providers" element={<Providers />} />
                <Route path="/manage" element={<Manage />} />
                <Route path="/licenses" element={<Licenses />} />
                <Route path="/viewlicense" element={<LicenseList />} />
                <Route path="/renewals" element={<Renewals />} />
                <Route path="/renew/:id" element={<Renew />} />
                <Route path="/create" element={<Create />} />
                <Route path="/help" element={<Help />} />
                <Route path="/dash" element={<Dash />} />

                {/* ---------VERSION 2------------- */}
                <Route path="/layout" element={<Layout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="dashboard" element={<DashboardHome />} />
                    <Route path="subscription" element={<Subscriptions />} />
                    <Route path="employees" element={<Employee />} />
                    <Route path="renewing" element={<Renewing />} />
                    <Route path="admins/manage" element={<Admins />} />
                    <Route path="admins/logs" element={<Logs />} />
                    <Route path="settings" element={<Renewing />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
