import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBranch } from "../context/BranchContext";
import { useService } from "../context/ServiceContext";

const AppointmentForm = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  mode = "create",
  role = "admin", // 'admin' or 'receptionist'
}) => {
  const { branches } = useBranch();
  const { services, getServices } = useService();

  // Local state for dropdowns
  const [categories, setCategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);

  // Client state
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientList, setShowClientList] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    branchId: "",
    clientId: "",
    customerName: "",
    email: "",
    phone: "",
    category: "", // ID
    service: "", // Service Name (legacy) or ID? formatService uses ID for category but service itself?
    // AdminAppointments.jsx uses service Name in payload usually, but let's check.
    // It maps service name. But ID is better. Let's use ID if backend supports, or Name if not.
    // Existing code uses 'service: apt.service' (string name).
    // We will stick to name to match backend expectation for now, BUT we need ID to find staff.
    serviceName: "",
    serviceId: "",
    staff: "Any",
    date: "",
    time: "",
    notes: "",
    price: 0,
  });

  const [loading, setLoading] = useState(false);

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setFormData({
        branchId: initialData.branchId || "",
        clientId: initialData.clientId || "",
        customerName: initialData.clientName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        category: initialData.type || "", // Category Name or ID? formatted data has 'type' which is name?
        // This is messy. We should try to resolve IDs.
        // For 'create', it's clean. For 'edit', we accept what we have.
        serviceName: initialData.service || "",
        serviceId: "", // We might find this from services list
        staff: initialData.staff || "Any",
        date: initialData.date || "",
        time: initialData.time || "",
        notes: initialData.notes || "",
        price: initialData.price || 0,
      });
    } else {
      // New Appointment
      setFormData((prev) => ({
        ...prev,
        // If Role is receptionist, auto-set branch
        branchId:
          role === "receptionist" && branches.length > 0 ? branches[0]._id : "",
      }));
    }
  }, [initialData, isOpen, role, branches]);

  // Fetch Clients
  useEffect(() => {
    const fetchClients = async () => {
      // Only fetch if branch is selected (or if we want to allow global search for admin, but specific is requested)
      // User request: "if client is already present in that branch... if not owner can create new client... in that branch"
      // This implies we should filter clients by branch if a branch is selected.
      if (!formData.branchId) return;

      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/clients?branchId=${formData.branchId}`,
        );
        setClients(data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };
    fetchClients();
  }, [formData.branchId]); // Refetch when branch changes

  // Fetch Categories when branch changes
  useEffect(() => {
    if (formData.branchId) {
      const fetchCats = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:3000/api/categories/${formData.branchId}`,
          );
          setCategories(data.success ? data.categories : []);
        } catch (err) {
          console.error(err);
          setCategories([]);
        }
      };
      fetchCats();
    } else {
      setCategories([]);
    }
  }, [formData.branchId]);

  // Fetch services when branch/cat updates
  useEffect(() => {
    if (formData.branchId && formData.category) {
      // Fetch services filtered by branch and category
      const fetchSvcs = async () => {
        try {
          // If formData.category is ID (which it should be from select)
          const { data } = await axios.get(
            `http://localhost:3000/api/services?branchId=${formData.branchId}&category=${formData.category}`,
          );
          if (data.success) {
            setFilteredServices(data.services);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchSvcs();
    } else {
      setFilteredServices([]);
    }
  }, [formData.branchId, formData.category]);

  // Update staff when Service changes
  useEffect(() => {
    if (formData.serviceId) {
      const service = filteredServices.find(
        (s) => s._id === formData.serviceId,
      );
      if (service && service.staffIds && service.staffIds.length > 0) {
        setAvailableStaff(service.staffIds); // These should be populated objects { _id, name, role }
      } else {
        setAvailableStaff([]); // No specific staff assigned
      }
      // Update price too
      if (service) {
        setFormData((prev) => ({ ...prev, price: service.price }));
      }
    } else {
      setAvailableStaff([]);
    }
  }, [formData.serviceId, filteredServices]);

  const handleClientSelect = (client) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client._id,
      customerName: client.name,
      email: client.email,
      phone: client.phone,
    }));
    setClientSearch(client.name);
    setShowClientList(false);
    setShowNewClientForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find category name if needed for payload (backend expectation?)
      const cat = categories.find((c) => c._id === formData.category);
      const catName = cat ? cat.name : formData.category;

      const payload = {
        ...formData,
        category: catName, // Sending Name as per previous observation
        service: formData.serviceName, // Sending Name
      };

      if (mode === "create") {
        await axios.post("http://localhost:3000/api/appointments", {
          ...payload,
          status: "pending",
        });
        alert("Appointment created successfully");
      } else {
        await axios.put(
          `http://localhost:3000/api/appointments/${initialData.id}`,
          payload,
        );
        alert("Appointment updated successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-rose-50 to-pink-50">
          <h3 className="text-xl font-bold text-gray-800">
            {mode === "create" ? "New Booking" : "Edit Appointment"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch Selection (Admin only) */}
            {role === "admin" && (
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                <label className="block text-sm font-bold text-rose-800 mb-2">
                  Select Branch <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.branchId}
                  onChange={(e) =>
                    setFormData({
                      branchId: e.target.value,
                      clientId: "",
                      customerName: "",
                      email: "",
                      phone: "",
                      category: "",
                      serviceId: "",
                      serviceName: "",
                      staff: "Any",
                      date: "",
                      time: "",
                      notes: "",
                      price: 0,
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:border-rose-500 focus:outline-none bg-white font-medium"
                  disabled={mode === "edit"}
                >
                  <option value="">-- Choose Branch --</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {!formData.branchId && (
                  <p className="text-xs text-rose-600 mt-2">
                    Please select a branch to proceed with booking.
                  </p>
                )}
              </div>
            )}

            {/* If not admin and no branchId, show error/loading */}
            {role !== "admin" && !formData.branchId && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                <p className="font-medium">Branch information missing.</p>
                <p className="text-sm">Cannot proceed with booking.</p>
              </div>
            )}

            {/* Only show rest of form if Branch is selected */}
            {formData.branchId && (
              <>
                {/* Client Section */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  {!formData.clientId && !showNewClientForm ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Search client..."
                          value={clientSearch}
                          onChange={(e) => {
                            setClientSearch(e.target.value);
                            setShowClientList(true);
                          }}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500"
                        />
                        {showClientList && clientSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {clients
                              .filter((c) =>
                                c.name
                                  .toLowerCase()
                                  .includes(clientSearch.toLowerCase()),
                              )
                              .map((c) => (
                                <div
                                  key={c._id}
                                  onClick={() => handleClientSelect(c)}
                                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  {c.name} ({c.phone})
                                </div>
                              ))}
                            <div
                              className="px-4 py-2 hover:bg-rose-50 cursor-pointer text-rose-600 font-bold border-t"
                              onClick={() => {
                                setFormData((p) => ({
                                  ...p,
                                  customerName: clientSearch,
                                }));
                                setShowNewClientForm(true);
                                setShowClientList(false);
                              }}
                            >
                              + Add "{clientSearch}"
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNewClientForm(true)}
                        className="px-3 py-2 bg-rose-100 text-rose-600 rounded-xl"
                      >
                        <i className="ri-add-line text-xl"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative">
                      {formData.clientId && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((p) => ({
                              ...p,
                              clientId: "",
                              customerName: "",
                              email: "",
                              phone: "",
                            }));
                            setClientSearch("");
                            setShowNewClientForm(false);
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <i className="ri-close-circle-line text-xl"></i>
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Name
                          </label>
                          <input
                            required
                            value={formData.customerName}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                customerName: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg"
                            readOnly={!!formData.clientId}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Phone
                          </label>
                          <input
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg"
                            readOnly={!!formData.clientId}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Email
                          </label>
                          <input
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg"
                            readOnly={!!formData.clientId}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          category: e.target.value,
                          serviceId: "",
                          serviceName: "",
                        }))
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service
                    </label>
                    <select
                      required
                      value={formData.serviceId}
                      onChange={(e) => {
                        const svc = filteredServices.find(
                          (s) => s._id === e.target.value,
                        );
                        setFormData((p) => ({
                          ...p,
                          serviceId: e.target.value,
                          serviceName: svc ? svc.name : "",
                          staff: "Any", // Reset staff
                        }));
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                      disabled={!formData.category}
                    >
                      <option value="">Select Service</option>
                      {filteredServices.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} (₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Staff, Date, Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff
                    </label>
                    <select
                      value={formData.staff}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, staff: e.target.value }))
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                    >
                      <option value="Any">Any Staff</option>
                      {availableStaff.map((s) => (
                        // s is populated object { _id, name, role }
                        // backend expects staff name string?
                        // Existing code used apt.staff (string).
                        // If we send name, fine. If ID, backend must handle.
                        // Let's send Name for now to be safe with existing backend.
                        <option key={s._id} value={s.name}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, date: e.target.value }))
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, time: e.target.value }))
                      }
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, notes: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : mode === "create"
                        ? "Book Appointment"
                        : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
