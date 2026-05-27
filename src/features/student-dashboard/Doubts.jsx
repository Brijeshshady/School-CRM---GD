import { useState } from "react";
import { HelpCircle, Plus, Send, Check, Clock, AlertCircle, X, Filter } from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { useNotifications } from "@/app/context/NotificationContext";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useStudentTeachers } from "./hooks/useStudentData";
export const Doubts = () => {
  const { user } = useAuth();
  const { showToast, addNotification } = useNotifications();
  const { doubts, users, addDoubt, updateDoubt, addDoubtReply } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [newDoubt, setNewDoubt] = useState({
    teacherId: "",
    subject: "",
    question: "",
    description: "",
    priority: "Medium"
  });
  const [attachment, setAttachment] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachment(file);
    setUploadStatus("uploading");
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("completed");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setUploadStatus("idle");
    setUploadProgress(0);
  };

  const { data: studentTeachers = [] } = useStudentTeachers();
  const filteredDoubts = Array.isArray(doubts) ? (filterStatus === "All" ? doubts : doubts.filter((d) => d.status === filterStatus)) : [];
  const handleOpenModal = () => {
    setAttachment(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setIsModalOpen(true);
    setNewDoubt({
      teacherId: "",
      subject: "",
      question: "",
      description: "",
      priority: "Medium"
    });
  };
  const handleSubmitDoubt = (e) => {
    e.preventDefault();
    if (!newDoubt.teacherId) return;
    const payload = {
      title: newDoubt.question,
      question: newDoubt.description,
      subject: newDoubt.subject,
      teacherId: newDoubt.teacherId,
      priority: newDoubt.priority
    };
    addDoubt(payload);
    setIsModalOpen(false);
    showToast("success", "Doubt Submitted", `Your question has been posted`);
    addNotification({
      type: "info",
      title: "Doubt Submitted",
      message: `Your ${newDoubt.subject} question has been posted`
    });
  };
  const handleMarkResolved = (doubtId) => {
    updateDoubt(doubtId, { status: "Resolved" });
    showToast("success", "Doubt Resolved", "Doubt has been marked as resolved");
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-orange-100 text-orange-800";
      case "Answered":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Answered":
        return <AlertCircle className="w-4 h-4" />;
      case "Resolved":
        return <Check className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ask Your Doubts</h2>
          <p className="text-slate-500">Student ID: {user?.studentId || "STU-" + (user?._id ? user._id.slice(-4).toUpperCase() : "202")}</p>
          <p className="text-slate-600 mt-1">Get help from your teachers</p>
        </div>
        <button
    onClick={handleOpenModal}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
  >
          <Plus className="w-4 h-4" />
          Ask Doubt
        </button>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Doubts</p>
              <p className="text-2xl font-bold text-slate-900">{doubts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {doubts.filter((d) => d.status === "Pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Answered</p>
              <p className="text-2xl font-bold text-blue-600">
                {doubts.filter((d) => d.status === "Answered").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {doubts.filter((d) => d.status === "Resolved").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Filter:</span>
          <div className="flex gap-2">
            {["All", "Pending", "Answered", "Resolved"].map((status) => <button
    key={status}
    onClick={() => setFilterStatus(status)}
    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filterStatus === status ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
                {status}
              </button>)}
          </div>
        </div>
      </div>

      {
    /* Doubts List */
  }
      <div className="space-y-4">
        {filteredDoubts.map((doubt) => <div
    key={doubt.id}
    className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
    onClick={() => setSelectedDoubt(doubt)}
  >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{doubt.title}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doubt.status)}`}>
                    {getStatusIcon(doubt.status)}
                    {doubt.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(doubt.priority)}`}>
                    {doubt.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="font-medium text-indigo-600">{doubt.subject}</span>
                  <span>•</span>
                  <span>{format(new Date(doubt.timestamp), "MMM d, yyyy h:mm a")}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-700 mb-4">{doubt.question}</p>

            {doubt.replies && doubt.replies.length > 0 && <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {doubt.replies[0].userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doubt.replies[0].userName}</p>
                    <p className="text-xs text-slate-500">
                      Answered on {format(new Date(doubt.replies[0].timestamp), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 mt-2">{doubt.replies[0].message}</p>
                
                {doubt.status === "Answered" && <button
    onClick={(e) => {
      e.stopPropagation();
      handleMarkResolved(doubt.id);
    }}
    className="mt-3 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
  >
                    <Check className="w-4 h-4" />
                    Mark as Resolved
                  </button>}
              </div>}
          </div>)}

        {filteredDoubts.length === 0 && <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No doubts found</h3>
            <p className="text-slate-600 mb-4">
              {filterStatus === "All" ? "You haven't asked any doubts yet. Click 'Ask Doubt' to get started!" : `No ${filterStatus.toLowerCase()} doubts found.`}
            </p>
          </div>}
      </div>

      {
    /* Ask Doubt Modal */
  }
      {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Ask a Doubt</h2>
              <p className="text-sm font-bold text-slate-900">Teacher Account</p>
              <button
    onClick={() => setIsModalOpen(false)}
    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDoubt} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
    type="text"
    required
    value={newDoubt.subject}
    onChange={(e) => setNewDoubt({ ...newDoubt, subject: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="e.g., Mathematics"
  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ask Teacher *
                  </label>
                  <select
    required
    value={newDoubt.teacherId}
    onChange={(e) => setNewDoubt({ ...newDoubt, teacherId: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
                    <option value="">Select a teacher</option>
                    {studentTeachers.map((teacher) => (
                      <option key={teacher._id} value={teacher.user?._id}>
                        {teacher.user?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <div className="flex gap-3">
                  {["Low", "Medium", "High"].map((priority) => <label key={priority} className="flex items-center gap-2 cursor-pointer">
                      <input
    type="radio"
    name="priority"
    value={priority}
    checked={newDoubt.priority === priority}
    onChange={(e) => setNewDoubt({ ...newDoubt, priority: e.target.value })}
    className="w-4 h-4 text-indigo-600"
  />
                      <span className="text-sm text-slate-700">{priority}</span>
                    </label>)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Question Title *
                </label>
                <input
    type="text"
    required
    value={newDoubt.question}
    onChange={(e) => setNewDoubt({ ...newDoubt, question: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Brief title for your doubt"
  />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={newDoubt.description}
                  onChange={(e) => setNewDoubt({ ...newDoubt, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Explain your doubt in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Attachment (Optional)
                </label>
                {attachment ? (
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                          {attachment.name}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {uploadStatus === "uploading" ? `Uploading ${uploadProgress}%...` : "Uploaded"}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-150 ${uploadStatus === "completed" ? "bg-green-500" : "bg-indigo-600"}`}
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-sm text-slate-600">
                      <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop files here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
    type="button"
    onClick={() => setIsModalOpen(false)}
    className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
  >
                  <Send className="w-4 h-4" />
                  Submit Doubt
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* Doubt Detail Modal */
  }
      {selectedDoubt && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">Doubt Details</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDoubt.status)}`}>
                  {getStatusIcon(selectedDoubt.status)}
                  {selectedDoubt.status}
                </span>
              </div>
              <button
    onClick={() => setSelectedDoubt(null)}
    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{selectedDoubt.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="font-medium text-indigo-600">{selectedDoubt.subject}</span>
                  <span>•</span>
                  <span>{format(new Date(selectedDoubt.timestamp), "MMM d, yyyy h:mm a")}</span>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">{selectedDoubt.question}</p>
              </div>

              {selectedDoubt.replies && selectedDoubt.replies.length > 0 ? <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold flex-shrink-0">
                      {selectedDoubt.replies[0].userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{selectedDoubt.replies[0].userName}</p>
                      <p className="text-sm text-slate-500">
                        Answered on {format(new Date(selectedDoubt.replies[0].timestamp), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{selectedDoubt.replies[0].message}</p>
                  </div>
                  
                  {selectedDoubt.status === "Answered" && <button
    onClick={() => {
      handleMarkResolved(selectedDoubt.id);
      setSelectedDoubt(null);
    }}
    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
  >
                      <Check className="w-4 h-4" />
                      Mark as Resolved
                    </button>}
                </div> : <div className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <p className="text-orange-900 font-medium">Waiting for teacher's response...</p>
                  </div>
                  <p className="text-orange-700 text-sm mt-2">
                    Your teacher will respond to your doubt soon. You'll receive a notification when they answer.
                  </p>
                </div>}
            </div>
          </div>
        </div>}
    </div>;
};
