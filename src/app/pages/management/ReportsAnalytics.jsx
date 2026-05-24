import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  Calendar,
  Download,
  FileText
} from "lucide-react";
export function ReportsAnalytics() {
  const reportTypes = [
    {
      id: 1,
      name: "Student Performance Report",
      description: "Detailed academic performance analysis by class and subject",
      icon: Award,
      color: "bg-blue-500",
      lastGenerated: "2026-02-05"
    },
    {
      id: 2,
      name: "Attendance Report",
      description: "Monthly attendance statistics and trends",
      icon: Users,
      color: "bg-green-500",
      lastGenerated: "2026-02-07"
    },
    {
      id: 3,
      name: "Fee Collection Report",
      description: "Revenue collection and pending payments analysis",
      icon: TrendingUp,
      color: "bg-purple-500",
      lastGenerated: "2026-02-06"
    },
    {
      id: 4,
      name: "Teacher Performance Report",
      description: "Teaching effectiveness and student feedback summary",
      icon: GraduationCap,
      color: "bg-orange-500",
      lastGenerated: "2026-02-04"
    },
    {
      id: 5,
      name: "Admission Pipeline Report",
      description: "Enrollment trends and conversion metrics",
      icon: FileText,
      color: "bg-pink-500",
      lastGenerated: "2026-02-03"
    },
    {
      id: 6,
      name: "Monthly Summary Report",
      description: "Comprehensive monthly overview of all activities",
      icon: Calendar,
      color: "bg-indigo-500",
      lastGenerated: "2026-02-01"
    }
  ];
  const keyMetrics = [
    { label: "Student Enrollment", current: "1,245", previous: "1,200", change: "+3.8%", trend: "up" },
    { label: "Avg Attendance", current: "92.8%", previous: "90.7%", change: "+2.3%", trend: "up" },
    { label: "Academic Performance", current: "76.8%", previous: "73.6%", change: "+4.3%", trend: "up" },
    { label: "Fee Collection", current: "79.4%", previous: "75.2%", change: "+5.6%", trend: "up" }
  ];
  return <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Generate and view institutional reports and insights</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5" />
          Export All
        </button>
      </div>

      {
    /* Key Metrics */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {keyMetrics.map((metric, idx) => <div key={idx} className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">{metric.current}</p>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-slate-500">vs last month</span>
              </div>
            </div>)}
        </div>
      </div>

      {
    /* Chart Placeholder */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Performance Trends</h2>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Interactive charts and visualizations</p>
            <p className="text-sm text-slate-400 mt-1">Data visualization would appear here</p>
          </div>
        </div>
      </div>

      {
    /* Report Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className={`${report.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <report.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">{report.name}</h3>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
              <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString("en-IN")}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Generate
              </button>
              <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>

      {
    /* Quick Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-blue-100 text-sm mb-1">Total Students</p>
          <p className="text-4xl font-bold mb-2">1,245</p>
          <p className="text-sm text-blue-100">Across 32 classes</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <GraduationCap className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-green-100 text-sm mb-1">Teaching Staff</p>
          <p className="text-4xl font-bold mb-2">87</p>
          <p className="text-sm text-green-100">45 full-time, 42 part-time</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Award className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-purple-100 text-sm mb-1">Academic Excellence</p>
          <p className="text-4xl font-bold mb-2">76.8%</p>
          <p className="text-sm text-purple-100">School average performance</p>
        </div>
      </div>
    </div>;
}
