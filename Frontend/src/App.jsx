import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile.jsx";
import Contact from "./pages/Contact.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Activity from "./pages/Activity.jsx";
import History from "./pages/History.jsx";
import Projects from "./pages/Projects.jsx";
import Services from "./pages/Services.jsx";
import Team from "./pages/Team";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProfile from "./pages/AdminProfile";
import AdminAppointments from "./pages/AdminAppointments";
import AdminClients from "./pages/AdminClients.jsx";
import AdminRevenueReports from "./pages/AdminRevenueReports.jsx";
import AdminServices from "./pages/AdminServices.jsx";
import AdminReceptionists from "./pages/AdminReceptionists";
import AdminStaff from "./pages/AdminStaff.jsx";
import AdminOffers from "./pages/AdminOffers";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import AdminBranches from "./pages/AdminBranches";
import ReceptionistDashboard from "./pages/ReceptionistDashboard.jsx";
import { BranchProvider } from "./context/BranchContext.jsx";
import { StaffProvider } from "./context/StaffContext.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ServiceProvider } from "./context/ServiceContext.jsx";
import ReceptionistCheckIn from "./pages/ReceptionistCheckin";
import ReceptionistWalkIns from "./pages/ReceptionistWalkIns";
import ReceptionistAppointments from "./pages/ReceptionistAppointments";
import ReceptionistClients from "./pages/ReceptionistClients";
import ReceptionistServices from "./pages/ReceptionistServices";
import ReceptionistStaff from "./pages/ReceptionistStaff";
import ReceptionistNotifications from "./pages/ReceptionistNotifications";
import Pricing from "./pages/Pricing.jsx";
import AdminInventory from "./pages/Inventory";
import AdminAttendance from "./pages/AdminAttendance";
import ReceptionistAttendance from "./pages/ReceptionistAttendance";
import BookAppointment from "./pages/BookAppointment";
import AdminWalkIn from "./pages/AdminWalkIn";
import ReceptionistReports from "./pages/ReceptionistReports";
import ReceptionistSettings from "./pages/ReceptionistSettings"; // Import the new page

const App = () => {
  const location = useLocation();

  // Check if current route is admin
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isReceptionistRoute = location.pathname.startsWith("/receptionist");
  return (
    <AuthProvider>
      <BranchProvider>
        <CategoryProvider>
          <ServiceProvider>
            <StaffProvider>
              <div className="min-h-screen bg-black flex flex-col">
                {!isAdminRoute && !isReceptionistRoute && <Navbar />}

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/team" element={<Team />} />
                    <Route
                      path="/book-appointment"
                      element={<BookAppointment />}
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/dashboard"
                      element={<AdminDashboard />}
                    />
                    <Route path="/admin/profile" element={<AdminProfile />} />
                    <Route
                      path="/admin/appointments"
                      element={<AdminAppointments />}
                    />
                    <Route path="/admin/clients" element={<AdminClients />} />

                    <Route path="/admin/walkins" element={<AdminWalkIn />} />

                    <Route path="/admin/services" element={<AdminServices />} />
                    <Route path="/admin/staff" element={<AdminStaff />} />
                    <Route path="/admin/branches" element={<AdminBranches />} />
                    <Route
                      path="/admin/revenue-reports"
                      element={<AdminRevenueReports />}
                    />
                    <Route
                      path="/admin/receptionist"
                      element={<AdminReceptionists />}
                    />
                    <Route
                      path="/admin/inbox"
                      element={<AdminNotifications />}
                    />
                    <Route path="/admin/offers" element={<AdminOffers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route
                      path="/admin/attendance"
                      element={<AdminAttendance />}
                    />

                    {/* Receptionist Routes */}
                    <Route
                      path="/receptionist/dashboard"
                      element={<ReceptionistDashboard />}
                    />
                    <Route
                      path="/receptionist/appointments"
                      element={<ReceptionistAppointments />}
                    />
                    <Route
                      path="/receptionist/checkin"
                      element={<ReceptionistCheckIn />}
                    />
                    <Route
                      path="/receptionist/walkins"
                      element={<ReceptionistWalkIns />}
                    />
                    <Route
                      path="/receptionist/clients"
                      element={<ReceptionistClients />}
                    />
                    <Route
                      path="/receptionist/services"
                      element={<ReceptionistServices />}
                    />
                    <Route
                      path="/receptionist/staff"
                      element={<ReceptionistStaff />}
                    />
                    <Route
                      path="/receptionist/notifications"
                      element={<ReceptionistNotifications />}
                    />
                    <Route
                      path="/receptionist/inventory"
                      element={<AdminInventory />}
                    />
                    <Route
                      path="/receptionist/attendance"
                      element={<ReceptionistAttendance />}
                    />
                    <Route
                      path="/receptionist/reports"
                      element={<ReceptionistReports />}
                    />
                    <Route
                      path="/receptionist/settings"
                      element={<ReceptionistSettings />}
                    />

                    {/* Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* Footer only for NON-admin routes */}
                {!isAdminRoute && !isReceptionistRoute && <Footer />}
              </div>
            </StaffProvider>
          </ServiceProvider>
        </CategoryProvider>
      </BranchProvider>
    </AuthProvider>
  );
};

export default App;
