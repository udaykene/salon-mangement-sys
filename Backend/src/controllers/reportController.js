import { Appointment } from "../models/Appointment.js";
import { Client } from "../models/Client.js";
import Service from "../models/services.model.js";

export const getReportSummary = async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'year'

        const now = new Date();
        let startDate = new Date();

        if (period === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (period === 'year') {
            startDate.setFullYear(now.getFullYear() - 1);
        } else {
            startDate.setMonth(now.getMonth() - 1); // Default to month
        }

        // Fetch all appointments in the period
        // Note: Appointment date is stored as String YYYY-MM-DD, strict comparison might be tricky with timezone
        // but for now let's assume simple string comparison or fetch all and filter
        const allAppointments = await Appointment.find();

        const filteredAppointments = allAppointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate >= startDate && appDate <= now;
        });

        // Fetch all services to get prices
        const services = await Service.find();
        const servicePriceMap = {};
        services.forEach(s => {
            servicePriceMap[s.name] = s.price;
        });

        // Calculate Revenue, Service Breakdown, and Chart Data
        let totalRevenue = 0;
        const serviceRevenue = {}; // { 'Hair': 500, 'Nails': 200 }
        const chartDataMap = {}; // { '2025-01-01': 500 } (date -> revenue)

        filteredAppointments.forEach(app => {
            if (app.status !== 'Cancelled') {
                const price = servicePriceMap[app.service] || 0;
                totalRevenue += price;

                // Breakdown by Category
                if (!serviceRevenue[app.category]) {
                    serviceRevenue[app.category] = 0;
                }
                serviceRevenue[app.category] += price;

                // Chart Data Aggregation
                const appDate = new Date(app.date);
                let key;
                if (period === 'year') {
                    key = appDate.toLocaleString('default', { month: 'short' }); // "Jan"
                } else {
                    // For week/month, group by day
                    key = appDate.getDate(); // 1, 2, 3...
                }

                chartDataMap[key] = (chartDataMap[key] || 0) + price;
            }
        });

        // Format Chart Data
        let chartData = [];
        if (period === 'year') {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            chartData = months.map(m => ({
                label: m,
                value: chartDataMap[m] || 0
            }));
        } else {
            // For week/month, just show days where we have data or fill gaps (simplified)
            // Simplified: just passing what we have, frontend can map
            chartData = Object.keys(chartDataMap).map(k => ({
                label: k,
                value: chartDataMap[k]
            }));
        }

        // Fetch New Clients in period
        const newClients = await Client.countDocuments({
            createdAt: { $gte: startDate, $lte: now }
        });

        // Calculate Trend (Mocking strictly for demo, real implementation needs previous period comparison)
        const trend = "+12.5%";

        // Prepare Response
        const summary = {
            totalRevenue,
            totalAppointments: filteredAppointments.length,
            newClients,
            serviceRevenue,
            chartData,
            period
        };

        res.status(200).json(summary);

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Error generating report" });
    }
};
