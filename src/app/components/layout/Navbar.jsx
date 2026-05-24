import { useState } from "react";
import { Bell, Search, User, ChevronDown, LogOut, Settings, HelpCircle } from "lucide-react";
export function Navbar({ userRole }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const getRoleLabel = (role) => {
    const labels = {
      "super-admin": "Super Admin",
      "school-admin": "School Admin",
      "teacher": "Teacher",
      "parent": "Parent"
    };
    return labels[role];
  };
  const notifications = [
    { id: 1, title: "New admission request", time: "5 min ago", unread: true },
    { id: 2, title: "Fee payment received", time: "1 hour ago", unread: true },
    { id: 3, title: "Attendance updated", time: "2 hours ago", unread: false }
  ];
  return <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {
    /* Search */
  }
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
    type="text"
    placeholder="Search students, teachers, or records..."
    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background"
  />
        </div>
      </div>

      {
    /* Right Section */
  }
      <div className="flex items-center gap-4 ml-4">
        {
    /* Notifications */
  }
        <div className="relative">
          <button
    onClick={() => {
      setShowNotifications(!showNotifications);
      setShowProfileMenu(false);
    }}
    className="relative p-2 hover:bg-muted rounded-lg transition-colors"
  >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {showNotifications && <>
              <div
    className="fixed inset-0 z-10"
    onClick={() => setShowNotifications(false)}
  />
              <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-20">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => <div
    key={notification.id}
    className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer ${notification.unread ? "bg-primary/5" : ""}`}
  >
                      <div className="flex items-start gap-3">
                        {notification.unread && <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>)}
                </div>
                <div className="p-3 text-center border-t border-border">
                  <button className="text-sm text-primary hover:underline font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            </>}
        </div>

        {
    /* Help */
  }
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>

        {
    /* Profile */
  }
        <div className="relative">
          <button
    onClick={() => {
      setShowProfileMenu(!showProfileMenu);
      setShowNotifications(false);
    }}
    className="flex items-center gap-3 hover:bg-muted rounded-lg transition-colors pl-3 pr-2 py-1.5"
  >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-muted-foreground">{getRoleLabel(userRole)}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showProfileMenu && <>
              <div
    className="fixed inset-0 z-10"
    onClick={() => setShowProfileMenu(false)}
  />
              <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-lg shadow-lg border border-border z-20">
                <div className="p-3 border-b border-border">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">admin@school.com</div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>
                <div className="p-2 border-t border-border">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-left text-destructive">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </div>
            </>}
        </div>
      </div>
    </div>;
}
