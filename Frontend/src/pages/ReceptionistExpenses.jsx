import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../components/ReceptionistLayout";
import expenseService from "../services/expenseService";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ReceptionistExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get branchId from user context
  const branchId = user?.branchId?._id || user?.branchId;

  useEffect(() => {
    if (branchId) {
      fetchExpenses();
      fetchBranches();
    }
  }, [branchId]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // Receptionist only sees expenses for their branch
      const data = await expenseService.getExpenses({ branchId });
      setExpenses(data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/branches/my-branches",
      );
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  return (
    <ReceptionistLayout>
      <main className="bg-white min-h-screen lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Salon Expenses
          </h1>
          <p className="text-gray-600">View expenses for your branch</p>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 italic">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="4" className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded w-full"></div>
                        </td>
                      </tr>
                    ))
                ) : expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 capitalize">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {expense.description || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500 italic"
                    >
                      No expenses found for this branch
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </ReceptionistLayout>
  );
};

export default ReceptionistExpenses;
