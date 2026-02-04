import React from "react";

const AdminMobileHeader = ({ onMenuClick, isOpen }) => {
  return (
    <div className={`sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm lg:hidden ${isOpen ? 'z-[50]' : 'z-[80]'}`}>
      <button
        onClick={onMenuClick}
        className="text-2xl text-gray-700 hover:text-amber-600 transition-colors"
        aria-label="Open menu"
      >
        <i className="ri-menu-line"></i>
      </button>
      <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
      <div className="w-8"></div> {/* Spacer for centering */}
    </div>
  );
};

export default AdminMobileHeader;