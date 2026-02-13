import axios from "axios";

// Use relative URL so requests go through the Vite proxy (same as services.js)
const api = axios.create({
  baseURL: "/api/categories",
  withCredentials: true,
});

export const getCategories = async (branchId) => {
  const response = await api.get(`/${branchId}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post("/", categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
