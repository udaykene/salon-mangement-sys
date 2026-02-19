import React from "react";
import { Link } from "react-router-dom";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const ServicesPage = () => {
  const services = [
    {
      icon: "✂️",
      title: "Hair Styling & Cuts",
      desc: "From classic cuts to contemporary styles, our expert stylists create looks that enhance your natural beauty and personality.",
      tag: "Most Popular",
    },
    {
      icon: "🎨",
      title: "Hair Color & Highlights",
      desc: "Transform your look with vibrant colors, subtle highlights, or complete color makeovers using premium products.",
    },
    {
      icon: "👰",
      title: "Bridal Makeup",
      desc: "Look stunning on your special day with our professional bridal makeup packages and hair styling services.",
      tag: "Premium",
    },
    {
      icon: "💆",
      title: "Spa & Massage",
      desc: "Relax and rejuvenate with our luxurious spa treatments, aromatherapy, and therapeutic massage services.",
    },
    {
      icon: "✨",
      title: "Facial & Skin Care",
      desc: "Achieve radiant, glowing skin with our customized facials and advanced skincare treatments.",
    },
    {
      icon: "💅",
      title: "Nail Art & Manicure",
      desc: "Pamper your hands and feet with our premium manicure, pedicure, and creative nail art services.",
    },
    {
      icon: "💇",
      title: "Keratin Treatment",
      desc: "Say goodbye to frizz with our professional keratin smoothing treatments for silky, manageable hair.",
    },
    {
      icon: "🌸",
      title: "Waxing & Threading",
      desc: "Smooth, flawless skin with our gentle and precise waxing and threading services.",
    },
    {
      icon: "💎",
      title: "Luxury Hair Spa",
      desc: "Restore shine and strength with our nourishing hair spa treatments using premium oils and masks.",
    },
  ];

  return (
    <div className="bg-[#0d0d0f] w-full overflow-x-hidden" style={FONT_STYLE}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .service-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.3s ease;
        }
        .service-card:hover {
          background: rgba(244,63,94,0.08);
          border-color: rgba(244,63,94,0.25);
          transform: translateY(-4px);
        }
        .tag-pill {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>

      {/* Hero */}
      <div className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
        <div className="absolute inset-0 hero-grain" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-rose-500/10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 text-center px-4 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">What we offer</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Our{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Services
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto font-light">
            Experience luxury beauty treatments tailored to enhance your natural
            radiance and confidence.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className="service-card rounded-2xl p-6 sm:p-7 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{s.icon}</span>
                {s.tag && (
                  <span className="tag-pill text-rose-300 bg-rose-500/15 border border-rose-500/25 px-2.5 py-1 rounded-full">
                    {s.tag}
                  </span>
                )}
              </div>
              <h3
                className="text-white font-semibold text-base mb-2"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {s.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed flex-1">
                {s.desc}
              </p>
              <div className="w-full h-px bg-white/5 mt-5 mb-4" />
              <Link
                to="/book-appointment"
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Book This Service →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-[#0d0d0f] to-pink-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-rose-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Ready to{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              book a service?
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto font-light">
            Our expert team is ready to make you look and feel your absolute
            best.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/book-appointment"
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-xl shadow-rose-500/20 transition-all"
            >
              Book Appointment
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-white/70 text-sm font-semibold rounded-xl transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
