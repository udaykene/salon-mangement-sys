import React, { useState, useEffect } from "react";
import ReceptionistLayout from "./../components/ReceptionistLayout";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import InventoryForm from "../components/InventoryForm";

const Inventory = () => {
  const { user } = useAuth();
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = async () => {
    if (!user || !user.branchId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/inventory/branch/${user.branchId}`,
      );
      const data = response.data.data;
      setInventoryItems(data);
      calculateStatsAndCategories(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

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

  const updateQuantity = async (id, change) => {
    try {
      const item = inventoryItems.find((i) => i._id === id);
      const newQuantity = Math.max(0, item.quantity + change);
      await axios.patch(`/api/inventory/${id}`, { quantity: newQuantity });
      fetchInventory();
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    }
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

  const openForm = (item = null) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  return (
    <ReceptionistLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600">
              Track and manage your salon products and supplies
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95"
          >
            <i className="ri-add-line text-xl"></i>
            Add Product
          </button>
        </div>

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
            <p className="text-xs text-gray-500 mt-2">Across all categories</p>
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
            <p className="text-xs text-gray-500 mt-2">Need restocking soon</p>
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
            <p className="text-xs text-gray-500 mt-2">Restock immediately</p>
          </div>

          {/* Total Value */}
          <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-500/5 border border-green-100 hover:shadow-xl hover:shadow-green-500/10 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <i className="ri-money-rupee-circle-line text-white text-2xl"></i>
              </div>
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
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-box-3-line text-rose-600"></i>
                  Product Inventory
                </h2>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-2 bg-white/50 p-1 rounded-xl backdrop-blur-sm border border-rose-100">
                  {["all", "in", "low", "out"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        activeTab === tab
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                          : "text-gray-600 hover:bg-rose-50"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Items */}
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-12 text-center animate-pulse">
                  <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading inventory items...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="ri-inbox-line text-6xl text-gray-200 mb-4"></i>
                  <p className="text-gray-500 font-semibold">
                    No products found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-6 hover:bg-rose-50/20 transition-all group border-l-4 border-transparent hover:border-rose-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-600 border border-rose-200 shadow-sm group-hover:scale-105 transition-transform">
                          <i className="ri-product-hunt-line text-2xl"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-rose-600 transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                              <i className="ri-barcode-line"></i> {item.sku}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                              <i className="ri-folder-line"></i> {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm ${getStatusColor(item.status)}`}
                      >
                        <i className={getStockIcon(item.status)}></i>
                        {item.status.split("-").join(" ").toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                          Quantity
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95"
                          >
                            <i className="ri-subtract-line font-bold"></i>
                          </button>
                          <span className="font-bold text-gray-900 text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-md shadow-rose-200 active:scale-95"
                          >
                            <i className="ri-add-line font-bold"></i>
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                          Price
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                          Min Stock
                        </p>
                        <p className="font-bold text-gray-700">
                          {item.minStock} units
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                          Total Value
                        </p>
                        <p className="font-bold text-rose-600 text-lg">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <i className="ri-truck-line text-rose-500"></i>{" "}
                          {item.supplier || "No Supplier"}
                        </span>
                        {item.expiryDate && (
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <i className="ri-calendar-event-line text-rose-500"></i>{" "}
                            Exp:{" "}
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openForm(item)}
                          className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                        >
                          <i className="ri-edit-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => deleteItem(item._id)}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all active:scale-95"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-grid-line text-purple-600"></i>
                  Categories
                </h2>
              </div>
              <div className="p-6 space-y-5">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center italic">
                    No categories yet
                  </p>
                ) : (
                  categories.map((category, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {category.name}
                        </h3>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full ring-1 ring-purple-100">
                          {category.count} items
                        </span>
                      </div>
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs text-gray-500">Value</p>
                        <p className="text-sm font-bold text-gray-700">
                          ₹{category.value.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.min(100, (category.count / stats.totalProducts) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
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
                <button className="w-full p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-rose-500/25 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <i className="ri-download-line text-lg"></i>
                  Export Inventory
                </button>
                <button className="w-full p-3 bg-white border-2 border-purple-100 text-purple-600 rounded-xl font-bold hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <i className="ri-file-upload-line text-lg"></i>
                  Import Products
                </button>
                <button className="w-full p-3 bg-white border-2 border-blue-100 text-blue-600 rounded-xl font-bold hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                  <i className="ri-printer-line text-lg"></i>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <InventoryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={selectedItem}
          onSuccess={fetchInventory}
        />
      </main>
    </ReceptionistLayout>
  );
};

export default Inventory;
