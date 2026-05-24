import { useParams } from "react-router-dom";
import { User, Mail, Phone, MapPin, Calendar, Award, Activity } from "lucide-react";
export function StudentProfile() {
  const { id } = useParams();
  const tabs = ["Overview", "Attendance", "Academics", "Fees", "Communication"];
  const activeTab = "Overview";
  return <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
            JS
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">John Smith</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Roll: 1001</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <span>Grade 10A</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>DOB: 15/05/2008</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-accent">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="flex gap-6">
          {tabs.map((tab) => <button
    key={tab}
    className={`pb-3 border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}
  >
              {tab}
            </button>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>john.smith@school.com</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>+1 555-0101</span>
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>123 Main St, Springfield, CA 12345</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Academic Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">A</div>
                <div className="text-sm text-muted-foreground mt-1">Current Grade</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <div className="text-3xl font-bold text-secondary">96%</div>
                <div className="text-sm text-muted-foreground mt-1">Attendance</div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold text-accent">#5</div>
                <div className="text-sm text-muted-foreground mt-1">Class Rank</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Father</label>
                <div className="font-medium">Michael Smith</div>
                <div className="text-sm text-muted-foreground">+1 555-0101</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Mother</label>
                <div className="font-medium">Sarah Smith</div>
                <div className="text-sm text-muted-foreground">+1 555-0102</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Fees</span>
                <span className="font-medium">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Paid</span>
                <span className="font-medium text-accent">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Balance</span>
                <span className="font-medium">$0</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-block w-full px-3 py-2 bg-accent/10 text-accent text-center rounded-lg text-sm font-medium">
                Fully Paid
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
