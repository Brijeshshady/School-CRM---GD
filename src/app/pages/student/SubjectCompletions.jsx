import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  FileText,
  Trophy,
  X,
  Printer
} from "lucide-react";
import { mockSubjectCompletions } from "../../data/mockData";
export const SubjectCompletions = () => {
  const [selectedSubjectForReport, setSelectedSubjectForReport] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState(/* @__PURE__ */ new Set(["sub1"]));
  const toggleSubject = (subjectId) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
  };
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };
  const getProgressTextColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };
  const overallCompletion = mockSubjectCompletions && mockSubjectCompletions.length > 0
    ? Math.round(mockSubjectCompletions.reduce((sum, subject) => sum + subject.percentage, 0) / mockSubjectCompletions.length)
    : 0;
  return <div className="min-h-screen bg-slate-50">
      {
    /* Hero Section */
  }
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center max-w-3xl mx-auto"
  >
            <h1 className="text-4xl font-bold mb-4">Subject Progress Tracker</h1>
            <p className="text-lg text-purple-100 mb-8">
              Track your learning journey across all subjects. Complete units and achieve milestones!
            </p>
          </motion.div>

          {
    /* Overall Progress Card */
  }
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto"
  >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Overall Progress</h2>
                  <p className="text-purple-100 text-sm">Across all subjects</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{overallCompletion}%</p>
                <p className="text-xs text-purple-100">Complete</p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
    className="bg-white h-3 rounded-full transition-all duration-500"
    style={{ width: `${overallCompletion}%` }}
  />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {
    /* Subject Cards */
  }
        <div className="space-y-4">
          {mockSubjectCompletions.map((subject, index) => {
    const isExpanded = expandedSubjects.has(subject.id);
    return <motion.div
      key={subject.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
    >
                {
      /* Subject Header */
    }
                <button
      onClick={() => toggleSubject(subject.id)}
      className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
    >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{subject.subject}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-slate-500">
                          {subject.completedUnits} of {subject.totalUnits} units completed
                        </p>
                        <span className="text-xs text-slate-400">•</span>
                        <div className="flex items-center gap-1.5 text-sm text-blue-600">
                          <Target className="w-4 h-4" />
                          <span className="text-xs">{subject.nextMilestone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {
      /* Progress Bar */
    }
                    <div className="w-32 hidden md:block">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold ${getProgressTextColor(subject.percentage)}`}>
                          {subject.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
      className={`h-2 rounded-full transition-all ${getProgressColor(subject.percentage)}`}
      style={{ width: `${subject.percentage}%` }}
    />
                      </div>
                    </div>

                    {
      /* Mobile percentage */
    }
                    <div className="md:hidden">
                      <span className={`text-xl font-bold ${getProgressTextColor(subject.percentage)}`}>
                        {subject.percentage}%
                      </span>
                    </div>

                    {
      /* Expand Icon */
    }
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                    </div>
                  </div>
                </button>

                {
      /* Expanded Units List */
    }
                {isExpanded && <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-t border-slate-100 bg-slate-50"
    >
                    <div className="p-6 space-y-2">
                      {(subject.units || []).map((unit, unitIndex) => <div
      key={unit.id}
      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${unit.completed ? "bg-white border border-green-100" : "bg-white border border-slate-100 opacity-70"}`}
    >
                          {
      /* Completion Icon */
    }
                          <div className="flex-shrink-0">
                            {unit.completed ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <Circle className="w-6 h-6 text-slate-300" />}
                          </div>

                          {
      /* Unit Info */
    }
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${unit.completed ? "text-slate-900" : "text-slate-500"}`}>
                              {unit.name}
                            </p>
                            {unit.completed && unit.quizScore && <div className="flex items-center gap-2 mt-1">
                                <Award className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-xs text-blue-600 font-medium">
                                  Quiz Score: {unit.quizScore}%
                                </span>
                              </div>}
                          </div>

                          {
      /* Unit Number */
    }
                          <div className="text-xs font-medium text-slate-400">
                            #{unitIndex + 1}
                          </div>
                        </div>)}
                    </div>

                    {
      /* Subject Footer Actions */
    }
                    <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
                      <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm">
                        <FileText className="w-4 h-4" />
                        View Study Materials
                      </button>
                      <button 
                        onClick={() => setSelectedSubjectForReport(subject)}
                        className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <TrendingUp className="w-4 h-4" />
                        View Progress Report
                      </button>
                    </div>
                  </motion.div>}
              </motion.div>;
  })}
        </div>

        {
    /* Achievement Badges */
  }
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="font-semibold text-slate-900">Physics Master</p>
                <p className="text-xs text-slate-600">Completed 12 units</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <p className="font-semibold text-slate-900">Math Champion</p>
                <p className="text-xs text-slate-600">14 units completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="font-semibold text-slate-900">Consistent Learner</p>
                <p className="text-xs text-slate-600">7 day streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedSubjectForReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:static print:bg-white print:p-0">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 print:shadow-none print:w-full print:max-w-none print:rounded-none">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Academic Progress Report</h2>
                  <p className="text-sm text-slate-500">Official subject completion details</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSubjectForReport(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Report Content */}
            <div className="p-8 space-y-6 print:p-0">
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{selectedSubjectForReport.subject}</h1>
                  <p className="text-sm text-slate-500 mt-1">Course Progress Summary • Academic Year 2026</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-2xl font-black ${getProgressTextColor(selectedSubjectForReport.percentage)}`}>
                    {selectedSubjectForReport.percentage}%
                  </span>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completion Score</p>
                </div>
              </div>

              {/* Progress Summary Stats */}
              <div className="grid grid-cols-3 gap-4 text-center print:grid-cols-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 print:bg-white print:border-slate-300">
                  <p className="text-2xl font-bold text-slate-900">{selectedSubjectForReport.completedUnits}</p>
                  <p className="text-xs text-slate-500 mt-1">Completed Units</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 print:bg-white print:border-slate-300">
                  <p className="text-2xl font-bold text-slate-900">{selectedSubjectForReport.totalUnits - selectedSubjectForReport.completedUnits}</p>
                  <p className="text-xs text-slate-500 mt-1">Remaining Units</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 print:bg-white print:border-slate-300">
                  <p className="text-2xl font-bold text-slate-900">{selectedSubjectForReport.nextMilestone ? "Active" : "N/A"}</p>
                  <p className="text-xs text-slate-500 mt-1">Milestone Status</p>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Detailed Unit Breakdown</h3>
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Quiz Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedSubjectForReport.units?.map((unit, idx) => (
                        <tr key={unit.id || idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-900">{unit.name}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${unit.completed ? 'text-green-600' : 'text-slate-400'}`}>
                              {unit.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-semibold text-slate-700">
                            {unit.quizScore ? `${unit.quizScore}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 print:hidden">
              <button 
                onClick={() => setSelectedSubjectForReport(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-950/10"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>;
};
