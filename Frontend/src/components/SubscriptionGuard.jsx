import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SubscriptionGuard = () => {
    const { isTrialExpired, loading, role } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    // Only check for Admin (Owner) role
    if (role === 'admin' && isTrialExpired) {
        return <Navigate to="/plan-expired" replace />;
    }

    return <Outlet />;
};

export default SubscriptionGuard;
