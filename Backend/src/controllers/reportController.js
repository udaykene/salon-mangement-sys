import { Appointment } from "../models/Appointment.js";
import { Client } from "../models/client.model.js";
import Service from "../models/services.model.js";
import Staff from "../models/staff.model.js";
import Expense from "../models/expense.model.js";

export const getReportSummary = async (req, res) => {
  try {
    const { period, branchId } = req.query; // 'week', 'month', 'year', 'branchId'

    const now = new Date();
    let startDate = new Date();
    let prevStartDate = new Date();
    let prevEndDate = new Date(); // End of previous period is start of current (roughly)

    // Calculate Date Ranges
    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
      prevStartDate.setDate(now.getDate() - 14);
      prevEndDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1);
      prevStartDate.setMonth(now.getMonth() - 2);
      prevEndDate.setMonth(now.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
      prevStartDate.setFullYear(now.getFullYear() - 2);
      prevEndDate.setFullYear(now.getFullYear() - 1);
    } else {
      // Default to month
      startDate.setMonth(now.getMonth() - 1);
      prevStartDate.setMonth(now.getMonth() - 2);
      prevEndDate.setMonth(now.getMonth() - 1);
    }

    // Base Query
    let query = {};
    if (branchId) {
      query.branchId = branchId;
    }

    // Fetch ALL appointments (filtered by branch)
    const allAppointments = await Appointment.find(query).sort({
      createdAt: -1,
    });

    // Fetch ALL expenses (filtered by branch)
    const allExpenses = await Expense.find(query).sort({
      date: -1,
    });

    // Filter appointments for Current Period
    const currentAppointments = allAppointments.filter((app) => {
      const appDate = new Date(app.date);
      return appDate >= startDate && appDate <= now;
    });

    // Filter appointments for Previous Period (for trends)
    const prevAppointments = allAppointments.filter((app) => {
      const appDate = new Date(app.date);
      return appDate >= prevStartDate && appDate <= prevEndDate;
    });

    // Filter expenses for Current Period
    const currentExpenses = allExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= startDate && expDate <= now;
    });

    // Filter expenses for Previous Period
    const prevExpenses = allExpenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= prevStartDate && expDate <= prevEndDate;
    });

    // --- Services Price Map ---
    const services = await Service.find();
    const servicePriceMap = {};
    services.forEach((s) => {
      servicePriceMap[s.name] = s.price;
    });

    // --- Calculate Metrics Helper ---
    const calculateMetrics = (apps) => {
      let revenue = 0;
      const serviceRev = {};
      const chartMap = {};

      apps.forEach((app) => {
        if (app.status !== "Cancelled") {
          const price = app.price || servicePriceMap[app.service] || 0;
          revenue += price;

          // Category Breakdown
          if (app.category) {
            serviceRev[app.category] = (serviceRev[app.category] || 0) + price;
          }

          // Chart Data
          const appDate = new Date(app.date);
          let key;
          if (period === "year") {
            key = appDate.toLocaleString("default", { month: "short" });
          } else {
            key = appDate.getDate();
          }
          chartMap[key] = (chartMap[key] || 0) + price;
        }
      });
      return { revenue, serviceRev, chartMap, count: apps.length };
    };

    const currentMetrics = calculateMetrics(currentAppointments);
    const prevMetrics = calculateMetrics(prevAppointments);

    // --- Calculate Expenses ---
    const calculateExpenseMetrics = (expenses) => {
      let total = 0;
      const categoryBreakdown = {};
      expenses.forEach((exp) => {
        total += exp.amount;
        categoryBreakdown[exp.category] =
          (categoryBreakdown[exp.category] || 0) + exp.amount;
      });
      return { total, categoryBreakdown };
    };

    const currentExpenseMetrics = calculateExpenseMetrics(currentExpenses);
    const prevExpenseMetrics = calculateExpenseMetrics(prevExpenses);

    // --- Calculate Trends ---
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const change = ((current - previous) / previous) * 100;
      return (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
    };

    const revenueTrend = calculateTrend(
      currentMetrics.revenue,
      prevMetrics.revenue,
    );
    const countTrend = calculateTrend(currentMetrics.count, prevMetrics.count);
    const expenseTrend = calculateTrend(
      currentExpenseMetrics.total,
      prevExpenseMetrics.total,
    );

    // --- New Clients ---
    let clientQuery = { createdAt: { $gte: startDate, $lte: now } };
    let prevClientQuery = {
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
    };
    if (branchId) {
      clientQuery.branchId = branchId;
      prevClientQuery.branchId = branchId;
    }

    const newClientsCount = await Client.countDocuments(clientQuery);
    const prevClientsCount = await Client.countDocuments(prevClientQuery);
    const clientTrend = calculateTrend(newClientsCount, prevClientsCount);

    // --- Avg Transaction ---
    const avgTransaction =
      currentMetrics.count > 0
        ? Math.round(currentMetrics.revenue / currentMetrics.count)
        : 0;
    const prevAvgTransaction =
      prevMetrics.count > 0
        ? Math.round(prevMetrics.revenue / prevMetrics.count)
        : 0;
    const avgTrend = calculateTrend(avgTransaction, prevAvgTransaction);

    // --- Chart Data Formatting ---
    let chartData = [];
    if (period === "year") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      chartData = months.map((m) => ({
        label: m,
        value: currentMetrics.chartMap[m] || 0,
      }));
    } else {
      chartData = Object.keys(currentMetrics.chartMap).map((k) => ({
        label: k,
        value: currentMetrics.chartMap[k],
      }));
      // Sort by date (numeric key)
      chartData.sort((a, b) => parseInt(a.label) - parseInt(b.label));
    }

    // --- Recent Transactions ---
    // Take top 5 from all appointments for this branch
    const recentApts = allAppointments.slice(0, 5).map((app) => ({
      id: app._id,
      client: app.customerName,
      service: app.service,
      amount: app.price || servicePriceMap[app.service] || 0,
      date: app.date,
      time: app.time,
      status: app.status,
      stylist: app.staff,
      phone: app.phone,
      type: "Service",
      avatar: app.customerName ? app.customerName.charAt(0).toUpperCase() : "?",
    }));

    // --- Dashboard Specific Stats (Today's Data) ---
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD

    const todayAppointments = allAppointments.filter(
      (app) => app.date === todayString,
    );

    const todayStats = {
      total: todayAppointments.length,
      confirmed: todayAppointments.filter((app) => app.status === "Confirmed")
        .length,
      pending: todayAppointments.filter((app) => app.status === "Pending")
        .length,
      completed: todayAppointments.filter((app) => app.status === "Completed")
        .length,
      cancelled: todayAppointments.filter((app) => app.status === "Cancelled")
        .length,
      checkedIn: todayAppointments.filter((app) => app.status === "Checked In")
        .length, // Assuming 'Checked In' status exists or mapped
      waiting: todayAppointments.filter((app) => app.status === "Waiting")
        .length, // Assuming 'Waiting' status exists
    };

    // Active Staff Count
    const activeStaffCount = await Staff.countDocuments({
      branchId: branchId,
      status: "active",
    });

    const staffMembers = await Staff.find({ branchId }).select(
      "name role status",
    ); // Fetch simple list

    // Total Active Clients (All time for branch)
    const activeClientsCount = await Client.countDocuments(
      branchId ? { branchId } : {},
    );

    // --- Final Response ---
    const summary = {
      totalRevenue: currentMetrics.revenue,
      totalExpenses: currentExpenseMetrics.total,
      netRevenue: currentMetrics.revenue - currentExpenseMetrics.total,
      totalAppointments: currentMetrics.count,
      newClients: newClientsCount,
      activeClients: activeClientsCount,
      activeStaff: activeStaffCount,
      avgTransaction,
      serviceRevenue: currentMetrics.serviceRev,
      expenseBreakdown: currentExpenseMetrics.categoryBreakdown,
      chartData,
      recentTransactions: recentApts,
      todayStats, // NEW: For Dashboard cards
      staffMembers, // NEW: For staff widget
      trends: {
        revenue: revenueTrend,
        appointments: countTrend,
        clients: clientTrend,
        avg: avgTrend,
        expenses: expenseTrend,
      },
      period,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};
