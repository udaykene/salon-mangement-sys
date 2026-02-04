import React, { useState } from "react";
import { Link } from "react-router-dom";
import Certifications from "../components/Certifications";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-6 sm:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to manage your appointments and profile
              </p>
            </div>


          

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-rose-600"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl"
              >
                Sign In
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-rose-600">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges — TL bola sirf import + paste */}
      <Certifications />
    </div>
  );
};

export default LoginPage;