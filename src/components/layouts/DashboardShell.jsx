import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SharedSidebar } from "./SharedSidebar";
import { SharedTopbar } from "./SharedTopbar";

export const DashboardShell = ({ menuItems, roleName, sidebarFooter, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SharedSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        menuItems={menuItems} 
        roleName={roleName}
        sidebarFooter={sidebarFooter}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <SharedTopbar 
          setSidebarOpen={setSidebarOpen} 
          menuItems={menuItems} 
        />
        
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
