import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "New Appointment Request",
      message:
        "John Doe has requested an appointment for Hair Styling & Color on Feb 5, 2026",
      sender: "John Doe",
      time: "5 minutes ago",
      date: "2026-01-29",
      isRead: false,
      priority: "high",
      icon: "ri-calendar-event-line",
      color: "from-rose-500 to-pink-500",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message:
        "Payment of ₹45,000 received from Rahul Sharma for Bridal Makeup Package",
      sender: "Rahul Sharma",
      time: "2 hours ago",
      date: "2026-01-29",
      isRead: false,
      priority: "high",
      icon: "ri-money-rupee-circle-line",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      type: "client",
      title: "New Client Registration",
      message: "Anita Desai has registered as a new client",
      sender: "System",
      time: "3 hours ago",
      date: "2026-01-29",
      isRead: true,
      priority: "medium",
      icon: "ri-user-add-line",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      type: "service",
      title: "Service Update",
      message:
        "Spa & Massage service has been updated with new pricing",
      sender: "Admin",
      time: "5 hours ago",
      date: "2026-01-29",
      isRead: true,
      priority: "medium",
      icon: "ri-scissors-2-line",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 5,
      type: "staff",
      title: "Staff Leave Request",
      message: "Vikram Singh has requested leave from Feb 15 to Feb 20",
      sender: "Vikram Singh",
      time: "1 day ago",
      date: "2026-01-28",
      isRead: false,
      priority: "low",
      icon: "ri-calendar-close-line",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 6,
      type: "appointment",
      title: "Appointment Cancelled",
      message:
        "Sarah Williams has cancelled the appointment for Facial Treatment",
      sender: "Sarah Williams",
      time: "1 day ago",
      date: "2026-01-28",
      isRead: true,
      priority: "low",
      icon: "ri-calendar-close-line",
      color: "from-red-500 to-pink-500",
    },
    {
      id: 7,
      type: "offer",
      title: "Offer Redemption",
      message: "Client used promo code BELLA20 for ₹2,000 discount",
      sender: "System",
      time: "2 days ago",
      date: "2026-01-27",
      isRead: true,
      priority: "low",
      icon: "ri-gift-line",
      color: "from-rose-500 to-pink-500",
    },
    {
      id: 8,
      type: "payment",
      title: "Payment Pending",
      message:
        "Payment of ₹32,500 is pending from Anita Desai for Bridal Package",
      sender: "System",
      time: "2 days ago",
      date: "2026-01-27",
      isRead: true,
      priority: "high",
      icon: "ri-time-line",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 9,
      type: "review",
      title: "New Review Received",
      message: "Amit Verma left a 5-star review for Hair Coloring service",
      sender: "Amit Verma",
      time: "3 days ago",
      date: "2026-01-26",
      isRead: true,
      priority: "low",
      icon: "ri-star-line",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 10,
      type: "system",
      title: "System Update",
      message:
        "System maintenance scheduled for Feb 1, 2026 from 2:00 AM to 4:00 AM",
      sender: "System",
      time: "3 days ago",
      date: "2026-01-26",
      isRead: true,
      priority: "medium",
      icon: "ri-information-line",
      color: "from-gray-500 to-slate-500",
    },
  ]);

  const [filterType, setFilterType] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const notificationTypes = [
    { id: "all", label: "All", icon: "ri-inbox-line" },
    {
      id: "appointment",
      label: "Appointments",
      icon: "ri-calendar-event-line",
    },
    { id: "payment", label: "Payments", icon: "ri-money-rupee-circle-line" },
    { id: "client", label: "Clients", icon: "ri-user-line" },
    { id: "service", label: "Services", icon: "ri-scissors-2-line" },
    { id: "staff", label: "Staff", icon: "ri-team-line" },
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
    const searchMatch =
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && readMatch && searchMatch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleBulkDelete = () => {
    setNotifications((prev) =>
      prev.filter((n) => !selectedNotifications.includes(n.id)),
    );
    setSelectedNotifications([]);
  };

  const handleBulkMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n,
      ),
    );
    setSelectedNotifications([]);
  };

  return (
    <AdminLayout>
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
                Stay updated with your latest notifications
                {unreadCount > 0 && (
                  <span className="ml-2 inline-block rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                    {unreadCount} New
                  </span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {selectedNotifications.length > 0 && (
                <>
                  <button
                    onClick={handleBulkMarkAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <i className="ri-check-double-line text-lg text-green-600"></i>
                    <span className="text-sm font-semibold text-gray-900">
                      Mark Read ({selectedNotifications.length})
                    </span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-red-200 hover:border-red-500 hover:bg-red-50 transition-all group"
                  >
                    <i className="ri-delete-bin-line text-lg text-red-600"></i>
                    <span className="text-sm font-semibold text-gray-900">
                      Delete ({selectedNotifications.length})
                    </span>
                  </button>
                </>
              )}
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-rose-500/30 transition-all"
              >
                <i className="ri-check-double-line text-lg"></i>
                <span className="text-sm font-semibold">Mark All Read</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          {/* Type Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Filter by Type:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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

          {/* Status Filter and Search */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
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

            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
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
                      <i className={`${notification.icon} text-white text-2xl`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-lg ${notification.isRead ? 'font-semibold' : 'font-bold'} text-gray-900`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                              NEW
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold border rounded-md capitalize ${getPriorityStyles(
                              notification.priority,
                            )}`}
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
                        className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                        title="View details"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>
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
    </AdminLayout>
  );
};

export default AdminNotifications;