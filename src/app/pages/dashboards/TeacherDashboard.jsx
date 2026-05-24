import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
export function TeacherDashboard() {
  const todayClasses = [
    { time: "09:00 AM", subject: "Mathematics", class: "Grade 10A", room: "201", status: "ongoing" },
    { time: "11:00 AM", subject: "Physics", class: "Grade 11B", room: "305", status: "upcoming" },
    { time: "02:00 PM", subject: "Mathematics", class: "Grade 10B", room: "201", status: "upcoming" }
  ];
  const recentActivity = [
    { action: "Attendance marked for Grade 10A", time: "30 min ago" },
    { action: "Assignment submitted by 28 students", time: "2 hours ago" },
    { action: "Parent meeting scheduled", time: "5 hours ago" }
  ];
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Prof. Smith</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">My Classes</span>
          </div>
          <div className="text-3xl font-bold">8</div>
          <p className="text-sm text-muted-foreground mt-1">Active classes</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-medium">Today's Classes</span>
          </div>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-muted-foreground mt-1">Scheduled for today</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <span className="font-medium">Attendance</span>
          </div>
          <div className="text-3xl font-bold">94%</div>
          <p className="text-sm text-muted-foreground mt-1">Average this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todayClasses.map((cls, idx) => <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className="text-center">
                  <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm font-medium">{cls.time}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{cls.subject}</div>
                  <div className="text-sm text-muted-foreground">{cls.class} • Room {cls.room}</div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${cls.status === "ongoing" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                  {cls.status === "ongoing" ? "Ongoing" : "Upcoming"}
                </span>
              </div>)}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => <div key={idx} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all">
            <CheckCircle className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Mark Attendance</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition-all">
            <Calendar className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium">View Timetable</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all">
            <Users className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium">My Students</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-chart-4 hover:bg-chart-4/5 transition-all">
            <Clock className="w-6 h-6 text-chart-4" />
            <span className="text-sm font-medium">Assignments</span>
          </button>
        </div>
      </div>
    </div>;
}
