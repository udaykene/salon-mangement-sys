import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PlanExpired = () => {
    const { logout, isTrialExpired, role } = useAuth();
    const navigate = useNavigate();

    // If unknowingly navigated here but not expired, go back (optional safety)
    useEffect(() => {
        if (!isTrialExpired && role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [isTrialExpired, role, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="w-10 h-10 text-rose-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">
                    Trial Period Expired
                </h1>
                <p className="text-gray-400 mb-8">
                    Your 14-day free trial has ended. To continue managing your salon with
                    premium features, please upgrade your plan.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/pricing"
                        className="block w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors"
                    >
                        View Plans & Upgrade
                    </Link>

                    <button
                        onClick={logout}
                        className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-500">
                        Need help? <a href="/contact" className="text-rose-500 hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlanExpired;
