import React, { useState, useEffect } from "react";
import Certifications from "../components/Certifications";

const SalonProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    isActive: true,
    createdAt: "",
    roleLabel:"",
    branchName:"",
  });
  const [role, setRole] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        const data = await res.json();

        // 🚫 Block receptionist from owner profile
        // if (data.role !== "admin") {
        //   throw new Error("Unauthorized access");
        // }

        setProfile(data.profile);
        setRole(data.role);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "OW";
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
            ✨ Owner Profile
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Profile
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your salon account and information
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
                {getInitials(profile.name)}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-24 pb-12 px-12">
            <div className="flex justify-between items-start mb-8 border-b pb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h2>
                <div className="flex gap-2 items-center">
                  {/* Active / Inactive */}
                  <span
                    className={`inline-block px-3 py-1 text-white text-sm font-bold rounded-full ${
                      profile.isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-gray-500 to-gray-600"
                    }`}
                  >
                    {profile.isActive ? "✓ Active" : "⏸ Inactive"}
                  </span>

                  {/* Role */}
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full">
                    {profile.roleLabel}
                  </span>

                  {/* Branch – ONLY for receptionist */}
                  {role === "receptionist" && profile.branchName && (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-full">
                      {profile.branchName}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                ✏️ Edit Profile
              </button>
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
                    {profile.email || "Not provided"}
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-sm font-bold text-purple-600 mb-1">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900">
                    {profile.phone || "Not provided"}
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm font-bold text-blue-600 mb-1">
                    Account Status
                  </p>
                  <p className="font-semibold text-gray-900">
                    {profile.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-600 mb-1">
                    Member Since
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex gap-4">
              <button className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-shadow">
                🏪 Manage Salon
              </button>
              <button className="flex-1 px-6 py-4 border-2 border-rose-500 text-rose-500 font-bold rounded-xl hover:bg-rose-50 transition-colors">
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <Certifications />
    </div>
  );
};

export default SalonProfile;
