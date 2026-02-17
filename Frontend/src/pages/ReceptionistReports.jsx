import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ReceptionistReports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [reportData, setReportData] = useState(null);

  // Get branchId from user context
  const branchId = user?.branchId?._id || user?.branchId;

  const fetchReport = async () => {
    if (!branchId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/reports/summary?period=${selectedPeriod}&branchId=${branchId}`,
      );
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  useEffect(() => {
    if (branchId) {
      fetchReport();
    }
  }, [selectedPeriod, branchId]);

  const revenueStats = [
    {
      title: "Total Revenue",
      value: reportData ? `$${reportData.totalRevenue.toLocaleString()}` : "$0",
      icon: "💰",
      gradient: "from-rose-500 to-pink-500",
      trend: reportData?.trends?.revenue || "0%",
      trendUp: reportData?.trends?.revenue?.includes("+") || false,
    },
    {
      title: "Total Appointments",
      value: reportData ? reportData.totalAppointments : 0,
      icon: "📅",
      gradient: "from-pink-500 to-fuchsia-500",
      trend: reportData?.trends?.appointments || "0%",
      trendUp: reportData?.trends?.appointments?.includes("+") || false,
    },
    {
      title: "New Clients",
      value: reportData ? reportData.newClients : 0,
      icon: "👥",
      gradient: "from-fuchsia-500 to-purple-500",
      trend: reportData?.trends?.clients || "0%",
      trendUp: reportData?.trends?.clients?.includes("+") || false,
    },
    {
      title: "Total Expenses",
      value: reportData
        ? `₹${reportData.totalExpenses.toLocaleString()}`
        : "₹0",
      icon: "💸",
      gradient: "from-amber-500 to-orange-500",
      trend: reportData?.trends?.expenses || "0%",
      trendUp: !(reportData?.trends?.expenses?.includes("+") || false),
    },
  ];

  const monthlyRevenue =
    reportData && reportData.chartData
      ? reportData.chartData.map((d) => ({
          month: d.label,
          revenue: d.value,
        }))
      : [];

  const serviceRevenueBreakdown =
    reportData && reportData.serviceRevenue
      ? Object.entries(reportData.serviceRevenue).map(
          ([category, amount], index) => ({
            category,
            amount,
            percentage:
              reportData.totalRevenue > 0
                ? ((amount / reportData.totalRevenue) * 100).toFixed(1)
                : 0,
            gradient: [
              "from-rose-500 to-pink-500",
              "from-pink-500 to-fuchsia-500",
              "from-fuchsia-500 to-purple-500",
              "from-purple-500 to-rose-500",
            ][index % 4],
          }),
        )
      : [];

  const maxRevenue =
    monthlyRevenue.length > 0
      ? Math.max(...monthlyRevenue.map((m) => m.revenue))
      : 100;

  const recentTransactions = reportData?.recentTransactions || [];

  return (
    <ReceptionistLayout>
      {/* Page Body */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Reports & Revenue
          </h1>
          <p className="text-gray-600">Track your branch performance</p>
        </div>

        {/* Revenue Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
          {revenueStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    stat.trendUp
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {stat.trend} {stat.trendUp ? "↑" : "↓"}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Revenue Chart - 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Revenue Overview
              </h3>
              <div className="flex gap-2 w-full sm:w-auto">
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`flex-1 sm:flex-initial rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all capitalize ${
                      selectedPeriod === period
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex h-[240px] sm:h-[280px] items-end justify-between gap-1 sm:gap-2">
              {monthlyRevenue.map((data, index) => (
                <div
                  key={index}
                  className="group flex flex-1 flex-col items-center gap-2"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-rose-500 to-pink-500 transition-all duration-500 hover:from-rose-600 hover:to-pink-600"
                      style={{
                        height: `${(data.revenue / maxRevenue) * 220}px`,
                        minHeight: "20px",
                      }}
                    >
                      <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block whitespace-nowrap z-10">
                        ${(data.revenue / 1000).toFixed(1)}K
                        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown - 1 column */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Revenue by Service
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {serviceRevenueBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}
                    >
                      {index === 0
                        ? "💇"
                        : index === 1
                          ? "💄"
                          : index === 2
                            ? "💆"
                            : "💅"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {item.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.percentage}% of total
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0 ml-2">
                    ${(item.amount / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Total Revenue
                </span>
                <span className="text-xl font-bold text-gray-900">
                  $
                  {reportData
                    ? (reportData.totalRevenue || 0).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Recent Transactions
            </h3>
            {/* <button className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg transition">
              View All
            </button> */}
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl hover:bg-gray-50 transition group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
                    {transaction.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {transaction.client}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {transaction.service}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      ${transaction.amount}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        transaction.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : transaction.status === "Cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No recent transactions found.
              </p>
            )}
          </div>
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistReports;
