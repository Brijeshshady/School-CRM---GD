import { Building2, DollarSign, Users, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
export function SuperAdminDashboard() {
  const kpiData = [
    { title: "Total Schools", value: "523", change: "+15%", icon: Building2, color: "bg-primary" },
    { title: "Active Plans", value: "487", change: "+8%", icon: Users, color: "bg-secondary" },
    { title: "Monthly Revenue", value: "$125,450", change: "+12%", icon: DollarSign, color: "bg-accent" },
    { title: "Growth Rate", value: "23%", change: "+5%", icon: TrendingUp, color: "bg-chart-4" }
  ];
  const revenueData = [
    { month: "Jan", revenue: 95e3, schools: 450 },
    { month: "Feb", revenue: 105e3, schools: 465 },
    { month: "Mar", revenue: 98e3, schools: 478 },
    { month: "Apr", revenue: 115e3, schools: 492 },
    { month: "May", revenue: 12e4, schools: 508 },
    { month: "Jun", revenue: 125e3, schools: 523 }
  ];
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SaaS Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide metrics and school management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
    const Icon = kpi.icon;
    return <div key={kpi.title} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${kpi.color.replace("bg-", "text-")}`} />
                </div>
                <span className="text-sm font-medium text-accent">{kpi.change}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
            </div>;
  })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">School Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }} />
              <Bar dataKey="schools" fill="#14B8A6" radius={[8, 8, 0, 0]} name="Active Schools" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Schools</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-sm">School Name</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Students</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-sm">MRR</th>
              </tr>
            </thead>
            <tbody>
              {[
    { name: "Springfield High", plan: "Professional", students: 1247, status: "Active", mrr: "$299" },
    { name: "Oakwood Academy", plan: "Enterprise", students: 2156, status: "Active", mrr: "$599" },
    { name: "Riverside School", plan: "Basic", students: 456, status: "Active", mrr: "$99" }
  ].map((school, idx) => <tr key={idx} className="border-b border-border hover:bg-muted/30">
                  <td className="py-3 px-4">{school.name}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{school.plan}</span>
                  </td>
                  <td className="py-3 px-4">{school.students}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">{school.status}</span>
                  </td>
                  <td className="py-3 px-4 font-medium">{school.mrr}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
