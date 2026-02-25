import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const BranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [branch, setBranch] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState("Any");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        customerName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        notes: "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        const [branchRes, catRes] = await Promise.all([
          axios.get(`/api/branches/public/${id}`),
          axios.get(`/api/categories/public/${id}`),
        ]);
        setBranch(branchRes.data);
        const branchCategories = (catRes.data.categories || []).filter(
          (cat) => String(cat.branchId) === String(id),
        );
        setCategories(branchCategories);

        // Fetch all services initially
        const svcRes = await axios.get(`/api/services/public?branchId=${id}`);
        setServices(svcRes.data.services || []);
      } catch (err) {
        console.error("Error fetching branch details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranchData();
  }, [id]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const catParam =
          selectedCategory === "all" ? "" : `&category=${selectedCategory}`;
        const res = await axios.get(
          `/api/services/public?branchId=${id}${catParam}`,
        );
        setServices(res.data.services || []);
        if (
          selectedService &&
          !res.data.services.find((s) => s._id === selectedService._id)
        ) {
          setSelectedService(null);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    if (!loading) fetchServices();
  }, [selectedCategory, id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (id && selectedDate) {
        try {
          const staffParam =
            selectedStaff !== "Any" ? `&staff=${selectedStaff}` : "";
          const res = await axios.get(
            `/api/appointments/available-slots?branchId=${id}&date=${selectedDate}${staffParam}`,
          );
          setAvailableSlots(res.data);
        } catch (err) {
          console.error("Error fetching slots:", err);
        }
      }
    };
    fetchSlots();
  }, [id, selectedDate, selectedStaff]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please select service, date and time slot");
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        ...formData,
        branchId: id,
        category: selectedService.category.name,
        service: selectedService.name,
        staff: selectedStaff,
        date: selectedDate,
        time: selectedTime,
        price: selectedService.price,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
      };

      const res = await axios.post("/api/appointments", bookingData);
      alert("Appointment booked successfully!");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Error booking appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!branch)
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center text-white">
        Branch not found
      </div>
    );

  return (
    <div
      className="bg-[#0d0d0f] min-h-screen text-white pb-20"
      style={FONT_STYLE}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&display=swap');
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }
        .step-number {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f43f5e;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>

      {/* Hero Section - F/Z Design */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0f] z-10" />
        <img
          src={
            branch.branchType === "salon"
              ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
              : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1740&auto=format&fit=crop"
          }
          className="w-full h-full object-cover opacity-40"
          alt={branch.name}
        />
        <div className="absolute bottom-10 left-0 right-0 z-20 mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 mb-4 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                {branch.branchType}
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-2"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {branch.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {branch.address}, {branch.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {branch.openingTime} - {branch.closingTime}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 glass-card rounded-2xl text-center">
                <div className="text-rose-400 font-bold">4.8</div>
                <div className="text-[10px] text-white/40 uppercase">
                  Rating
                </div>
              </div>
              <div className="px-4 py-2 glass-card rounded-2xl text-center">
                <div className="text-rose-400 font-bold">500+</div>
                <div className="text-[10px] text-white/40 uppercase">
                  Happy Clients
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl">
        {/* Left Column: Booking Flow (2/3) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Step 1: Category Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="step-number">1</span>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Select Category
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-2xl transition-all border ${selectedCategory === "all" ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"}`}
              >
                All Services
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`px-6 py-3 rounded-2xl transition-all border ${selectedCategory === cat._id ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Service Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="step-number">2</span>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Choose Service
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div
                  key={svc._id}
                  onClick={() => setSelectedService(svc)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedService?._id === svc._id ? "bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/50" : "bg-white/3 border-white/10 hover:border-white/20"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{svc.name}</h3>
                    <span className="text-rose-400 font-bold">
                      ₹{svc.price}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm mb-4 line-clamp-2">
                    {svc.desc ||
                      "Professional treatment designed to rejuvenate and enhance your well-being."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {svc.duration}
                    </span>
                    {selectedService?._id === svc._id && (
                      <span className="text-rose-400 text-xs font-bold uppercase tracking-widest">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="col-span-2 text-white/40 py-10 text-center glass-card rounded-2xl">
                  No services found for this category.
                </div>
              )}
            </div>
          </section>

          {/* Step 3: Staff Selection */}
          {selectedService && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="step-number">3</span>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Assign Staff
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <div
                  onClick={() => setSelectedStaff("Any")}
                  className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer w-28 text-center border transition-all ${selectedStaff === "Any" ? "bg-rose-500/10 border-rose-500/50" : "bg-white/3 border-white/10"}`}
                >
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-2">
                    <svg
                      className="w-6 h-6 text-rose-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Any</span>
                </div>
                {selectedService.staffIds?.map((staff) => (
                  <div
                    key={staff._id}
                    onClick={() => setSelectedStaff(staff._id)}
                    className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer w-28 text-center border transition-all ${selectedStaff === staff._id ? "bg-rose-500/10 border-rose-500/50" : "bg-white/3 border-white/10"}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-2 text-white font-bold">
                      {staff.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium truncate w-full">
                      {staff.name}
                    </span>
                    <span className="text-[10px] text-white/40 truncate w-full">
                      {staff.roleTitle || "Stylist"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Step 4: Schedule */}
          {selectedService && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="step-number">4</span>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  Pick Date & Time
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-white/40 text-xs uppercase mb-3 font-semibold">
                    Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-rose-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs uppercase mb-3 font-semibold">
                    Available Slots
                  </label>
                  {!selectedDate ? (
                    <div className="text-white/30 text-sm italic py-3">
                      Please select a date first
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                            !slot.available
                              ? "bg-white/2 text-white/10 cursor-not-allowed"
                              : selectedTime === slot.time
                                ? "bg-rose-500 text-white"
                                : "bg-white/5 border border-white/10 hover:border-rose-500/50 text-white/70"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-rose-400/70 text-sm py-3">
                      No slots available for this day.
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Checkout Sidebar (1/3) */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-3xl p-8 sticky top-24">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Booking Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Venue</span>
                <span className="font-medium">{branch.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Service</span>
                <span className="font-medium">
                  {selectedService?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Staff</span>
                <span className="font-medium">
                  {selectedStaff === "Any"
                    ? "Any Specialist"
                    : "Selected Staff"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">DateTime</span>
                <span className="font-medium">
                  {selectedDate && selectedTime
                    ? `${selectedDate} @ ${selectedTime}`
                    : "-"}
                </span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-rose-400">
                  ₹{selectedService?.price || 0}
                </span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-sans"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500/50 transition-all font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={bookingLoading || !selectedService || !selectedTime}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                {bookingLoading ? "Processing..." : "Confirm Booking"}
                {!bookingLoading && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </form>
            <p className="text-[10px] text-center text-white/20 mt-4 leading-relaxed">
              By confirming, you agree to our booking policy. Cancellation is
              available up to 2 hours before the appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;
