import { User, Calendar, DollarSign, BookOpen, TrendingUp } from "lucide-react";
export function ParentDashboard() {
  const children = [
    {
      name: "Emma Johnson",
      class: "Grade 10A",
      attendance: "96%",
      fees: "Paid",
      avatar: "E"
    }
  ];
  const upcomingEvents = [
    { date: "Jan 28", title: "Parent-Teacher Meeting", time: "10:00 AM" },
    { date: "Feb 01", title: "Science Fair", time: "2:00 PM" },
    { date: "Feb 05", title: "Sports Day", time: "9:00 AM" }
  ];
  const recentAnnouncements = [
    { title: "Mid-term Exam Schedule Released", time: "2 days ago" },
    { title: "School Picnic on March 15th", time: "5 days ago" },
    { title: "New Library Books Available", time: "1 week ago" }
  ];
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your child's progress and activities</p>
      </div>

      {
    /* Child Overview */
  }
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">My Children</h3>
        {children.map((child, idx) => <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {child.avatar}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{child.name}</h4>
              <p className="text-sm text-muted-foreground">{child.class}</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              View Profile
            </button>
          </div>)}
      </div>

      {
    /* Stats Grid */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Attendance</span>
          </div>
          <div className="text-3xl font-bold">96%</div>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <span className="font-medium">Academic</span>
          </div>
          <div className="text-3xl font-bold">A</div>
          <p className="text-sm text-muted-foreground mt-1">Average Grade</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-secondary" />
            </div>
            <span className="font-medium">Fees</span>
          </div>
          <div className="text-3xl font-bold text-accent">Paid</div>
          <p className="text-sm text-muted-foreground mt-1">Q1 2024</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-chart-4/10 rounded-lg">
              <Calendar className="w-5 h-5 text-chart-4" />
            </div>
            <span className="font-medium">Events</span>
          </div>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-muted-foreground mt-1">Upcoming</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
    /* Upcoming Events */
  }
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, idx) => <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className="text-center">
                  <div className="text-sm font-medium text-primary">{event.date.split(" ")[0]}</div>
                  <div className="text-2xl font-bold">{event.date.split(" ")[1]}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {event.time}
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {
    /* Recent Announcements */
  }
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            {recentAnnouncements.map((announcement, idx) => <div key={idx} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium mb-1">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground">{announcement.time}</p>
                </div>
              </div>)}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
            View All Announcements
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
            <User className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">View Profile</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition-all">
            <Calendar className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium">Exam Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all">
            <DollarSign className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium">Pay Fees</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-chart-4 hover:bg-chart-4/5 transition-all">
            <BookOpen className="w-6 h-6 text-chart-4" />
            <span className="text-sm font-medium">Report Card</span>
          </button>
        </div>
      </div>
    </div>;
}
