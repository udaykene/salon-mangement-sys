import React from "react";
import Certifications from "../components/Certifications";

const SalonProfile = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden">
      
      {/* Hero Header */}
      <div className="relative bg-gray-900 py-12 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1740&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block mb-3 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-300/30 text-rose-200 text-sm font-medium">
            ✨ Your Beauty Profile
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Profile
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Cover */}
          <div className="relative h-48 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1740&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/80 to-pink-500/80"></div>

            <div className="absolute -bottom-16 left-12">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 border-4 border-white flex items-center justify-center text-4xl text-white font-bold shadow-2xl">
                UK
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-24 pb-12 px-12">
            <div className="flex justify-between items-start mb-8 border-b pb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Uday Kene
                </h2>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full">
                  VIP Member
                </span>
              </div>

              <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg">
                ✏️ Edit Profile
              </button>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-bold mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-rose-50 rounded-xl border">
                  <p className="text-sm font-bold text-rose-600">Email</p>
                  <p className="font-semibold">uday.kene@example.com</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl border">
                  <p className="text-sm font-bold text-purple-600">Phone</p>
                  <p className="font-semibold">+91 98765 43210</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex gap-4">
              <button className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl">
                📅 Book Appointment
              </button>
              <button className="flex-1 px-6 py-4 border-2 border-rose-500 text-rose-500 font-bold rounded-xl">
                🎁 View Rewards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges / Certifications */}
      <Certifications />
    </div>
  );
};

export default SalonProfile;