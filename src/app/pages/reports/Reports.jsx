import { BarChart3, TrendingUp, Download, FileText, Calendar } from "lucide-react";
export function Reports() {
  const reportCategories = [
    {
      title: "Admissions Reports",
      icon: TrendingUp,
      color: "bg-primary",
      reports: ["Conversion Funnel", "Lead Sources", "Monthly Admissions", "Enquiry Analytics"]
    },
    {
      title: "Attendance Reports",
      icon: Calendar,
      color: "bg-secondary",
      reports: ["Daily Attendance", "Monthly Summary", "Class-wise Report", "Absentee List"]
    },
    {
      title: "Fee Reports",
      icon: FileText,
      color: "bg-accent",
      reports: ["Fee Collection", "Pending Fees", "Overdue Payments", "Revenue Analysis"]
    },
    {
      title: "Academic Reports",
      icon: BarChart3,
      color: "bg-chart-4",
      reports: ["Grade Analysis", "Performance Trends", "Subject-wise Report", "Student Rankings"]
    }
  ];
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and download comprehensive reports</p>
      </div>

      {
    /* Quick Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Reports Generated</div>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Scheduled Reports</div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground mt-1">Active</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Downloads</div>
          <div className="text-2xl font-bold">856</div>
          <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-sm text-muted-foreground mb-1">Report Types</div>
          <div className="text-2xl font-bold">16</div>
          <p className="text-xs text-muted-foreground mt-1">Available</p>
        </div>
      </div>

      {
    /* Report Categories */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category) => {
    const Icon = category.icon;
    return <div key={category.title} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${category.color} bg-opacity-10 p-2 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${category.color.replace("bg-", "text-")}`} />
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
              <div className="space-y-2">
                {category.reports.map((report) => <button
      key={report}
      className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-all group"
    >
                    <span className="text-sm font-medium">{report}</span>
                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>)}
              </div>
            </div>;
  })}
      </div>

      {
    /* Custom Report Builder */
  }
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Custom Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Report Type</label>
            <select className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Admissions Report</option>
              <option>Attendance Report</option>
              <option>Fee Collection Report</option>
              <option>Academic Performance</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Start Date</label>
            <input
    type="date"
    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">End Date</label>
            <input
    type="date"
    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
  />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            Preview
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-5 h-5" />
            Generate Report
          </button>
          <select className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <option>Export as PDF</option>
            <option>Export as Excel</option>
            <option>Export as CSV</option>
          </select>
        </div>
      </div>
    </div>;
}
