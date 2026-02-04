import React, { useState } from "react";
import { Link } from "react-router-dom";
import Certifications from "../components/Certifications";

const SalonRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    newsletter: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration submitted:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-6 sm:px-8 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Create Account
              </h2>
              <p className="text-gray-600">
                Join us for exclusive beauty services and rewards
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all placeholder:text-gray-400"
                  required
                />
              </div>
              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl mt-6"
              >
                Create Account
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-rose-600 hover:text-rose-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges / Certifications - NO WRAPPER */}
      <Certifications />
    </>
  );
};

export default SalonRegister;
