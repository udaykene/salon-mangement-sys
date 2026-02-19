import React from "react";
import { Link } from "react-router-dom";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const HomePage = () => {
  const services = [
    {
      icon: "✂️",
      title: "Hair Styling & Cuts",
      desc: "Expert cuts and styles from classic to contemporary.",
    },
    {
      icon: "🎨",
      title: "Hair Color & Highlights",
      desc: "Vibrant color transformations using premium products.",
    },
    {
      icon: "👰",
      title: "Bridal Makeup",
      desc: "Look stunning on your special day with expert artistry.",
    },
    {
      icon: "💆",
      title: "Spa & Massage",
      desc: "Luxurious treatments for full relaxation and rejuvenation.",
    },
    {
      icon: "✨",
      title: "Facial & Skin Care",
      desc: "Radiant glow with customized advanced skin treatments.",
    },
    {
      icon: "💅",
      title: "Nail Art & Manicure",
      desc: "Premium nail care and creative art services.",
    },
  ];

  const stats = [
    ["10+", "Years of Excellence"],
    ["15k+", "Happy Clients"],
    ["25+", "Expert Stylists"],
    ["50+", "Premium Services"],
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Client",
      text: "Absolutely love the experience here. The stylists are experts and the ambiance is just perfect for relaxation.",
      rating: 5,
    },
    {
      name: "Ananya Verma",
      role: "Bridal Client",
      text: "Got my bridal makeup done here. I looked stunning and felt so confident. 10/10 would recommend!",
      rating: 5,
    },
    {
      name: "Rhea Kapoor",
      role: "Loyal Member",
      text: "Been coming here for 3 years. The hair treatments have transformed my hair completely. Incredible team!",
      rating: 5,
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
        .testimonial-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s ease;
        }
        .testimonial-card:hover {
          border-color: rgba(244,63,94,0.2);
        }
        .tag-pill {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-18"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
        <div className="absolute inset-0 hero-grain" />

        {/* Decorative blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-rose-500/8" />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">
              Award-Winning Beauty Experts
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Unleash Your{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Beauty
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/50 max-w-xl mx-auto mb-9 font-light leading-relaxed">
            Experience luxury treatments and transformative services tailored
            just for you — where elegance meets excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/book-appointment"
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-xl shadow-rose-500/20 transition-all"
            >
              Book Appointment →
            </Link>
            <Link
              to="/services"
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-white/70 text-sm font-semibold rounded-xl transition-all"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 float-anim">
          <span className="text-white/20 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-t border-white/5 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(([num, label]) => (
            <div
              key={label}
              className="space-y-1 group hover:scale-105 transition-transform"
            >
              <div
                className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {num}
              </div>
              <div className="text-white/35 text-xs uppercase tracking-widest">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
              <span className="tag-pill text-rose-400">What We Offer</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Our{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Services
              </span>
            </h2>
            <p className="text-white/35 text-sm max-w-md mx-auto font-light">
              From haircuts to bridal packages — we cover everything you need to
              look and feel your absolute best.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {services.map((s, i) => (
              <div key={i} className="service-card rounded-2xl p-6 sm:p-7">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3
                  className="text-white font-semibold text-base mb-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-white/70 text-sm font-semibold rounded-xl transition-all"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Special Offer Banner ── */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-15"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-[#0d0d0f] to-pink-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-rose-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">Limited Time Offer</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            New Client{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Special: 20% Off
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto font-light">
            First-time visitors enjoy 20% off any service. Experience the
            difference that professional care makes.
          </p>
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-xl shadow-rose-500/20 transition-all"
          >
            Claim Your Discount →
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
              <span className="tag-pill text-rose-400">Client Love</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              What Clients{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Say
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-rose-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-semibold">
                      {t.name}
                    </div>
                    <div className="text-white/30 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-[#0d0d0f] to-pink-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Ready to{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              get started?
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto font-light">
            Join thousands of happy clients and book your first appointment
            today. Your transformation awaits.
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

export default HomePage;
