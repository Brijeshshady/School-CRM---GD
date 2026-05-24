import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Lock, ArrowRight, Loader2, Mail, Hash, Sparkles, Building2, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export const EnhancedLogin = ({ defaultTab }) => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab || "parent");
  const [showPassword, setShowPassword] = useState(false);
  
  // Single email/password state is enough since they share the same backend route
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleFillSampleData = () => {
    if (activeTab === "parent") {
      setEmail("parent1@school.com");
      setPassword("password123");
    } else if (activeTab === "student") {
      setEmail("student1@school.com");
      setPassword("password123");
    } else if (activeTab === "staff") {
      setEmail("teacher1@school.com");
      setPassword("password123");
    } else if (activeTab === "admin") {
      setEmail("admin@school.com");
      setPassword("password123");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter your credentials");
      return;
    }

    try {
      const response = await login(email, password);
      const userRole = response.data.user.role;
      
      toast.success("Login successful!");

      // Redirect based on role
      if (userRole === "Parent") navigate("/parent/dashboard");
      else if (userRole === "Student") navigate("/student/dashboard");
      else if (userRole === "Admin" || userRole === "SuperAdmin") navigate("/admin/dashboard");
      else if (userRole === "Teacher" || userRole === "Staff") navigate("/teacher/dashboard");
      else navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your School CRM account</p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6 relative">
            {["parent", "student", "staff", "admin"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError("");
                  // Clear fields on tab change to avoid confusion in demo
                  setEmail("");
                  setPassword("");
                }}
                className={`flex-1 text-sm font-medium py-2.5 px-3 rounded-lg transition-all duration-200 relative z-10 capitalize ${activeTab === tab ? "text-blue-700" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab === "staff" ? "Teacher" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="login-tab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleFillSampleData}
            className="w-full mb-6 py-2.5 px-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl text-purple-700 text-sm font-medium hover:from-purple-100 hover:to-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Fill with {activeTab} sample data
          </button>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">
                {activeTab === "student" ? "Email / Student ID" : "Email Address"}
              </label>
              <div className="relative group">
                {activeTab === "student" ? (
                  <Hash className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                ) : activeTab === "admin" ? (
                  <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                ) : (
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                )}
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder={activeTab === "student" ? "student1@school.com" : `${activeTab}@school.com`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 w-4 h-4" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline">Sign Up</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
