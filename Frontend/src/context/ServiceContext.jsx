import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getServices as fetchServicesApi,
  createService as createServiceApi,
  updateService as updateServiceApi,
  deleteService as deleteServiceApi,
  toggleServiceStatus as toggleStatusApi,
} from "../api/services";

const ServiceContext = createContext();

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatService = (service) => ({
    id: service._id,
    name: service.name,
    category: service.category?.name || "Uncategorized",
    categoryId:
      typeof service.category === "object"
        ? service.category?._id
        : service.category,
    gender: service.gender,
    desc: service.desc || "",
    price: service.price, // Keep numeric for logic
    displayPrice: `₹${service.price}`, // Formatted for UI
    duration: service.duration,
    status: service.status,
    icon: service.icon,
    gradient: service.gradient,
    clients: service.clients,
    branchId: service.branchId?._id || service.branchId,
    branchName: service.branchId?.name || "",
  });

  const fetchServices = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchServicesApi(filters);
      if (response.success) {
        setServices(response.services.map(formatService));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = async (serviceData) => {
    try {
      setLoading(true);
      const response = await createServiceApi(serviceData);
      if (response.success) {
        const newService = formatService(response.service);
        setServices((prev) => [...prev, newService]);
        return newService;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      setLoading(true);
      const response = await updateServiceApi(id, serviceData);
      if (response.success) {
        const updated = formatService(response.service);
        setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return updated;
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      setLoading(true);
      const response = await deleteServiceApi(id);
      if (response.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (id) => {
    const response = await toggleStatusApi(id);
    if (response.success) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: s.status === "active" ? "inactive" : "active" }
            : s,
        ),
      );
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        loading,
        error,
        fetchServices,
        createService,
        updateService,
        deleteService,
        toggleServiceStatus,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
