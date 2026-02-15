import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import AddServiceForm from "../components/AddServiceForm";
import { useService } from "../context/ServiceContext";
import { useCategory } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";
import {
  CATEGORY_GRADIENTS,
  getCategoryIcon,
} from "../constants/serviceConstants";

const ReceptionistServices = () => {
  const { user } = useAuth();
  const branchId = user?.branchId;

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    fetchServices,
    toggleServiceStatus,
    deleteService,
  } = useService();
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategory();

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (branchId) {
      fetchServices({ branchId });
      fetchCategories(branchId);
    }
  }, [branchId, fetchServices, fetchCategories]);

  const genderList = ["all", "Men", "Female", "Unisex"];

  const counts = categories.reduce(
    (acc, cat) => {
      acc[cat._id] = services.filter((s) => s.categoryId === cat._id).length;
      return acc;
    },
    { all: services.length },
  );

  const activeServicesCount = services.filter(
    (s) => s.status === "active",
  ).length;

  const filtered = services.filter((sv) => {
    const matchCat =
      filterCategory === "all" || sv.categoryId === filterCategory;
    const matchGender = filterGender === "all" || sv.gender === filterGender;
    const matchSearch =
      searchTerm === "" ||
      sv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sv.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchGender && matchSearch;
  });

  const handleViewDetails = (service) => {
    alert(
      `Service: ${service.name}\nPrice: ${service.displayPrice}\nDuration: ${service.duration}\nGender: ${service.gender}\n\n${service.desc}`,
    );
    setDropdownOpen(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowAddForm(true);
    setDropdownOpen(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleServiceStatus(id);
      setDropdownOpen(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        await deleteService(service.id);
        setDropdownOpen(null);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete service");
      }
    }
  };

  return (
    <ReceptionistLayout>
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Services Catalog
            </h1>
            <p className="text-gray-600">
              Browse and manage available services
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <i className="ri-add-line text-xl"></i>
            Add Service
          </button>
        </div>

        {(servicesLoading || categoriesLoading) && services.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        )}

        {servicesError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{servicesError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="ri-scissors-2-line"
            label="Total"
            title="Total Services"
            value={services.length}
            subValue="All offerings"
            color="rose"
          />
          <StatCard
            icon="ri-checkbox-circle-line"
            label="Available"
            title="Active Services"
            value={activeServicesCount}
            subValue="Currently bookable"
            color="green"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-6">
            <FilterSection
              title="Filter by Category"
              options={[
                { id: "all", name: "All", count: counts.all },
                ...categories.map((c) => ({
                  id: c._id,
                  name: c.name,
                  count: counts[c._id] || 0,
                })),
              ]}
              activeId={filterCategory}
              setActiveId={setFilterCategory}
            />
            <FilterSection
              title="Gender"
              options={genderList.map((g) => ({ id: g, name: g }))}
              activeId={filterGender}
              setActiveId={setFilterGender}
            />
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((sv) => (
              <ServiceCard
                key={sv.id}
                service={sv}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                handleViewDetails={handleViewDetails}
                handleEdit={handleEdit}
                handleToggleStatus={handleToggleStatus}
                handleDelete={handleDelete}
              />
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="ri-grid-line text-rose-600"></i> Service Categories
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <CategoryGridItem
                key={cat._id}
                category={cat}
                index={index}
                count={services.filter((s) => s.categoryId === cat._id).length}
                activeCount={
                  services.filter(
                    (s) => s.categoryId === cat._id && s.status === "active",
                  ).length
                }
                onSelect={() => setFilterCategory(cat._id)}
              />
            ))}
          </div>
        </div>
      </main>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <AddServiceForm
              onSubmit={() => {
                setShowAddForm(false);
                setEditingService(null);
              }}
              onClose={() => {
                setShowAddForm(false);
                setEditingService(null);
              }}
              editingService={editingService}
            />
          </div>
        </div>
      )}
    </ReceptionistLayout>
  );
};

