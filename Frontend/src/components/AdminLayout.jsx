import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f4f7fe] flex"> {/* Added flex here */}
      <AdminSidebar />

      <main className="flex-1 h-screen ">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
