import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Award, Settings, FileText, ChevronRight, CheckCircle, ListPlus, Loader2, Sparkles, Trash2, Edit3, Calendar, Clock, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useExamTypes, useCreateExamType, useUpdateExamType, useDeleteExamType, useReportCards, useGenerateReportCard, usePublishReportCard, useClassAnalytics, useExamSchedules, useUpsertExamSchedule, useDeleteExamSchedule } from '../hooks/useGradebook';
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

  // 3. Exam Schedule State
  const [scheduleClass, setScheduleClass] = useState('');
  const [scheduleExamType, setScheduleExamType] = useState('');
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ subject: '', date: '', startTime: '', endTime: '', room: '' });

  // Queries
  const { data: examTypes = [], isLoading: examLoading } = useExamTypes();
  const createExamMutation = useCreateExamType();
  const updateExamMutation = useUpdateExamType();
  const deleteExamMutation = useDeleteExamType();
  
  const generateMutation = useGenerateReportCard();
  const publishMutation = usePublishReportCard();

  // Schedules Queries & Mutations
  const { data: schedulesList = [], refetch: refetchSchedules } = useExamSchedules({
    classId: scheduleClass,
    examTypeId: scheduleExamType
  });

  const upsertScheduleMutation = useUpsertExamSchedule();
  const deleteScheduleMutation = useDeleteExamSchedule();

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

  // Fetch all subjects for schedule builder
  const { data: subjects = [] } = useQuery({
    queryKey: ['adminSubjects'],
    queryFn: async () => {
      const res = await api.get('/subjects');
      return res.data.data;
    }
  });

  // Load existing schedule slots if they exist
  useEffect(() => {
    if (scheduleClass && scheduleExamType && schedulesList && schedulesList.length > 0) {
      const match = schedulesList.find(s => s.class?._id === scheduleClass && s.examType?._id === scheduleExamType);
      if (match) {
        setScheduleSlots(match.timetable.map(slot => ({
          subject: slot.subject?._id || slot.subject,
          date: slot.date ? new Date(slot.date).toISOString().split('T')[0] : '',
          startTime: slot.startTime,
          endTime: slot.endTime,
          room: slot.room || ''
        })));
      } else {
        setScheduleSlots([]);
      }
    } else {
      setScheduleSlots([]);
    }
  }, [scheduleClass, scheduleExamType, schedulesList]);

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

  const handleSaveSchedule = () => {
    if (!scheduleClass || !scheduleExamType) return;
    upsertScheduleMutation.mutate({
      classId: scheduleClass,
      examTypeId: scheduleExamType,
      timetable: scheduleSlots
    });
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
          { id: 'exam-types', label: 'Exam Configuration', icon: Settings },
          { id: 'schedules', label: 'Exam Timetables', icon: Calendar }
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

        {activeTab === 'schedules' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form category panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Select Schedule Target
                </h3>

                {/* Class select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Unit</label>
                  <select
                    value={scheduleClass}
                    onChange={(e) => setScheduleClass(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c._id}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>

                {/* Exam type select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Category</label>
                  <select
                    value={scheduleExamType}
                    onChange={(e) => setScheduleExamType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-xs cursor-pointer"
                  >
                    <option value="">Select Exam Category</option>
                    {examTypes.map(et => (
                      <option key={et._id} value={et._id}>{et.name}</option>
                    ))}
                  </select>
                </div>
              </Card>
            </div>

            {/* Timetable Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {scheduleClass && scheduleExamType ? (
                <Card className="p-6 bg-white rounded-[2rem] border border-slate-200/60 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800">Timetable Slots</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Configure subject dates, times, and exam rooms.
                      </p>
                    </div>
                    {schedulesList && schedulesList.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this schedule?')) {
                            deleteScheduleMutation.mutate(schedulesList[0]._id);
                          }
                        }}
                        className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Schedule
                      </button>
                    )}
                  </div>

                  {/* Slot Creator */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <h5 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      Add Exam Slot
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Subject Select */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                        <select
                          value={newSlot.subject}
                          onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 text-xs cursor-pointer font-semibold"
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(sub => (
                            <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                        <input
                          type="date"
                          value={newSlot.date}
                          onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 text-xs font-semibold"
                        />
                      </div>

                      {/* Start Time */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 09:00 AM"
                          value={newSlot.startTime}
                          onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 text-xs font-semibold"
                        />
                      </div>

                      {/* End Time */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End Time</label>
                        <input
                          type="text"
                          placeholder="e.g. 12:00 PM"
                          value={newSlot.endTime}
                          onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 text-xs font-semibold"
                        />
                      </div>

                      {/* Room */}
                      <div className="space-y-1 col-span-1 sm:col-span-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Room / Hall</label>
                        <input
                          type="text"
                          placeholder="e.g. Examination Hall A"
                          value={newSlot.room}
                          onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-700 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!newSlot.subject || !newSlot.date || !newSlot.startTime || !newSlot.endTime) {
                          alert('Please fill out Subject, Date, Start Time, and End Time.');
                          return;
                        }
                        setScheduleSlots([...scheduleSlots, newSlot]);
                        setNewSlot({ subject: '', date: '', startTime: '', endTime: '', room: '' });
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-indigo-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to List
                    </button>
                  </div>

                  {/* List of slots */}
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Scheduled Exam Slots ({scheduleSlots.length})</h5>

                    <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                      {scheduleSlots.map((slot, idx) => {
                        const subObj = subjects.find(s => s._id === slot.subject);
                        return (
                          <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</p>
                                <p className="font-extrabold text-slate-800 text-xs mt-0.5">{subObj?.name || 'Unknown'} ({subObj?.code || slot.subject})</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                <p className="font-bold text-slate-700 text-xs mt-0.5">{slot.date}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                                <p className="font-bold text-slate-700 text-xs mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {slot.startTime} - {slot.endTime}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room</p>
                                <p className="font-bold text-slate-700 text-xs mt-0.5">{slot.room || 'N/A'}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setScheduleSlots(scheduleSlots.filter((_, i) => i !== idx))}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}

                      {scheduleSlots.length === 0 && (
                        <div className="p-8 text-center text-slate-400 font-bold text-xs italic bg-white">
                          No slots added to this schedule yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={handleSaveSchedule}
                      disabled={upsertScheduleMutation.isPending || scheduleSlots.length === 0}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer"
                    >
                      {upsertScheduleMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Exam Schedule
                    </button>
                  </div>
                </Card>
              ) : (
                <div className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 py-32 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">Exam Timetable Setup</h3>
                  <p className="text-slate-500 mt-2 max-w-sm mx-auto text-xs">
                    Select a class and exam category in the left pane to configure dates, rooms, and timetables for exams.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

