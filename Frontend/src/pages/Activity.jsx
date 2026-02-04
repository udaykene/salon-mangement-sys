import React from "react";

const SalonActivity = () => {
  const activities = [
    {
      id: 1,
      type: "Appointment",
      service: "Bridal Makeover Package",
      status: "Confirmed",
      date: "24 Jan 2026",
      time: "10:00 AM",
      stylist: "Sarah Johnson",
    },
    {
      id: 2,
      type: "Consultation",
      service: "Hair Color & Highlights",
      status: "Pending",
      date: "28 Jan 2026",
      time: "2:30 PM",
      stylist: "Emma Davis",
    },
    {
      id: 3,
      type: "Spa Session",
      service: "Luxury Full Body Massage",
      status: "Completed",
      date: "15 Jan 2026",
      time: "4:00 PM",
      stylist: "Jessica Smith",
    },
    {
      id: 4,
      type: "Appointment",
      service: "Makeup & Styling",
      status: "Confirmed",
      date: "30 Jan 2026",
      time: "11:30 AM",
      stylist: "Emily Wilson",
    },
  ];

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
          <span className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-300/30 text-rose-200 text-xs sm:text-sm font-medium backdrop-blur-sm">
            ✨ Your Beauty Journey
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">Activity</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Track your appointments and beauty services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rose-100 hover:shadow-lg transition-all group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
              4
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Total Bookings</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100 hover:shadow-lg transition-all group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
              2
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Confirmed</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-100 hover:shadow-lg transition-all group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
              1
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Pending</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-all group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-slate-500 mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
              1
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Completed</p>
          </div>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 sm:px-6 py-4 sm:py-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              Recent Activities
            </h2>
          </div>

          {/* Activity Items */}
          <div className="divide-y divide-gray-100">
            {activities.map((act, index) => (
              <div
                key={act.id}
                className="p-4 sm:p-6 md:p-8 hover:bg-gradient-to-r hover:from-rose-50/50 hover:to-pink-50/50 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  {/* Left Side - Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-rose-200">
                        {act.type === "Appointment" && "📅"}
                        {act.type === "Consultation" && "💬"}
                        {act.type === "Spa Session" && "💆"}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 uppercase tracking-wider mb-1">
                          {act.type}
                        </p>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                          {act.service}
                        </h3>
                        
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="text-rose-500">📍</span>
                            <span className="font-medium">{act.stylist}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-rose-500">🕐</span>
                            <span>{act.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-rose-500">📆</span>
                            <span>{act.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Status & Actions */}
                  <div className="flex flex-row lg:flex-col items-center gap-3 sm:gap-4">
                    {/* Status Badge */}
                    <span
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap ${
                        act.status === "Confirmed"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : act.status === "Pending"
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {act.status}
                    </span>

                    {/* Action Button */}
                    {act.status !== "Completed" && (
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                        {act.status === "Confirmed" ? "Reschedule" : "Confirm"}
                      </button>
                    )}
                    
                    {act.status === "Completed" && (
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-rose-500 text-rose-500 hover:bg-rose-50 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap">
                        Rebook
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Want to book a new appointment?
          </p>
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all transform hover:-translate-y-1">
            Book New Appointment
          </button>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/90 via-pink-900/85 to-rose-900/90"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-white text-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-lg font-bold mb-2">Loyalty Rewards</h3>
              <p className="text-sm text-white/80">Earn points with every booking</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-lg font-bold mb-2">Easy Rescheduling</h3>
              <p className="text-sm text-white/80">Change your appointments anytime</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-lg font-bold mb-2">Premium Service</h3>
              <p className="text-sm text-white/80">Personalized care just for you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
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

export default SalonActivity;