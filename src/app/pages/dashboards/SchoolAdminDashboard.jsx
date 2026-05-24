import { Users, GraduationCap, DollarSign, UserPlus, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
export function SchoolAdminDashboard() {
  const kpiData = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-primary"
    },
    {
      title: "Teachers",
      value: "87",
      change: "+5%",
      trend: "up",
      icon: GraduationCap,
      color: "bg-secondary"
    },
    {
      title: "Pending Fees",
      value: "$45,230",
      change: "-8%",
      trend: "down",
      icon: DollarSign,
      color: "bg-accent"
    },
    {
      title: "Admission Leads",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: UserPlus,
      color: "bg-chart-4"
    }
  ];
  const feeCollectionData = [
    { month: "Jan", collected: 45e3, pending: 12e3 },
    { month: "Feb", collected: 52e3, pending: 8e3 },
    { month: "Mar", collected: 48e3, pending: 15e3 },
    { month: "Apr", collected: 61e3, pending: 9e3 },
    { month: "May", collected: 55e3, pending: 11e3 },
    { month: "Jun", collected: 67e3, pending: 7e3 }
  ];
  const admissionFunnelData = [
    { stage: "Enquiry", count: 450 },
    { stage: "Follow-up", count: 320 },
    { stage: "Test", count: 185 },
    { stage: "Interview", count: 142 },
    { stage: "Confirmed", count: 98 }
  ];
  const attendanceData = [
    { name: "Grade 1", present: 92, absent: 8 },
    { name: "Grade 2", present: 88, absent: 12 },
    { name: "Grade 3", present: 95, absent: 5 },
    { name: "Grade 4", present: 89, absent: 11 },
    { name: "Grade 5", present: 93, absent: 7 }
  ];
  const COLORS = ["#3B82F6", "#14B8A6", "#10B981", "#8B5CF6", "#F59E0B"];
  const recentActivities = [
    { id: 1, action: "New admission inquiry received", time: "5 min ago", type: "admission" },
    { id: 2, action: "Fee payment of $2,500 received", time: "15 min ago", type: "payment" },
    { id: 3, action: "Class 10A attendance marked", time: "1 hour ago", type: "attendance" },
    { id: 4, action: "Parent-teacher meeting scheduled", time: "2 hours ago", type: "event" }
  ];
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening in your school today.</p>
      </div>

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
    const Icon = kpi.icon;
    const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
    return <div key={kpi.title} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${kpi.color.replace("bg-", "text-")}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === "up" ? "text-accent" : "text-destructive"}`}>
                  <TrendIcon className="w-4 h-4" />
                  {kpi.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
            </div>;
  })}
      </div>

      {
    /* Charts Row 1 */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
    /* Fee Collection Chart */
  }
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Fee Collection Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={feeCollectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
  />
              <Legend />
              <Area type="monotone" dataKey="collected" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Collected" />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {
    /* Admission Funnel */
  }
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Admission Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={admissionFunnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" stroke="#64748B" />
              <YAxis type="category" dataKey="stage" stroke="#64748B" />
              <Tooltip
    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
  />
              <Bar dataKey="count" fill="#14B8A6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {
    /* Charts Row 2 */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {
    /* Attendance Overview */
  }
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
  />
              <Legend />
              <Bar dataKey="present" fill="#10B981" radius={[8, 8, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="#EF4444" radius={[8, 8, 0, 0]} name="Absent %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {
    /* Recent Activities */
  }
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => <div key={activity.id} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === "admission" ? "bg-primary" : activity.type === "payment" ? "bg-accent" : activity.type === "attendance" ? "bg-secondary" : "bg-chart-4"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>)}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
            View All Activities
          </button>
        </div>
      </div>

      {
    /* Quick Actions */
  }
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all">
            <UserPlus className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Add Student</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition-all">
            <GraduationCap className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium">Add Teacher</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all">
            <DollarSign className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium">Collect Fee</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-chart-4 hover:bg-chart-4/5 transition-all">
            <Calendar className="w-6 h-6 text-chart-4" />
            <span className="text-sm font-medium">Schedule Event</span>
          </button>
        </div>
      </div>
    </div>;
}
