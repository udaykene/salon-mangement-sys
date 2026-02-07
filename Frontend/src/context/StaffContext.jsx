import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const StaffContext = createContext();

// Create an axios instance with base settings
const api = axios.create({
  baseURL: "/api/staff",
  withCredentials: true, // Crucial for sending/receiving session cookies
});

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear staff data on logout
  const logoutStaff = () => {
    setStaff([]);
    setError(null);
  };

  // Fetch all staff for the logged-in owner
  const fetchStaff = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);

      // Backend identifies user via Session Cookie
      const res = await api.get("/");
      const data = res.data;
      setStaff(data);
    } catch (err) {
      // If 401 and we haven't retried yet, wait 800ms and try once more
      if (err.response?.status === 401 && !isRetry) {
        console.warn("Initial fetch unauthorized, retrying session sync...");
        setTimeout(() => fetchStaff(true), 800);
        return;
      }
      // If it still fails after retry, or is a different error
      setStaff([]);
      const errorMessage =
        err.response?.data?.message || "Failed to fetch staff";
      setError(errorMessage);
      console.error("Error fetching staff:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new staff member
  const addStaff = async (staffData) => {
    try {
      setLoading(true);
      
      // Convert specialization string to array
      const dataToSend = {
        ...staffData,
        specialization: staffData.specialization
          ? staffData.specialization
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
      };

      const res = await api.post("/", dataToSend);
      const newStaff = res.data;
      
      setStaff((prev) => [...prev, newStaff]);
      setLoading(false);
      return newStaff;
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || err.message || "Error adding staff";
      throw new Error(errorMessage);
    }
  };

  // Update an existing staff member
  const updateStaff = async (staffId, staffData) => {
    try {
      setLoading(true);

      // Convert specialization string to array
      const dataToSend = {
        ...staffData,
        specialization: staffData.specialization
          ? staffData.specialization
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
      };

      const res = await api.put(`/${staffId}`, dataToSend);
      const updatedStaff = res.data;

      setStaff((prev) =>
        prev.map((s) => (s._id === staffId ? updatedStaff : s))
      );
      
      setLoading(false);
      return updatedStaff;
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || err.message || "Error updating staff";
      throw new Error(errorMessage);
    }
  };

  // Delete a staff member
  const deleteStaff = async (staffId) => {
    try {
      setLoading(true);
      await api.delete(`/${staffId}`);

      setStaff((prev) => prev.filter((s) => s._id !== staffId));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || err.message || "Error deleting staff";
      throw new Error(errorMessage);
    }
  };

  // Toggle staff status (active/on-leave/inactive)
  const toggleStaffStatus = async (staffId, newStatus) => {
    try {
      const res = await api.patch(`/${staffId}/status`, { status: newStatus });
      const updatedStaff = res.data;

      setStaff((prev) =>
        prev.map((s) => (s._id === staffId ? updatedStaff : s))
      );

      return updatedStaff;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error updating status";
      throw new Error(errorMessage);
    }
  };

  // Initial load on mount
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const value = {
    staff,
    loading,
    error,
    fetchStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
    logoutStaff,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
};

export default StaffContext;