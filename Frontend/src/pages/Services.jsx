import React from "react";
import Certifications from "../components/Certifications";

const SalonServices = () => {
  const services = [
    {
      title: "Hair Styling & Cuts",
      description:
        "From classic cuts to contemporary styles, our expert stylists create looks that enhance your natural beauty and personality.",
      icon: "✂️",
    },
    {
      title: "Hair Color & Highlights",
      description:
        "Transform your look with vibrant colors, subtle highlights, or complete color makeovers using premium products.",
      icon: "🎨",
    },
    {
      title: "Bridal Makeup",
      description:
        "Look stunning on your special day with our professional bridal makeup packages and hair styling services.",
      icon: "👰",
    },
    {
      title: "Spa & Massage",
      description:
        "Relax and rejuvenate with our luxurious spa treatments, aromatherapy, and therapeutic massage services.",
      icon: "💆",
    },
    {
      title: "Facial & Skin Care",
      description:
        "Achieve radiant, glowing skin with our customized facials and advanced skincare treatments.",
      icon: "✨",
    },
    {
      title: "Nail Art & Manicure",
      description:
        "Pamper your hands and feet with our premium manicure, pedicure, and creative nail art services.",
      icon: "💅",
    },
  ];

  return (
    <>
      <div className="bg-white min-h-screen w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative bg-gray-900 py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 text-center">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

          <div className="relative max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
                Services
              </span>
            </h1>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed px-4">
              Experience luxury beauty treatments tailored to enhance your natural
              radiance and confidence.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 sm:p-7 md:p-8 border border-gray-200 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-rose-500 hover:to-pink-500 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer transform hover:-translate-y-2"
              >
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-white mb-3 sm:mb-4">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 group-hover:text-white/90">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* baaki sections SAME as before */}
      </div>

      {/* Trust Badges / Certifications */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 sm:py-8 overflow-hidden border-t border-white/5">
        <Certifications />
      </section>
    </>
  );
};

export default SalonServices;