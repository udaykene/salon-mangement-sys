import React from "react";
import Certifications from "../components/Certifications";

const SalonContact = () => {
  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      {/* Hero Header */}
      <div className="relative bg-gray-900 py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Salon"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Touch
            </span>
          </h1>
          <p className="text-rose-300 text-base sm:text-lg md:text-xl">
            We're ready to help you look and feel your absolute best.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Side */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Visit Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                Salon
              </span>
            </h2>

            <p className="text-gray-600 mb-8">
              Whether you're looking for a fresh new look or a relaxing spa day,
              our expert stylists are here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-2xl mr-4">📍</span>
                <div>
                  <h4 className="font-bold">Our Location</h4>
                  <p className="text-gray-600">
                    123 Beauty Avenue, City Center
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-4">📞</span>
                <div>
                  <h4 className="font-bold">Call Us</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-2xl mr-4">✉️</span>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-gray-600">hello@beautysalon.com</p>
                </div>
              </div>
            </div>

            <div className="mt-10 h-56 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              [ Map Placeholder ]
            </div>
          </div>

          {/* Right Side */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6">
              Book Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                Appointment
              </span>
            </h3>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border rounded-lg"
              />
              <select className="w-full p-3 border rounded-lg">
                <option>Hair Styling</option>
                <option>Makeup</option>
                <option>Spa & Massage</option>
              </select>
              <textarea
                rows="4"
                placeholder="Special requests"
                className="w-full p-3 border rounded-lg"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 rounded-lg"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust Badges / Certifications */}
      <Certifications />
    </div>
  );
};

export default SalonContact;