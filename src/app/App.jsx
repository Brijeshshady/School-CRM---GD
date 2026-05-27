import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DataProvider } from "./context/DataContext";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "../components/error/ErrorBoundary";
import { PageLoader } from "../components/ui/skeletons/PageLoader";
import { Suspense, lazy } from "react";

// Layouts - imported statically as they are lightweight and wrap the pages
import { Layout } from "../components/layouts/Layout";
import { StudentLayout } from "../components/layouts/StudentLayout";
import { ParentLayout } from "../components/layouts/ParentLayout";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { TeacherLayout } from "../components/layouts/TeacherLayout";

// Route Page components (Lazy loaded to reduce initial bundle size)
const EnhancedLogin = lazy(() => import("./pages/auth/EnhancedLogin").then(m => ({ default: m.EnhancedLogin })));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ChatInterface = lazy(() => import("./pages/ChatInterface").then(m => ({ default: m.ChatInterface })));
const SupportTickets = lazy(() => import("./pages/support/SupportTickets").then(m => ({ default: m.SupportTickets })));

// Student Features
const StudentDashboardHome = lazy(() => import("../features/student-dashboard/StudentDashboardHome").then(m => ({ default: m.StudentDashboardHome })));
const StudentGrades = lazy(() => import("../features/student-dashboard/StudentGrades").then(m => ({ default: m.StudentGrades })));
const StudentAssignments = lazy(() => import("../features/student-dashboard/StudentAssignments").then(m => ({ default: m.StudentAssignments })));
const StudentAttendance = lazy(() => import("../features/student-dashboard/StudentAttendance").then(m => ({ default: m.StudentAttendance })));
const Timetable = lazy(() => import("../features/student-dashboard/Timetable").then(m => ({ default: m.Timetable })));
const CareerOptions = lazy(() => import("../features/student-dashboard/CareerOptions").then(m => ({ default: m.CareerOptions })));
const SubjectCompletions = lazy(() => import("../features/student-dashboard/SubjectCompletions").then(m => ({ default: m.SubjectCompletions })));
const Doubts = lazy(() => import("../features/student-dashboard/Doubts").then(m => ({ default: m.Doubts })));
const StudentQuizRunner = lazy(() => import("../features/student-dashboard/StudentQuizRunner").then(m => ({ default: m.StudentQuizRunner })));

// Parent Features
const ParentHome = lazy(() => import("../features/parent-dashboard/ParentHome").then(m => ({ default: m.ParentHome })));
const ParentProgress = lazy(() => import("../features/parent-dashboard/ParentProgress").then(m => ({ default: m.ParentProgress })));
const ParentAttendance = lazy(() => import("../features/parent-dashboard/ParentAttendance").then(m => ({ default: m.ParentAttendance })));
const ParentFees = lazy(() => import("../features/parent-dashboard/ParentFees").then(m => ({ default: m.ParentFees })));

