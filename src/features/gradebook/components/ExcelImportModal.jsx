import React, { useState } from 'react';
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { parseExcelFile } from '../utils/gradeCalculations';
import { useBulkImportGrades } from '../hooks/useGradebook';

export const ExcelImportModal = ({ isOpen, onClose, classId, className, subjectId, subjectName, examTypeId, examTypeName }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const bulkImportMutation = useBulkImportGrades();

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsValidating(true);
    setValidationErrors([]);
    setPreviewData([]);

    try {
      const data = await parseExcelFile(uploadedFile);
      
      // Perform frontend structural validation
      const errors = [];
      const validRows = [];

      if (data.length === 0) {
        errors.push("The spreadsheet is empty.");
      } else {
        data.forEach((row, index) => {
          const rowNum = index + 2; // Offset for Excel header row
          
          if (!row.rollNumber) {
            errors.push(`Row ${rowNum}: Missing "rollNumber" column.`);
          }

          // Validate marks ranges
          const components = ['theory', 'practical', 'assignment', 'attendance', 'viva'];
          components.forEach(comp => {
            const obt = Number(row[comp]) || 0;
            const max = Number(row[`${comp}Max`]) || 0;
            
            if (obt < 0) {
              errors.push(`Row ${rowNum}: Obtained marks for "${comp}" cannot be negative.`);
            }
            if (max < 0) {
              errors.push(`Row ${rowNum}: Maximum marks for "${comp}" cannot be negative.`);
            }
            if (obt > max) {
              errors.push(`Row ${rowNum}: "${comp}" marks (${obt}) exceed maximum marks limit (${max}).`);
            }
          });
          
          validRows.push(row);
        });
      }

      setValidationErrors(errors);
      setPreviewData(validRows);
    } catch (err) {
      setValidationErrors([err.message]);
    } finally {
      setIsValidating(false);
    }
  };

  const handleImportSubmit = () => {
    if (previewData.length === 0 || validationErrors.length > 0) return;

    bulkImportMutation.mutate({
      classId,
      subjectId,
      examTypeId,
      grades: previewData
    }, {
      onSuccess: () => {
        setFile(null);
        setPreviewData([]);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Bulk Import Marks</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Importing marks for <span className="text-slate-800">{className}</span> • <span className="text-slate-800">{subjectName}</span> • <span className="text-slate-800">{examTypeName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Upload Area */}
          {!file && (
            <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all group">
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
              <div className="w-16 h-16 bg-slate-50 group-hover:bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="font-bold text-slate-700">Drag & Drop or Choose Excel File</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Supports standard offline spreadsheet template formats (.xlsx, .xls)</p>
            </label>
          )}

          {/* Loading validation */}
          {isValidating && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Analyzing template structure and validating data ranges...</p>
            </div>
          )}

          {/* File Selected & Validation Summary */}
          {file && !isValidating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{file.name}</p>
                    <p className="text-xs text-slate-400 font-semibold">{(file.size / 1024).toFixed(1)} KB • {previewData.length} records detected</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFile(null); setPreviewData([]); setValidationErrors([]); }}
                  className="px-4 py-2 bg-slate-200/50 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Validation Status */}
              {validationErrors.length > 0 ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                    Formatting Errors Detected ({validationErrors.length})
                  </div>
                  <ul className="text-xs text-rose-700 space-y-1 pl-7 list-disc">
                    {validationErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {validationErrors.length > 5 && (
                      <li className="font-bold text-[10px] uppercase tracking-wider text-rose-500">And {validationErrors.length - 5} more errors...</li>
                    )}
                  </ul>
                  <p className="text-[10px] text-rose-500 font-bold pl-7 italic mt-1">Please fix the spreadsheet structure before finalizing the import.</p>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Spreadsheet passed all structural and range integrity checks. Ready to import.
                </div>
              )}

              {/* Data Preview Table */}
              {previewData.length > 0 && (
                <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 font-bold text-slate-500">
                      <tr>
                        <th className="p-3">Roll No.</th>
                        <th className="p-3">Theory</th>
                        <th className="p-3">Practical</th>
                        <th className="p-3">Assignment</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3">Viva</th>
                        <th className="p-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {previewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{row.rollNumber}</td>
                          <td className="p-3">{row.theory || 0} / {row.theoryMax || 100}</td>
                          <td className="p-3">{row.practical || 0} / {row.practicalMax || 0}</td>
                          <td className="p-3">{row.assignment || 0} / {row.assignmentMax || 0}</td>
                          <td className="p-3">{row.attendance || 0} / {row.attendanceMax || 0}</td>
                          <td className="p-3">{row.viva || 0} / {row.vivaMax || 0}</td>
                          <td className="p-3 text-slate-400 truncate max-w-[120px]">{row.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            onClick={handleImportSubmit} 
            disabled={previewData.length === 0 || validationErrors.length > 0 || bulkImportMutation.isPending}
            className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 shadow-lg transition-all ${
              previewData.length > 0 && validationErrors.length === 0 && !bulkImportMutation.isPending
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 cursor-pointer'
                : 'bg-slate-300 shadow-none cursor-not-allowed'
            }`}
          >
            {bulkImportMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Finalize Bulk Import'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
