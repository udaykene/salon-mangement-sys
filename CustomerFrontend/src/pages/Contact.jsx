import React, { useState } from "react";
import { Link } from "react-router-dom";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only: no backend connection
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Our Location",
      lines: ["123 Beauty Avenue, City Center", "Mumbai 400001, India"],
    },
    {
      icon: "📞",
      title: "Call Us",
      lines: ["+1 (555) 123-4567", "Mon – Sat: 9am – 8pm"],
    },
    {
      icon: "✉️",
      title: "Email Us",
      lines: ["hello@glamourstudio.com", "We reply within 24 hrs"],
    },
    {
      icon: "🕐",
      title: "Working Hours",
      lines: ["Mon – Sat: 9am – 8pm", "Sunday: 10am – 6pm"],
    },
  ];

  const inputClass =
    "w-full px-4 py-3 bg-white/3 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-rose-500/50 focus:bg-rose-500/5 transition-all";

  return (
    <div className="bg-[#0d0d0f] w-full overflow-x-hidden" style={FONT_STYLE}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .info-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s ease;
        }
        .info-card:hover {
          border-color: rgba(244,63,94,0.2);
        }
        .tag-pill {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>

      {/* Hero */}
      <div className="relative min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
        <div className="absolute inset-0 hero-grain" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 text-center px-4 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">Reach Out</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Get In{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Touch
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto font-light">
            We're ready to help you look and feel your absolute best. Reach out
            anytime.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — Info Cards */}
          <div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Visit Our{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Salon
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((item, i) => (
                <div key={i} className="info-card rounded-2xl p-5">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4
                    className="text-white font-semibold text-sm mb-1.5"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {item.title}
                  </h4>
                  {item.lines.map((line, j) => (
                    <p
                      key={j}
                      className={`text-sm ${j === 0 ? "text-white/55" : "text-white/30"}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-white/8 h-52 flex items-center justify-center bg-white/2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent" />
              <div className="text-center z-10">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-white/30 text-sm">
                  123 Beauty Avenue, City Center
                </p>
                <p className="text-white/20 text-xs mt-1">
                  Mumbai 400001, India
                </p>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            <div
              className="rounded-2xl p-7 sm:p-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Send Us a{" "}
                <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                  Message
                </span>
              </h3>
              <p className="text-white/35 text-sm mb-7 font-light">
                Fill in the form and we'll get back to you within 24 hours.
              </p>

              {submitted && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5">
                  <span className="text-emerald-400 text-lg">✓</span>
                  <span className="text-emerald-300 text-sm">
                    Message sent! We'll be in touch soon.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputClass}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className={inputClass}
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className={inputClass}
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Your message..."
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-xl shadow-rose-500/20 transition-all"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <p className="text-white/30 text-xs mb-3">Or book directly</p>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-sm font-semibold transition-colors"
                >
                  Book an Appointment →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
