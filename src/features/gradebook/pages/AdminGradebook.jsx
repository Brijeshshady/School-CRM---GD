import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, Settings, FileText, ChevronRight, CheckCircle, ListPlus, Loader2, Sparkles, Trash2, Edit3 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useExamTypes, useCreateExamType, useUpdateExamType, useDeleteExamType, useReportCards, useGenerateReportCard, usePublishReportCard, useClassAnalytics } from '../hooks/useGradebook';
import { ReportCardPrintable } from '../components/ReportCardPrintable';
import api from '../../../lib/api';

export const AdminGradebook = () => {
  const [activeTab, setActiveTab] = useState('compiler');
  
  // 1. Report Card Compiler State
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [activeReportCard, setActiveReportCard] = useState(null);

  // 2. Exam Type Configurator State
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeCode, setNewTypeCode] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [editingType, setEditingType] = useState(null);

  // Queries
  const { data: examTypes = [], isLoading: examLoading } = useExamTypes();
  const createExamMutation = useCreateExamType();
  const updateExamMutation = useUpdateExamType();
  const deleteExamMutation = useDeleteExamType();
  
  const generateMutation = useGenerateReportCard();
  const publishMutation = usePublishReportCard();

  // Fetch all classes
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['adminClasses'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data.data;
    }
  });

  // Fetch students by class
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['classStudents', selectedClass],
    queryFn: async () => {
      const res = await api.get('/students', { params: { class: selectedClass } });
      return res.data.data;
    },
    enabled: !!selectedClass
  });

  // Fetch compiled report cards for class
  const { data: compiledReportCards = [], refetch: refetchReportCards } = useReportCards({ classId: selectedClass });

  // Fetch class ranking analytics
  const { data: analytics } = useClassAnalytics(selectedClass, examTypes[0]?._id);

  // Handlers
  const handleCompile = () => {
    if (!selectedStudent || !selectedClass) return;
    generateMutation.mutate({
      studentId: selectedStudent,
      classId: selectedClass,
      teacherRemarks,
      academicYear: '2025-2026',
      term: 'Full Year'
    }, {
      onSuccess: (data) => {
        setActiveReportCard(data);
        setTeacherRemarks('');
        refetchReportCards();
      }
    });
  };

  const handlePublish = (rcId) => {
    publishMutation.mutate(rcId, {
      onSuccess: () => {
        refetchReportCards();
        if (activeReportCard && activeReportCard._id === rcId) {
          setActiveReportCard(prev => ({ ...prev, status: 'published' }));
        }
      }
    });
  };

  const handleCreateExamType = (e) => {
    e.preventDefault();
    if (!newTypeName || !newTypeCode) return;
    createExamMutation.mutate({
      name: newTypeName,
      code: newTypeCode,
      description: newTypeDesc
    }, {
      onSuccess: () => {
        setNewTypeName('');
        setNewTypeCode('');
        setNewTypeDesc('');
      }
    });
  };

  const handleUpdateExamType = (e) => {
    e.preventDefault();
    if (!editingType?.name) return;
    updateExamMutation.mutate({
      id: editingType._id,
      data: {
        name: editingType.name,
        description: editingType.description,
        isActive: editingType.isActive
      }
    }, {
      onSuccess: () => {
        setEditingType(null);
      }
    });
  };

  const handleDeleteExamType = (id) => {
    if (window.confirm('Are you sure you want to delete this exam type?')) {
      deleteExamMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Title Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-12 pointer-events-none">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">Academic Gradebook Management</h1>
          <p className="text-slate-400 font-semibold mt-1">
            Configure dynamic examination categories, compile official term transcripts, and analyze student rankings.
          </p>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'compiler', label: 'Report Card Compiler', icon: FileText },
          { id: 'exam-types', label: 'Exam Configuration', icon: Settings }
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
      <div className="space-y-8">
        {activeTab === 'compiler' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Compiler Settings Block */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2">Compiler Parameters</h3>
                
                {/* Class select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Unit</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudent(''); setActiveReportCard(null); }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>

                {/* Student select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Student</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => { setSelectedStudent(e.target.value); setActiveReportCard(null); }}
                    disabled={!selectedClass}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs disabled:cursor-not-allowed"
                  >
                    <option value="">Select Student</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.user?.name} (Roll: {s.rollNumber})</option>
                    ))}
                  </select>
                </div>

                {/* Remarks Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teacher remarks / suggestions</label>
                  <textarea
                    value={teacherRemarks}
                    onChange={(e) => setTeacherRemarks(e.target.value)}
                    placeholder="Enter academic remarks..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs h-24 resize-none"
                  />
                </div>

                <button
                  onClick={handleCompile}
                  disabled={!selectedStudent || generateMutation.isPending}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {generateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Compile Transcript
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </Card>

              {/* Class rankings summary list */}
              {selectedClass && analytics && (
                <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    Class Rankings
                  </h3>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {analytics.studentRankings?.map((stu, i) => (
                      <div key={stu.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            #{stu.rank}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{stu.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold">Roll No: {stu.rollNumber}</p>
                          </div>
                        </div>
                        <span className="font-black text-xs text-indigo-600">{stu.overallPercentage}%</span>
                      </div>
                    ))}
                    {(!analytics.studentRankings || analytics.studentRankings.length === 0) && (
                      <p className="text-xs text-slate-400 italic">No rankings available</p>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Compiler Working Area */}
            <div className="lg:col-span-2 space-y-6">
              {activeReportCard ? (
                <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800">Transcript Preview</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Status: <span className="uppercase text-slate-700 font-black">{activeReportCard.status}</span></p>
                    </div>
                    {activeReportCard.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(activeReportCard._id)}
                        disabled={publishMutation.isPending}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer"
                      >
                        {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Publish Transcript
                      </button>
                    )}
                  </div>
                  
                  <ReportCardPrintable reportCard={activeReportCard} />
                </Card>
              ) : (
                <div className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 py-32 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">Compile Report Card Workspace</h3>
                  <p className="text-slate-500 mt-2 max-w-sm mx-auto text-xs">
                    Select parameters on the left pane and compile to begin formatting official terminal academic transcripts.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'exam-types' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form category panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ListPlus className="w-5 h-5 text-indigo-600" />
                  {editingType ? 'Modify Exam Type' : 'Add Exam Category'}
                </h3>
                
                <form onSubmit={editingType ? handleUpdateExamType : handleCreateExamType} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                    <input
                      type="text"
                      value={editingType ? editingType.name : newTypeName}
                      onChange={(e) => editingType ? setEditingType({ ...editingType, name: e.target.value }) : setNewTypeName(e.target.value)}
                      placeholder="e.g. Midterm Exams"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Code</label>
                    <input
                      type="text"
                      value={editingType ? editingType.code : newTypeCode}
                      onChange={(e) => editingType ? setEditingType({ ...editingType, code: e.target.value }) : setNewTypeCode(e.target.value)}
                      disabled={!!editingType}
                      placeholder="e.g. midterm"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      value={editingType ? editingType.description : newTypeDesc}
                      onChange={(e) => editingType ? setEditingType({ ...editingType, description: e.target.value }) : setNewTypeDesc(e.target.value)}
                      placeholder="Enter description..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs h-20 resize-none"
                    />
                  </div>

                  {editingType && (
                    <div className="flex items-center gap-2 py-2">
                      <input 
                        type="checkbox" 
                        id="isActive"
                        checked={editingType.isActive}
                        onChange={(e) => setEditingType({ ...editingType, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <label htmlFor="isActive" className="text-xs font-bold text-slate-600">Active status (available to evaluate)</label>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {editingType && (
                      <button
                        type="button"
                        onClick={() => setEditingType(null)}
                        className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {editingType ? 'Update Category' : 'Save Category'}
                    </button>
                  </div>

                </form>
              </Card>
            </div>

            {/* Config categories grid list */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Configured Academic Categories</h3>
                
                <div className="divide-y divide-slate-100">
                  {examTypes.map(type => (
                    <div key={type._id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm">{type.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] border uppercase tracking-wider ${
                            type.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {type.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">Code: {type.code}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{type.description || 'No description provided.'}</p>
                      </div>
                      
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setEditingType(type)}
                          className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExamType(type._id)}
                          className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl border border-slate-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {examTypes.length === 0 && (
                    <div className="text-center py-12 text-slate-400 font-bold text-xs italic">
                      No exam categories configured.
                    </div>
                  )}
                </div>
              </Card>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
