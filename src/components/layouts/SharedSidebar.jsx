import { X, LogOut } from "lucide-react";
import { useAuth } from "../../app/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const SharedSidebar = ({ sidebarOpen, setSidebarOpen, menuItems, roleName = "Portal", sidebarFooter }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Find the single most specific active item
  const getActiveItemId = () => {
    // 1. Direct path/prefix matching (most specific first)
    const sortedItems = [...menuItems].sort((a, b) => b.path.length - a.path.length);
    const active = sortedItems.find(item => 
      currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path + '/'))
    );
    if (active) return active.id;

    // 2. Base-segment matching fallback (for aligned routes like /students vs /admin/dashboard/students)
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
      if (matchBySegment) return matchBySegment.id;
    }
    return undefined;
  };

  const activeId = getActiveItemId();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static
    `}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">EduMaster</h2>
              <p className="text-xs text-slate-500">{roleName}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleMenuClick}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          {sidebarFooter}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
