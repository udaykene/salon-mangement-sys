import React, { useState, useEffect } from "react";
import axios from "axios";
import Certifications from "../components/Certifications";

const Pricing = () => {
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    axios
      .get("/api/subscriptions/current", { withCredentials: true })
      .then((res) => setCurrentPlan(res.data?.subscription?.plan || null))
      .catch(() => setCurrentPlan(null));
  }, []);

  const plans = [
    {
      key: "demo",
      name: "Demo",
      price: "0",
      salons: "1",
      isDemo: true,
      trialDays: 14,
      tagline: "Try before you commit",
      icon: "🎯",
      features: [
        "1 Salon Location",
        "Basic Analytics",
        "Email Support",
        "14-Day Free Trial",
      ],
    },
    {
      key: "basic",
      name: "Basic",
      price: "29",
      salons: "1",
      tagline: "Perfect for solo salons",
      icon: "✦",
      features: [
        "1 Salon Location",
        "Basic Analytics",
        "Email Support",
        "Mobile App Access",
      ],
    },
    {
      key: "standard",
      name: "Standard",
      price: "99",
      salons: "5",
      popular: true,
      tagline: "Most chosen by growing brands",
      icon: "⬡",
      features: [
        "Up to 5 Salon Locations",
        "Advanced Analytics",
        "Priority Email Support",
        "Mobile App Access",
        "Custom Branding",
      ],
    },
    {
      key: "premium",
      name: "Premium",
      price: "199",
      salons: "10",
      tagline: "For large, multi-branch empires",
      icon: "◈",
      features: [
        "Up to 10 Salon Locations",
        "Advanced Analytics & Reports",
        "24/7 Priority Support",
        "Mobile App Access",
        "Custom Branding",
        "Dedicated Account Manager",
      ],
    },
  ];

  return (
    <div className="bg-[#0d0d0f] w-full overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');

        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .plan-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .plan-card:hover {
          transform: translateY(-4px);
        }
        .shine-border {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .rose-glow {
          box-shadow: 0 0 40px rgba(244, 63, 94, 0.2), 0 0 80px rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.4);
        }
        .current-glow {
          box-shadow: 0 0 40px rgba(251, 191, 36, 0.2), 0 0 80px rgba(251, 191, 36, 0.08);
          border: 1px solid rgba(251, 191, 36, 0.5);
        }
        .emerald-glow {
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .faq-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .faq-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(244, 63, 94, 0.2);
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
        {/* Background layers */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-20"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0f] via-transparent to-[#0d0d0f]" />
        <div className="absolute inset-0 hero-grain" />

        {/* Decorative circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-rose-500/10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 text-center px-4 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="tag-pill text-rose-400">Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Plans &{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Pricing
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto font-light">
            Choose the perfect plan to manage your salon business — scale as you grow, pay only for what you need.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-4">

        {currentPlan && (
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 text-sm">👑</span>
              <span className="text-amber-300 text-sm font-medium">
                You're on the <span className="font-bold capitalize">{currentPlan}</span> plan
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.key;
            const isPopular = plan.popular && !isCurrent;

            return (
              <div
                key={plan.key}
                className={`plan-card relative rounded-2xl p-6 flex flex-col justify-between ${
                  isCurrent
                    ? "current-glow bg-gradient-to-b from-amber-950/30 to-[#0d0d0f]"
                    : isPopular
                    ? "rose-glow bg-gradient-to-b from-rose-950/30 to-[#0d0d0f]"
                    : plan.isDemo
                    ? "emerald-glow bg-gradient-to-b from-emerald-950/20 to-[#0d0d0f]"
                    : "shine-border bg-gradient-to-b from-white/[0.03] to-transparent"
                }`}
              >
                {/* Badges */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex flex-col gap-2">
                    {isCurrent && (
                      <span className="tag-pill text-amber-300 bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-full w-fit">
                        ★ Your Plan
                      </span>
                    )}
                    {isPopular && (
                      <span className="tag-pill text-rose-300 bg-rose-500/15 border border-rose-500/25 px-2.5 py-1 rounded-full w-fit">
                        Most Popular
                      </span>
                    )}
                    {plan.isDemo && !isCurrent && (
                      <span className="tag-pill text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-full w-fit">
                        Free Trial
                      </span>
                    )}
                  </div>
                  <span className="text-2xl opacity-60">{plan.icon}</span>
                </div>

                {/* Plan info */}
                <div className="mb-5">
                  <h3 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                    {plan.name}
                  </h3>
                  <p className="text-white/35 text-xs font-light mb-4">{plan.tagline}</p>

                  {plan.isDemo ? (
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold text-emerald-400" style={{ fontFamily: "'Fraunces', serif" }}>Free</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-sm text-white/40 self-start mt-2">₹</span>
                      <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>{plan.price}</span>
                    </div>
                  )}
                  <p className="text-white/30 text-xs">
                    {plan.isDemo ? `${plan.trialDays} days • no credit card` : "per user / year"}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 mb-5" />

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 text-sm flex-shrink-0 ${plan.isDemo ? 'text-emerald-400' : isPopular || isCurrent ? 'text-rose-400' : 'text-white/40'}`}>
                        ✓
                      </span>
                      <span className="text-white/60 text-sm leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/25 cursor-default"
                      : plan.isDemo
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20"
                      : isPopular
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-400 hover:to-pink-400 shadow-lg shadow-rose-500/20"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isCurrent ? "Current Plan" : plan.isDemo ? "Start Free Trial" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-white/25 text-sm mt-8">
          All paid plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>

      {/* FAQ */}
      <section className="border-t border-white/5 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
              Got{" "}
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                questions?
              </span>
            </h2>
            <p className="text-white/35 text-sm">Everything you need to know about our plans.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the end of your billing cycle.",
              },
              {
                q: "What happens if I exceed my salon limit?",
                a: "You'll be prompted to upgrade to the next tier to add more salon locations. We'll help make the transition seamless.",
              },
              {
                q: "Is there a free trial?",
                a: "Absolutely! All plans come with a 14-day free trial. No credit card required to get started.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and offer invoice-based billing for annual plans.",
              },
            ].map((faq, i) => (
              <div key={i} className="faq-card p-5 rounded-xl">
                <h4 className="font-semibold text-white/90 mb-1.5 text-sm sm:text-base">{faq.q}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-[#0d0d0f] to-pink-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-rose-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Ready to{" "}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              get started?
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base mb-8 max-w-md mx-auto font-light">
            Join thousands of salon owners who trust us to manage their business operations seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-sm font-semibold rounded-xl shadow-xl shadow-rose-500/20 transition-all">
              Start Free Trial
            </button>
            <button className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold rounded-xl transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Certifications />
    </div>
  );
};

export default Pricing;