import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
export function DashboardLayout({ children, userRole }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return <div className="min-h-screen bg-background flex">
      <Sidebar
    userRole={userRole}
    isCollapsed={isSidebarCollapsed}
    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
  />
      
      <div className="flex-1 flex flex-col">
        <Navbar userRole={userRole} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>;
}
