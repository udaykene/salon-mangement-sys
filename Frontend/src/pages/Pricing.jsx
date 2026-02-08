import React from "react";
import Certifications from "../components/Certifications";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "29",
      salons: "1",
      popular: false,
      features: [
        "1 Salon Location",
        "Basic Analytics",
        "Email Support",
        "Mobile App Access",
      ],
    },
    {
      name: "Standard",
      price: "99",
      salons: "5",
      popular: true,
      features: [
        "Up to 5 Salon Locations",
        "Advanced Analytics",
        "Priority Email Support",
        "Mobile App Access",
        "Custom Branding",
      ],
    },
    {
      name: "Premium",
      price: "199",
      salons: "10",
      popular: false,
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
    <div className="bg-white w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Plans &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Pricing
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Choose the perfect plan to manage your salon business with ease
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 p-6 flex flex-col justify-between sm:p-8 transition-all duration-300 ${
                plan.popular
                  ? "border-rose-500 shadow-2xl shadow-rose-500/20 transform scale-105 bg-gradient-to-br from-white to-rose-50"
                  : "border-gray-200 shadow-lg hover:shadow-xl hover:border-rose-300 bg-white"
              }`}
            >
              {/* Popular Badge */}
              {/* {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ RECOMMENDED
                  </span>
                </div>
              )} */}

              <div>
                {/* Plan Name */}
                <div className=" mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                      ${plan.price}
                    </span>
                    <div className="flex flex-col">
                    <span className="text-gray-600 text-sm">per user / per year</span>
                    <span className="text-gray-600 text-sm">billed annually</span>
                    </div>
                  </div>
                </div>

                {/* Salon Count Highlight */}
                {/* <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-4 rounded-xl mb-6">
                <div className="text-3xl sm:text-4xl font-bold">
                  {plan.salons}
                </div>
                <div className="text-sm sm:text-base">
                  Salon{plan.salons !== "1" ? "s" : ""}
                </div>
              </div> */}

                {/* Features List */}
                <ul className="space-y-3 sm:space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-rose-500 mr-3 mt-0.5 text-lg">
                        ✓
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/30"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <p className="text-center text-gray-500 text-sm sm:text-base mt-8 sm:mt-12">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
              Questions
            </span>
          </h2>

          <div className="space-y-6">
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
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">
                  {faq.q}
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-pink-900/85 to-rose-900/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of salon owners who trust us to manage their business
            operations seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white hover:bg-gray-100 text-rose-600 text-sm sm:text-base font-bold rounded-lg shadow-xl transition-all">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white hover:bg-white/20 text-white text-sm sm:text-base font-bold rounded-lg transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges / Certifications */}
      <Certifications />
    </div>
  );
};

export default Pricing;
