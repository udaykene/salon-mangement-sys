import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import axios from "axios";

const ReceptionistProfile = () => {
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Receptionist",
        joinDate: "",
        isActive: true,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "", // Not used in current API but good for UI
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get("http://localhost:3000/api/profile", {
                withCredentials: true,
            });

            if (data.profile) {
                setProfileData({
                    name: data.profile.name || "",
                    email: data.profile.email || "",
                    phone: data.profile.phone || "",
                    role: data.profile.roleLabel || "Receptionist",
                    joinDate: data.profile.createdAt
                        ? new Date(data.profile.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })
                        : "January 2024",
                    isActive: data.profile.isActive ?? (data.profile.status === "active"),
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            // Only name, role, and joiningDate are editable
            // Email and Phone are read-only in UI
            const payload = {
                name: profileData.name,
                roleTitle: profileData.role,
                joiningDate: profileData.joinDate,
            };

            const { data } = await axios.put("http://localhost:3000/api/profile/receptionist", payload, {
                withCredentials: true,
            });

            // Update local state with returned data to ensure sync
            if (data.profile) {
                setProfileData(prev => ({
                    ...prev,
                    name: data.profile.name,
                    role: data.profile.roleLabel || prev.role,
                    joinDate: data.profile.createdAt ? new Date(data.profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    }) : prev.joinDate,
                }));
            }

            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            alert("Please fill in all password fields");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        try {
            // The receptionist update endpoint handles password update if 'password' field is present
            const payload = {
                name: profileData.name,
                password: passwordData.newPassword,
            };

            await axios.put("http://localhost:3000/api/profile/receptionist", payload, {
                withCredentials: true,
            });

            alert("Password changed successfully!");
            setShowPasswordModal(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            alert(error.response?.data?.message || "Failed to change password");
        }
    };

    if (isLoading) {
        return (
            <ReceptionistLayout>
                <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600"></div>
                    </div>
                </main>
            </ReceptionistLayout>
        );
    }

    return (
        <ReceptionistLayout>
            {/* Main Content */}
            <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600">
                        Manage your account information and preferences
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                    {/* Header with Gradient Background */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                                    <span className="text-4xl font-bold text-white">
                                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : "R"}
                                    </span>
                                </div>
                                {/* Camera icon button - visual only for now */}
                                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white border-2 border-rose-200 flex items-center justify-center text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-lg">
                                    <i className="ri-camera-line text-lg"></i>
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {profileData.name}
                                </h2>
                                <p className="text-gray-600 mb-3">{profileData.email}</p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                                        {profileData.role}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                        <i className="ri-calendar-line mr-1"></i>
                                        Since {profileData.joinDate}
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg border-2 ${isEditing
                                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                                    : "bg-gradient-to-br from-rose-500 to-pink-500 text-white border-transparent hover:from-rose-600 hover:to-pink-600"
                                    }`}
                                onClick={() => setIsEditing(!isEditing)}
                                aria-label={isEditing ? "Close" : "Edit"}
                            >
                                <i
                                    className={`${isEditing ? "ri-close-line" : "ri-edit-line"} text-xl`}
                                ></i>
                            </button>
                        </div>
                    </div>

                    {/* Personal Information Form */}
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <i className="ri-user-settings-line text-rose-600"></i>
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {/* Name Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="rounded-xl border-2 border-gray-200 p-3 text-sm text-gray-900 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                                        {profileData.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Field - Read Only */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <p className="text-base font-medium text-gray-500 bg-gray-100 rounded-xl p-3 border border-gray-200 break-words cursor-not-allowed">
                                    {profileData.email}
                                </p>
                            </div>

                            {/* Phone Field - Read Only */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Phone Number
                                </label>
                                <p className="text-base font-medium text-gray-500 bg-gray-100 rounded-xl p-3 border border-gray-200 cursor-not-allowed">
                                    {profileData.phone}
                                </p>
                            </div>

                            {/* Role Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="role"
                                        value={profileData.role}
                                        onChange={handleInputChange}
                                        className="rounded-xl border-2 border-gray-200 p-3 text-sm text-gray-900 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                                        {profileData.role}
                                    </p>
                                )}
                            </div>

                            {/* Join Date Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                    Member Since
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="joinDate"
                                        value={profileData.joinDate}
                                        onChange={handleInputChange}
                                        placeholder="YYYY-MM-DD or Month Year"
                                        className="rounded-xl border-2 border-gray-200 p-3 text-sm text-gray-900 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    />
                                ) : (
                                    <p className="text-base font-medium text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                                        {profileData.joinDate}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all"
                                >
                                    <i className="ri-check-line text-lg"></i>
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="rounded-xl bg-gray-100 hover:bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all border-2 border-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Settings Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <i className="ri-shield-check-line text-rose-600"></i>
                            Security Settings
                        </h2>
                    </div>

                    <div className="p-6 space-y-4">
                        {[
                            {
                                icon: "ri-lock-password-line",
                                title: "Password",
                                desc: "Change your account password",
                                btn: "Change Password",
                                gradient: "from-rose-500 to-pink-500",
                                bgColor: "bg-rose-50",
                                textColor: "text-rose-600",
                                borderColor: "border-rose-200",
                                hoverBg: "hover:bg-rose-500",
                                onClick: () => setShowPasswordModal(true),
                            },
                            {
                                icon: "ri-shield-check-line",
                                title: "Two-Factor Authentication",
                                desc: "Add an extra layer of security",
                                btn: "Enable",
                                gradient: "from-green-500 to-emerald-500",
                                bgColor: "bg-green-50",
                                textColor: "text-green-600",
                                borderColor: "border-green-200",
                                hoverBg: "hover:bg-green-500",
                                onClick: () => alert("Two-Factor Authentication feature coming soon!"),
                            },
                            {
                                icon: "ri-smartphone-line",
                                title: "Active Sessions",
                                desc: "Manage your active devices",
                                btn: "View All",
                                gradient: "from-blue-500 to-cyan-500",
                                bgColor: "bg-blue-50",
                                textColor: "text-blue-600",
                                borderColor: "border-blue-200",
                                hoverBg: "hover:bg-blue-500",
                                onClick: () => alert("Active Sessions feature coming soon!"),
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border-2 border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg hover:border-rose-200 hover:bg-rose-50/30 group"
                            >
                                <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
                                    >
                                        <i className={`${item.icon} text-2xl text-white`}></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-gray-900 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={item.onClick}
                                    className={`w-full sm:w-auto border-2 ${item.borderColor} rounded-xl ${item.bgColor} px-5 py-2.5 text-sm font-semibold ${item.textColor} transition-all ${item.hoverBg} hover:text-white hover:border-transparent shadow-sm whitespace-nowrap`}
                                >
                                    {item.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    {/* Account Activity */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                                <i className="ri-line-chart-line text-white text-2xl"></i>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">
                            Account Activity
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {profileData.isActive ? "Active" : "Inactive"}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Last login: Today</p>
                    </div>

                    {/* Total Logins - Placeholder specific for Receptionist */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                                <i className="ri-login-circle-line text-white text-2xl"></i>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">
                            Check-ins Handled
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">42</p>
                        <p className="text-xs text-gray-500 mt-2">This month: 12</p>
                    </div>

                    {/* Profile Completion */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">
                            Profile Completion
                        </h3>
                        <p className="text-3xl font-bold text-gray-900">100%</p>
                        <p className="text-xs text-gray-500 mt-2">All details up to date</p>
                    </div>
                </div>
            </main>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <i className="ri-lock-password-line text-rose-600"></i>
                                Change Password
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData((prev) => ({
                                            ...prev,
                                            newPassword: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm text-gray-900 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData((prev) => ({
                                            ...prev,
                                            confirmPassword: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border-2 border-gray-200 p-3 text-sm text-gray-900 outline-none transition-all focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handlePasswordChange}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all"
                                >
                                    Update Password
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                    }}
                                    className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-all border-2 border-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ReceptionistLayout>
    );
};

export default ReceptionistProfile;
