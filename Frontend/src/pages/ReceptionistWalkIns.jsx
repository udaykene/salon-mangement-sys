import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReceptionistLayout from "../components/ReceptionistLayout";
import { useBranch } from "../context/BranchContext";
import { useService } from "../context/ServiceContext";

const ReceptionistWalkIns = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { currentBranch } = useBranch();
  const { services: allServices, fetchServices } = useService();

  const [walkIns, setWalkIns] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "",
    serviceName: "",
    category: "",
    staff: "Any",
    date: new Date().toISOString().split("T")[0],
    time: "",
  });

  const fetchWalkIns = useCallback(async () => {
    if (!currentBranch?._id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/appointments?branchId=${currentBranch._id}`,
      );
      // Filter for walk-ins only
      const walkInList = data
        .filter((apt) => apt.bookingType === "Walk-in")
        .map((apt) => ({
          id: apt._id,
          name: apt.customerName,
          service: apt.service,
          time: apt.time,
          status: apt.status.toLowerCase(), // Normalize to frontend status keys
          stylist: apt.staff,
          phone: apt.phone,
          avatar: apt.customerName.charAt(0).toUpperCase(),
        }));
      setWalkIns(walkInList);
    } catch (err) {
      console.error("Failed to fetch walk-ins", err);
    } finally {
      setLoading(false);
    }
  }, [currentBranch?._id]);

  const fetchStaff = useCallback(async () => {
    if (!currentBranch?._id) return;
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/staff?branchId=${currentBranch._id}`,
      );
      setStaffList(data);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    }
  }, [currentBranch?._id]);

  useEffect(() => {
    fetchWalkIns();
    fetchServices({ branchId: currentBranch?._id });
    fetchStaff();
  }, [fetchWalkIns, fetchServices, fetchStaff, currentBranch?._id]);

  useEffect(() => {
    if (showAddForm && formData.date) {
      const fetchSlots = async () => {
        try {
          setFetchingSlots(true);
          const { data } = await axios.get(
            `http://localhost:3000/api/appointments/available-slots?branchId=${currentBranch?._id}&date=${formData.date}&staff=${formData.staff}`,
          );
          setAvailableSlots(data);
        } catch (err) {
          console.error("Failed to fetch slots", err);
        } finally {
          setFetchingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [showAddForm, formData.date, formData.staff, currentBranch?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Please select an available time slot");
      return;
    }

    try {
      setLoading(true);
      const selectedService = allServices.find(
        (s) => s.id === formData.serviceId,
      );

      const payload = {
        customerName: formData.name,
        phone: formData.phone,
        email: "walkin@example.com", // Placeholder for required field
        category: selectedService?.category || "General",
        service: selectedService?.name || formData.serviceName,
        staff: formData.staff,
        date: formData.date,
        time: formData.time,
        branchId: currentBranch?._id,
        bookingType: "Walk-in",
        status: "Confirmed", // Walk-ins usually skip Pending
      };

      await axios.post("http://localhost:3000/api/appointments", payload);

      setFormData({
        name: "",
        phone: "",
        serviceId: "",
        serviceName: "",
        category: "",
        staff: "Any",
        date: new Date().toISOString().split("T")[0],
        time: "",
      });
      setShowAddForm(false);
      fetchWalkIns();
      alert("Walk-in client added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add walk-in");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Backend status uses Title Case: "Pending", "Confirmed", "Cancelled", "Completed", "In-Progress"
      const statusMap = {
        waiting: "Confirmed",
        "in-progress": "In-Progress",
        completed: "Completed",
      };

      const backendStatus = statusMap[newStatus] || newStatus;

      await axios.patch(`http://localhost:3000/api/appointments/${id}/status`, {
        status: backendStatus,
      });

      fetchWalkIns();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
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
      w.stylist.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const counts = walkIns.reduce(
    (acc, w) => {
      acc[w.status] = (acc[w.status] || 0) + 1;
      return acc;
    },
    { waiting: 0, "in-progress": 0, completed: 0 },
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
            <p className="text-3xl font-bold text-gray-900">{walkIns.length}</p>
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
            <p className="text-3xl font-bold text-gray-900">{counts.waiting}</p>
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
                    value={formData.serviceId}
                    onChange={(e) => {
                      const svc = allServices.find(
                        (s) => s.id === e.target.value,
                      );
                      setFormData({
                        ...formData,
                        serviceId: e.target.value,
                        serviceName: svc?.name || "",
                        category: svc?.category || "",
                      });
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="">Select a service</option>
                    {allServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} (₹{service.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Stylist
                  </label>
                  <select
                    value={formData.staff}
                    onChange={(e) =>
                      setFormData({ ...formData, staff: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  >
                    <option value="Any">Any Available</option>
                    {staffList.map((staff) => (
                      <option key={staff._id} value={staff.name}>
                        {staff.name} ({staff.roleTitle || staff.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Slots *
                  </label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    disabled={fetchingSlots}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm disabled:opacity-50"
                  >
                    <option value="">
                      {fetchingSlots ? "Fetching..." : "Select a slot"}
                    </option>
                    {availableSlots.map((slot) => (
                      <option
                        key={slot.time}
                        value={slot.time}
                        disabled={!slot.available}
                      >
                        {slot.time} {!slot.available && "(Booked)"}
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
