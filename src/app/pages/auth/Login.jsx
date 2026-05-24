import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/app/context/AppContext";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
export function Login() {
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("school-admin");
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };
  return <div className="min-h-screen flex bg-background">
      {
    /* Left Side - Branding */
  }
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent p-12 flex-col justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">EduCRM</h1>
            <p className="text-sm text-white/80">School Management Platform</p>
          </div>
        </div>
        
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-4">
            Streamline Your
            <br />
            School Operations
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Complete solution for admissions, student management, fees, and communication.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-white/70">Schools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm text-white/70">Students</div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Right Side - Login Form */
  }
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {
    /* Mobile Logo */
  }
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EduCRM</h1>
              <p className="text-sm text-muted-foreground">School Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {
    /* Demo Role Selector */
  }
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Demo Login As</label>
            <div className="grid grid-cols-2 gap-2">
              {[
    { value: "super-admin", label: "Super Admin" },
    { value: "school-admin", label: "School Admin" },
    { value: "teacher", label: "Teacher" },
    { value: "parent", label: "Parent" }
  ].map((role) => <button
    key={role.value}
    type="button"
    onClick={() => setSelectedRole(role.value)}
    className={`py-2 px-4 rounded-lg border-2 transition-all ${selectedRole === role.value ? "border-primary bg-primary text-white" : "border-border hover:border-primary/50"}`}
  >
                  {role.label}
                </button>)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="admin@school.com"
    className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
    id="password"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter your password"
    className="w-full pl-10 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
    required
  />
                <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
  >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
    type="submit"
    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
  >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              New to EduCRM?{" "}
              <Link to="/onboarding" className="text-primary hover:underline font-medium">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
}
