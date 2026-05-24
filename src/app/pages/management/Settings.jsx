import { useState } from "react";
import {
  Settings as SettingsIcon,
  School,
  Bell,
  Lock,
  Globe,
  Database,
  Shield,
  Clock,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [activeTab, setActiveTab] = useState(isAdmin ? "general" : "notifications");
  return <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage system preferences and configurations</p>
      </div>

      {
    /* Tabs */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            ...(isAdmin ? [{ id: "general", label: "General", icon: SettingsIcon }] : []),
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            ...(isAdmin ? [{ id: "system", label: "System", icon: Database }] : [])
          ].map((tab) => (
            <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
  >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "general" && isAdmin && <div className="space-y-6">
              {
    /* School Information */
  }
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <School className="w-5 h-5" />
                  School Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">School Name</label>
                    <input
    type="text"
    defaultValue="Delhi Public School"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
    type="email"
    defaultValue="info@dpsschool.edu.in"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
    type="tel"
    defaultValue="+91 11 2345 6789"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    <textarea
    rows={3}
    defaultValue="Sector 24, Rohini, New Delhi - 110085"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                  </div>
                </div>
              </div>

              {
    /* Academic Year */
  }
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Academic Year Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Academic Year</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>2025-2026</option>
                      <option>2026-2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Session Start Date</label>
                    <input
    type="date"
    defaultValue="2025-04-01"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                  </div>
                </div>
              </div>

              {
    /* Time Zone */
  }
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Regional Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Zone</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Save Changes
                </button>
              </div>
            </div>}

          {activeTab === "notifications" && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {[
    { label: "Email Notifications", description: "Receive email updates for important events" },
    { label: "SMS Alerts", description: "Get SMS notifications for critical updates" },
    { label: "Push Notifications", description: "Browser push notifications for real-time updates" },
    { label: "Daily Digest", description: "Receive a daily summary of all activities" },
    { label: "Attendance Alerts", description: "Notify when student attendance is below threshold" },
    { label: "Fee Reminders", description: "Automatic reminders for pending fee payments" }
  ].map((setting, idx) => <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{setting.label}</p>
                        <p className="text-sm text-slate-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                      </label>
                    </div>)}
                </div>
              </div>
            </div>}

          {activeTab === "security" && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
    type="password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
    type="password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
    type="password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Two-Factor Authentication
                </h3>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Enable 2FA</p>
                      <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Update Password
                </button>
              </div>
            </div>}

          {activeTab === "system" && isAdmin && <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Information
                </h3>
                <div className="space-y-3">
                  {[
    { label: "System Version", value: "v2.4.1" },
    { label: "Last Updated", value: "February 1, 2026" },
    { label: "Database Size", value: "2.4 GB" },
    { label: "Total Users", value: "1,332" },
    { label: "Active Sessions", value: "245" }
  ].map((item, idx) => <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900">{item.label}</span>
                      <span className="text-slate-600">{item.value}</span>
                    </div>)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Maintenance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                    <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-medium text-slate-900">Backup Database</p>
                    <p className="text-sm text-slate-500">Create system backup</p>
                  </button>
                  <button className="p-4 border-2 border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                    <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-medium text-slate-900">Clear Cache</p>
                    <p className="text-sm text-slate-500">Improve performance</p>
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}
