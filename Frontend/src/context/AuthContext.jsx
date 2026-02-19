import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Global axios config to ensure cookies (sessions) are sent with every request
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  // 1. Check if user is already logged in on mount
  const checkAuth = async () => {
    try {
      const res = await axios.get("/auth/me");
      if (res.data.loggedIn) {
        // Now fetch the full profile based on the role found in session
        const profileRes = await axios.get("/api/profile");
        setUser(profileRes.data.profile);
        setRole(profileRes.data.role);
        setIsAuthenticated(true);

        // Fetch subscription data for admins
        if (profileRes.data.role === "admin") {
          await fetchSubscription();
        }
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription status
  const fetchSubscription = async () => {
    try {
      const res = await axios.get("/api/subscriptions/current");
      setSubscription(res.data.subscription);
      setHasPlan(res.data.hasPlan);
      setIsTrialExpired(res.data.isTrialExpired);
    } catch (err) {
      console.error("Subscription fetch failed:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 2. Owner Registration
  const register = async ({ name, email, phone, password }) => {
    const res = await axios.post("/auth/register", {
      name,
      email,
      phone,
      password,
    });

    if (res.data.success) {
      const profileRes = await axios.get("/api/profile");
      setUser(profileRes.data.profile);
      setRole("admin");
      setIsAuthenticated(true);
      await fetchSubscription();
      return { success: true, message: res.data.message };
    }

    return { success: false };
  };

  // 3. Owner Login
  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    if (res.data.success) {
      // Fetch profile to get full details after login
      const profileRes = await axios.get("/api/profile");
      setUser(profileRes.data.profile);
      setRole("admin");
      setIsAuthenticated(true);
      await fetchSubscription();
      return { success: true };
    }
  };

  // 4. Staff Login
  const staffLogin = async (phone) => {
    const res = await axios.post("/auth/login/staff", { phone });
    if (res.data.success) {
      const profileRes = await axios.get("/api/profile");
      setUser(profileRes.data.profile);
      setRole("receptionist");
      setIsAuthenticated(true);
      return { success: true };
    }
  };

  // 5. Logout
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      window.location.href = "/login"; // Force redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated,
        subscription,
        isTrialExpired,
        hasPlan,
        register,
        login,
        staffLogin,
        logout,
        checkAuth,
        fetchSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
