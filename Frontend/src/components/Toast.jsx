import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: "ri-checkbox-circle-line",
    error: "ri-error-warning-line",
    warning: "ri-alert-line",
    info: "ri-information-line",
  };

  const colors = {
    success: "from-green-500 to-emerald-500",
    error: "from-red-500 to-rose-500",
    warning: "from-yellow-500 to-orange-500",
    info: "from-blue-500 to-cyan-500",
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[100] max-w-md ${bgColors[type]} border-2 rounded-2xl shadow-2xl backdrop-blur-sm animate-slideInRight`}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[type]} flex items-center justify-center flex-shrink-0 shadow-lg`}
        >
          <i className={`${icons[type]} text-white text-xl`}></i>
        </div>
        <div className="flex-1 pt-1">
          <p className="text-gray-900 font-semibold text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[type]} animate-shrink`}
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-shrink {
          animation: shrink linear;
        }
      `}</style>
    </div>
  );
};

export default Toast;