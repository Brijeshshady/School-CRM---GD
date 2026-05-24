import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NotificationDropdown } from "../../features/notifications/components/NotificationDropdown";

export const SharedTopbar = ({ setSidebarOpen, menuItems }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Find the single most specific active item for the title
  const getActiveMenu = () => {
    // 1. Direct path/prefix matching (most specific first)
    const sortedItems = [...menuItems].sort((a, b) => b.path.length - a.path.length);
    const active = sortedItems.find(item => 
      currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'))
    );
    if (active) return active;

    // 2. Base-segment matching fallback
    const pathSegments = currentPath.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      const matchBySegment = menuItems.find(item => {
        const itemSegments = item.path.split('/').filter(Boolean);
        const itemLastSegment = itemSegments[itemSegments.length - 1];
        return (
          item.id === lastSegment || 
          itemLastSegment === lastSegment || 
          (lastSegment === 'tickets' && item.id === 'support') ||
          (lastSegment === 'support' && item.id === 'tickets') ||
          (lastSegment === 'chat' && item.id === 'communications') ||
          (lastSegment === 'communications' && item.id === 'chat')
        );
      });
      if (matchBySegment) return matchBySegment;
    }

    return { label: "Dashboard" };
  };

  const activeMenu = getActiveMenu();

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {activeMenu.label}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
        </div>
      </header>
    </>
  );
};
