import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OtpModal from "../components/OtpModal";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
    email: "",
  });

  // OTP state for email change
  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/customer-auth/profile", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.user) {
        setProfile(data.user);
        setForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          gender: data.user.gender || "",
          address: data.user.address || "",
          email: data.user.email || "",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        address: form.address,
      };

      const res = await fetch("/customer-auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.requiresOtp) {
        setOtpEmail(data.otpEmail || profile?.email || "");
        setShowOtp(true);
        setMessage({
          type: "success",
          text: data.message || "OTP sent. Verify to complete mobile update.",
        });
        return;
      }

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.message || "Update failed" });
        return;
      }

      setProfile(data.user);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      refreshUser();
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneOtpVerified = (data) => {
    if (data?.success && data?.user) {
      setProfile(data.user);
      setForm((prev) => ({ ...prev, phone: data.user.phone || "" }));
      setMessage({ type: "success", text: "Mobile number updated successfully!" });
      refreshUser();
    } else {
      setMessage({ type: "error", text: data?.message || "OTP verification failed" });
    }

    setOtpEmail("");
    setShowOtp(false);
    setEditing(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        address: profile.address || "",
        email: profile.email || "",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const avatar = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
      `}</style>

      <div
        className="min-h-screen px-4 py-24 relative"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-gradient-to-b from-rose-500/6 to-transparent blur-[80px]" />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-xl shadow-rose-500/25 mb-4">
              <span
                className="text-white text-3xl font-bold"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {avatar}
              </span>
            </div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {profile.name}
            </h1>
            <p className="text-white/40 text-sm">{profile.email}</p>
            {profile.emailVerified && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                <span>✓</span> Email Verified
              </span>
            )}
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-5 px-4 py-3 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-[#141416]/80 backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
              <h2 className="text-white font-semibold text-sm">
                Personal Information
              </h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 text-xs font-medium text-white/40 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg hover:from-rose-400 hover:to-pink-400 transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="px-6 py-5 space-y-5">
              {/* Name */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm text-white/40 font-medium">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="col-span-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all"
                  />
                ) : (
                  <span className="col-span-2 text-sm text-white">
                    {profile.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm text-white/40 font-medium">
                  Email
                </label>
                <div className="col-span-2">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    readOnly
                    disabled
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm cursor-not-allowed"
                  />
                  <p className="text-white/40 text-xs mt-1.5">
                    Email cannot be changed.
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm text-white/40 font-medium">
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="col-span-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all"
                  />
                ) : (
                  <span className="col-span-2 text-sm text-white">
                    {profile.phone || "—"}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm text-white/40 font-medium">
                  Gender
                </label>
                {editing ? (
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="col-span-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#141416]">
                      Select
                    </option>
                    <option value="male" className="bg-[#141416]">
                      Male
                    </option>
                    <option value="female" className="bg-[#141416]">
                      Female
                    </option>
                    <option value="other" className="bg-[#141416]">
                      Other
                    </option>
                  </select>
                ) : (
                  <span className="col-span-2 text-sm text-white capitalize">
                    {profile.gender || "—"}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="grid grid-cols-3 items-start gap-4">
                <label className="text-sm text-white/40 font-medium pt-2.5">
                  Address
                </label>
                {editing ? (
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="col-span-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all resize-none"
                    placeholder="Enter your address"
                  />
                ) : (
                  <span className="col-span-2 text-sm text-white">
                    {profile.address || "—"}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/6">
              <p className="text-white/20 text-xs">
                Member since{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal for email change */}
      {showOtp && (
        <OtpModal
          email={otpEmail}
          purpose="phone-change"
          onVerified={handlePhoneOtpVerified}
          onClose={() => setShowOtp(false)}
        />
      )}
    </>
  );
};

export default Profile;

