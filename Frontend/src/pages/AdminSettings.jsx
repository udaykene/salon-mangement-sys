import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  // 🆕 Support URL parameters for direct tab navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && tabs.find(t => t.id === tab)) {
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
    { id: "notifications", label: "Notifications", icon: "ri-notification-3-line" },
    { id: "security", label: "Security", icon: "ri-lock-line" },
    { id: "business", label: "Business", icon: "ri-briefcase-line" },
  ];

  const plans = {
    basic: { name: "Basic", maxBranches: 1, price: 29, color: "gray" },
    standard: { name: "Standard", maxBranches: 5, price: 99, color: "rose" },
    premium: { name: "Premium", maxBranches: 10, price: 199, color: "purple" },
  };

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
      `Price: ₹${plans[newPlan].price}/user/year`
    );

    if (!confirmed) return;

    try {
      setLoadingSubscription(true);
      const res = await axios.post(
        "/api/subscriptions/upgrade",
        { newPlan },
        { withCredentials: true }
      );

      alert(res.data.message);
      await fetchSubscriptionData(); // Refresh subscription data
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
        currency: generalSettings.currency
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      {/* Main Content */}
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
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
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

          {/* Subscriptions Tab */}
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
                  <div className="flex items-center justify-center py-12">
                    <i className="ri-loader-4-line animate-spin text-4xl text-rose-500"></i>
                  </div>
                ) : subscriptionData ? (
                  <>
                    {/* Current Plan Card */}
                    <div className="mb-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                          <h3 className="text-2xl font-bold text-gray-900 capitalize">
                            {subscriptionData.subscription?.plan || "Basic"} Plan
                          </h3>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                          <i className="ri-vip-crown-fill text-white text-3xl"></i>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Branch Limit</p>
                          <p className="text-xl font-bold text-gray-900">
                            {subscriptionData.subscription?.maxBranches || 1}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-1">Branches Used</p>
                          <p className="text-xl font-bold text-gray-900">
                            {subscriptionData.currentBranchCount}
                          </p>
                        </div>
                      </div>

                      {subscriptionData.currentBranchCount >= (subscriptionData.subscription?.maxBranches || 1) && (
                        <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 flex items-start gap-2">
                          <i className="ri-error-warning-line text-amber-600 text-lg mt-0.5"></i>
                          <div>
                            <p className="text-sm font-semibold text-amber-800">Branch Limit Reached</p>
                            <p className="text-xs text-amber-700">Upgrade your plan to add more branches</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Available Plans */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(plans).map(([key, plan]) => {
                        const isCurrent = (subscriptionData.subscription?.plan || "basic") === key;
                        const planOrder = ["basic", "standard", "premium"];
                        const currentIndex = planOrder.indexOf(subscriptionData.subscription?.plan || "basic");
                        const thisIndex = planOrder.indexOf(key);
                        const canUpgrade = thisIndex > currentIndex;

                        return (
                          <div
                            key={key}
                            className={`rounded-xl border-2 p-6 transition-all ${isCurrent
                              ? "border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg"
                              : "border-gray-200 bg-white hover:border-rose-300"
                              }`}
                          >
                            {isCurrent && (
                              <div className="mb-3">
                                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  CURRENT PLAN
                                </span>
                              </div>
                            )}

                            <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                            <div className="mb-4">
                              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                                ₹{plan.price}
                              </span>
                              <span className="text-sm text-gray-600">/user/year</span>
                            </div>

                            <div className="mb-4 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <i className="ri-checkbox-circle-fill text-green-500"></i>
                                Up to {plan.maxBranches} Branch{plan.maxBranches > 1 ? "es" : ""}
                              </div>
                            </div>

                            {canUpgrade ? (
                              <button
                                onClick={() => handleUpgradePlan(key)}
                                disabled={loadingSubscription}
                                className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50"
                              >
                                {loadingSubscription ? "Processing..." : "Upgrade"}
                              </button>
                            ) : (
                              <button
                                disabled
                                className="w-full py-2.5 bg-gray-100 text-gray-400 font-bold rounded-lg cursor-not-allowed"
                              >
                                {isCurrent ? "Current Plan" : "Lower Plan"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Info Note */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <i className="ri-information-line text-blue-600 text-xl mt-0.5"></i>
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Plan Upgrade Information</p>
                          <p className="text-xs text-blue-700">
                            • Upgrades are instant and take effect immediately<br />
                            • You can only upgrade to higher plans (no downgrades)<br />
                            • No payment gateway integrated yet - upgrades are free for testing
                          </p>
                        </div>
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
                    { id: "email", label: "Email Notifications", desc: "Receive updates via email", icon: "ri-mail-line" },
                    { id: "sms", label: "SMS Alerts", desc: "Get text message notifications", icon: "ri-message-3-line" },
                    { id: "push", label: "Push Notifications", desc: "Browser push notifications", icon: "ri-notification-badge-line" },
                    { id: "appointments", label: "Appointment Reminders", desc: "Alerts for upcoming appointments", icon: "ri-calendar-check-line" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <i className={`${item.icon} text-white text-lg`}></i>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
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
                        <label className="text-sm font-semibold text-gray-700">Current Password</label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">New Password</label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
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
                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
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
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 sm:w-40">
                            <input type="checkbox" className="w-5 h-5 text-green-500 rounded focus:ring-green-200" defaultChecked={day !== "Sunday"} />
                            <span className="font-semibold text-gray-900">{day}</span>
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
                        <label className="text-sm font-semibold text-gray-700">Booking Buffer (minutes)</label>
                        <input
                          type="number"
                          defaultValue="15"
                          className="rounded-xl border-2 border-gray-200 bg-gray-50 p-3 text-gray-900 font-medium focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Max Advance Booking (days)</label>
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

        {/* Save Button (Bottom) - Hide for subscriptions tab */}
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