import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const BranchContext = createContext();

// Create an axios instance with base settings
const api = axios.create({
  baseURL: "/api/branches",
  withCredentials: true, // Crucial for sending/receiving session cookies
});

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
};

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logoutBranches = () => {
    setBranches([]);
    setCurrentBranch(null);
    localStorage.removeItem("currentBranchId");
  };

  // Fetch all branches for the logged-in owner
  const fetchBranches = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);

      // 💡 No ownerId needed - Backend identifies user via Session Cookie
      const res = await api.get("/my-branches");
      const data = res.data;
      setBranches(data);

      // Restore saved selection or default to first branch
      // Inside fetchBranches in BranchContext.js
      const savedBranchId = localStorage.getItem("currentBranchId");
      if (savedBranchId) {
        const saved = data.find((b) => b._id === savedBranchId);
        if (saved) {
          setCurrentBranch(saved);
        } else {
          // Selection is old/invalid, clear it and use default
          setCurrentBranch(data[0] || null);
          if (data[0]) localStorage.setItem("currentBranchId", data[0]._id);
          else localStorage.removeItem("currentBranchId");
        }
      } else if (data.length > 0) {
        setCurrentBranch(data[0]);
        localStorage.setItem("currentBranchId", data[0]._id);
      }
    } catch (err) {
      // 💡 THE FIX: If 401 and we haven't retried yet, wait 800ms and try once more
      if (err.response?.status === 401 && !isRetry) {
        console.warn("Initial fetch unauthorized, retrying session sync...");
        setTimeout(() => fetchBranches(true), 800);
        return;
      }
      // If it still fails after retry, or is a different error
      setBranches([]);
      setError(err.response?.data?.message || "Failed to fetch");
    } finally {
      // Only stop loading if we aren't in the middle of a retry
      if (!isRetry || (isRetry && branches.length >= 0)) {
        setLoading(false);
      }
    }
  }, []);

  // Create a new branch
  const createBranch = async (branchData) => {
    try {
      const res = await api.post("/", branchData);
      const newBranch = res.data;
      setBranches((prev) => [...prev, newBranch]);
      setCurrentBranch(newBranch);
      return newBranch;
    } catch (err) {
      // 💡 Improved error extraction
      const errorMessage =
        err.response?.data?.message || err.message || "Unknown error";
      throw errorMessage;
    }
  };

  // Toggle status
  const toggleBranchStatus = async (branchId) => {
    try {
      const res = await api.patch(`/${branchId}/status`);
      const updatedBranch = res.data;

      setBranches((prev) =>
        prev.map((b) => (b._id === branchId ? updatedBranch : b)),
      );

      if (currentBranch?._id === branchId) {
        setCurrentBranch(updatedBranch);
      }
    } catch (err) {
      throw err.response?.data?.message || "Error updating status";
    }
  };

  // Switch current branch selection
  const switchBranch = (branch) => {
    setCurrentBranch(branch);
    localStorage.setItem("currentBranchId", branch._id);
  };

  // Initial load on mount
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const value = {
    branches,
    currentBranch,
    logoutBranches,
    loading,
    error,
    fetchBranches,
    createBranch,
    toggleBranchStatus,

    switchBranch,
  };

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
};

export default BranchContext;
