import axios from "axios";

const API_URL = "http://localhost:3000/api/expenses";

// Set withCredentials to true for session-based auth
axios.defaults.withCredentials = true;

const addExpense = async (expenseData) => {
  const response = await axios.post(API_URL, expenseData);
  return response.data;
};

const getExpenses = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

const updateExpense = async (id, expenseData) => {
  const response = await axios.put(`${API_URL}/${id}`, expenseData);
  return response.data;
};

const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
