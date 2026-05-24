import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getLetterGrade, calculatePercentage } from '../utils/gradeCalculations';
import { useUpsertExamGrades } from '../hooks/useGradebook';

export const GradebookTable = ({ classId, subjectId, examTypeId, roster = [], initialGrades = [] }) => {
  const [grades, setGrades] = useState({});
  const [maxMarks, setMaxMarks] = useState({
    theory: 100,
    practical: 0,
    assignment: 0,
    attendance: 0,
    viva: 0
  });

  const upsertMutation = useUpsertExamGrades();

  // Populate initial values
  useEffect(() => {
    const gradesMap = {};
    
    // Default config values
    let theoryMax = 100;
    let practicalMax = 0;
    let assignmentMax = 0;
    let attendanceMax = 0;
    let vivaMax = 0;

    roster.forEach(student => {
      const match = initialGrades.find(g => g.student?._id === student._id || g.student === student._id);
      
      if (match) {
        gradesMap[student._id] = {
          marks: {
            theory: match.marks?.theory || 0,
            practical: match.marks?.practical || 0,
            assignment: match.marks?.assignment || 0,
            attendance: match.marks?.attendance || 0,
            viva: match.marks?.viva || 0
          },
          remarks: match.remarks || ''
        };
        
        // Grab maximum marks structure from existing records if present
        if (match.maxMarks) {
          theoryMax = match.maxMarks.theory || 0;
          practicalMax = match.maxMarks.practical || 0;
          assignmentMax = match.maxMarks.assignment || 0;
          attendanceMax = match.maxMarks.attendance || 0;
          vivaMax = match.maxMarks.viva || 0;
        }
      } else {
        gradesMap[student._id] = {
          marks: { theory: 0, practical: 0, assignment: 0, attendance: 0, viva: 0 },
          remarks: ''
        };
      }
    });

    setGrades(gradesMap);
    setMaxMarks({
      theory: theoryMax,
      practical: practicalMax,
      assignment: assignmentMax,
      attendance: attendanceMax,
      viva: vivaMax
    });
  }, [roster, initialGrades]);

  const handleMarkChange = (studentId, component, value) => {
    const numericVal = Math.max(0, Math.min(Number(value) || 0, maxMarks[component]));
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: {
          ...prev[studentId].marks,
          [component]: numericVal
        }
      }
    }));
  };

  const handleRemarksChange = (studentId, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: value
      }
    }));
  };

  const handleMaxMarksChange = (component, value) => {
    const numericVal = Math.max(0, Number(value) || 0);
    setMaxMarks(prev => ({
      ...prev,
      [component]: numericVal
    }));
  };

  const handleSubmit = (status) => {
    const payload = roster.map(student => {
      const entry = grades[student._id] || { marks: {}, remarks: '' };
      return {
        studentId: student._id,
        marks: entry.marks,
        maxMarks,
        remarks: entry.remarks
      };
    });

    upsertMutation.mutate({
      classId,
      subjectId,
      examTypeId,
      status,
      gradesList: payload
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Weightage Configuration Dashboard */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Exam Weightage Configuration (Max Marks)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {['theory', 'practical', 'assignment', 'attendance', 'viva'].map(comp => (
            <div key={comp} className="space-y-1.5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block capitalize">{comp}</label>
              <input 
                type="number"
                value={maxMarks[comp]}
                onChange={(e) => handleMaxMarksChange(comp, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 text-sm"
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 font-bold mt-3 italic">
          * Set dynamic maximum score parameter to "0" to disable the grading column on the entry roster.
        </p>
      </div>

      {/* Roster Entries Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-extrabold uppercase text-slate-500">
              <tr>
                <th className="p-4">Roll</th>
                <th className="p-4">Student Info</th>
                {maxMarks.theory > 0 && <th className="p-4">Theory (Max {maxMarks.theory})</th>}
                {maxMarks.practical > 0 && <th className="p-4">Practical (Max {maxMarks.practical})</th>}
                {maxMarks.assignment > 0 && <th className="p-4">Assignment (Max {maxMarks.assignment})</th>}
                {maxMarks.attendance > 0 && <th className="p-4">Attendance (Max {maxMarks.attendance})</th>}
                {maxMarks.viva > 0 && <th className="p-4">Viva (Max {maxMarks.viva})</th>}
                <th className="p-4 text-center">Summary</th>
                <th className="p-4">Teacher Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {roster.map(student => {
                const entry = grades[student._id] || { marks: { theory: 0, practical: 0, assignment: 0, attendance: 0, viva: 0 }, remarks: '' };
                
                // Calculate live stats
                let obtained = 0;
                let max = 0;
                ['theory', 'practical', 'assignment', 'attendance', 'viva'].forEach(comp => {
                  if (maxMarks[comp] > 0) {
                    obtained += entry.marks[comp] || 0;
                    max += maxMarks[comp];
                  }
                });

                const percentage = calculatePercentage(obtained, max);
                const grade = getLetterGrade(percentage);

                return (
                  <tr key={student._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">{student.rollNumber || '-'}</td>
                    <td className="p-4">
                      <p className="font-extrabold text-slate-900">{student.user?.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{student.studentId}</p>
                    </td>
                    
                    {maxMarks.theory > 0 && (
                      <td className="p-4">
                        <input 
                          type="number"
                          value={entry.marks.theory}
                          onChange={(e) => handleMarkChange(student._id, 'theory', e.target.value)}
                          className="w-16 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-slate-800 text-sm"
                        />
                      </td>
                    )}
                    {maxMarks.practical > 0 && (
                      <td className="p-4">
                        <input 
                          type="number"
                          value={entry.marks.practical}
                          onChange={(e) => handleMarkChange(student._id, 'practical', e.target.value)}
                          className="w-16 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-slate-800 text-sm"
                        />
                      </td>
                    )}
                    {maxMarks.assignment > 0 && (
                      <td className="p-4">
                        <input 
                          type="number"
                          value={entry.marks.assignment}
                          onChange={(e) => handleMarkChange(student._id, 'assignment', e.target.value)}
                          className="w-16 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-slate-800 text-sm"
                        />
                      </td>
                    )}
                    {maxMarks.attendance > 0 && (
                      <td className="p-4">
                        <input 
                          type="number"
                          value={entry.marks.attendance}
                          onChange={(e) => handleMarkChange(student._id, 'attendance', e.target.value)}
                          className="w-16 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-slate-800 text-sm"
                        />
                      </td>
                    )}
                    {maxMarks.viva > 0 && (
                      <td className="p-4">
                        <input 
                          type="number"
                          value={entry.marks.viva}
                          onChange={(e) => handleMarkChange(student._id, 'viva', e.target.value)}
                          className="w-16 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold text-slate-800 text-sm"
                        />
                      </td>
                    )}

                    <td className="p-4 text-center">
                      <p className="font-extrabold text-slate-900 text-sm">{obtained} / {max}</p>
                      <p className={`text-[10px] font-black ${
                        percentage >= 85 ? 'text-emerald-600' : percentage >= 60 ? 'text-indigo-600' : 'text-rose-600'
                      }`}>
                        {percentage}% ({grade})
                      </p>
                    </td>

                    <td className="p-4">
                      <input 
                        type="text"
                        value={entry.remarks}
                        onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                        placeholder="Add remarks..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 text-[11px]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action controls */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => handleSubmit('draft')}
            disabled={upsertMutation.isPending}
            className="px-5 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-400" />
            Save Draft Roster
          </button>
          
          <button 
            type="button" 
            onClick={() => handleSubmit('published')}
            disabled={upsertMutation.isPending}
            className="px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 rounded-2xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-lg shadow-slate-900/10 transition-all cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-white/90" />
            Publish All Marks
          </button>
        </div>

      </div>
    </div>
  );
};
