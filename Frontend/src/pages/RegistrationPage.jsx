import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Certifications from "../components/Certifications";
import { useAuth } from "../context/AuthContext";

const SalonRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    newsletter: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Frontend Validation
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions to proceed.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeTerms: formData.agreeTerms,
        newsletter: formData.newsletter,
      });

      alert(res.message || "Registration successful");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
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
                  name="name"
                  value={formData.name}
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
                    placeholder="********"
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
                    placeholder="********"
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

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 border-2 border-gray-200 rounded text-rose-500 focus:ring-rose-500/10 transition-all cursor-pointer"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeTerms"
                      className="text-gray-600 cursor-pointer"
                    >
                      I agree to the{" "}
                      <span className="text-rose-600 font-semibold hover:underline">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-rose-600 font-semibold hover:underline">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
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
