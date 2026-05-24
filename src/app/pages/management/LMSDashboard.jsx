import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, FileText, Video, Link as LinkIcon, Plus, Trash2, Calendar, Clock, CheckCircle2, User, HelpCircle, Loader2, PlayCircle, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/api";

export default function LMSDashboard() {
  const queryClient = useQueryClient();
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [activeLMSTab, setActiveLMSTab] = useState("materials"); // "materials", "quizzes", "builder"
  
  // Study Materials State
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("PDF");
  const [matUrl, setMatUrl] = useState("");

  // Quiz Builder State
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [quizClassId, setQuizClassId] = useState("");
  const [quizTimeLimit, setQuizTimeLimit] = useState(30);
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([]); // Array of { questionText, options: [string], correctOption: number, points: number }

  // New Question Form State
  const [newQText, setNewQText] = useState("");
  const [newQOptions, setNewQOptions] = useState(["", "", "", ""]);
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQPoints, setNewQPoints] = useState(5);

  // Selected Quiz attempts tracker
  const [trackedQuiz, setTrackedQuiz] = useState(null);

  // Fetch subjects
  const { data: subjectsResponse, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subjects");
      return response.data.data;
    }
  });
  const subjects = subjectsResponse || [];

  // Set initial subject once loaded
  if (!selectedSubjectId && subjects.length > 0) {
    setSelectedSubjectId(subjects[0]._id);
  }

  // Fetch classes
  const { data: classesResponse } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await api.get("/classes");
      return response.data.data;
    }
  });
  const classesList = classesResponse || [];

  // Fetch active subject details
  const { data: subjectDetails, isLoading: subjectDetailsLoading } = useQuery({
    queryKey: ["subject", selectedSubjectId],
    queryFn: async () => {
      if (!selectedSubjectId) return null;
      const response = await api.get(`/subjects/${selectedSubjectId}`);
      return response.data.data;
    },
    enabled: !!selectedSubjectId
  });

  // Fetch quizzes for this subject
  const { data: quizzesResponse, isLoading: quizzesLoading } = useQuery({
    queryKey: ["quizzes", selectedSubjectId],
    queryFn: async () => {
      if (!selectedSubjectId) return [];
      const response = await api.get("/quizzes", { params: { subject: selectedSubjectId } });
      return response.data.data;
    },
    enabled: !!selectedSubjectId
  });
  const quizzes = quizzesResponse || [];

  // Fetch attempts of tracked quiz
  const { data: trackedAttempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ["quiz-attempts", trackedQuiz?._id],
    queryFn: async () => {
      if (!trackedQuiz) return [];
      const response = await api.get(`/quizzes/${trackedQuiz._id}/attempts`);
      return response.data.data;
    },
    enabled: !!trackedQuiz
  });

  // Mutations
  const addMaterialMutation = useMutation({
    mutationFn: async (materialData) => {
      const response = await api.post(`/subjects/${selectedSubjectId}/materials`, materialData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", selectedSubjectId]);
      toast.success("Study material uploaded successfully!");
      setMatTitle("");
      setMatUrl("");
      setShowAddMaterial(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add study material");
    }
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (materialId) => {
      const response = await api.delete(`/subjects/${selectedSubjectId}/materials/${materialId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subject", selectedSubjectId]);
      toast.success("Study material removed successfully.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete material");
    }
  });

  const createQuizMutation = useMutation({
    mutationFn: async (quizPayload) => {
      // 1. Create questions first
      const savedQuestionIds = [];
      for (const q of quizQuestions) {
        const qRes = await api.post("/quizzes/questions", {
          subject: selectedSubjectId,
          questionText: q.questionText,
          options: q.options,
          correctOption: q.correctOption,
          points: q.points
        });
        savedQuestionIds.push(qRes.data.data._id);
      }

      // 2. Create quiz with question IDs
      const response = await api.post("/quizzes", {
        title: quizTitle,
        description: quizDesc,
        subject: selectedSubjectId,
        class: quizClassId,
        timeLimit: quizTimeLimit,
        allowMultipleAttempts,
        questions: savedQuestionIds
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes", selectedSubjectId]);
      toast.success("Quiz compiled and published successfully!");
      // Reset quiz builder state
      setQuizTitle("");
      setQuizDesc("");
      setQuizClassId("");
      setQuizTimeLimit(30);
      setAllowMultipleAttempts(true);
      setQuizQuestions([]);
      setActiveLMSTab("quizzes");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Quiz compilation failed");
    }
  });

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQText.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }
    if (newQOptions.some(opt => !opt.trim())) {
      toast.error("Please supply all 4 options");
      return;
    }

    setQuizQuestions(prev => [
      ...prev,
      {
        questionText: newQText,
        options: [...newQOptions],
        correctOption: Number(newQCorrect),
        points: Number(newQPoints)
      }
    ]);

    // Clear question form
    setNewQText("");
    setNewQOptions(["", "", "", ""]);
    setNewQCorrect(0);
    setNewQPoints(5);
    toast.success("Question appended to list!");
  };

  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (!quizTitle.trim() || !quizClassId || quizQuestions.length === 0) {
      toast.error("Please fill in title, class and add at least one question");
      return;
    }
    createQuizMutation.mutate();
  };

  const activeSubject = subjects.find(s => s._id === selectedSubjectId);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curriculum & LMS Control</h1>
          <p className="text-slate-500 font-medium mt-1">Direct classroom material delivery and automatic grading quiz modules</p>
        </div>

        {/* Subject Selector */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setTrackedQuiz(null);
            }}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 shadow-sm focus:outline-none"
          >
            {subjects.map(sub => (
              <option key={sub._id} value={sub._id}>
                {sub.name} ({sub.class?.name}-{sub.class?.section || "All"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { id: "materials", label: "Study Materials", icon: FileText },
          { id: "quizzes", label: "Class Quizzes", icon: HelpCircle },
          { id: "builder", label: "Quiz Compiler", icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLMSTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-black text-xs uppercase tracking-widest border-b-2 transition-all ${
                activeLMSTab === tab.id
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeLMSTab === "materials" && (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Digital Library</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Study materials for this subject</p>
                </div>
                <button
                  onClick={() => setShowAddMaterial(!showAddMaterial)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-600/25"
                >
                  <Plus className="w-4 h-4" />
                  Add Material
                </button>
              </div>

              {showAddMaterial && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!matTitle || !matUrl) return;
                    addMaterialMutation.mutate({ title: matTitle, type: matType, url: matUrl });
                  }}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Quantum Mechanics Intro"
                        value={matTitle}
                        onChange={(e) => setMatTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Type</label>
                      <select
                        value={matType}
                        onChange={(e) => setMatType(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold bg-white"
                      >
                        <option value="PDF">PDF Document</option>
                        <option value="Video">Video Lecture Link</option>
                        <option value="Link">External Web Resource</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Resource URL / Link</label>
                    <input
                      type="url"
                      placeholder="https://example.com/material.pdf"
                      value={matUrl}
                      onChange={(e) => setMatUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold bg-white"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddMaterial(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addMaterialMutation.isPending}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
                    >
                      {addMaterialMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Material
                    </button>
                  </div>
                </form>
              )}

              {subjectDetailsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
              ) : subjectDetails?.studyMaterials && subjectDetails.studyMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectDetails.studyMaterials.map((mat) => (
                    <div key={mat._id} className="p-4 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          mat.type === 'PDF' ? 'bg-red-50 text-red-600' :
                          mat.type === 'Video' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {mat.type === 'PDF' && <FileText className="w-5 h-5" />}
                          {mat.type === 'Video' && <Video className="w-5 h-5" />}
                          {mat.type === 'Link' && <LinkIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 leading-tight">{mat.title}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{mat.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={mat.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this resource?")) {
                              deleteMaterialMutation.mutate(mat._id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-[2rem]">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-black">No study materials in library</p>
                  <p className="text-xs text-slate-400 mt-1">Upload slides, syllabus copies or links for student reference.</p>
                </div>
              )}
            </div>
          )}

          {activeLMSTab === "quizzes" && (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Quizzes & Assessments</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">MCQ Quizzes compiled for this subject</p>
              </div>

              {quizzesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
              ) : quizzes.length > 0 ? (
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} className="p-5 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:bg-slate-50 transition-all">
                      <div className="space-y-2">
                        <h3 className="font-bold text-slate-900">{quiz.title}</h3>
                        <p className="text-xs text-slate-500 font-semibold">{quiz.description}</p>
                        <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider text-slate-600">
                          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded">
                            <Clock className="w-3.5 h-3.5" />
                            {quiz.timeLimit} mins
                          </span>
                          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded">
                            <HelpCircle className="w-3.5 h-3.5" />
                            {quiz.questions?.length} MCQs
                          </span>
                          <span className={`px-2.5 py-1 rounded ${
                            quiz.allowMultipleAttempts 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {quiz.allowMultipleAttempts ? "Multiple Attempts" : "Single Attempt"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTrackedQuiz(quiz)}
                          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          View Attempt Logs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-[2rem]">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-black">No quizzes published yet</p>
                  <p className="text-xs text-slate-400 mt-1">Navigate to the "Quiz Compiler" tab to launch a new MCQ test.</p>
                </div>
              )}
            </div>
          )}

          {activeLMSTab === "builder" && (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Quiz Compiler</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Author standard assessment papers</p>
              </div>

              <form onSubmit={handleCreateQuizSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Quiz Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Unit 1 Physics Review"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Class</label>
                    <select
                      value={quizClassId}
                      onChange={(e) => setQuizClassId(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold"
                      required
                    >
                      <option value="">Select target class...</option>
                      {classesList.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.section})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Limit (Minutes)</label>
                    <input
                      type="number"
                      value={quizTimeLimit}
                      onChange={(e) => setQuizTimeLimit(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="allowMultiple"
                      checked={allowMultipleAttempts}
                      onChange={(e) => setAllowMultipleAttempts(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="allowMultiple" className="text-sm font-bold text-slate-700 cursor-pointer">
                      Allow Multiple Retake Attempts
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <textarea
                    placeholder="Short summary of instructions..."
                    value={quizDesc}
                    onChange={(e) => setQuizDesc(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                {/* Compiled Questions list */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    Questions Stack ({quizQuestions.length})
                  </h3>
                  
                  {quizQuestions.length > 0 ? (
                    <div className="space-y-3">
                      {quizQuestions.map((q, idx) => (
                        <div key={idx} className="p-4 border border-slate-100 bg-slate-50 rounded-xl flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-slate-800">Q{idx + 1}: {q.questionText}</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-slate-500">
                              {q.options.map((opt, oIdx) => (
                                <p key={oIdx} className={oIdx === q.correctOption ? "font-bold text-green-600" : ""}>
                                  {oIdx + 1}. {opt}
                                </p>
                              ))}
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded">
                            {q.points} Pts
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No questions compiled yet. Use the question form below to build your questions.</p>
                  )}
                </div>

                {/* Question Form */}
                <div className="p-5 border border-indigo-100 bg-indigo-50/20 rounded-2xl space-y-4">
                  <h4 className="font-black text-xs text-indigo-700 uppercase tracking-widest">Append New MCQ Question</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Text</label>
                    <input
                      type="text"
                      placeholder="Enter question questionText..."
                      value={newQText}
                      onChange={(e) => setNewQText(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {newQOptions.map((opt, i) => (
                      <div key={i} className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Option {i + 1}</label>
                        <input
                          type="text"
                          placeholder={`Option ${i + 1}...`}
                          value={opt}
                          onChange={(e) => {
                            const copy = [...newQOptions];
                            copy[i] = e.target.value;
                            setNewQOptions(copy);
                          }}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Option</label>
                      <select
                        value={newQCorrect}
                        onChange={(e) => setNewQCorrect(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                      >
                        <option value={0}>Option 1</option>
                        <option value={1}>Option 2</option>
                        <option value={2}>Option 3</option>
                        <option value={3}>Option 4</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Points</label>
                      <input
                        type="number"
                        value={newQPoints}
                        onChange={(e) => setNewQPoints(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    Append to Stack
                  </button>
                </div>

                {/* Final Submit */}
                <button
                  type="submit"
                  disabled={createQuizMutation.isPending || quizQuestions.length === 0}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-600/25 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {createQuizMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Compile & Publish Quiz Paper
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar Panel: Attempt Logs Trackers */}
        <div className="lg:col-span-1">
          {trackedQuiz ? (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 sticky top-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Attempt Audit</h2>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                    For {trackedQuiz.title}
                  </p>
                </div>
                <button
                  onClick={() => setTrackedQuiz(null)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-black uppercase tracking-wider"
                >
                  Close
                </button>
              </div>

              {attemptsLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
              ) : trackedAttempts && trackedAttempts.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {trackedAttempts.map((att) => (
                    <div key={att._id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-700">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">{att.student?.user?.name || "Student"}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            {new Date(att.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-indigo-600 leading-tight">
                          {att.score}/{att.totalPoints} Pts
                        </p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest mt-0.5">
                          {Math.round((att.score / att.totalPoints) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">No student attempts recorded</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-slate-200 text-center py-16">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-black text-sm text-slate-500 uppercase tracking-wider">Attempt Audit</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Click "View Attempt Logs" on any quiz card to track student submission grades and score cards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
