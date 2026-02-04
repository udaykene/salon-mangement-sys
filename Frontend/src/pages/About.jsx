import React from "react";

const SalonAbout = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden">

      {/* HERO */}
      <div className="relative bg-gray-900 py-16 sm:py-20 md:py-28 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3">
            Unleash Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">Beauty</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-rose-300 italic">
            Where Elegance Meets Excellence
          </p>
        </div>
      </div>

      {/* ABOUT */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5 border-l-4 border-rose-500 pl-4">
              About Our Salon
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
              Welcome to a sanctuary of beauty and wellness. We specialize in premium hair styling, 
              spa treatments, and beauty services that transform and rejuvenate.
            </p>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Our team of expert stylists and therapists ensures every visit becomes an unforgettable 
              experience of luxury and care.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1740&auto=format&fit=crop"
              className="w-full h-[220px] sm:h-[320px] md:h-[360px] lg:h-[420px] object-cover"
              alt=""
            />
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 sm:py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              ["10+", "Years of Excellence"],
              ["15k+", "Happy Clients"],
              ["25+", "Expert Stylists"],
              ["50+", "Premium Services"]
            ].map(([num, label], i) => (
              <div key={i} className="group hover:scale-105 transition-transform">
                <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 mb-1">
                  {num}
                </div>
                <div className="text-xs sm:text-sm text-gray-400 tracking-widest uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CORE VALUES / SERVICES */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">
          What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Offer</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

          {[
            { title: "Hair Styling & Color", desc: "Expert cuts, styling, and vibrant color transformations." },
            { title: "Spa & Wellness", desc: "Luxurious treatments for complete relaxation and rejuvenation." },
            { title: "Makeup & Beauty", desc: "Professional artistry for every occasion and style." }
          ].map((v, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-rose-300 transition-all group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-lg flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                0{i + 1}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2">
                {v.title}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base">
                {v.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-pink-900/85 to-rose-900/90"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Why Choose Us?
          </h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Experience the perfect blend of luxury, expertise, and personalized care. We're committed 
            to making you look and feel your absolute best.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-bold mb-2">Premium Products</h3>
              <p className="text-sm text-white/80">Only the finest brands and quality ingredients</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">👑</div>
              <h3 className="text-lg font-bold mb-2">Expert Team</h3>
              <p className="text-sm text-white/80">Certified professionals with years of experience</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">💖</div>
              <h3 className="text-lg font-bold mb-2">Personalized Care</h3>
              <p className="text-sm text-white/80">Tailored treatments just for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 sm:py-8 overflow-hidden border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 uppercase tracking-wider">
            Certified & Trusted By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">✓</span>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide">ISO Certified</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">★</span>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide">Award Winning</span>
            </div>
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">♥</span>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base md:text-lg tracking-wide">Expert Certified</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SalonAbout;