import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const SalonsPage = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch("/api/branches/public?type=salon");
        if (res.ok) {
          const data = await res.json();
          setSalons(data);
        }
      } catch (err) {
        console.error("Failed to fetch salons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  return (
    <div className="bg-[#0d0d0f] w-full overflow-x-hidden" style={FONT_STYLE}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .salon-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.35s cubic-bezier(.4,0,.2,1);
        }
        .salon-card:hover {
          background: rgba(244,63,94,0.06);
          border-color: rgba(244,63,94,0.22);
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(244,63,94,0.15);
        }
        .tag-pill {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .explore-btn {
          position: relative;
          overflow: hidden;
        }
        .explore-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: left 0.5s ease;
        }
        .explore-btn:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Hero */}
      <div className="relative min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1740&auto=format&fit=crop"
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
            <span className="tag-pill text-rose-400">Find your style</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Our{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Salons
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto font-light">
            Discover premium salons with expert stylists ready to transform your
            look and elevate your confidence.
          </p>
        </div>
      </div>

      {/* Salon Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 sm:p-7 border border-white/5"
              >
                <div className="skeleton h-5 w-3/4 mb-4" />
                <div className="skeleton h-4 w-full mb-3" />
                <div className="skeleton h-4 w-2/3 mb-3" />
                <div className="skeleton h-4 w-1/2 mb-5" />
                <div className="skeleton h-10 w-full" />
              </div>
            ))}
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-30">✂️</div>
            <h3
              className="text-xl font-semibold text-white mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              No salons available yet
            </h3>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              We're onboarding new salon partners. Check back soon for an
              amazing selection of premium salons near you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {salons.map((salon) => (
              <div
                key={salon._id}
                className="salon-card rounded-2xl p-6 sm:p-7 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/20 flex items-center justify-center">
                    <span className="text-xl">✂️</span>
                  </div>
                  <span className="tag-pill text-rose-300 bg-rose-500/15 border border-rose-500/25 px-2.5 py-1 rounded-full">
                    Salon
                  </span>
                </div>

                {/* Name */}
                <h3
                  className="text-white font-semibold text-lg mb-3"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {salon.name}
                </h3>

                {/* Info rows */}
                <div className="flex flex-col gap-2 flex-1">
                  {(salon.address || salon.city) && (
                    <div className="flex items-start gap-2.5">
                      <svg
                        className="w-4 h-4 text-rose-400/60 mt-0.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-white/40 text-sm leading-relaxed">
                        {[salon.address, salon.city, salon.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {salon.phone && (
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="w-4 h-4 text-rose-400/60 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-white/40 text-sm">
                        {salon.phone}
                      </span>
                    </div>
                  )}

                  {(salon.openingTime || salon.closingTime) && (
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="w-4 h-4 text-rose-400/60 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-white/40 text-sm">
                        {salon.openingTime} – {salon.closingTime}
                      </span>
                    </div>
                  )}

                  {salon.workingDays?.length > 0 && (
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="w-4 h-4 text-rose-400/60 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div className="flex flex-wrap gap-1">
                        {salon.workingDays.map((day) => (
                          <span
                            key={day}
                            className="text-[10px] font-semibold uppercase tracking-wider text-white/30 bg-white/5 px-1.5 py-0.5 rounded"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider + Explore */}
                <div className="w-full h-px bg-white/5 mt-5 mb-4" />
                <Link
                  to={`/salons/${salon._id}`}
                  className="explore-btn w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 text-sm font-semibold rounded-xl transition-all"
                >
                  Explore
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonsPage;
