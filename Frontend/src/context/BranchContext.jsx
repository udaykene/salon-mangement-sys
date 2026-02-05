import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BranchContext = createContext();

// Create an axios instance with base settings
const api = axios.create({
  baseURL: '/api/branches',
  withCredentials: true, // Crucial for sending/receiving session cookies
});

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all branches for the logged-in owner
  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 💡 No ownerId needed - Backend identifies user via Session Cookie
      const res = await api.get('/my-branches');
      
      const data = res.data;
      setBranches(data);

      // Restore saved selection or default to first branch
      const savedBranchId = localStorage.getItem('currentBranchId');
      if (savedBranchId) {
        const saved = data.find(b => b._id === savedBranchId);
        setCurrentBranch(saved || data[0] || null);
      } else if (data.length > 0) {
        setCurrentBranch(data[0]);
        localStorage.setItem('currentBranchId', data[0]._id);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch branches';
      setError(msg);
      console.error('Fetch Error:', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new branch
 const createBranch = async (branchData) => {
  try {
    const res = await api.post('/', branchData);
    const newBranch = res.data;
    setBranches(prev => [...prev, newBranch]);
    setCurrentBranch(newBranch);
  } catch (err) {
    // 💡 Improved error extraction
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    throw errorMessage; 
  }
};

  // Toggle status
  const toggleBranchStatus = async (branchId) => {
    try {
      const res = await api.patch(`/${branchId}/status`);
      const updatedBranch = res.data;

      setBranches(prev => prev.map(b => b._id === branchId ? updatedBranch : b));
      
      if (currentBranch?._id === branchId) {
        setCurrentBranch(updatedBranch);
      }
    } catch (err) {
      throw err.response?.data?.message || 'Error updating status';
    }
  };

  // Switch current branch selection
  const switchBranch = (branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('currentBranchId', branch._id);
  };

  // Initial load on mount
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const value = {
    branches,
    currentBranch,
    loading,
    error,
    fetchBranches,
    createBranch,
    toggleBranchStatus,
    switchBranch,
  };

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
};

export default BranchContext;