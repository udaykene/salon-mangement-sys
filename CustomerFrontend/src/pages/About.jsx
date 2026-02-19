import React from "react";
import { Link } from "react-router-dom";

const FONT_STYLE = { fontFamily: "'DM Sans', sans-serif" };

const AboutPage = () => {
  const stats = [
    ["10+", "Years of Excellence"],
    ["15k+", "Happy Clients"],
    ["25+", "Expert Stylists"],
    ["50+", "Premium Services"],
  ];

  const values = [
    {
      icon: "✨",
      title: "Premium Products",
      desc: "Only the finest brands and quality ingredients for every service.",
    },
    {
      icon: "👑",
      title: "Expert Team",
      desc: "Certified professionals with years of hands-on experience.",
    },
    {
      icon: "💖",
      title: "Personalized Care",
      desc: "Treatments and services tailored uniquely to you.",
    },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Senior Hair Stylist",
      initial: "S",
      exp: "8 years",
    },
    {
      name: "Ananya Patel",
      role: "Bridal Makeup Artist",
      initial: "A",
      exp: "6 years",
    },
    {
      name: "Jessica Thorn",
      role: "Nail Art Specialist",
      initial: "J",
      exp: "5 years",
    },
    {
      name: "Meera Kapoor",
      role: "Spa & Wellness Expert",
      initial: "M",
      exp: "7 years",
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
        .shine-border {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }
        .shine-border:hover {
          border-color: rgba(244,63,94,0.2);
          background: rgba(244,63,94,0.05);
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
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 text-center px-4 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">Our Story</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            About{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Glamour Studio
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto font-light">
            Where elegance meets excellence — a sanctuary of beauty and wellness
            since 2014.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="border-t border-white/5 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(([num, label]) => (
            <div
              key={label}
              className="group hover:scale-105 transition-transform"
            >
              <div
                className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 mb-1"
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

      {/* About content */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
              <span className="tag-pill text-rose-400">Who we are</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-5"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              A Sanctuary of{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Beauty & Wellness
              </span>
            </h2>
            <p className="text-white/50 leading-relaxed text-sm sm:text-base mb-4 font-light">
              Welcome to Glamour Studio — a sanctuary of beauty and wellness. We
              specialize in premium hair styling, spa treatments, and beauty
              services that transform and rejuvenate.
            </p>
            <p className="text-white/40 leading-relaxed text-sm sm:text-base mb-8 font-light">
              Our team of expert stylists and therapists ensures every visit
              becomes an unforgettable experience of luxury and care. Since
              2014, we've been the trusted beauty destination for thousands of
              happy clients.
            </p>
            <Link
              to="/book-appointment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition-all"
            >
              Book Your Visit →
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/8">
            <img
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1740&auto=format&fit=crop"
              className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-cover opacity-80"
              alt="Salon interior"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
              <span className="tag-pill text-rose-400">Why Choose Us</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Our Core{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Values
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {values.map((v, i) => (
              <div key={i} className="shine-border rounded-2xl p-7 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
              <span className="tag-pill text-rose-400">Meet the Team</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Our Expert{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Stylists
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
            {team.map((member, i) => (
              <div key={i} className="shine-border rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg shadow-rose-500/20">
                  {member.initial}
                </div>
                <h4
                  className="text-white font-semibold text-sm mb-1"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {member.name}
                </h4>
                <p className="text-white/40 text-xs mb-2">{member.role}</p>
                <span className="tag-pill text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full inline-block text-[9px]">
                  {member.exp} exp
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-[#0d0d0f] to-pink-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Come{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Visit Us
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto font-light">
            Experience the Glamour Studio difference. Book your appointment
            today and let us take care of the rest.
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
              Get Directions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
