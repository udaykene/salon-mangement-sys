import React from "react";
import ReceptionistSidebar from './ReceptionistSidebar';

const ReceptionistLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f4f7fe] flex"> {/* Added flex here */}
      <ReceptionistSidebar/>

      <main className="flex-1 h-screen ">
        {children}
      </main>
    </div>
  );
};

export default ReceptionistLayout;