// Admin Features
const AdminHome = lazy(() => import("../features/admin-dashboard/AdminHome").then(m => ({ default: m.AdminHome })));
const AdminClassManagement = lazy(() => import("./pages/admin/AdminClassManagement").then(m => ({ default: m.AdminClassManagement })));
const AdminFeesManagement = lazy(() => import("./pages/admin/AdminFeesManagement").then(m => ({ default: m.AdminFeesManagement })));
const AdminReports = lazy(() => import("./pages/admin/AdminReports").then(m => ({ default: m.AdminReports })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminStudentManagement = lazy(() => import("./pages/admin/AdminStudentManagement").then(m => ({ default: m.AdminStudentManagement })));
const AdminTeacherManagement = lazy(() => import("./pages/admin/AdminTeacherManagement").then(m => ({ default: m.AdminTeacherManagement })));
const AdminSubjectManagement = lazy(() => import("./pages/admin/AdminSubjectManagement").then(m => ({ default: m.AdminSubjectManagement })));
const AdminTimetableApprovals = lazy(() => import("./pages/admin/AdminTimetableApprovals").then(m => ({ default: m.AdminTimetableApprovals })));
const AdminTicketManagement = lazy(() => import("./pages/support/AdminTicketManagement").then(m => ({ default: m.AdminTicketManagement })));
const UserManagement = lazy(() => import("./pages/admin/UserManagement").then(m => ({ default: m.UserManagement })));
const AdminGradebook = lazy(() => import("../features/gradebook/pages/AdminGradebook").then(m => ({ default: m.AdminGradebook })));

// Teacher Features
const TeacherHome = lazy(() => import("../features/teacher-dashboard/TeacherHome").then(m => ({ default: m.TeacherHome })));
const TeacherClasses = lazy(() => import("../features/teacher-dashboard/TeacherClasses").then(m => ({ default: m.TeacherClasses })));
const TeacherAttendance = lazy(() => import("../features/teacher-dashboard/TeacherAttendance").then(m => ({ default: m.TeacherAttendance })));
const TeacherAssignments = lazy(() => import("../features/teacher-dashboard/TeacherAssignments").then(m => ({ default: m.TeacherAssignments })));
const TeacherGrades = lazy(() => import("../features/teacher-dashboard/TeacherGrades").then(m => ({ default: m.TeacherGrades })));

// Management Features
const StudentManagement = lazy(() => import("./pages/management/StudentManagement").then(m => ({ default: m.StudentManagement })));
const AdmissionsCRM = lazy(() => import("./pages/management/AdmissionsCRM").then(m => ({ default: m.AdmissionsCRM })));
const AcademicsManagement = lazy(() => import("./pages/management/AcademicsManagement").then(m => ({ default: m.AcademicsManagement })));
const AttendanceManagement = lazy(() => import("./pages/management/AttendanceManagement").then(m => ({ default: m.AttendanceManagement })));
const FeesManagement = lazy(() => import("./pages/management/FeesManagement").then(m => ({ default: m.FeesManagement })));
const ReportsAnalytics = lazy(() => import("./pages/management/ReportsAnalytics").then(m => ({ default: m.ReportsAnalytics })));
const Settings = lazy(() => import("./pages/management/Settings").then(m => ({ default: m.Settings })));
const NotificationCenter = lazy(() => import("../features/notifications/components/NotificationCenter").then(m => ({ default: m.NotificationCenter })));
const LeaveRequestForm = lazy(() => import("./pages/teacher/LeaveRequestForm"));
const AdminLeaveApprovals = lazy(() => import("./pages/admin/AdminLeaveApprovals"));
const LMSDashboard = lazy(() => import("./pages/management/LMSDashboard"));

// Transport Features
const AdminTransport = lazy(() => import("./pages/admin/AdminTransport").then(m => ({ default: m.AdminTransport })));
const DriverDashboard = lazy(() => import("../features/driver/pages/DriverDashboard").then(m => ({ default: m.DriverDashboard })));
const StudentTransport = lazy(() => import("../features/student-dashboard/StudentTransport").then(m => ({ default: m.StudentTransport })));



const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user doesn't have permission, redirect to their home dashboard
    const homePath = user?.role === "Parent" ? "/parent/dashboard" : 
                    user?.role === "Student" ? "/student/dashboard" :
                    (user?.role === "Driver" || user?.role === "Helper" || user?.role === "Assistant") ? "/driver/dashboard" :
                    (user?.role === "Teacher" || user?.role === "Staff") ? "/teacher/dashboard" : 
                    (user?.role === "Admin" || user?.role === "SuperAdmin") ? "/admin/dashboard" : "/login";
    return <Navigate to={homePath} replace />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
};
const RedirectBasedOnRole = () => {
  const { user } = useAuth();
  if (user?.role === "Parent") return <Navigate to="/parent/dashboard" replace />;
  if (user?.role === "Student") return <Navigate to="/student/dashboard" replace />;
  if (user?.role === "Admin" || user?.role === "SuperAdmin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "Driver" || user?.role === "Helper" || user?.role === "Assistant") return <Navigate to="/driver/dashboard" replace />;
  if (user?.role === "Teacher" || user?.role === "Staff") return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};
const GenericDashboard = () => <div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
    <p className="text-slate-500">Welcome to your dashboard.</p>
  </div>;
const PlaceholderPage = ({ title }) => <div className="flex flex-col items-center justify-center h-96 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">🚧</span>
    </div>
    <h1 className="text-xl font-bold text-slate-800">{title}</h1>
    <p className="text-slate-500 max-w-sm mt-2">This module is part of the comprehensive scope but not fully implemented in this prototype.</p>
  </div>;
const AppContent = () => {
  return <Routes>
      <Route path="/login" element={<EnhancedLogin />} />
      <Route path="/teacher/login" element={<EnhancedLogin defaultTab="staff" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {
    /* Student Routes - Direct without Layout */
  }
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["Student"]}>
          <StudentLayout />
        </ProtectedRoute>}>
        <Route index element={<StudentDashboardHome />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="doubts" element={<Doubts />} />
        <Route path="career" element={<CareerOptions />} />
        <Route path="completions" element={<SubjectCompletions />} />
        <Route path="quizzes" element={<StudentQuizRunner />} />
        <Route path="transport" element={<StudentTransport />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="support" element={<SupportTickets />} />
      </Route>
      
      {
    /* Parent Routes - Direct without Standard Layout */
  }
      <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={["Parent"]}>
          <ParentLayout />
        </ProtectedRoute>}>
        <Route index element={<ParentHome />} />
        <Route path="progress" element={<ParentProgress />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="schedule" element={<ParentHome />} />
        <Route path="fees" element={<ParentFees />} />
        <Route path="transport" element={<StudentTransport />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="support" element={<SupportTickets />} />
      </Route>
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
          <AdminLayout />
        </ProtectedRoute>}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="students" element={<AdminStudentManagement />} />
        <Route path="teachers" element={<AdminTeacherManagement />} />
        <Route path="subjects" element={<AdminSubjectManagement />} />
        <Route path="classes" element={<AdminClassManagement />} />
        <Route path="fees" element={<AdminFeesManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="tickets" element={<AdminTicketManagement />} />
        <Route path="timetable-approvals" element={<AdminTimetableApprovals />} />
        <Route path="gradebook" element={<AdminGradebook />} />
        <Route path="transport" element={<AdminTransport />} />
        <Route path="leaves" element={<AdminLeaveApprovals />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      
      {
    /* Teacher Routes - Direct without Standard Layout */
  }
      <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={["Teacher", "Staff"]}>
          <TeacherLayout />
        </ProtectedRoute>}>
        <Route index element={<TeacherHome />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="leaves" element={<LeaveRequestForm />} />
        <Route path="support" element={<SupportTickets />} />
      </Route>
      
      {
    /* Driver Routes */
  }
      <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={["Driver", "Helper", "Assistant"]}>
          <TeacherLayout />
        </ProtectedRoute>}>
        <Route index element={<DriverDashboard />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="support" element={<SupportTickets />} />
      </Route>
      
      {
    /* Other Routes - With Layout (Staff/Admin) */
  }
      <Route path="/" element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin", "Teacher", "Staff"]}>
          <Layout />
        </ProtectedRoute>}>
        <Route index element={<RedirectBasedOnRole />} />
        
        {
    /* General Routes */
  }
        <Route path="dashboard" element={<RedirectBasedOnRole />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="admissions" element={<AdmissionsCRM />} />
        <Route path="academics" element={<AcademicsManagement />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="fees" element={<FeesManagement />} />
        <Route path="communications" element={<ChatInterface />} /> {
    /* Reusing chat for demo */
  }
        <Route path="support" element={<SupportTickets />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="lms" element={<LMSDashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={["Student", "Parent", "Admin", "SuperAdmin", "Teacher", "Staff"]}><NotificationCenter /></ProtectedRoute>} />
    </Routes>;
};
export default function App() {
  return <Router>
      <AuthProvider>
        <NotificationProvider>
          <DataProvider>
            <ChatProvider>
              <Toaster position="top-right" richColors />
              <Suspense fallback={<PageLoader text="Loading application..." />}>
                <ErrorBoundary>
                  <AppContent />
                </ErrorBoundary>
              </Suspense>
            </ChatProvider>
          </DataProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>;
}