const StatCard = ({ icon, label, title, value, subValue, color }) => {
  const colors = {
    rose: "from-rose-500 to-pink-500 bg-rose-50 text-rose-600",
    green: "from-green-500 to-emerald-500 bg-green-50 text-green-600",
  };
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border border-${color}-100 hover:shadow-xl transition-all group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color].split(" ")[0]} ${colors[color].split(" ")[1]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
        >
          <i className={`${icon} text-white text-2xl`}></i>
        </div>
        <span
          className={`text-xs font-semibold ${colors[color].split(" ")[2]} ${colors[color].split(" ")[3]} px-2 py-1 rounded-full`}
        >
          {label}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{subValue}</p>
    </div>
  );
};

const FilterSection = ({ title, options, activeId, setActiveId }) => (
  <div>
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {title}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setActiveId(opt.id)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
            activeId === opt.id
              ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30"
              : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:bg-rose-50"
          }`}
        >
          <span className="capitalize">{opt.name}</span>
          {opt.count !== undefined && (
            <span className="ml-1.5 opacity-75">({opt.count})</span>
          )}
        </button>
      ))}
    </div>
  </div>
);

const ServiceCard = ({
  service,
  dropdownOpen,
  setDropdownOpen,
  handleViewDetails,
  handleEdit,
  handleToggleStatus,
  handleDelete,
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-rose-200 transition-all flex flex-col overflow-hidden group">
    <div
      className={`h-2 bg-gradient-to-r ${service.gradient} group-hover:h-3 transition-all`}
    />
    <div className="p-6 flex flex-col flex-1">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
        >
          <i className={`${service.icon} text-white text-2xl`}></i>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${
              service.status === "active"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {service.status}
          </span>
          <div className="relative">
            <button
              onClick={() =>
                setDropdownOpen(dropdownOpen === service.id ? null : service.id)
              }
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <i className="ri-more-2-fill text-gray-600 text-xl"></i>
            </button>
            {dropdownOpen === service.id && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => handleViewDetails(service)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <i className="ri-eye-line text-rose-500"></i> View Details
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <i className="ri-edit-line text-rose-500"></i> Edit Service
                </button>
                <button
                  onClick={() => handleToggleStatus(service.id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <i
                    className={`${service.status === "active" ? "ri-pause-circle-line" : "ri-play-circle-line"} text-rose-500`}
                  ></i>
                  {service.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <i className="ri-delete-bin-line"></i> Delete Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
          {service.category}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
          {service.gender}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {service.desc}
      </p>
      <div className="border-t border-gray-100 pt-4 mt-auto space-y-3">
        <ServiceDetail
          icon="ri-money-rupee-circle-line"
          label="Price"
          value={service.displayPrice}
        />
        <ServiceDetail
          icon="ri-time-line"
          label="Duration"
          value={service.duration}
        />
        <ServiceDetail
          icon="ri-team-line"
          label="Clients"
          value={service.clients}
        />
      </div>
    </div>
  </div>
);

const ServiceDetail = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500 flex items-center gap-2">
      <i className={`${icon} text-rose-500`}></i> {label}
    </span>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);

const CategoryGridItem = ({
  category,
  index,
  count,
  activeCount,
  onSelect,
}) => (
  <div
    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-rose-50 hover:shadow-md border-2 border-transparent hover:border-rose-200 transition-all cursor-pointer group"
    onClick={onSelect}
  >
    <div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0`}
    >
      <i className={`${getCategoryIcon(category.name)} text-white text-xl`}></i>
    </div>
    <div className="min-w-0">
      <p className="font-bold text-gray-900 text-base">{category.name}</p>
      <p className="text-xs text-gray-500">
        {count} services · {activeCount} available
      </p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
      <i className="ri-scissors-2-line text-4xl text-gray-400"></i>
    </div>
    <p className="text-gray-500 font-medium text-lg">No services found</p>
    <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
  </div>
);

export default ReceptionistServices;
