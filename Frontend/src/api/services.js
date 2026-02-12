import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "/api/services",
  withCredentials: true, // Important for session cookies
});

// Create a new service
export const createService = async (serviceData) => {
  const response = await api.post("/", serviceData);
  return response.data;
};

// Get all services (with optional filters)
export const getServices = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.branchId) params.append("branchId", filters.branchId);
  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.gender && filters.gender !== "all") {
    params.append("gender", filters.gender);
  }

  const response = await api.get(`/?${params.toString()}`);
  return response.data;
};

// Update a service
export const updateService = async (serviceId, serviceData) => {
  const response = await api.put(`/${serviceId}`, serviceData);
  return response.data;
};

// Toggle service status
export const toggleServiceStatus = async (serviceId) => {
  const response = await api.patch(`/${serviceId}/status`);
  return response.data;
};

// Delete a service
export const deleteService = async (serviceId) => {
  const response = await api.delete(`/${serviceId}`);
  return response.data;
};

export default {
  createService,
  getServices,
  updateService,
  toggleServiceStatus,
  deleteService,
};
