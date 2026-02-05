import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Certifications from "../components/Certifications";
import axios from "axios";
const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("owner"); // 'owner' or 'staff'

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (loginType === "owner") {
      const res = await axios.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      alert(res.data.message);
      navigate("/admin/dashboard");

    } else {
      alert("Staff login will be added later");
    }

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    // Clear form data when switching
    setFormData({
      email: "",
      password: "",
      phone: "",
      rememberMe: false,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col bg-gray-50">
      {/* Login Content */}
      <div className="flex-1 min-h-screen flex items-center justify-center">
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

            {/* Login Type Toggle */}
            <div className="mb-6 bg-gray-100 rounded-xl p-1 flex gap-1">
              <button
                type="button"
                onClick={() => handleLoginTypeChange("owner")}
                className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                  loginType === "owner"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-shield-user-line mr-2"></i>
                Owner Login
              </button>
              <button
                type="button"
                onClick={() => handleLoginTypeChange("staff")}
                className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                  loginType === "staff"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-team-line mr-2"></i>
                Staff Login
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {loginType === "owner" ? (
                <>
                  {/* Owner Login - Email & Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <i
                          className={
                            showPassword ? "ri-eye-off-line" : "ri-eye-line"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Staff Login - Phone Number Only */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <i className="ri-phone-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      <i className="ri-information-line mr-1"></i>
                      Staff members login with registered phone number
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                {loginType === "owner" && (
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all hover:shadow-xl"
              >
                {loginType === "owner" ? (
                  <>
                    <i className="ri-login-box-line mr-2"></i>
                    Sign In as Owner
                  </>
                ) : (
                  <>
                    <i className="ri-login-box-line mr-2"></i>
                    Sign In as Staff
                  </>
                )}
              </button>
            </form>

            {loginType === "owner" && (
              <p className="text-center mt-6 text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            )}

            {loginType === "staff" && (
              <p className="text-center mt-6 text-sm text-gray-500">
                <i className="ri-information-line mr-1"></i>
                Staff accounts are created by the salon owner
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges — TL bola sirf import + paste */}
      <Certifications />
    </div>
  );
};

export default LoginPage;
