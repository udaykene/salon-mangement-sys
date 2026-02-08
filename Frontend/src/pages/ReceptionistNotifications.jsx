import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "New Walk-in Client",
      message:
        "John Doe walked in requesting Hair Styling service. Please check staff availability.",
      sender: "Front Desk",
      time: "5 minutes ago",
      date: "2026-02-08",
      isRead: false,
      priority: "high",
      icon: "ri-user-add-line",
      color: "from-rose-500 to-pink-500",
    },
    {
      id: 2,
      type: "appointment",
      title: "Client Arriving Soon",
      message:
        "Sarah Johnson has an appointment at 10:00 AM for Hair Styling. Expected in 15 minutes.",
      sender: "System",
      time: "10 minutes ago",
      date: "2026-02-08",
      isRead: false,
      priority: "high",
      icon: "ri-calendar-event-line",
      color: "from-orange-500 to-amber-500",
    },
    {
      id: 3,
      type: "client",
      title: "Client Checked In",
      message: "Emily Davis has checked in for her 11:30 AM Hair Coloring appointment",
      sender: "System",
      time: "30 minutes ago",
      date: "2026-02-08",
      isRead: true,
      priority: "medium",
      icon: "ri-login-circle-line",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      type: "staff",
      title: "Staff Break Reminder",
      message:
        "Emma Williams is scheduled for a break at 12:00 PM. Duration: 30 minutes.",
      sender: "System",
      time: "1 hour ago",
      date: "2026-02-08",
      isRead: true,
      priority: "low",
      icon: "ri-time-line",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 5,
      type: "appointment",
      title: "Appointment Cancelled",
      message:
        "Jessica Wright cancelled her 03:30 PM Nail Art appointment. Slot now available.",
      sender: "Jessica Wright",
      time: "2 hours ago",
      date: "2026-02-08",
      isRead: false,
      priority: "medium",
      icon: "ri-calendar-close-line",
      color: "from-red-500 to-rose-500",
    },
    {
      id: 6,
      type: "payment",
      title: "Payment Pending",
      message:
        "Payment of ₹2,500 is pending from Lisa Morgan for Spa Treatment service.",
      sender: "System",
      time: "3 hours ago",
      date: "2026-02-08",
      isRead: true,
      priority: "high",
      icon: "ri-money-rupee-circle-line",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 7,
      type: "client",
      title: "Client Waiting",
      message:
        "Anna Klein has been waiting for 10 minutes. Stylist Emma Williams is running late.",
      sender: "System",
      time: "15 minutes ago",
      date: "2026-02-08",
      isRead: false,
      priority: "high",
      icon: "ri-alert-line",
      color: "from-red-500 to-pink-500",
    },
    {
      id: 8,
      type: "staff",
      title: "Staff Available",
      message: "Maria Garcia is now available for appointments after completing her current service.",
      sender: "System",
      time: "20 minutes ago",
      date: "2026-02-08",
      isRead: true,
      priority: "low",
      icon: "ri-checkbox-circle-line",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 9,
      type: "appointment",
      title: "Appointment Reminder",
      message:
        "Reminder: Michael Brown has an appointment at 02:00 PM for Bridal Makeup consultation.",
      sender: "System",
      time: "4 hours ago",
      date: "2026-02-08",
      isRead: true,
      priority: "medium",
      icon: "ri-notification-line",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 10,
      type: "system",
      title: "Daily Report Ready",
      message:
        "Today's attendance and appointment summary is ready for review.",
      sender: "System",
      time: "5 hours ago",
      date: "2026-02-08",
      isRead: true,
      priority: "low",
      icon: "ri-file-text-line",
      color: "from-gray-500 to-slate-500",
    },
  ]);

  const [filterType, setFilterType] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const notificationTypes = [
    { id: "all", label: "All", icon: "ri-inbox-line" },
    {
      id: "appointment",
      label: "Appointments",
      icon: "ri-calendar-event-line",
    },
    { id: "client", label: "Clients", icon: "ri-user-line" },
    { id: "staff", label: "Staff", icon: "ri-team-line" },
    { id: "payment", label: "Payments", icon: "ri-money-rupee-circle-line" },
  ];

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const typeMatch = filterType === "all" || notification.type === filterType;
    const readMatch =
      filterRead === "all" ||
      (filterRead === "unread" && !notification.isRead) ||
      (filterRead === "read" && notification.isRead);
    const priorityMatch =
      filterPriority === "all" || notification.priority === filterPriority;
    const searchMatch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && readMatch && priorityMatch && searchMatch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const highPriorityCount = notifications.filter(
    (n) => n.priority === "high" && !n.isRead
  ).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <ReceptionistLayout>
      {/* Main Content */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with important alerts
                {unreadCount > 0 && (
                  <span className="ml-2 inline-block rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                    {unreadCount} New
                  </span>
                )}
                {highPriorityCount > 0 && (
                  <span className="ml-2 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    {highPriorityCount} Urgent
                  </span>
                )}
              </p>
            </div>

            {/* Mark All Read Button */}
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-rose-500/30 transition-all font-semibold"
            >
              <i className="ri-check-double-line text-lg"></i>
              Mark All Read
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-notification-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              All Notifications
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {notifications.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Today</p>
          </div>

          {/* Unread */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-mail-unread-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                New
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Unread</h3>
            <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
            <p className="text-xs text-gray-500 mt-2">Needs attention</p>
          </div>

          {/* High Priority */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-alert-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Urgent
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              High Priority
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {highPriorityCount}
            </p>
            <p className="text-xs text-gray-500 mt-2">Action required</p>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-calendar-event-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Appointments
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {notifications.filter((n) => n.type === "appointment").length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Related alerts</p>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          {/* Type Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Filter by Type:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {notificationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilterType(type.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all font-semibold text-sm ${
                    filterType === type.id
                      ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-500 text-rose-600"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <i className={`${type.icon} text-lg`}></i>
                  <span className="hidden sm:inline">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status and Priority Filters + Search */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Status Filters */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">
                Status:
              </span>
              <div className="flex gap-2">
                {["all", "unread", "read"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterRead(status)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all font-semibold text-sm capitalize ${
                      filterRead === status
                        ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-500 text-rose-600"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-rose-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filters */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">
                Priority:
              </span>
              <div className="flex gap-2">
                {["all", "high", "medium", "low"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilterPriority(priority)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all font-semibold text-sm capitalize ${
                      filterPriority === priority
                        ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-500 text-rose-600"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-rose-300"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:max-w-md ml-auto">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <i className="ri-notification-off-line text-6xl text-gray-300 mb-4 block"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600">
                {filterRead === "unread"
                  ? "You're all caught up! No unread notifications."
                  : searchQuery
                    ? "No notifications match your search."
                    : "Try adjusting your filters to see more results."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all group ${
                  notification.isRead
                    ? "border-gray-100"
                    : "border-rose-200 shadow-rose-500/5"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${notification.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <i
                        className={`${notification.icon} text-white text-2xl`}
                      ></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`text-lg ${notification.isRead ? "font-semibold" : "font-bold"} text-gray-900`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                              NEW
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold border rounded-md capitalize ${getPriorityStyles(notification.priority)}`}
                          >
                            {notification.priority}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <i className="ri-user-line text-rose-500"></i>
                          {notification.sender}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-time-line text-rose-500"></i>
                          {notification.time}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="w-10 h-10 rounded-lg bg-green-100 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                          title="Mark as read"
                        >
                          <i className="ri-check-line text-lg"></i>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistNotifications;