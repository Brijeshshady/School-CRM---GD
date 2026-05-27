import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, BookOpen, BarChart3, FileText, Loader2, Sparkles, Calendar, Clock } from 'lucide-react';
import { useStudentAnalytics, useExamGrades, useReportCards, useExamSchedules } from '../hooks/useGradebook';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { ReportCardPrintable } from '../components/ReportCardPrintable';
import api from '../../../lib/api';

export const StudentGradebook = () => {
  const [activeTab, setActiveTab] = useState('grades');

  // 1. Fetch student profile to get student._id
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const res = await api.get('/students/profile');
      return res.data.data;
    }
  });

  const studentId = profile?._id;
  const classId = profile?.class?._id;

  // 2. Fetch grades, report cards, analytics, and schedules
  const { data: grades = [], isLoading: gradesLoading } = useExamGrades({ studentId });
  const { data: reportCards = [], isLoading: reportCardsLoading } = useReportCards({ studentId });
  const { data: analytics, isLoading: analyticsLoading } = useStudentAnalytics(studentId);
  const { data: examSchedules = [], isLoading: schedulesLoading } = useExamSchedules({ classId });

  const activeReportCard = reportCards[0]; // Get latest compiled report card

  const isLoading = profileLoading || gradesLoading || reportCardsLoading || analyticsLoading || schedulesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm font-bold text-slate-600">Retrieving academic profile & compiled evaluations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Academic Performance Portal</h1>
            <p className="text-slate-400 font-semibold mt-1">
              Check your published marks, progress trends, and compile final report cards.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-5 py-3.5 rounded-2xl border border-white/15 backdrop-blur-md">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="block text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Latest GPA Score</span>
              <span className="font-extrabold text-sm">{activeReportCard?.gpa?.toFixed(2) || 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'grades', label: 'Subject Performance', icon: BookOpen },
          { id: 'analytics', label: 'Growth Analytics', icon: BarChart3 },
          { id: 'report-card', label: 'Official Report Card', icon: FileText },
          { id: 'timetable', label: 'Exam Timetable', icon: Calendar }
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

      {/* Tab Contents */}
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
                      <th className="p-4">Remarks</th>
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
                <p className="font-bold text-slate-800">No grades are currently published for you.</p>
                <p className="text-xs text-slate-400 mt-1">Please check back once evaluations are compiled.</p>
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
                <p className="font-bold text-slate-800">Report Card Not Compiled Yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Your class teacher has not compiled or published the final report card transcript for this term.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="space-y-6">
            {examSchedules.length > 0 ? (
              examSchedules.map((schedule, idx) => (
                <div key={idx} className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">{schedule.examType?.name} Schedule</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Academic Year: {schedule.academicYear}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 font-extrabold uppercase text-slate-500">
                        <tr>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Exam Date</th>
                          <th className="p-3">Timing</th>
                          <th className="p-3">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {schedule.timetable?.map((slot, sIdx) => (
                          <tr key={sIdx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{slot.subject?.name} ({slot.subject?.code})</td>
                            <td className="p-3 text-slate-600">{slot.date ? new Date(slot.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</td>
                            <td className="p-3 text-slate-600 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {slot.startTime} - {slot.endTime}
                            </td>
                            <td className="p-3 text-slate-600">{slot.room || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-bold text-slate-800">No Exam Timetables Configured</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Schedules for your upcoming examinations have not been uploaded by the administration yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

