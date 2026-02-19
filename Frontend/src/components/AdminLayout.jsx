import React from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { hasPlan, isTrialExpired, loading, role } = useAuth();
  const navigate = useNavigate();

  // Only gate admin users — receptionists are not affected
  const showOverlay =
    role === "admin" && !loading && (!hasPlan || isTrialExpired);

  const overlayMessage = isTrialExpired
    ? "Your trial period is over. Please purchase a plan to continue."
    : "You need to subscribe to a plan to access your dashboard.";

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex">
      <AdminSidebar />

      <main className="flex-1 h-screen relative">
        {/* Content — blurred when no plan or trial expired */}
        <div
          className={
            showOverlay ? "filter blur-sm pointer-events-none select-none" : ""
          }
        >
          {children}
        </div>

        {/* Overlay popup */}
        {showOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-gray-100">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200">
                <svg
                  className="w-8 h-8 text-white"
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

              {/* Heading */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isTrialExpired ? "Trial Expired" : "Subscription Required"}
              </h2>

              {/* Message */}
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                {overlayMessage}
              </p>

              {/* CTA */}
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-600 transition-all text-sm"
              >
                View Plans & Subscribe
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout;
