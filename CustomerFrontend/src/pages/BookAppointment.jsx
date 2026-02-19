import React, { useState } from "react";
import { Link } from "react-router-dom";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const BookAppointmentPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    category: "",
    service: "",
    staff: "Any",
    date: "",
    time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = {
    Hair: ["Haircut", "Hair Spa", "Coloring", "Keratin Treatment"],
    Skin: ["Facial", "Cleanup", "Skin Brightening"],
    Nails: ["Manicure", "Pedicure", "Nail Art"],
    Makeup: ["Party Makeup", "Bridal Makeup", "Everyday Look"],
    Spa: ["Full Body Massage", "Aromatherapy", "Hot Stone Massage"],
  };

  const staffOptions = [
    "Any Available Stylist",
    "Sarah (Senior Stylist)",
    "Mike (Top Barber)",
    "Jessica (Nail Artist)",
    "Emily (Makeup Artist)",
    "Meera (Spa Expert)",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { service: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only form — no backend connection as requested
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/5 transition-all";
  const selectClass =
    "w-full px-4 py-3 bg-[#141417] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500/50 transition-all appearance-none";

  if (submitted) {
    return (
      <div
        className="bg-[#0d0d0f] min-h-screen flex items-center justify-center px-4"
        style={FONT_STYLE}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');`}</style>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-emerald-400 text-4xl">✓</span>
          </div>
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Appointment{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Booked!
            </span>
          </h2>
          <p className="text-white/45 text-sm mb-8 font-light leading-relaxed">
            Thanks{" "}
            <strong className="text-white/70">
              {formData.customerName || "there"}
            </strong>
            ! Your appointment request has been received. We'll confirm your
            booking via email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-7 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition-all"
            >
              Back to Home
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="px-7 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold rounded-xl transition-all"
            >
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0f] w-full overflow-x-hidden" style={FONT_STYLE}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .tag-pill {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.4);
        }
      `}</style>

      {/* Hero */}
      <div className="relative min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-18"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
        <div className="absolute inset-0 hero-grain" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative z-10 text-center px-4 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">Schedule a Visit</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Book Your{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Appointment
            </span>
          </h1>
          <p className="text-base text-white/50 max-w-lg mx-auto font-light">
            Fill in the details below to schedule your visit. We'll confirm your
            booking shortly.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div
          className="rounded-2xl p-7 sm:p-10"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Section: Personal Info */}
            <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            {/* Section: Service Details */}
            <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">
                Service Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Service *
                  </label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className={`${selectClass} disabled:opacity-40`}
                  >
                    <option value="">Select Service</option>
                    {formData.category &&
                      categories[formData.category].map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Preferred Staff (Optional)
                  </label>
                  <select
                    name="staff"
                    value={formData.staff}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    {staffOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            {/* Section: Date & Time */}
            <div>
              <h3 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">
                Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-2 font-medium">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            {/* Notes */}
            <div>
              <label className="block text-white/50 text-xs mb-2 font-medium">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any specific requests, allergies, or preferences..."
                className={inputClass}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-xl shadow-rose-500/20 transition-all"
            >
              Confirm Booking →
            </button>

            <p className="text-center text-white/25 text-xs">
              By booking, you agree to our cancellation policy. No charge until
              the day of service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
