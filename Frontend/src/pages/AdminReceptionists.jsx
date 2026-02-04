import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const AdminReceptionists = () => {
    const [receptionists, setReceptionists] = useState([
        {
            id: 1,
            name: "Meera Kapoor",
            email: "meera@parthbuilders.com",
            phone: "+91 9876543210",
            shift: "Morning",
            shiftTime: "8:00 AM - 2:00 PM",
            status: "active",
            location: "Main Office",
            joinDate: "Jan 2024",
            experience: "2 years",
            rating: 4.8,
        },
        {
            id: 2,
            name: "Kavita Singh",
            email: "kavita@parthbuilders.com",
            phone: "+91 9123456780",
            shift: "Afternoon",
            shiftTime: "2:00 PM - 8:00 PM",
            status: "active",
            location: "Main Office",
            joinDate: "Mar 2023",
            experience: "3 years",
            rating: 4.9,
        },
        {
            id: 3,
            name: "Pooja Mehta",
            email: "pooja@parthbuilders.com",
            phone: "+91 9988776655",
            shift: "Evening",
            shiftTime: "8:00 PM - 2:00 AM",
            status: "on-leave",
            location: "Branch Office",
            joinDate: "Jul 2024",
            experience: "1 year",
            rating: 4.6,
        },
        {
            id: 4,
            name: "Simran Kaur",
            email: "simran@parthbuilders.com",
            phone: "+91 9445566778",
            shift: "Morning",
            shiftTime: "8:00 AM - 2:00 PM",
            status: "active",
            location: "Branch Office",
            joinDate: "Feb 2023",
            experience: "3 years",
            rating: 4.7,
        },
        {
            id: 5,
            name: "Ritu Sharma",
            email: "ritu@parthbuilders.com",
            phone: "+91 9334455667",
            shift: "Afternoon",
            shiftTime: "2:00 PM - 8:00 PM",
            status: "active",
            location: "Main Office",
            joinDate: "Sep 2024",
            experience: "6 months",
            rating: 4.5,
        },
    ]);

    const [filterStatus, setFilterStatus] = useState("All");
    const [filterShift, setFilterShift] = useState("All");
    const [filterLocation, setFilterLocation] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const shifts = ["All", "Morning", "Afternoon", "Evening"];
    const locations = ["All", "Main Office", "Branch Office"];

    const getStatusStyles = (status) => {
        switch (status) {
            case "active":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";
            case "on-leave":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "inactive":
                return "bg-rose-50 text-rose-700 border border-rose-200";
            default:
                return "bg-slate-50 text-slate-700 border border-slate-200";
        }
    };

    const getShiftColor = (shift) => {
        switch (shift) {
            case "Morning":
                return "bg-blue-500";
            case "Afternoon":
                return "bg-amber-500";
            case "Evening":
                return "bg-purple-500";
            default:
                return "bg-slate-500";
        }
    };

    const filteredReceptionists = receptionists.filter((receptionist) => {
        const statusMatch =
            filterStatus === "All" || receptionist.status === filterStatus;
        const shiftMatch =
            filterShift === "All" || receptionist.shift === filterShift;
        const locationMatch =
            filterLocation === "All" || receptionist.location === filterLocation;
        const searchMatch =
            receptionist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.email.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && shiftMatch && locationMatch && searchMatch;
    });

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <i
                        key={index}
                        className={`${
                            index < fullStars
                                ? "ri-star-fill text-amber-500"
                                : index === fullStars && hasHalfStar
                                ? "ri-star-half-fill text-amber-500"
                                : "ri-star-line text-slate-300"
                        } text-sm`}
                    ></i>
                ))}
                <span className="ml-1 text-sm font-semibold text-slate-600">
                    {rating}
                </span>
            </div>
        );
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                Receptionist Management
                            </h1>
                            <p className="text-slate-600 text-sm">
                                Manage front desk staff and schedules
                            </p>
                        </div>
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5">
                            <i className="ri-user-add-line text-lg"></i>
                            <span>Add Receptionist</span>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        {[
                            {
                                title: "Total Staff",
                                value: receptionists.length.toString(),
                                icon: "ri-team-line",
                                color: "blue",
                            },
                            {
                                title: "On Duty",
                                value: receptionists
                                    .filter((r) => r.status === "active")
                                    .length.toString(),
                                icon: "ri-user-follow-line",
                                color: "emerald",
                            },
                            {
                                title: "On Leave",
                                value: receptionists
                                    .filter((r) => r.status === "on-leave")
                                    .length.toString(),
                                icon: "ri-time-line",
                                color: "amber",
                            },
                            {
                                title: "Locations",
                                value: "2",
                                icon: "ri-building-line",
                                color: "purple",
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                                        <i className={`${stat.icon} text-2xl text-${stat.color}-600`}></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
                    <div className="space-y-4">
                        {/* Status Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="text-sm font-semibold text-slate-700 min-w-fit">
                                Status:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {["all", "active", "on-leave", "inactive"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                            filterStatus === status
                                                ? "bg-amber-500 text-white shadow-md"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                    >
                                        {status === "all"
                                            ? "All"
                                            : status === "on-leave"
                                            ? "On Leave"
                                            : status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                                        <span className="opacity-75">
                                            (
                                            {status === "all"
                                                ? receptionists.length
                                                : receptionists.filter((r) => r.status === status)
                                                      .length}
                                            )
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Shift and Location Filters - Desktop */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700">
                                    Shift:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {shifts.map((shift) => (
                                        <button
                                            key={shift}
                                            onClick={() => setFilterShift(shift)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                filterShift === shift
                                                    ? "bg-amber-500 text-white shadow-md"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            {shift}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700">
                                    Location:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => setFilterLocation(location)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                filterLocation === location
                                                    ? "bg-amber-500 text-white shadow-md"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shift and Location Filters - Mobile */}
                        <div className="lg:hidden space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700 min-w-fit">
                                    Shift:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {shifts.map((shift) => (
                                        <button
                                            key={shift}
                                            onClick={() => setFilterShift(shift)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                filterShift === shift
                                                    ? "bg-amber-500 text-white shadow-md"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            {shift}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700 min-w-fit">
                                    Location:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => setFilterLocation(location)}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                                filterLocation === location
                                                    ? "bg-amber-500 text-white shadow-md"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                            <input
                                type="text"
                                placeholder="Search receptionists..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Receptionists List */}
                <div className="space-y-4">
                    {filteredReceptionists.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 py-20 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                                <i className="ri-user-search-line text-3xl text-slate-400"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                No receptionists found
                            </h3>
                            <p className="text-slate-600 mb-6">
                                Try adjusting your filters to see more results.
                            </p>
                            <button
                                onClick={() => {
                                    setFilterStatus("ll");
                                    setFilterShift("all");
                                    setFilterLocation("all");
                                    setSearchTerm("");
                                }}
                                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        filteredReceptionists.map((receptionist) => (
                            <div
                                key={receptionist.id}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-5 sm:p-6">
                                    {/* Header - Avatar, Name, Status, Shift */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                                        {/* Avatar */}
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm flex-shrink-0">
                                            {getInitials(receptionist.name)}
                                        </div>

                                        {/* Name and Badges */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                                                {receptionist.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(
                                                        receptionist.status
                                                    )}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${
                                                            receptionist.status === "active"
                                                                ? "bg-emerald-600"
                                                                : receptionist.status === "on-leave"
                                                                ? "bg-amber-600"
                                                                : "bg-rose-600"
                                                        }`}
                                                    ></span>
                                                    {receptionist.status === "on-leave"
                                                        ? "On Leave"
                                                        : receptionist.status}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white ${getShiftColor(
                                                        receptionist.shift
                                                    )}`}
                                                >
                                                    <i className="ri-time-line"></i>
                                                    {receptionist.shift}
                                                </span>
                                                <span className="text-xs text-slate-600 px-2">
                                                    {receptionist.shiftTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <i className="ri-mail-line text-slate-400 flex-shrink-0"></i>
                                            <span className="truncate">{receptionist.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <i className="ri-phone-line text-slate-400 flex-shrink-0"></i>
                                            <span>{receptionist.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <i className="ri-map-pin-line text-slate-400 flex-shrink-0"></i>
                                            <span>{receptionist.location}</span>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="flex flex-wrap items-center gap-4 pb-4 mb-4 border-b border-slate-200">
                                        {renderStars(receptionist.rating)}
                                        <span className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <i className="ri-briefcase-line text-slate-400"></i>
                                            <span className="font-medium">
                                                {receptionist.experience}
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <i className="ri-calendar-line text-slate-400"></i>
                                            <span className="font-medium">
                                                Joined {receptionist.joinDate}
                                            </span>
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium text-sm"
                                            title="View Details"
                                        >
                                            <i className="ri-eye-line"></i>
                                            <span className="sm:inline">View</span>
                                        </button>
                                        <button
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-colors font-medium text-sm"
                                            title="Edit"
                                        >
                                            <i className="ri-edit-line"></i>
                                            <span className="sm:inline">Edit</span>
                                        </button>
                                        <button
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors font-medium text-sm"
                                            title="Schedule"
                                        >
                                            <i className="ri-calendar-schedule-line"></i>
                                            <span className="hidden lg:inline">Schedule</span>
                                        </button>
                                        <button
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors font-medium text-sm"
                                            title="Message"
                                        >
                                            <i className="ri-mail-line"></i>
                                            <span className="hidden lg:inline">Message</span>
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors font-medium text-sm"
                                            title="Delete"
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {filteredReceptionists.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-600 text-center sm:text-left">
                            Showing{" "}
                            <span className="font-semibold">
                                {filteredReceptionists.length}
                            </span>{" "}
                            of <span className="font-semibold">{receptionists.length}</span>{" "}
                            receptionists
                        </p>
                    
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminReceptionists;