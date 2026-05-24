import React, { useState } from 'react';
import { Award, BookOpen, BarChart3, FileText, Loader2, Sparkles, AlertCircle, ChevronDown } from 'lucide-react';
import { useParentStudentData } from '../../parent-dashboard/hooks/useParentData';
import { useStudentAnalytics, useExamGrades, useReportCards } from '../hooks/useGradebook';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { ReportCardPrintable } from '../components/ReportCardPrintable';

export const ParentGradebook = () => {
  const [activeTab, setActiveTab] = useState('grades');
  
  // 1. Fetch linked students and current student selection
  const { linkedStudents, selectedStudentId, setSelectedStudentId, isLoading: parentLoading } = useParentStudentData();

  // 2. Fetch specific student academic records
  const { data: grades = [], isLoading: gradesLoading } = useExamGrades({ studentId: selectedStudentId });
  const { data: reportCards = [], isLoading: reportCardsLoading } = useReportCards({ studentId: selectedStudentId });
  const { data: analytics, isLoading: analyticsLoading } = useStudentAnalytics(selectedStudentId);

  const activeReportCard = reportCards[0]; // Get latest compiled report card
  const currentStudentName = linkedStudents.find(s => s._id === selectedStudentId)?.user?.name || 'Child';

  const isLoading = parentLoading || gradesLoading || reportCardsLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-bold text-slate-600">Retrieving academic profile & child evaluation databases...</p>
      </div>
    );
  }

  if (linkedStudents.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border border-slate-200 max-w-lg mx-auto mt-20">
        <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-wider">No Student Linked</h3>
        <p className="text-slate-500 mt-2 font-semibold">Please contact school administration to link your child's account to this portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title block with selection dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Progress Portal</h1>
          <p className="text-slate-500 font-semibold mt-1">Monitor grades, visual progression trends, and final transcripts.</p>
        </div>
        
        {linkedStudents.length > 1 && (
          <div className="relative">
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 appearance-none pr-10 cursor-pointer text-xs uppercase tracking-wider transition-all"
            >
              {linkedStudents.map(student => (
                <option key={student._id} value={student._id}>
                  {student.user?.name} ({student.rollNumber || 'Roll N/A'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Child Summary Stats Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full font-bold text-[10px] text-slate-300 uppercase tracking-widest mb-2">Academic Overview</span>
            <h2 className="text-2xl font-black tracking-tight">{currentStudentName}</h2>
            <p className="text-slate-400 font-medium text-xs mt-1">
              Roll No: {linkedStudents.find(s => s._id === selectedStudentId)?.rollNumber || 'N/A'} • Enrolled Student
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl border border-white/15 backdrop-blur-md">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="block text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Cumulative GPA</span>
              <span className="font-extrabold text-sm">{activeReportCard?.gpa?.toFixed(2) || 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'grades', label: 'Subject Performance', icon: BookOpen },
          { id: 'analytics', label: 'Growth Analytics', icon: BarChart3 },
          { id: 'report-card', label: 'Official Report Card', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 font-bold text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-slate-900 text-slate-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'grades' && (
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
            {grades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 font-extrabold uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Exam Term</th>
                      <th className="p-4 text-center">Marks</th>
                      <th className="p-4 text-center">Percentage</th>
                      <th className="p-4 text-center">Grade</th>
                      <th className="p-4">Teacher Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {grades.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-950">{g.subject?.name}</td>
                        <td className="p-4 font-medium text-slate-500">{g.examType?.name}</td>
                        <td className="p-4 text-center font-bold text-slate-800">
                          {g.totalObtained} / {g.totalMax}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-bold ${
                            g.percentage >= 80 ? 'text-emerald-600' : g.percentage >= 60 ? 'text-indigo-600' : 'text-rose-600'
                          }`}>
                            {g.percentage}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-black">
                            {g.grade}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-500 italic">{g.remarks || 'No remarks added'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-bold text-slate-800">No grades are currently published for your child.</p>
                <p className="text-xs text-slate-400 mt-1">Evaluations will display here as they are published by faculties.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsCharts analyticsData={analytics} />
        )}

        {activeTab === 'report-card' && (
          <div>
            {activeReportCard ? (
              <ReportCardPrintable reportCard={activeReportCard} />
            ) : (
              <div className="text-center py-24 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-bold text-slate-800">Report Card Not Published</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  The terminal transcript and compilation report card for {currentStudentName} has not been published yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
