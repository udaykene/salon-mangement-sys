import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";

const SalonAdminRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [selectedPeriod]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/reports/summary?period=${selectedPeriod}`);
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const revenueStats = [
    {
      title: "Total Revenue",
      value: reportData ? `$${reportData.totalRevenue.toLocaleString()}` : "$0",
      icon: "💰",
      gradient: "from-rose-500 to-pink-500",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Appointments",
      value: reportData ? reportData.totalAppointments : 0,
      icon: "📅",
      gradient: "from-pink-500 to-fuchsia-500",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "New Clients",
      value: reportData ? reportData.newClients : 0,
      icon: "👥",
      gradient: "from-fuchsia-500 to-purple-500",
      trend: "+5.3%",
      trendUp: true,
    },
    {
      title: "Avg. Transaction",
      value: reportData && reportData.totalAppointments > 0 ? `$${Math.round(reportData.totalRevenue / reportData.totalAppointments)}` : "$0",
      icon: "💳",
      gradient: "from-purple-500 to-rose-500",
      trend: "+3.8%",
      trendUp: true,
    },
  ];

  const monthlyRevenue = reportData && reportData.chartData ? reportData.chartData.map(d => ({
    month: d.label,
    revenue: d.value
  })) : [];

  // Recent transactions can be kept static or fetched separately if needed, 
  // currently we don't have transaction endpoint, so keeping static for UI consistency
  const recentTransactions = [
    {
      id: 1,
      client: "Sarah Johnson",
      service: "Bridal Makeup Package",
      amount: "$450",
      date: "2026-02-01",
      status: "completed",
      type: "Service Payment",
      avatar: "S",
    },
    {
      id: 2,
      client: "Emily Davis",
      service: "Hair Coloring & Highlights",
      amount: "$325",
      date: "2026-01-30",
      status: "pending",
      type: "Advance Payment",
      avatar: "E",
    },
    {
      id: 3,
      client: "Lisa Morgan",
      service: "Spa Treatment Package",
      amount: "$580",
      date: "2026-01-28",
      status: "completed",
      type: "Full Payment",
      avatar: "L",
    },
  ];

  const serviceRevenueBreakdown = reportData && reportData.serviceRevenue ? Object.entries(reportData.serviceRevenue).map(([category, amount], index) => ({
    category,
    amount,
    percentage: reportData.totalRevenue > 0 ? ((amount / reportData.totalRevenue) * 100).toFixed(1) : 0,
    gradient: [
      "from-rose-500 to-pink-500",
      "from-pink-500 to-fuchsia-500",
      "from-fuchsia-500 to-purple-500",
      "from-purple-500 to-rose-500"
    ][index % 4]
  })) : [];

  const maxRevenue = monthlyRevenue.length > 0 ? Math.max(...monthlyRevenue.map((m) => m.revenue)) : 100;

  return (
    <AdminLayout>
      {/* Page Body */}
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Revenue Reports
          </h1>
          <p className="text-gray-600">
            Track and analyze your revenue performance
          </p>
        </div>
        {/* Revenue Stats Grid */}
        <div className="grid !grid grid-cols-1 !grid-cols-1 sm:grid-cols-2 !sm:grid-cols-2 xl:grid-cols-4 !xl:grid-cols-4 gap-4 !gap-4 sm:gap-5 !sm:gap-5 mb-6 !mb-6">
          {revenueStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white !bg-white rounded-2xl !rounded-2xl p-5 !p-5 shadow-sm !shadow-sm border !border border-gray-100 !border-gray-100 hover:shadow-md transition-all !transition-all group !group"
            >
              <div className="flex !flex items-center !items-center justify-between !justify-between mb-4 !mb-4">
                <div
                  className={`w-12 !w-12 h-12 !h-12 rounded-xl !rounded-xl bg-gradient-to-br !bg-gradient-to-br ${stat.gradient} flex !flex items-center !items-center justify-center !justify-center text-xl !text-xl shadow-md !shadow-md group-hover:scale-110 transition-transform !transition-transform`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`text-xs !text-xs font-bold !font-bold px-2.5 !px-2.5 py-1 !py-1 rounded-full !rounded-full ${stat.trendUp ? "bg-emerald-50 !bg-emerald-50 text-emerald-600 !text-emerald-600" : "bg-red-50 !bg-red-50 text-red-600 !text-red-600"}`}
                >
                  {stat.trend} {stat.trendUp ? "↑" : "↓"}
                </span>
              </div>
              <h3 className="text-2xl !text-2xl sm:text-3xl !sm:text-3xl font-bold !font-bold text-gray-900 !text-gray-900 leading-tight !leading-tight">
                {stat.value}
              </h3>
              <p className="text-sm !text-sm text-gray-500 !text-gray-500 mt-1 !mt-1">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid !grid grid-cols-1 !grid-cols-1 lg:grid-cols-3 !lg:grid-cols-3 gap-4 !gap-4 sm:gap-6 !sm:gap-6 mb-6 !mb-6">
          {/* Revenue Chart - 2 columns */}
          <div className="lg:col-span-2 !lg:col-span-2 bg-white !bg-white rounded-2xl !rounded-2xl p-5 !p-5 sm:p-6 !sm:p-6 shadow-sm !shadow-sm border !border border-gray-100 !border-gray-100">
            <div className="flex !flex flex-col !flex-col sm:flex-row !sm:flex-row items-start !items-start sm:items-center !sm:items-center justify-between !justify-between gap-3 !gap-3 sm:gap-4 !sm:gap-4 mb-6 !mb-6 pb-4 !pb-4 border-b !border-b border-gray-100 !border-gray-100">
              <h3 className="text-base !text-base sm:text-lg !sm:text-lg font-bold !font-bold text-gray-900 !text-gray-900">
                Revenue Overview
              </h3>
              <div className="flex !flex gap-2 !gap-2 w-full !w-full sm:w-auto !sm:w-auto">
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`flex-1 !flex-1 sm:flex-initial !sm:flex-initial rounded-lg !rounded-lg px-3 !px-3 sm:px-4 !sm:px-4 py-1.5 !py-1.5 sm:py-2 !sm:py-2 text-xs !text-xs sm:text-sm !sm:text-sm font-semibold !font-semibold transition-all !transition-all capitalize !capitalize ${selectedPeriod === period
                      ? "bg-gradient-to-r !bg-gradient-to-r from-rose-500 !from-rose-500 to-pink-500 !to-pink-500 text-white !text-white shadow-md !shadow-md"
                      : "bg-gray-100 !bg-gray-100 text-gray-600 !text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex !flex h-[240px] !h-[240px] sm:h-[280px] !sm:h-[280px] items-end !items-end justify-between !justify-between gap-1 !gap-1 sm:gap-2 !sm:gap-2">
              {monthlyRevenue.map((data, index) => (
                <div
                  key={index}
                  className="group !group flex !flex flex-1 !flex-1 flex-col !flex-col items-center !items-center gap-2 !gap-2"
                >
                  <div className="relative !relative w-full !w-full">
                    <div
                      className="w-full !w-full rounded-t-lg !rounded-t-lg bg-gradient-to-t !bg-gradient-to-t from-rose-500 !from-rose-500 to-pink-500 !to-pink-500 transition-all !transition-all duration-500 !duration-500 hover:from-rose-600 hover:to-pink-600"
                      style={{
                        height: `${(data.revenue / maxRevenue) * 220}px`,
                        minHeight: "20px",
                      }}
                    >
                      <div className="absolute !absolute -top-10 !-top-10 left-1/2 !left-1/2 hidden !hidden -translate-x-1/2 !-translate-x-1/2 rounded-lg !rounded-lg bg-gray-900 !bg-gray-900 px-3 !px-3 py-2 !py-2 text-xs !text-xs font-semibold !font-semibold text-white !text-white shadow-lg !shadow-lg group-hover:block whitespace-nowrap !whitespace-nowrap z-10 !z-10">
                        ${(data.revenue / 1000).toFixed(1)}K
                        <div className="absolute !absolute -bottom-1 !-bottom-1 left-1/2 !left-1/2 h-2 !h-2 w-2 !w-2 -translate-x-1/2 !-translate-x-1/2 rotate-45 !rotate-45 bg-gray-900 !bg-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs !text-xs font-medium !font-medium text-gray-500 !text-gray-500">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown - 1 column */}
          <div className="bg-white !bg-white rounded-2xl !rounded-2xl p-5 !p-5 sm:p-6 !sm:p-6 shadow-sm !shadow-sm border !border border-gray-100 !border-gray-100">
            <div className="mb-6 !mb-6 pb-4 !pb-4 border-b !border-b border-gray-100 !border-gray-100">
              <h3 className="text-base !text-base sm:text-lg !sm:text-lg font-bold !font-bold text-gray-900 !text-gray-900">
                Revenue by Service
              </h3>
            </div>

            <div className="flex !flex flex-col !flex-col gap-3 !gap-3">
              {serviceRevenueBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex !flex items-center !items-center justify-between !justify-between p-3 !p-3 rounded-xl !rounded-xl bg-gray-50 !bg-gray-50 hover:bg-gray-100 transition-all !transition-all group !group"
                >
                  <div className="flex !flex items-center !items-center gap-3 !gap-3 min-w-0 !min-w-0 flex-1 !flex-1">
                    <div
                      className={`h-10 !h-10 w-10 !w-10 rounded-xl !rounded-xl bg-gradient-to-br !bg-gradient-to-br ${item.gradient} flex !flex items-center !items-center justify-center !justify-center text-white !text-white text-lg !text-lg shadow-md !shadow-md group-hover:scale-110 transition-transform !transition-transform flex-shrink-0 !flex-shrink-0`}
                    >
                      {index === 0
                        ? "💇"
                        : index === 1
                          ? "💄"
                          : index === 2
                            ? "💆"
                            : "💅"}
                    </div>
                    <div className="min-w-0 !min-w-0 flex-1 !flex-1">
                      <p className="text-sm !text-sm font-bold !font-bold text-gray-900 !text-gray-900 truncate !truncate">
                        {item.category}
                      </p>
                      <p className="text-xs !text-xs text-gray-500 !text-gray-500">
                        {item.percentage}% of total
                      </p>
                    </div>
                  </div>
                  <span className="text-sm !text-sm font-bold !font-bold text-gray-900 !text-gray-900 flex-shrink-0 !flex-shrink-0 ml-2 !ml-2">
                    ${(item.amount / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 !mt-6 pt-4 !pt-4 border-t !border-t border-gray-100 !border-gray-100">
              <div className="flex !flex justify-between !justify-between items-center !items-center">
                <span className="text-sm !text-sm font-medium !font-medium text-gray-600 !text-gray-600">
                  Total Revenue
                </span>
                <span className="text-xl !text-xl font-bold !font-bold text-gray-900 !text-gray-900">
                  $45.3K
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white !bg-white rounded-2xl !rounded-2xl shadow-sm !shadow-sm border !border border-gray-100 !border-gray-100 overflow-hidden !overflow-hidden">
          <div className="flex !flex items-center !items-center justify-between !justify-between px-5 !px-5 pt-5 !pt-5 pb-3 !pb-3 border-b !border-b border-gray-100 !border-gray-100">
            <h3 className="text-base !text-base sm:text-lg !sm:text-lg font-bold !font-bold text-gray-900 !text-gray-900">
              Recent Transactions
            </h3>
            <button className="text-xs !text-xs sm:text-sm !sm:text-sm font-semibold !font-semibold text-rose-500 !text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 !px-3 py-1 !py-1 rounded-lg !rounded-lg transition !transition">
              View All
            </button>
          </div>

          <div className="p-4 !p-4 sm:p-5 !sm:p-5 space-y-3 !space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex !flex items-center !items-center gap-3 !gap-3 sm:gap-4 !sm:gap-4 p-3 !p-3 rounded-xl !rounded-xl hover:bg-gray-50 transition !transition group !group cursor-pointer !cursor-pointer"
              >
                <div className="w-10 !w-10 h-10 !h-10 rounded-xl !rounded-xl bg-gradient-to-br !bg-gradient-to-br from-rose-500 !from-rose-500 to-pink-500 !to-pink-500 flex !flex items-center !items-center justify-center !justify-center text-white !text-white text-lg !text-lg font-bold !font-bold shadow-md !shadow-md shrink-0 !shrink-0">
                  {transaction.avatar}
                </div>
                <div className="flex-1 !flex-1 min-w-0 !min-w-0">
                  <p className="text-sm !text-sm font-semibold !font-semibold text-gray-800 !text-gray-800 truncate !truncate">
                    {transaction.client}
                  </p>
                  <p className="text-xs !text-xs text-gray-500 !text-gray-500 truncate !truncate">
                    {transaction.service}
                  </p>
                </div>
                <div className="text-right !text-right shrink-0 !shrink-0">
                  <p className="text-sm !text-sm font-bold !font-bold text-gray-900 !text-gray-900">
                    {transaction.amount}
                  </p>
                  <span
                    className={`text-xs !text-xs font-bold !font-bold px-2 !px-2 py-0.5 !py-0.5 rounded-full !rounded-full ${transaction.status === "completed"
                      ? "bg-emerald-50 !bg-emerald-50 text-emerald-600 !text-emerald-600"
                      : "bg-amber-50 !bg-amber-50 text-amber-600 !text-amber-600"
                      }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 !mt-6 flex !flex flex-col !flex-col sm:flex-row !sm:flex-row gap-3 !gap-3 justify-end !justify-end">
          <button className="flex !flex items-center !items-center justify-center !justify-center gap-2 !gap-2 px-5 !px-5 py-2.5 !py-2.5 border-2 !border-2 border-gray-200 !border-gray-200 bg-white !bg-white text-gray-700 !text-gray-700 font-semibold !font-semibold rounded-lg !rounded-lg hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all !transition-all">
            <span className="text-lg !text-lg">📥</span>
            Export Report
          </button>
          <button className="flex !flex items-center !items-center justify-center !justify-center gap-2 !gap-2 px-6 !px-6 py-3 !py-3 bg-gradient-to-r !bg-gradient-to-r from-rose-500 !from-rose-500 to-pink-500 !to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white !text-white font-bold !font-bold rounded-lg !rounded-lg shadow-md !shadow-md shadow-rose-500/30 !shadow-rose-500/30 transition-all !transition-all">
            <span className="text-lg !text-lg">📊</span>
            Generate Report
          </button>
        </div>
      </main>
    </AdminLayout>
  );
};

export default SalonAdminRevenue;
