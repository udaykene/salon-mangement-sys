import React from "react";
import Certifications from "../components/Certifications";

const SalonHome = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <main className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center w-full bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 max-w-5xl w-full">
          <span className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-300/30 text-rose-200 text-xs sm:text-sm font-medium backdrop-blur-sm">
            ✨ Award-Winning Beauty Experts
          </span>

          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-3 sm:mb-4 drop-shadow-2xl tracking-tight leading-tight">
            Unleash Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Beauty
            </span>
          </h1>

          <p className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-6 sm:mb-8 max-w-2xl px-2">
            Experience luxury treatments and transformative services tailored just
            for you.
          </p>

          <div className="flex justify-center sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto px-4 sm:px-0">
            <button className="w-fit sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm sm:text-base font-bold rounded-lg shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center">
              Book Appointment <span className="ml-2">→</span>
            </button>

            <button className="w-fit sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white text-sm sm:text-base font-bold rounded-lg transition-all flex items-center justify-center">
              <span className="mr-2">▶</span> Virtual Tour
            </button>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 sm:py-10 md:py-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            ["10+", "Years of Excellence"],
            ["15k+", "Happy Clients"],
            ["25+", "Expert Stylists"],
            ["50+", "Premium Services"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="space-y-1 sm:space-y-2 group hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                {num}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-pink-900/80 to-rose-900/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-medium backdrop-blur-sm">
            Limited Time Offer
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            New Client Special: 20% Off
          </h2>

          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
            First-time visitors enjoy 20% off any service. Experience the
            difference that professional care makes.
          </p>

          <button className="px-8 sm:px-10 py-3 sm:py-4 bg-white hover:bg-gray-100 text-rose-600 text-sm sm:text-base font-bold rounded-lg shadow-xl transition-all">
            Claim Your Offer
          </button>
        </div>
      </section>

      {/* ✅ CERTIFICATIONS — FINAL FIX */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Certifications />
        </div>
      </section>
    </div>
  );
};

export default SalonHome