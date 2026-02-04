import React from "react";
import Certifications from "../components/Certifications";

const SalonHistory = () => {
  const historyItems = [
    {
      title: "Bridal Makeup Completed",
      service: "Premium Bridal Package",
      date: "15 Jan 2026",
      time: "10:00 AM",
      stylist: "Sarah Johnson",
      rating: 5,
      icon: "💄",
    },
    {
      title: "Hair Color Transformation",
      service: "Balayage & Highlights",
      date: "08 Jan 2026",
      time: "2:30 PM",
      stylist: "Emma Davis",
      rating: 5,
      icon: "✨",
    },
    {
      title: "Luxury Spa Session",
      service: "Full Body Massage & Facial",
      date: "28 Dec 2025",
      time: "4:00 PM",
      stylist: "Jessica Smith",
      rating: 5,
      icon: "💆",
    },
    {
      title: "Hair Styling & Cut",
      service: "Modern Layered Cut",
      date: "15 Dec 2025",
      time: "11:30 AM",
      stylist: "Emily Wilson",
      rating: 4,
      icon: "💇",
    },
    {
      title: "Nail Art & Manicure",
      service: "Gel Nails with Design",
      date: "05 Dec 2025",
      time: "3:00 PM",
      stylist: "Lisa Anderson",
      rating: 5,
      icon: "💅",
    },
    {
      title: "Consultation Session",
      service: "Skincare & Beauty Consultation",
      date: "20 Nov 2025",
      time: "1:00 PM",
      stylist: "Olivia Martinez",
      rating: 5,
      icon: "💬",
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
            alt="Salon"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Service{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              History
            </span>
          </h1>
          <p className="text-gray-300">
            Your journey to beauty and wellness
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {historyItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-l-4 border-rose-500 shadow-lg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-rose-500 font-semibold">{item.service}</p>
                  <p className="text-sm text-gray-500">
                    {item.date} • {item.time} • {item.stylist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <Certifications />
    </div>
  );
};

export default SalonHistory;