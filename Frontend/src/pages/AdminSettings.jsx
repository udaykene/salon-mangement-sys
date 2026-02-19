import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminSettings = () => {
  const { fetchSubscription: refreshAuthSubscription } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  // 🆕 Support URL parameters for direct tab navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && tabs.find((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, []);

  const [generalSettings, setGeneralSettings] = useState({
    salonName: "Bella Beauty Salon",
    email: "hello@bella.com",
    phone: "+1 (555) 123-4567",
    address: "123 Beauty Avenue, Downtown District, City 12345",
    currency: "INR",
  });

  const tabs = [
    { id: "general", label: "General", icon: "ri-settings-3-line" },
    { id: "subscriptions", label: "Subscriptions", icon: "ri-vip-crown-line" },
    {
      id: "notifications",
      label: "Notifications",
      icon: "ri-notification-3-line",
    },
    { id: "security", label: "Security", icon: "ri-lock-line" },
    { id: "business", label: "Business", icon: "ri-briefcase-line" },
  ];

  const plans = {
    demo: {
      name: "Demo",
      maxBranches: 1,
      price: 0,
      color: "emerald",
      trialDays: 14,
      tagline: "Try before you commit",
      icon: "🎯",
    },
    basic: {
      name: "Basic",
      maxBranches: 1,
      price: 29,
      color: "gray",
      tagline: "Perfect for solo salons",
      icon: "✦",
    },
    standard: {
      name: "Standard",
      maxBranches: 5,
      price: 99,
      color: "rose",
      tagline: "Growing multi-location brands",
      icon: "⬡",
    },
    premium: {
      name: "Premium",
      maxBranches: 10,
      price: 199,
      color: "purple",
      tagline: "Enterprise-level operations",
      icon: "◈",
    },
  };

  const planOrder = ["demo", "basic", "standard", "premium"];

  // Fetch subscription data when subscriptions tab is active
  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchSubscriptionData();
    }
  }, [activeTab]);

  const fetchSubscriptionData = async () => {
    try {
      setLoadingSubscription(true);
      const res = await axios.get("/api/subscriptions/current", {
        withCredentials: true,
      });
      setSubscriptionData(res.data);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      alert(err.response?.data?.message || "Failed to load subscription data");
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleUpgradePlan = async (newPlan) => {
    const planName = plans[newPlan].name;
    const confirmed = window.confirm(
      `Are you sure you want to upgrade to the ${planName} plan?\n\n` +
        `This will allow you to manage up to ${plans[newPlan].maxBranches} branches.\n` +
        `Price: ₹${plans[newPlan].price}/user/year`,
    );

    if (!confirmed) return;

    try {
      setLoadingSubscription(true);
      const res = await axios.post(
        "/api/subscriptions/upgrade",
        { newPlan },
        { withCredentials: true },
      );

      alert(res.data.message);
      await fetchSubscriptionData();
      if (refreshAuthSubscription) await refreshAuthSubscription();
    } catch (err) {
      console.error("Error upgrading plan:", err);
      alert(err.response?.data?.message || "Failed to upgrade plan");
    } finally {
      setLoadingSubscription(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/profile");
      if (data.profile && data.profile.salonSettings) {
        const s = data.profile.salonSettings;
        setGeneralSettings({
          salonName: s.name || "",
          email: s.email || "",
          phone: s.phone || "",
          address: s.address || "",
          currency: s.currency || "INR",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put("http://localhost:3000/api/profile/salon", {
        name: generalSettings.salonName,
        email: generalSettings.email,
        phone: generalSettings.phone,
        address: generalSettings.address,
        currency: generalSettings.currency,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const currentPlanKey = subscriptionData?.subscription?.plan || "basic";
  const currentPlanIndex = planOrder.indexOf(currentPlanKey);
  const usagePercent = subscriptionData
    ? Math.min(
        100,
        Math.round(
          (subscriptionData.currentBranchCount /
            (subscriptionData.subscription?.maxBranches || 1)) *
            100,
        ),
      )
    : 0;

  return (
    <AdminLayout>
      <main className="min-h-screen bg-white lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Settings
              </h1>
              <p className="text-gray-600">
                Configure your salon preferences and manage your account
              </p>
            </div>
            {activeTab !== "subscriptions" && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-600 hover:border-rose-200 hover:bg-rose-50"
              }`}
            >
              <i className={`${tab.icon} text-lg`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* General Settings */}
          {activeTab === "general" && (
            <>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-settings-3-line text-rose-600"></i>
                  General Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Basic salon information and preferences
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="ri-store-2-line text-rose-500"></i>
                      Salon Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.salonName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          salonName: e.target.value,
                        })
                      }
                      className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="ri-mail-line text-rose-500"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.email}
                      disabled
                      className="rounded-xl border-2 border-gray-200 bg-gray-100 p-3 text-gray-500 font-medium cursor-not-allowed transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="ri-phone-line text-rose-500"></i>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.phone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          phone: e.target.value,
                        })
                      }
                      className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="ri-money-rupee-circle-line text-rose-500"></i>
                      Currency
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          currency: e.target.value,
                        })
                      }
                      className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
                    >
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <i className="ri-map-pin-line text-rose-500"></i>
                      Address
                    </label>
                    <textarea
                      rows="3"
                      value={generalSettings.address}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          address: e.target.value,
                        })
                      }
                      className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── SUBSCRIPTIONS TAB ── */}
          {activeTab === "subscriptions" && (
            <>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-vip-crown-line text-amber-600"></i>
                  Subscription Management
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your plan and billing
                </p>
              </div>

              <div className="p-6">
                {loadingSubscription ? (
                  <div className="flex items-center justify-center py-16">
                    <i className="ri-loader-4-line animate-spin text-4xl text-rose-500"></i>
                  </div>
                ) : subscriptionData ? (
                  <>
                    {/* ── CURRENT PLAN HERO ── */}
                    <div className="mb-8 rounded-2xl overflow-hidden border border-rose-100">
                      {/* top strip */}
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 flex items-center justify-between">
                        <span className="text-white text-xs font-bold tracking-widest uppercase">
                          Active Subscription
                        </span>
                        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                          {currentPlanKey} Plan
                        </span>
                      </div>

                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          {/* left: plan name + tagline */}
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-200 text-2xl">
                              {plans[currentPlanKey]?.icon || "✦"}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 capitalize">
                                {plans[currentPlanKey]?.name} Plan
                              </h3>
                              <p className="text-gray-500 text-sm">
                                {plans[currentPlanKey]?.tagline}
                              </p>
                            </div>
                          </div>

                          {/* right: branch usage */}
                          <div className="sm:text-right">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                              Branch Usage
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                              {subscriptionData.currentBranchCount}
                              <span className="text-gray-400 text-lg font-normal">
                                /
                                {subscriptionData.subscription?.maxBranches ||
                                  1}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* progress bar */}
                        <div className="mt-5">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-500">
                              Branch capacity
                            </span>
                            <span
                              className={`text-xs font-semibold ${usagePercent >= 100 ? "text-red-500" : usagePercent >= 80 ? "text-amber-500" : "text-emerald-600"}`}
                            >
                              {usagePercent}% used
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                usagePercent >= 100
                                  ? "bg-gradient-to-r from-red-500 to-rose-500"
                                  : usagePercent >= 80
                                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                    : "bg-gradient-to-r from-rose-500 to-pink-500"
                              }`}
                              style={{ width: `${usagePercent}%` }}
                            />
                          </div>
                        </div>

                        {/* warning if at limit */}
                        {subscriptionData.currentBranchCount >=
                          (subscriptionData.subscription?.maxBranches || 1) && (
                          <div className="mt-4 bg-amber-100 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                            <i className="ri-error-warning-line text-amber-600 text-lg mt-0.5 flex-shrink-0"></i>
                            <div>
                              <p className="text-sm font-semibold text-amber-800">
                                Branch Limit Reached
                              </p>
                              <p className="text-xs text-amber-700 mt-0.5">
                                Upgrade your plan below to add more salon
                                locations.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── PLAN TIER STEPPER ── */}
                    <div className="mb-6">
                      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="ri-arrow-up-circle-line text-rose-500"></i>
                        Upgrade Your Plan
                      </h3>

                      {/* Stepper track */}
                      <div className="relative flex items-start gap-0 mb-6">
                        {planOrder.map((key, idx) => {
                          const plan = plans[key];
                          const isCurrent = key === currentPlanKey;
                          const isPast = idx < currentPlanIndex;
                          const isFuture = idx > currentPlanIndex;

                          return (
                            <React.Fragment key={key}>
                              <div className="flex flex-col items-center flex-1">
                                {/* dot */}
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 z-10 transition-all ${
                                    isCurrent
                                      ? "bg-gradient-to-br from-rose-500 to-pink-500 border-rose-500 text-white shadow-md shadow-rose-200"
                                      : isPast
                                        ? "bg-gray-300 border-gray-300 text-gray-500"
                                        : "bg-white border-gray-200 text-gray-400"
                                  }`}
                                >
                                  {isPast ? (
                                    <i className="ri-check-line text-sm"></i>
                                  ) : isCurrent ? (
                                    "★"
                                  ) : (
                                    idx + 1
                                  )}
                                </div>
                                {/* label */}
                                <p
                                  className={`mt-2 text-xs font-semibold text-center ${isCurrent ? "text-rose-600" : isPast ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {plan.name}
                                </p>
                                <p className="text-xs text-gray-400 text-center">
                                  {key === "demo" ? "Free" : `₹${plan.price}`}
                                </p>
                              </div>
                              {/* connector line between steps */}
                              {idx < planOrder.length - 1 && (
                                <div
                                  className={`flex-1 h-0.5 mt-4 ${idx < currentPlanIndex ? "bg-gray-300" : "bg-gray-100"}`}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── PLAN CARDS ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {planOrder.map((key) => {
                        const plan = plans[key];
                        const isCurrent = key === currentPlanKey;
                        const thisIndex = planOrder.indexOf(key);
                        const canUpgrade = thisIndex > currentPlanIndex;

                        return (
                          <div
                            key={key}
                            className={`rounded-2xl border-2 p-5 flex flex-col transition-all ${
                              isCurrent
                                ? "border-rose-400 bg-gradient-to-b from-rose-50 to-pink-50 shadow-md shadow-rose-100"
                                : canUpgrade
                                  ? "border-gray-200 bg-white hover:border-rose-200 hover:shadow-sm cursor-pointer"
                                  : "border-gray-100 bg-gray-50 opacity-60"
                            }`}
                          >
                            {/* header */}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                {isCurrent && (
                                  <span className="inline-block text-xs font-bold text-rose-600 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full mb-2">
                                    ★ Current
                                  </span>
                                )}
                                <h4 className="text-base font-bold text-gray-900">
                                  {plan.name}
                                </h4>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {plan.tagline}
                                </p>
                              </div>
                              <span className="text-xl opacity-50">
                                {plan.icon}
                              </span>
                            </div>

                            {/* price */}
                            <div className="mb-3">
                              {key === "demo" ? (
                                <span className="text-2xl font-bold text-emerald-600">
                                  Free
                                </span>
                              ) : (
                                <span className="text-2xl font-bold text-gray-900">
                                  ₹{plan.price}
                                  <span className="text-xs text-gray-400 font-normal">
                                    /yr
                                  </span>
                                </span>
                              )}
                            </div>

                            {/* branch count highlight */}
                            <div className="flex items-center gap-2 mb-4 p-2.5 bg-white rounded-lg border border-gray-100">
                              <i className="ri-store-2-line text-rose-400 text-sm"></i>
                              <span className="text-sm text-gray-700 font-medium">
                                {plan.maxBranches} Branch
                                {plan.maxBranches > 1 ? "es" : ""}
                              </span>
                            </div>

                            {/* CTA */}
                            {canUpgrade ? (
                              <button
                                onClick={() => handleUpgradePlan(key)}
                                disabled={loadingSubscription}
                                className="mt-auto w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl text-sm hover:from-rose-600 hover:to-pink-600 shadow-sm shadow-rose-200 transition-all disabled:opacity-50"
                              >
                                {loadingSubscription ? (
                                  <i className="ri-loader-4-line animate-spin"></i>
                                ) : (
                                  "Upgrade →"
                                )}
                              </button>
                            ) : (
                              <button
                                disabled
                                className="mt-auto w-full py-2.5 rounded-xl text-sm font-bold cursor-not-allowed bg-gray-100 text-gray-400"
                              >
                                {isCurrent ? "Active Plan" : "Lower Tier"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Info note */}
                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                      <i className="ri-information-line text-blue-500 text-xl mt-0.5 flex-shrink-0"></i>
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Plan Upgrade Information
                        </p>
                        <ul className="text-xs text-blue-700 space-y-0.5">
                          <li>
                            • Upgrades are instant and take effect immediately
                          </li>
                          <li>
                            • You can only upgrade to higher plans (no
                            downgrades)
                          </li>
                          <li>
                            • No payment gateway integrated yet — upgrades are
                            free for testing
                          </li>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Failed to load subscription data
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-notification-3-line text-purple-600"></i>
                  Notification Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage how you receive updates and alerts
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      id: "email",
                      label: "Email Notifications",
                      desc: "Receive updates via email",
                      icon: "ri-mail-line",
                    },
                    {
                      id: "sms",
                      label: "SMS Alerts",
                      desc: "Get text message notifications",
                      icon: "ri-message-3-line",
                    },
                    {
                      id: "push",
                      label: "Push Notifications",
                      desc: "Browser push notifications",
                      icon: "ri-notification-badge-line",
                    },
                    {
                      id: "appointments",
                      label: "Appointment Reminders",
                      desc: "Alerts for upcoming appointments",
                      icon: "ri-calendar-check-line",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <i className={`${item.icon} text-white text-lg`}></i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-lock-line text-blue-600"></i>
                  Security Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your account security and privacy
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-200 hover:shadow-lg transition-all">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="ri-lock-password-line text-blue-500"></i>
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                      </div>
                      <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-cyan-600 transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-200 hover:shadow-lg transition-all">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="ri-shield-check-line text-blue-500"></i>
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Business Settings */}
          {activeTab === "business" && (
            <>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-briefcase-line text-green-600"></i>
                  Business Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure business hours and operational settings
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-green-200 hover:shadow-lg transition-all">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="ri-time-line text-green-500"></i>
                      Business Hours
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <div
                          key={day}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3 sm:w-40">
                            <input
                              type="checkbox"
                              className="w-5 h-5 text-green-500 rounded focus:ring-green-200"
                              defaultChecked={day !== "Sunday"}
                            />
                            <span className="font-semibold text-gray-900">
                              {day}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              defaultValue="09:00"
                              className="rounded-lg border-2 border-gray-200 bg-white p-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              defaultValue="18:00"
                              className="rounded-lg border-2 border-gray-200 bg-white p-2 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-green-200 hover:shadow-lg transition-all">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="ri-calendar-line text-green-500"></i>
                      Booking Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Booking Buffer (minutes)
                        </label>
                        <input
                          type="number"
                          defaultValue="15"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Max Advance Booking (days)
                        </label>
                        <input
                          type="number"
                          defaultValue="30"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Save Button (Bottom) */}
        {activeTab !== "subscriptions" && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-600 hover:shadow-xl hover:shadow-rose-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-xl"></i>
                  Saving Changes...
                </>
              ) : (
                <>
                  <i className="ri-save-line text-xl"></i>
                  Save All Changes
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default AdminSettings;
