import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: "ri-dashboard-3-line",
      path: "/admin/dashboard",
    },
    {
      title: "Appointments",
      icon: "ri-calendar-check-line",
      path: "/admin/appointments",
    },
    { title: "Clients", icon: "ri-user-heart-line", path: "/admin/clients" },
    { title: "Walk-Ins", icon: "ri-user-add-line", path: "/admin/walkins" },
    { title: "Services", icon: "ri-scissors-2-line", path: "/admin/services" },
    { title: "Branches", icon: "ri-store-2-line", path: "/admin/branches" },
    { title: "Staff", icon: "ri-team-line", path: "/admin/staff" },
    {
      title: "Attendance",
      icon: "ri-calendar-check-fill",
      path: "/admin/attendance",
    },
    { title: "Offers", icon: "ri-gift-line", path: "/admin/offers" },
    { title: "Inbox", icon: "ri-mail-line", path: "/admin/inbox" },
    {
      title: "Revenue Reports",
      icon: "ri-line-chart-line",
      path: "/admin/revenue-reports",
    },
    {
      title: "Expenses",
      icon: "ri-wallet-3-line",
      path: "/admin/expenses",
    },
    { title: "Settings", icon: "ri-settings-3-line", path: "/admin/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all">
              <span className="text-white text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Admin Panel</h3>
              <p className="text-xs text-gray-500">Skin & Soul Studio</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow"
                    : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                }`}
              >
                <i className={`${item.icon} text-xl`} />
                <span className="font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="p-3 border-t border-gray-200">
        <Link
          to="/admin/profile"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive("/admin/profile")
              ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow"
              : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
            <i className="ri-user-line text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Admin</p>
            <p className="text-xs opacity-75 truncate">Admin Dashboard</p>
          </div>
          <i className="ri-arrow-right-s-line text-lg" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ===== Mobile Header ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white flex items-center px-4 z-50 border-b border-gray-200">
        <button onClick={() => setOpen(true)}>
          <i className="ri-menu-2-line text-2xl text-gray-700" />
        </button>
        <div className="ml-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-md">
            <span className="text-white text-sm">✨</span>
          </div>
          <h2 className="font-semibold">Admin Panel</h2>
        </div>
      </div>

      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden lg:flex! lg:flex-col fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50">
        <SidebarContent />
      </aside>

      {/* ===== Mobile Sidebar Drawer ===== */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition ${
          open ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-white transform transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent />
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;
