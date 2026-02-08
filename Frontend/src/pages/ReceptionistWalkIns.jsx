import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistWalkIns = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [walkIns, setWalkIns] = useState([
    {
      id: 1,
      name: "Rachel Green",
      service: "Hair Trim",
      time: "10:15 AM",
      status: "waiting",
      stylist: "Emma Williams",
      phone: "+91 98765 00001",
      avatar: "R",
    },
    {
      id: 2,
      name: "Monica Geller",
      service: "Manicure",
      time: "11:45 AM",
      status: "in-progress",
      stylist: "Lisa Anderson",
      phone: "+91 98765 00002",
      avatar: "M",
    },
    {
      id: 3,
      name: "Phoebe Buffay",
      service: "Facial",
      time: "01:20 PM",
      status: "completed",
      stylist: "Maria Garcia",
      phone: "+91 98765 00003",
      avatar: "P",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    stylist: "",
  });

  const services = [
    "Hair Cut",
    "Hair Styling",
    "Hair Coloring",
    "Manicure",
    "Pedicure",
    "Facial",
    "Spa Treatment",
    "Makeup",
    "Nail Art",
  ];

  const stylists = [
    "Emma Williams",
    "Lisa Anderson",
    "Maria Garcia",
    "John Smith",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newWalkIn = {
      id: walkIns.length + 1,
      name: formData.name,
      service: formData.service,
      time: time,
      status: "waiting",
      stylist: formData.stylist,
      phone: formData.phone,
      avatar: formData.name.charAt(0).toUpperCase(),
    };

    setWalkIns([newWalkIn, ...walkIns]);
    setFormData({ name: "", phone: "", service: "", stylist: "" });
    setShowAddForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setWalkIns((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filtered = walkIns.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.stylist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const counts = walkIns.reduce(
    (acc, w) => {
      acc[w.status] = (acc[w.status] || 0) + 1;
      return acc;
    },
    { waiting: 0, "in-progress": 0, completed: 0 }
  );

  return (
    <ReceptionistLayout>
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Walk-in Clients
          </h1>
          <p className="text-gray-600">
            Manage clients without prior appointments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Walk-ins Today */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-user-add-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Walk-ins
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {walkIns.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">Today's total</p>
          </div>

          {/* Waiting */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-time-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Queue
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Waiting</h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.waiting}
            </p>
            <p className="text-xs text-gray-500 mt-2">In waiting area</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-loader-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts["in-progress"]}
            </p>
            <p className="text-xs text-gray-500 mt-2">Being served</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Done
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Completed
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {counts.completed}
            </p>
            <p className="text-xs text-gray-500 mt-2">Finished today</p>
          </div>
        </div>

        {/* Add Walk-in Button & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2"
            >
              <i className="ri-add-circle-line text-xl"></i>
              {showAddForm ? "Cancel" : "Add Walk-in Client"}
            </button>

            {/* Search Box */}
            <div className="w-full lg:w-auto">
              <div className="relative">
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, service, or stylist..."
                  className="w-full lg:w-80 pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Walk-in Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="ri-user-add-line text-rose-600"></i>
              New Walk-in Client
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter client name"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service *
                  </label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Stylist *
                  </label>
                  <select
                    required
                    value={formData.stylist}
                    onChange={(e) =>
                      setFormData({ ...formData, stylist: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="">Select a stylist</option>
                    {stylists.map((stylist) => (
                      <option key={stylist} value={stylist}>
                        {stylist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all"
                >
                  Add Client
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Walk-ins List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="ri-list-check text-rose-600"></i>
                Walk-in Clients ({filtered.length})
              </h2>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-inbox-line text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                No walk-in clients yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Add a new walk-in client to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((walkIn) => (
                <div
                  key={walkIn.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Client Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
                        {walkIn.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {walkIn.name}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(walkIn.status)}`}
                          >
                            {walkIn.status === "in-progress"
                              ? "In Progress"
                              : walkIn.status.charAt(0).toUpperCase() +
                                walkIn.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {walkIn.service}
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <i className="ri-time-line text-rose-500"></i>
                            Arrived: {walkIn.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-scissors-2-line text-rose-500"></i>
                            {walkIn.stylist}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="ri-phone-line text-rose-500"></i>
                            {walkIn.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {walkIn.status === "waiting" && (
                        <button
                          onClick={() =>
                            handleStatusChange(walkIn.id, "in-progress")
                          }
                          className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm font-medium text-sm"
                        >
                          <i className="ri-play-circle-line"></i>
                          Start Service
                        </button>
                      )}
                      {walkIn.status === "in-progress" && (
                        <button
                          onClick={() =>
                            handleStatusChange(walkIn.id, "completed")
                          }
                          className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 shadow-sm font-medium text-sm"
                        >
                          <i className="ri-checkbox-circle-line"></i>
                          Complete
                        </button>
                      )}
                      <button
                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border-2 border-rose-200 hover:border-rose-500 shadow-sm"
                        title="View Details"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistWalkIns;