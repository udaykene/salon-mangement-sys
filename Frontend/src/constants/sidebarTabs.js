// Central configuration for receptionist sidebar tabs
export const SIDEBAR_TABS = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "ri-dashboard-3-line",
    path: "/receptionist/dashboard",
  },
  {
    id: "appointments",
    title: "Appointments",
    icon: "ri-calendar-check-line",
    path: "/receptionist/appointments",
  },
  {
    id: "inventory",
    title: "Inventory",
    icon: "ri-inbox-archive-line",
    path: "/receptionist/inventory",
  },
  {
    id: "check-in-out",
    title: "Check In/Out",
    icon: "ri-login-circle-line",
    path: "/receptionist/checkin",
  },
  {
    id: "walk-ins",
    title: "Walk-ins",
    icon: "ri-user-add-line",
    path: "/receptionist/walkins",
  },
  {
    id: "clients",
    title: "Clients",
    icon: "ri-user-heart-line",
    path: "/receptionist/clients",
  },
  {
    id: "services",
    title: "Services",
    icon: "ri-scissors-2-line",
    path: "/receptionist/services",
  },
  {
    id: "staff-availability",
    title: "Staff Availability",
    icon: "ri-team-line",
    path: "/receptionist/staff",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: "ri-calendar-check-fill",
    path: "/receptionist/attendance",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: "ri-notification-line",
    path: "/receptionist/notifications",
  },
];

// Get all tab IDs
export const getAllTabIds = () => SIDEBAR_TABS.map((tab) => tab.id);

// Get default allowed tabs (all tabs)
export const getDefaultAllowedTabs = () => getAllTabIds();