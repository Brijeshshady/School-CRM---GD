import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  FileText,
  TrendingUp,
  BarChart3,
  Plus
} from "lucide-react";
export function AcademicsManagement() {
  const [selectedTab, setSelectedTab] = useState("subjects");
  const subjects = [
    { id: 1, name: "Mathematics", class: "10-A", teacher: "Mrs. Anjali Gupta", students: 42, avgScore: 78.5, completion: 82 },
    { id: 2, name: "Physics", class: "10-A", teacher: "Ms. Priya Sharma", students: 42, avgScore: 75.2, completion: 78 },
    { id: 3, name: "Chemistry", class: "10-A", teacher: "Ms. Priya Sharma", students: 42, avgScore: 72.8, completion: 75 },
    { id: 4, name: "English", class: "10-A", teacher: "Ms. Meera Iyer", students: 42, avgScore: 81.3, completion: 85 },
    { id: 5, name: "History", class: "10-A", teacher: "Mr. Rahul Roy", students: 42, avgScore: 76.9, completion: 80 }
  ];
  const exams = [
    { id: 1, name: "Unit Test 2", subject: "Mathematics", class: "10-A", date: "2026-02-12", time: "09:00 AM", duration: "2 hours", status: "scheduled" },
    { id: 2, name: "Mid Term", subject: "Physics", class: "10-A", date: "2026-02-15", time: "10:00 AM", duration: "3 hours", status: "scheduled" },
    { id: 3, name: "Unit Test 2", subject: "Chemistry", class: "10-A", date: "2026-02-18", time: "09:00 AM", duration: "2 hours", status: "scheduled" },
    { id: 4, name: "Quiz", subject: "English", class: "10-A", date: "2026-02-20", time: "11:00 AM", duration: "1 hour", status: "scheduled" }
  ];
  const stats = [
    { label: "Total Subjects", value: "28", icon: BookOpen, color: "bg-blue-500", change: "Across all classes" },
    { label: "Active Teachers", value: "45", icon: Users, color: "bg-green-500", change: "5 substitutes" },
    { label: "Avg Performance", value: "76.8%", icon: TrendingUp, color: "bg-purple-500", change: "+3.2% this term" },
    { label: "Upcoming Exams", value: "12", icon: Calendar, color: "bg-orange-500", change: "Next 2 weeks" }
  ];
  return <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Academics Management</h1>
          <p className="text-slate-600 mt-1">Manage subjects, curriculum, and academic performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{stat.change}</p>
          </div>)}
      </div>

      {
    /* Tabs */
  }
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200">
          {[
    { id: "subjects", label: "Subjects" },
    { id: "curriculum", label: "Curriculum" },
    { id: "exams", label: "Exams" },
    { id: "performance", label: "Performance" }
  ].map((tab) => <button
    key={tab.id}
    onClick={() => setSelectedTab(tab.id)}
    className={`px-6 py-4 font-medium transition-all ${selectedTab === tab.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
  >
              {tab.label}
            </button>)}
        </div>

        <div className="p-6">
          {selectedTab === "subjects" && <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {subjects.map((subject) => <div key={subject.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{subject.name}</h3>
                          <p className="text-sm text-slate-500">Class {subject.class} • {subject.teacher}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">{subject.students} students</p>
                        <p className="text-lg font-bold text-slate-900">{subject.avgScore}%</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600">Curriculum Completion</span>
                        <span className="font-medium text-slate-900">{subject.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
    className="bg-blue-500 h-2 rounded-full"
    style={{ width: `${subject.completion}%` }}
  />
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}

          {selectedTab === "exams" && <div className="space-y-4">
              {exams.map((exam) => <div key={exam.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{exam.name}</h3>
                        <p className="text-sm text-slate-500">{exam.subject} • Class {exam.class}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(exam.date).toLocaleDateString("en-IN")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        {exam.time} • {exam.duration}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>}

          {(selectedTab === "curriculum" || selectedTab === "performance") && <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>Detailed {selectedTab} view</p>
              <p className="text-sm mt-2">Interactive charts and data visualization</p>
            </div>}
        </div>
      </div>
    </div>;
}
