import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useBranch } from "../context/BranchContext";
import axios from "axios";

const AdminInventory = () => {
  const { currentBranch } = useBranch();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = async () => {
    if (!currentBranch || !currentBranch._id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/inventory/branch/${currentBranch._id}`,
      );
      const data = response.data.data;
      setInventoryItems(data);
      calculateStatsAndCategories(data);
    } catch (err) {
      console.error("Error fetching admin inventory:", err);
      setError("Failed to load inventory items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBranch]);

  const calculateStatsAndCategories = (items) => {
    const stats = {
      totalProducts: items.length,
      lowStock: items.filter((i) => i.status === "low-stock").length,
      outOfStock: items.filter((i) => i.status === "out-of-stock").length,
      totalValue: items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    };
    setStats(stats);

    const categoryMap = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { name: item.category, count: 0, value: 0 };
      }
      acc[item.category].count += 1;
      acc[item.category].value += item.price * item.quantity;
      return acc;
    }, {});
    setCategories(Object.values(categoryMap));
  };

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
    <AdminLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Inventory Oversight
          </h1>
          <p className="text-gray-600">
            Monitoring stock levels for{" "}
            <span className="font-semibold text-rose-600">
              {currentBranch?.name}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 italic flex items-center gap-2">
            <i className="ri-error-warning-line"></i>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-archive-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-gray-500 mt-2">Current variety</p>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-yellow-500/5 border border-yellow-100 hover:shadow-xl hover:shadow-yellow-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-error-warning-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Low Stock Items
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.lowStock}</p>
            <p className="text-xs text-gray-500 mt-2">Requires attention</p>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-500/5 border border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-close-circle-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Out of Stock
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.outOfStock}
            </p>
            <p className="text-xs text-gray-500 mt-2">Urgent restock</p>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-money-rupee-circle-line text-white text-2xl"></i>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Asset Value
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.totalValue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Market value</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>
              <div className="flex gap-1 bg-white p-1 rounded-xl border border-rose-100">
                {["all", "in", "low", "out"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                      activeTab === tab
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-rose-50"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-12 text-center animate-pulse">
                  <div className="w-10 h-10 bg-rose-100 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Retrieving branch records...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="ri-inbox-line text-5xl text-gray-200 mb-4"></i>
                  <p className="text-gray-500 font-semibold">
                    No stock found in this category
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-5 hover:bg-rose-50/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-rose-500 border border-gray-100">
                          <i className="ri-box-3-line text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.sku} • {item.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 shadow-sm ${getStatusColor(item.status)}`}
                      >
                        <i className={getStockIcon(item.status)}></i>
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Stock
                        </p>
                        <p className="font-bold text-gray-900">
                          {item.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Price
                        </p>
                        <p className="font-bold text-gray-900">₹{item.price}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Supplier
                        </p>
                        <p className="text-xs font-semibold text-gray-700 truncate">
                          {item.supplier || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Last Entry
                        </p>
                        <p className="text-xs font-semibold text-gray-700">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-pie-chart-line text-purple-600"></i>
                  Distribution
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {categories.map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-gray-700">
                        {cat.name}
                      </span>
                      <span className="text-gray-400">{cat.count} Units</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{
                          width: `${(cat.count / stats.totalProducts) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i className="ri-information-line text-blue-500"></i>
                Admin Note
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                Inventory management is performed by branch receptionists.
                Administrators have read-only access to monitor stock viability
                and asset valuation across the organization.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminInventory;
