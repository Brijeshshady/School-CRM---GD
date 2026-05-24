import React, { useRef } from 'react';
import { Printer, Download, Award, Calendar, CheckSquare, ShieldCheck, User } from 'lucide-react';

export const ReportCardPrintable = ({ reportCard }) => {
  const printAreaRef = useRef();

  if (!reportCard) return null;

  const {
    student = {},
    class: classObj = {},
    academicYear = '',
    term = '',
    subjectGrades = [],
    attendancePercentage = 100,
    overallPercentage = 0,
    gpa = 0,
    classRank,
    classPercentile,
    teacherRemarks = '',
    principalRemarks = ''
  } = reportCard;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Actions toolbar */}
      <div className="flex justify-end gap-3 print:hidden">
        <button 
          onClick={handlePrint}
          className="px-5 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Transcript
        </button>
      </div>

      {/* Report Card A4 Sheet */}
      <div 
        ref={printAreaRef}
        className="bg-white border-2 border-double border-slate-300 rounded-[2.5rem] p-12 max-w-4xl mx-auto shadow-sm print:shadow-none print:border-none print:p-0 print:rounded-none"
      >
        {/* Style block for print-specific optimizations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:hidden {
              display: none !important;
            }
            #root, .print\\:show-area, .print\\:show-area * {
              visibility: visible;
            }
            .print\\:show-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}} />

        <div className="print:show-area space-y-8">
          
          {/* 1. Header & Branding */}
          <div className="border-b-4 border-double border-slate-300 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <span className="text-3xl font-black tracking-tighter">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">ST. ANGELO ACADEMIC ACADEMY</h1>
                <p className="text-xs text-slate-500 font-bold tracking-widest">OFFICIAL ACADEMIC TRANSCRIPT & REPORT CARD</p>
              </div>
            </div>
            <div className="text-right border-l-2 border-slate-200 pl-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Academic Term</p>
              <p className="font-extrabold text-slate-800 text-sm">{term}</p>
              <p className="text-xs font-bold text-slate-500">{academicYear}</p>
            </div>
          </div>

          {/* 2. Student Info Roster */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-6">
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</span>
              <span className="font-extrabold text-slate-800 text-sm">{student.user?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</span>
              <span className="font-extrabold text-slate-700 text-sm">{student.studentId || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Class & Section</span>
              <span className="font-extrabold text-slate-700 text-sm">{classObj.name} - {classObj.section}</span>
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</span>
              <span className="font-extrabold text-slate-700 text-sm">{student.rollNumber || 'N/A'}</span>
            </div>
          </div>

          {/* 3. Performance Breakdown Table */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              Academic Performance Breakdown
            </h3>
            
            <div className="border border-slate-200 rounded-[1.5rem] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-4">Subject Name</th>
                    {subjectGrades[0]?.examMarks?.map((mark, i) => (
                      <th key={i} className="p-4 text-center">{mark.examType?.name || 'Exam'}</th>
                    ))}
                    <th className="p-4 text-center">Final Score</th>
                    <th className="p-4 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {subjectGrades.map((sub, sIdx) => (
                    <tr key={sIdx} className="hover:bg-slate-50/30">
                      <td className="p-4 font-bold text-slate-900">{sub.subject?.name}</td>
                      {sub.examMarks?.map((mark, mIdx) => (
                        <td key={mIdx} className="p-4 text-center text-slate-500 font-medium">
                          {mark.totalObtained} / {mark.totalMax} <span className="block text-[10px] text-slate-400">({mark.percentage}%)</span>
                        </td>
                      ))}
                      <td className="p-4 text-center font-bold text-slate-900">{sub.subjectPercentage}%</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg font-bold text-xs ${
                          sub.subjectPercentage >= 80 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : sub.subjectPercentage >= 60 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {sub.subjectGrade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Transcripts Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="border border-slate-100 p-5 rounded-2xl text-center shadow-sm">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</span>
              <span className="text-xl font-black text-slate-900">{attendancePercentage}%</span>
            </div>
            
            <div className="border border-slate-100 p-5 rounded-2xl text-center shadow-sm">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cumulative GPA</span>
              <span className="text-xl font-black text-slate-900">{gpa.toFixed(2)}</span>
            </div>

            <div className="border border-slate-100 p-5 rounded-2xl text-center shadow-sm">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall %</span>
              <span className="text-xl font-black text-indigo-600">{overallPercentage}%</span>
            </div>

            <div className="border border-slate-100 p-5 rounded-2xl text-center shadow-sm">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Rank</span>
              <span className="text-xl font-black text-slate-900">
                #{classRank || '-'} <span className="text-xs text-slate-400">({classPercentile || 100}th %)</span>
              </span>
            </div>
          </div>

          {/* 5. Remarks & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Teacher's General Remarks</h4>
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                {teacherRemarks || '"Student demonstrates solid conceptual comprehension. Consistent participation and focus will secure top tiers."'}
              </p>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Principal's Directives</h4>
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                {principalRemarks || '"Approved. Highly recommended for standard academic advancement."'}
              </p>
            </div>
          </div>

          {/* 6. Signature Blocks */}
          <div className="flex justify-between items-end pt-12">
            <div className="w-48 text-center">
              <div className="h-0.5 bg-slate-300 w-full mb-3"></div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Teacher</span>
            </div>
            
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 border-dashed">
              <ShieldCheck className="w-8 h-8 text-emerald-500/80" />
            </div>

            <div className="w-48 text-center">
              <div className="h-0.5 bg-slate-300 w-full mb-3"></div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Principal Signature</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
