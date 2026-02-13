import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        phone: "",
        category: "",
        service: "",
        staff: "Any",
        date: "",
        time: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const categories = {
        Hair: ["Haircut", "Hair Spa", "Coloring"],
        Skin: ["Facial", "Cleanup"],
        Nails: ["Manicure", "Pedicure"],
        Makeup: ["Party Makeup", "Bridal Makeup"],
    };

    const staffOptions = [
        "Any",
        "Sarah (Senior Stylist)",
        "Mike (Top Barber)",
        "Jessica (Nail Artist)",
        "Emily (Makeup Artist)",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Reset service if category changes
            ...(name === "category" ? { service: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("http://localhost:3000/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: "Appointment booked successfully!" });
                setFormData({
                    customerName: "",
                    email: "",
                    phone: "",
                    category: "",
                    service: "",
                    staff: "Any",
                    date: "",
                    time: "",
                    notes: "",
                });
                setTimeout(() => navigate("/"), 3000); // Redirect after 3s
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "Something went wrong.",
                });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to connect to the server." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-2">
                        Book Your Appointment
                    </h2>
                    <p className="text-rose-100">
                        Fill in the details below to schedule your visit.
                    </p>
                </div>

                <div className="p-8 sm:p-12">
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex items-center ${message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                        >
                            <i
                                className={`ri-${message.type === "success"
                                        ? "checkbox-circle-line"
                                        : "error-warning-line"
                                    } text-xl mr-2`}
                            ></i>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-user-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="text"
                                        name="customerName"
                                        required
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-phone-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-mail-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-6"></div>

                        {/* Service Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Category
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-function-line text-gray-400"></i>
                                    </div>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors appearance-none bg-white"
                                    >
                                        <option value="">Select Category</option>
                                        {Object.keys(categories).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Service
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-sparkling-line text-gray-400"></i>
                                    </div>
                                    <select
                                        name="service"
                                        required
                                        value={formData.service}
                                        onChange={handleChange}
                                        disabled={!formData.category}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">Select Service</option>
                                        {formData.category &&
                                            categories[formData.category].map((svc) => (
                                                <option key={svc} value={svc}>
                                                    {svc}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Staff (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-user-star-line text-gray-400"></i>
                                    </div>
                                    <select
                                        name="staff"
                                        value={formData.staff}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors appearance-none bg-white"
                                    >
                                        {staffOptions.map((staff) => (
                                            <option key={staff} value={staff}>
                                                {staff}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                        <i className="ri-arrow-down-s-line"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-calendar-event-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="ri-time-line text-gray-400"></i>
                                    </div>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors"
                                placeholder="Any specific requests or allergies?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all transform hover:-translate-y-0.5 ${loading ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Confirm Booking"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
