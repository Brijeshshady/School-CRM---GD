import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle, Clock, CheckCircle2, XCircle, Trophy, PlayCircle,
  ArrowRight, ArrowLeft, Send, Loader2, BookOpen, AlertCircle,
  Timer, Sparkles, BarChart3
} from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";

export const StudentQuizRunner = () => {
  const queryClient = useQueryClient();
  
  // Quiz list & selection
  const [activeQuiz, setActiveQuiz] = useState(null); // Quiz object for taking
  const [quizData, setQuizData] = useState(null); // Loaded quiz with questions
  
  // Quiz session state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: { selectedOption, descriptiveAnswer } }
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch quizzes for this student's class
  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ["student-quizzes"],
    queryFn: async () => {
      const { data } = await api.get("/quizzes");
      return data.data;
    },
  });

  // Load quiz details when starting
  const { data: loadedQuiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz-detail", activeQuiz?._id],
    queryFn: async () => {
      const { data } = await api.get(`/quizzes/${activeQuiz._id}`);
      return data.data;
    },
    enabled: !!activeQuiz,
  });

  useEffect(() => {
    if (loadedQuiz) {
      setQuizData(loadedQuiz);
    }
  }, [loadedQuiz]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post(`/quizzes/${activeQuiz._id}/submit`, payload);
      return data.data;
    },
    onSuccess: (data) => {
      setResult(data);
      setQuizStarted(false);
      queryClient.invalidateQueries({ queryKey: ["student-quizzes"] });
      toast.success("Quiz submitted successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    },
  });

  const handleAutoSubmit = useCallback(() => {
    if (!quizData) return;
    const payload = buildSubmitPayload();
    submitMutation.mutate(payload);
  }, [quizData, answers]);

  const buildSubmitPayload = () => {
    const questionsAnswered = quizData.questions.map(q => {
      const ans = answers[q._id] || {};
      return {
        question: q._id,
        selectedOption: ans.selectedOption !== undefined ? ans.selectedOption : null,
        descriptiveAnswer: ans.descriptiveAnswer || "",
      };
    });
    return { answers: questionsAnswered };
  };

  const handleManualSubmit = () => {
    const payload = buildSubmitPayload();
    submitMutation.mutate(payload);
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setQuizStarted(false);
  };

  const beginAttempt = () => {
    if (quizData) {
      setTimeLeft((quizData.timeLimit || 30) * 60);
      setQuizStarted(true);
    }
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setQuizData(null);
    setQuizStarted(false);
    setResult(null);
    setCurrentQ(0);
    setAnswers({});
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // QUIZ LIST VIEW
  if (!activeQuiz) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[2rem] p-8 text-white shadow-xl shadow-violet-600/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Online Quizzes</h1>
              <p className="text-violet-100 font-medium">Test your knowledge with interactive assessments</p>
            </div>
          </div>
        </div>

        {quizzesLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map(quiz => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">{quiz.subject?.name} • {quiz.class?.name}</p>
                  </div>
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-violet-600" />
                  </div>
                </div>

                {quiz.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{quiz.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-wider border border-slate-100">
                    <Clock className="w-3.5 h-3.5" />
                    {quiz.timeLimit} min
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-wider border border-slate-100">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {quiz.questions?.length} Q's
                  </span>
                  {quiz.attemptsCount > 0 && (
                    <span className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] font-black text-emerald-700 uppercase tracking-wider border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {quiz.attemptsCount} attempt{quiz.attemptsCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {quiz.highestScore !== null && quiz.highestScore !== undefined && (
                    <span className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-[10px] font-black text-amber-700 uppercase tracking-wider border border-amber-200">
                      <Trophy className="w-3.5 h-3.5" />
                      Best: {quiz.highestScore}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  disabled={!quiz.allowMultipleAttempts && quiz.attemptsCount > 0}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <PlayCircle className="w-4 h-4" />
                  {quiz.attemptsCount > 0 ? (quiz.allowMultipleAttempts ? "Retake Quiz" : "Already Attempted") : "Start Quiz"}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">No quizzes available</p>
            <p className="text-xs text-slate-400 mt-1">Quizzes will appear here when your teachers publish them.</p>
          </div>
        )}
      </div>
    );
  }

  // RESULT VIEW
  if (result) {
    const pct = result.totalPoints > 0 ? Math.round((result.score / result.totalPoints) * 100) : 0;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] shadow-2xl p-10 text-center max-w-md w-full border border-slate-100"
        >
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
            pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100"
          }`}>
            {pct >= 80 ? (
              <Trophy className="w-12 h-12 text-emerald-600" />
            ) : pct >= 50 ? (
              <CheckCircle2 className="w-12 h-12 text-amber-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1">Quiz Complete!</h2>
          <p className="text-sm text-slate-500 font-semibold mb-6">{activeQuiz.title}</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-2xl font-black text-slate-900">{result.score}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Score</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-2xl font-black text-slate-900">{result.totalPoints}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</p>
            </div>
            <div className={`p-3 rounded-xl border ${
              pct >= 80 ? "bg-emerald-50 border-emerald-200" : pct >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
            }`}>
              <p className={`text-2xl font-black ${
                pct >= 80 ? "text-emerald-700" : pct >= 50 ? "text-amber-700" : "text-red-700"
              }`}>{pct}%</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Accuracy</p>
            </div>
          </div>

          <button
            onClick={exitQuiz}
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
          >
            Back to Quiz List
          </button>
        </motion.div>
      </div>
    );
  }

  // PRE-START (loading quiz details)
  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2.5rem] shadow-xl p-10 text-center max-w-md w-full border border-slate-100"
        >
          {quizLoading ? (
            <div className="py-12">
              <Loader2 className="w-10 h-10 animate-spin text-violet-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-bold">Loading quiz...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-violet-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">{activeQuiz.title}</h2>
              <p className="text-sm text-slate-500 font-semibold mb-6">{activeQuiz.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Clock className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                  <p className="text-lg font-black text-slate-900">{quizData?.timeLimit || 30}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Minutes</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <HelpCircle className="w-5 h-5 text-violet-600 mx-auto mb-1" />
                  <p className="text-lg font-black text-slate-900">{quizData?.questions?.length || 0}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Questions</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <p className="text-xs text-amber-700 font-bold flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  Timer starts when you click Begin. Auto-submits on expiry.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={exitQuiz}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={beginAttempt}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25"
                >
                  <PlayCircle className="w-4 h-4" />
                  Begin
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ACTIVE QUIZ VIEW
  const questions = quizData?.questions || [];
  const currentQuestion = questions[currentQ];
  const isLastQ = currentQ === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPct = ((currentQ + 1) / questions.length) * 100;
  const timerWarning = timeLeft < 60;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Timer & Progress Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-violet-600" />
            <span className="font-bold text-slate-900 text-sm">{activeQuiz.title}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm ${
            timerWarning ? "bg-red-50 text-red-700 border border-red-200 animate-pulse" : "bg-slate-50 text-slate-700 border border-slate-200"
          }`}>
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Q {currentQ + 1} of {questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion._id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-violet-700 text-sm">
                {currentQ + 1}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-relaxed">
                  {currentQuestion.questionText}
                </p>
                <span className="inline-block mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                  {currentQuestion.type === 'Descriptive' ? 'Descriptive' : 'MCQ'} • {currentQuestion.points} pts
                </span>
              </div>
            </div>

            {/* MCQ Options */}
            {currentQuestion.type !== 'Descriptive' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion._id]?.selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setAnswers(prev => ({
                        ...prev,
                        [currentQuestion._id]: { selectedOption: idx }
                      }))}
                      className={`w-full p-4 rounded-xl text-left font-semibold text-sm transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-violet-50 border-2 border-violet-500 text-violet-900 shadow-md shadow-violet-500/10"
                          : "bg-slate-50 border-2 border-transparent hover:border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs ${
                        isSelected ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Descriptive Answer */}
            {currentQuestion.type === 'Descriptive' && (
              <textarea
                value={answers[currentQuestion._id]?.descriptiveAnswer || ""}
                onChange={(e) => setAnswers(prev => ({
                  ...prev,
                  [currentQuestion._id]: { descriptiveAnswer: e.target.value }
                }))}
                rows={6}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none"
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-5 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {isLastQ ? (
          <button
            onClick={handleManualSubmit}
            disabled={submitMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50"
          >
            {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}
            className="flex items-center gap-2 px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/25"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentQ(idx)}
              className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                idx === currentQ
                  ? "bg-violet-600 text-white shadow-md"
                  : answers[q._id]
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
