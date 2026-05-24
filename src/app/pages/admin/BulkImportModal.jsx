import { useState } from "react";
import { X, Upload, Download, FileText, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import { toast } from "sonner";

export const BulkImportModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const importMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/admin/users/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success(`Import complete: ${data.success} successful, ${data.failed} failed.`);
      if (data.errors.length > 0) {
        console.error("Import Errors:", data.errors);
      }
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to import users");
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    importMutation.mutate(formData);
  };

  const downloadSample = () => {
    // In a real app, this would be a link to a static asset
    toast.info("Sample format: [name, email, role, password, studentId, rollNumber, classId, department]");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bulk Import</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Import multiple users via Excel</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-black text-indigo-900">Template Format</p>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-0.5">XLSX / CSV Supported</p>
              </div>
            </div>
            <button 
              onClick={downloadSample}
              className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Template
            </button>
          </div>

          <label className="block group cursor-pointer">
            <div className={`border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30'}`}>
              <div className={`w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110 ${file ? 'bg-emerald-600 text-white' : 'bg-white text-indigo-600'}`}>
                {file ? <CheckCircle2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
              </div>
              {file ? (
                <div>
                  <p className="text-xl font-black text-slate-900 mb-1">{file.name}</p>
                  <p className="text-sm text-emerald-600 font-bold">Import file uploaded and ready</p>
                </div>
              ) : (
                <div>
                  <p className="text-xl font-black text-slate-900 mb-2">Upload spreadsheet file</p>
                  <p className="text-slate-500 font-medium">Drop your Excel file here or click to browse</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            </div>
          </label>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleImport}
              disabled={!file || importMutation.isPending}
              className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
            >
              {importMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              Import Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
