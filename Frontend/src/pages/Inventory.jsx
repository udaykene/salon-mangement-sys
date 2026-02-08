import React, { useState } from "react";
import ReceptionistLayout from './../components/ReceptionistLayout';

const Inventory = () => {
  const [stats, setStats] = useState({
    totalProducts: 248,
    lowStock: 23,
    outOfStock: 8,
    totalValue: 156780,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [inventoryItems] = useState([
    {
      id: 1,
      name: "L'Oréal Professional Shampoo",
      category: "Hair Care",
      sku: "LP-SH-001",
      quantity: 45,
      minStock: 20,
      price: 850,
      supplier: "Beauty Supplies Co.",
      lastRestocked: "2024-01-28",
      expiryDate: "2025-12-31",
      status: "in-stock",
    },
    {
      id: 2,
      name: "Nail Polish Set - Premium",
      category: "Nail Care",
      sku: "NP-SET-045",
      quantity: 12,
      minStock: 15,
      price: 1200,
      supplier: "Glamour Essentials",
      lastRestocked: "2024-01-20",
      expiryDate: "2026-06-30",
      status: "low-stock",
    },
    {
      id: 3,
      name: "Massage Oil - Lavender",
      category: "Spa Products",
      sku: "MO-LAV-023",
      quantity: 0,
      minStock: 10,
      price: 650,
      supplier: "Wellness Traders",
      lastRestocked: "2024-01-10",
      expiryDate: "2025-08-15",
      status: "out-of-stock",
    },
    {
      id: 4,
      name: "Hair Color - Chocolate Brown",
      category: "Hair Color",
      sku: "HC-CB-089",
      quantity: 67,
      minStock: 25,
      price: 1450,
      supplier: "Color Masters Ltd.",
      lastRestocked: "2024-02-01",
      expiryDate: "2025-11-30",
      status: "in-stock",
    },
    {
      id: 5,
      name: "Face Mask - Hydrating",
      category: "Skincare",
      sku: "FM-HYD-156",
      quantity: 8,
      minStock: 12,
      price: 890,
      supplier: "Skincare Pro",
      lastRestocked: "2024-01-15",
      expiryDate: "2025-09-20",
      status: "low-stock",
    },
    {
      id: 6,
      name: "Styling Gel - Strong Hold",
      category: "Hair Styling",
      sku: "SG-SH-234",
      quantity: 34,
      minStock: 15,
      price: 720,
      supplier: "Beauty Supplies Co.",
      lastRestocked: "2024-01-25",
      expiryDate: "2026-03-15",
      status: "in-stock",
    },
    {
      id: 7,
      name: "Makeup Remover Wipes",
      category: "Makeup",
      sku: "MR-WP-078",
      quantity: 15,
      minStock: 20,
      price: 450,
      supplier: "Glamour Essentials",
      lastRestocked: "2024-01-22",
      expiryDate: "2025-07-31",
      status: "low-stock",
    },
    {
      id: 8,
      name: "Pedicure Kit - Deluxe",
      category: "Nail Care",
      sku: "PK-DLX-012",
      quantity: 0,
      minStock: 8,
      price: 2100,
      supplier: "Professional Tools Inc.",
      lastRestocked: "2023-12-20",
      expiryDate: "N/A",
      status: "out-of-stock",
    },
  ]);

  const [categories] = useState([
    { name: "Hair Care", count: 68, value: 45200 },
    { name: "Nail Care", count: 42, value: 28500 },
    { name: "Spa Products", count: 35, value: 31200 },
    { name: "Hair Color", count: 54, value: 38900 },
    { name: "Skincare", count: 29, value: 22100 },
    { name: "Hair Styling", count: 20, value: 14880 },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-700 border-green-200";
      case "low-stock":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "out-of-stock":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStockIcon = (status) => {
    switch (status) {
      case "in-stock":
        return "ri-checkbox-circle-line";
      case "low-stock":
        return "ri-error-warning-line";
      case "out-of-stock":
        return "ri-close-circle-line";
      default:
        return "ri-checkbox-blank-circle-line";
    }
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "low" && item.status === "low-stock") ||
      (activeTab === "out" && item.status === "out-of-stock") ||
      (activeTab === "in" && item.status === "in-stock");

    return matchesSearch && matchesTab;
  });

  return (
    <ReceptionistLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Track and manage your salon products and supplies
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-archive-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-gray-500 mt-2">Across all categories</p>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-error-warning-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                Attention
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Low Stock Items
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.lowStock}</p>
            <p className="text-xs text-gray-500 mt-2">Need restocking soon</p>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-close-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-1 rounded-full">
                Urgent
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Out of Stock
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.outOfStock}
            </p>
            <p className="text-xs text-gray-500 mt-2">Restock immediately</p>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-money-rupee-circle-line text-white text-2xl"></i>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +5% value
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Inventory Value
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalValue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Current stock value</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Inventory Table */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 ">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-box-3-line text-rose-600"></i>
                  Product Inventory
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all flex items-center gap-2">
                  <i className="ri-add-line"></i>
                  Add Product
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === "all"
                        ? "bg-rose-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("in")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === "in"
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    In Stock
                  </button>
                  <button
                    onClick={() => setActiveTab("low")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === "low"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setActiveTab("out")}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === "out"
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Out
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Items */}
            <div className="divide-y divide-gray-100 max-h-screen overflow-y-auto">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-rose-50/30 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 border-2 border-rose-200">
                        <i className="ri-product-hunt-line text-2xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <i className="ri-barcode-line text-rose-500"></i>
                            {item.sku}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1">
                            <i className="ri-folder-line text-rose-500"></i>
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                        item.status
                      )}`}
                    >
                      <i className={getStockIcon(item.status)}></i>
                      {item.status.split("-").join(" ").toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Quantity</p>
                      <p className="font-bold text-gray-900">
                        {item.quantity} units
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Min Stock</p>
                      <p className="font-bold text-gray-900">
                        {item.minStock} units
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="font-bold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Value</p>
                      <p className="font-bold text-gray-900">
                        ₹{(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <i className="ri-truck-line text-rose-500"></i>
                      {item.supplier}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-line text-rose-500"></i>
                      Last restocked: {item.lastRestocked}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="text-green-600 hover:text-green-700 font-semibold">
                        <i className="ri-add-box-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="p-12 text-center">
                  <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500 font-semibold">
                    No products found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-grid-line text-purple-600"></i>
                  Categories
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      ₹{category.value.toLocaleString()}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${(category.count / 70) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-flashlight-line text-blue-600"></i>
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                  <i className="ri-download-line"></i>
                  Export Inventory
                </button>
                <button className="w-full p-3 bg-white border-2 border-purple-200 text-purple-600 rounded-lg font-semibold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
                  <i className="ri-file-upload-line"></i>
                  Import Products
                </button>
                <button className="w-full p-3 bg-white border-2 border-blue-200 text-blue-600 rounded-lg font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  <i className="ri-printer-line"></i>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default Inventory;