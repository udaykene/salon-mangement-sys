import React, { useState, useEffect } from "react";
import Certifications from "../components/Certifications";
import { useAuth } from "../context/AuthContext";

const SalonProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    isActive: true,
    createdAt: "",
    roleLabel: "",
    branchName: "",
  });
  const { user, role, loading, logout } = useAuth();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const res = await fetch("/api/profile", {
  //         method: "GET",
  //         credentials: "include",
  //       });

  //       if (!res.ok) {
  //         throw new Error("Not authenticated");
  //       }

  //       const data = await res.json();

  //       // 🚫 Block receptionist from owner profile
  //       // if (data.role !== "admin") {
  //       //   throw new Error("Unauthorized access");
  //       // }

  //       setProfile(data.profile);
  //       setRole(data.role);
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.message || "Failed to load profile");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  const getInitials = (name) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600 font-semibold">
        <p>No profile data found.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-rose-500 mt-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // ❌ Error / Unauthorized
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white w-full overflow-x-hidden">
      {/* Hero Header */}
      <div className="relative bg-gray-900 py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block mb-3 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-300/30 text-rose-200 text-sm font-medium">
            ✨ {role === "admin" ? "Owner Central" : "Staff Portal"}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {role === "admin" ? "Salon" : "My"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Profile
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome back, {user.name.split(" ")[0]}!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Cover */}
          <div className="relative h-48 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1740&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/80 to-pink-500/80"></div>

            <div className="absolute -bottom-16 left-12">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 border-4 border-white flex items-center justify-center text-4xl text-white font-bold shadow-2xl">
                {getInitials(user.name)}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-24 pb-12 px-12">
            <div className="flex justify-between items-start mb-8 border-b pb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h2>
                <div className="flex gap-2 items-center">
                  {/* Active / Inactive */}
                  <span
                    className={`inline-block px-3 py-1 text-white text-sm font-bold rounded-full ${
                      user.isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-gray-500 to-gray-600"
                    }`}
                  >
                    {user.isActive ? "✓ Active" : "⏸ Inactive"}
                  </span>

                  {/* Role */}
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full">
                    {user.roleLabel}
                  </span>

                  {/* Branch – ONLY for receptionist */}
                  {role === "receptionist" && user.branchName && (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-full">
                      {user.branchName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-sm font-bold text-rose-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">
                    {user.email || "Not provided"}
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-sm font-bold text-purple-600 mb-1">
                    Phone Number
                  </p>
                  <p className="font-semibold text-gray-900">
                    {user.phone || "Not provided"}
                  </p>
                </div>
                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-600 mb-1">
                    Member Since
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Role Type
                  </p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {role}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              {role === "admin" ? (
                <>
                  <button className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-rose-200 transition-all">
                    🏪 Manage My Branches
                  </button>
                  <button className="flex-1 px-6 py-4 border-2 border-rose-500 text-rose-500 font-bold rounded-xl hover:bg-rose-50 transition-colors">
                    📊 Business Analytics
                  </button>
                </>
              ) : (
                <button className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all">
                  📅 View Today's Appointments
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Certifications />
    </div>
  );
};

export default SalonProfile;
