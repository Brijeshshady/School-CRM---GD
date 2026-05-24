import React, { useState } from 'react';
import { Award, TrendingUp, AlertCircle, Loader2, ChevronRight, FileDown, UploadCloud } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useTeacherClasses, useTeacherSubjects } from '../../teacher-dashboard/hooks/useTeacherData';
import { useExamTypes, useExamGrades, useClassAnalytics } from '../hooks/useGradebook';
import { GradebookTable } from '../components/GradebookTable';
import { ExcelImportModal } from '../components/ExcelImportModal';
import { downloadExcelTemplate } from '../utils/gradeCalculations';
import api from '../../../lib/api';
import { useQuery } from '@tanstack/react-query';

export const TeacherGradebook = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [activeParams, setActiveParams] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Queries
  const { data: classes, isLoading: classesLoading } = useTeacherClasses();
  const { data: subjects, isLoading: subjectsLoading } = useTeacherSubjects();
  const { data: examTypes, isLoading: examTypesLoading } = useExamTypes();

  // Student roster query
  const { data: roster = [], isLoading: rosterLoading } = useQuery({
    queryKey: ['roster', activeParams?.classId],
    queryFn: async () => {
      const res = await api.get('/students', { params: { class: activeParams.classId } });
      return res.data.data;
    },
    enabled: !!activeParams?.classId
  });

  // Grades query
  const { data: existingGrades = [], isLoading: gradesLoading, refetch: refetchGrades } = useExamGrades({
    classId: activeParams?.classId,
    subjectId: activeParams?.subjectId,
    examTypeId: activeParams?.examTypeId
  });

  // Analytics query
  const { data: analytics } = useClassAnalytics(
    activeParams?.classId,
    activeParams?.examTypeId
  );

  const handleInitEntry = () => {
    if (!selectedClass || !selectedSubject || !selectedExamType) return;
    setActiveParams({
      classId: selectedClass,
      subjectId: selectedSubject,
      examTypeId: selectedExamType
    });
  };

  const handleDownloadTemplate = () => {
    if (!activeParams || roster.length === 0) return;
    const cls = classes.find(c => c._id === activeParams.classId);
    const sub = subjects.find(s => s._id === activeParams.subjectId);
    const exam = examTypes.find(e => e._id === activeParams.examTypeId);
    
    downloadExcelTemplate(cls?.name || 'Class', sub?.name || 'Subject', exam?.name || 'Exam', roster);
  };

  const classAvg = analytics?.classAverage || 0;
  const eliteCount = analytics?.studentRankings?.filter(r => r.overallPercentage >= 80).length || 0;
  const interventionCount = analytics?.studentRankings?.filter(r => r.overallPercentage < 50).length || 0;

  return (
    <div className="space-y-8">
      {/* Parameter Selection Card */}
      <Card className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Gradebook</h2>
            <p className="text-slate-500 font-semibold mt-1">Manage, evaluate, and publish student terminal grades.</p>
          </div>
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Unit</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Unit</option>
              {classes?.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name} - {cls.section}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Subject</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Subject</option>
              {subjects?.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Type</label>
            <select 
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Exam</option>
              {examTypes?.map((e) => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleInitEntry}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Initialise Entry
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Card>

      {/* Roster entries & controls */}
      {activeParams ? (
        <div className="space-y-8">
          
          {/* Action buttons (Excel Import / Download template) */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-800">Gradebook Workspace</h3>
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full font-bold text-[10px] text-indigo-700 uppercase tracking-wider">
                Active Session
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownloadTemplate}
                className="px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <FileDown className="w-4 h-4 text-slate-400" />
                Template File
              </button>
              
              <button 
                onClick={() => setIsImportOpen(true)}
                className="px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                Spreadsheet Import
              </button>
            </div>
          </div>

          {/* Grades Roster Table */}
          {rosterLoading || gradesLoading ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm font-bold text-slate-600">Retrieving student class roster & marks database...</p>
            </div>
          ) : roster.length > 0 ? (
            <GradebookTable 
              classId={activeParams.classId}
              subjectId={activeParams.subjectId}
              examTypeId={activeParams.examTypeId}
              roster={roster}
              initialGrades={existingGrades}
            />
          ) : (
            <div className="text-center py-24 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm">
              <p className="font-bold text-slate-800">No students are currently linked to this class unit.</p>
            </div>
          )}

          {/* Analytics Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Class Average</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{classAvg}%</p>
                </div>
              </div>
              <Badge variant={classAvg >= 65 ? "success" : "warning"} className="px-4 py-1 rounded-full font-bold text-[10px]">
                {classAvg >= 65 ? "SECURE STANDING" : "IMPROVEMENT TARGET"}
              </Badge>
            </Card>

            <Card className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <Award className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elite Performers</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{eliteCount}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scored above 80%</p>
            </Card>

            <Card className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-200/60 group hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <AlertCircle className="w-7 h-7 text-rose-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical Interventions</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{interventionCount}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Scored below 50%</p>
            </Card>
          </div>

        </div>
      ) : (
        <div className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 py-24 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Award className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Configure Evaluation Parameters</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Select a class, subject, and examination parameters to open the grading workspace.</p>
        </div>
      )}

      {/* Excel Import Modal */}
      {activeParams && (
        <ExcelImportModal 
          isOpen={isImportOpen}
          onClose={() => { setIsImportOpen(false); refetchGrades(); }}
          classId={activeParams.classId}
          className={classes?.find(c => c._id === activeParams.classId)?.name}
          subjectId={activeParams.subjectId}
          subjectName={subjects?.find(s => s._id === activeParams.subjectId)?.name}
          examTypeId={activeParams.examTypeId}
          examTypeName={examTypes?.find(e => e._id === activeParams.examTypeId)?.name}
        />
      )}

    </div>
  );
};
