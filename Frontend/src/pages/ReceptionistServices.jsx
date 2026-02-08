import React, { useState } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";

const ReceptionistServices = () => {
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ── data ──────────────────────────────────────
  const [services] = useState([
    {
      id: 1,
      name: "Hair Cut & Style",
      category: "Hair",
      desc: "Classic cuts, modern styles & blowouts tailored to your look.",
      price: "₹1,500",
      duration: "45 min",
      status: "active",
      icon: "ri-scissors-2-line",
      gradient: "from-rose-500 to-pink-500",
      availability: "Available",
    },
    {
      id: 2,
      name: "Color & Highlights",
      category: "Hair",
      desc: "Balayage, ombré, full-colour & highlight treatments.",
      price: "₹3,500",
      duration: "2 hrs",
      status: "active",
      icon: "ri-palette-line",
      gradient: "from-pink-500 to-fuchsia-500",
      availability: "Available",
    },
    {
      id: 3,
      name: "Bridal Makeup",
      category: "Makeup",
      desc: "Full-day bridal packages including trials & touch-ups.",
      price: "₹12,000",
      duration: "3 hrs",
      status: "active",
      icon: "ri-emotion-happy-line",
      gradient: "from-purple-500 to-pink-500",
      availability: "By Appointment",
    },
    {
      id: 4,
      name: "Everyday Makeup",
      category: "Makeup",
      desc: "Natural or glamorous looks for any occasion.",
      price: "₹2,500",
      duration: "1 hr",
      status: "active",
      icon: "ri-brush-3-line",
      gradient: "from-blue-500 to-cyan-500",
      availability: "Available",
    },
    {
      id: 5,
      name: "Relaxing Massage",
      category: "Spa",
      desc: "Swedish, deep-tissue & aromatherapy massage sessions.",
      price: "₹2,800",
      duration: "60 min",
      status: "active",
      icon: "ri-user-heart-line",
      gradient: "from-rose-400 to-pink-400",
      availability: "Available",
    },
    {
      id: 6,
      name: "Facial & Skin Care",
      category: "Spa",
      desc: "Customised facials with premium skincare products.",
      price: "₹2,200",
      duration: "50 min",
      status: "active",
      icon: "ri-emotion-line",
      gradient: "from-pink-400 to-fuchsia-400",
      availability: "Available",
    },
    {
      id: 7,
      name: "Manicure & Nail Art",
      category: "Nails",
      desc: "Classic manicures, gel sets & creative nail-art designs.",
      price: "₹1,800",
      duration: "75 min",
      status: "active",
      icon: "ri-hand-heart-line",
      gradient: "from-fuchsia-400 to-purple-400",
      availability: "Available",
    },
    {
      id: 8,
      name: "Pedicure & Foot Spa",
      category: "Nails",
      desc: "Rejuvenating pedicures with paraffin & foot treatments.",
      price: "₹2,000",
      duration: "60 min",
      status: "inactive",
      icon: "ri-footprint-line",
      gradient: "from-purple-400 to-rose-400",
      availability: "Currently Unavailable",
    },
  ]);

  // ── derived ───────────────────────────────────
  const categoryList = ["all", "Hair", "Makeup", "Spa", "Nails"];

  const counts = categoryList.reduce((acc, c) => {
    acc[c] =
      c === "all"
        ? services.length
        : services.filter((s) => s.category === c).length;
    return acc;
  }, {});

  const activeServices = services.filter((s) => s.status === "active").length;

  const filtered = services.filter((sv) => {
    const matchCat = filterCategory === "all" || sv.category === filterCategory;
    const matchSearch =
      searchTerm === "" ||
      sv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── gradient icon bg per category (for the overview row) ──
  const catMeta = {
    Hair: { gradient: "from-rose-500 to-pink-500", icon: "ri-scissors-2-line" },
    Makeup: {
      gradient: "from-pink-500 to-fuchsia-500",
      icon: "ri-brush-3-line",
    },
    Spa: {
      gradient: "from-purple-500 to-pink-500",
      icon: "ri-user-heart-line",
    },
    Nails: {
      gradient: "from-blue-500 to-cyan-500",
      icon: "ri-hand-heart-line",
    },
  };

  // ═══════════════════════════════════════════════
  return (
    <ReceptionistLayout>
      {/* Main Content */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Services Catalog
          </h1>
          <p className="text-gray-600">
            Browse available services and pricing
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Services */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-rose-500/5 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-scissors-2-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Services
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {services.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">All offerings</p>
          </div>

          {/* Active Services */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-checkbox-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Active Services
            </h3>
            <p className="text-3xl font-bold text-gray-900">{activeServices}</p>
            <p className="text-xs text-gray-500 mt-2">Currently bookable</p>
          </div>

          {/* Hair Services */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-scissors-cut-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Popular
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Hair Services
            </h3>
            <p className="text-3xl font-bold text-gray-900">{counts.Hair}</p>
            <p className="text-xs text-gray-500 mt-2">Available options</p>
          </div>

          {/* Spa Services */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-hand-heart-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Relaxing
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Spa & Wellness
            </h3>
            <p className="text-3xl font-bold text-gray-900">{counts.Spa}</p>
            <p className="text-xs text-gray-500 mt-2">Treatments</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-6">
            {/* Category Pills */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Filter by Category
              </p>
              <div className="flex flex-wrap gap-2">
                {categoryList.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCategory(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      filterCategory === c
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
                        : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
                    }`}
                  >
                    <span className="capitalize">{c}</span>
                    <span className="ml-1.5 opacity-75">({counts[c]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services by name or description..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-scissors-2-line text-4xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 font-medium text-lg">
                No services found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search
              </p>
            </div>
          ) : (
            filtered.map((sv) => (
              <div
                key={sv.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-rose-200 transition-all flex flex-col overflow-hidden group"
              >
                {/* Card Header Strip */}
                <div
                  className={`h-2 bg-gradient-to-r ${sv.gradient} group-hover:h-3 transition-all`}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Top Row: Icon + Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sv.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <i className={`${sv.icon} text-white text-2xl`}></i>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${
                        sv.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {sv.status}
                    </span>
                  </div>

                  {/* Name + Category Badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {sv.name}
                    </h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                      {sv.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {sv.desc}
                  </p>

                  {/* Meta Row */}
                  <div className="border-t border-gray-100 pt-4 mt-auto space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <i className="ri-money-rupee-circle-line text-rose-500"></i>
                        Price
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        {sv.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <i className="ri-time-line text-rose-500"></i>
                        Duration
                      </span>
                      <span className="font-bold text-gray-900">
                        {sv.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <i className="ri-checkbox-circle-line text-rose-500"></i>
                        Availability
                      </span>
                      <span
                        className={`font-bold ${sv.status === "active" ? "text-green-600" : "text-red-600"}`}
                      >
                        {sv.availability}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border-2 border-rose-200 hover:border-rose-500 transition-all">
                      <i className="ri-eye-line"></i>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="ri-grid-line text-rose-600"></i>
              Service Categories
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Hair", "Makeup", "Spa", "Nails"].map((cat) => {
              const meta = catMeta[cat];
              const count = services.filter((s) => s.category === cat).length;
              const activeCount = services.filter(
                (s) => s.category === cat && s.status === "active"
              ).length;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-rose-50 hover:shadow-md border-2 border-transparent hover:border-rose-200 transition-all cursor-pointer group"
                  onClick={() => setFilterCategory(cat)}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0`}
                  >
                    <i className={`${meta.icon} text-white text-xl`}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-base">{cat}</p>
                    <p className="text-xs text-gray-500">
                      {count} services · {activeCount} available
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistServices;