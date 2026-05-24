import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DataProvider } from "./context/DataContext";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "../components/error/ErrorBoundary";
import { PageLoader } from "../components/ui/skeletons/PageLoader";
import { Suspense } from "react";

// Layouts
import { Layout } from "./components/Layout";
import { StudentLayout } from "./components/layouts/StudentLayout";
import { ParentLayout } from "./components/layouts/ParentLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { TeacherLayout } from "./components/layouts/TeacherLayout";

// Tip: For future optimization, use React.lazy for route components:
// const EnhancedLogin = lazy(() => import('./pages/auth/EnhancedLogin'));
import { EnhancedLogin } from "./pages/auth/EnhancedLogin";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ParentDashboard } from "./pages/ParentDashboard";
import { ChatInterface } from "./pages/ChatInterface";
import { SupportTickets } from "./pages/support/SupportTickets";

// Student Features
import { StudentDashboardHome } from "../features/student-dashboard/StudentDashboardHome";
import { StudentGrades } from "../features/student-dashboard/StudentGrades";
import { StudentAssignments } from "../features/student-dashboard/StudentAssignments";
import { StudentAttendance } from "../features/student-dashboard/StudentAttendance";
import { Timetable } from "./pages/student/Timetable";
import { CareerOptions } from "./pages/student/CareerOptions";
import { SubjectCompletions } from "./pages/student/SubjectCompletions";
import { Doubts } from "./pages/student/Doubts";

// Parent Features
import { ParentHome } from "../features/parent-dashboard/ParentHome";
import { ParentProgress } from "../features/parent-dashboard/ParentProgress";
import { ParentAttendance } from "../features/parent-dashboard/ParentAttendance";
import { ParentFees } from "../features/parent-dashboard/ParentFees";

// Admin Features
import { AdminHome } from "../features/admin-dashboard/AdminHome";
import { AdminClassManagement } from "./pages/admin/AdminClassManagement";
import { AdminFeesManagement } from "./pages/admin/AdminFeesManagement";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminStudentManagement } from "./pages/admin/AdminStudentManagement";
import { AdminTeacherManagement } from "./pages/admin/AdminTeacherManagement";
import { AdminSubjectManagement } from "./pages/admin/AdminSubjectManagement";
import { AdminTimetableApprovals } from "./pages/admin/AdminTimetableApprovals";
import { AdminTicketManagement } from "./pages/support/AdminTicketManagement";
import { UserManagement } from "./pages/admin/UserManagement";
import { AdminGradebook } from "../features/gradebook/pages/AdminGradebook";

// Teacher Features
import { TeacherHome } from "../features/teacher-dashboard/TeacherHome";
import { TeacherClasses } from "../features/teacher-dashboard/TeacherClasses";
import { TeacherAttendance } from "../features/teacher-dashboard/TeacherAttendance";
import { TeacherAssignments } from "../features/teacher-dashboard/TeacherAssignments";
import { TeacherGrades } from "../features/teacher-dashboard/TeacherGrades";

// Management Features
import { StudentManagement } from "./pages/management/StudentManagement";
import { AdmissionsCRM } from "./pages/management/AdmissionsCRM";
import { AcademicsManagement } from "./pages/management/AcademicsManagement";
import { AttendanceManagement } from "./pages/management/AttendanceManagement";
import { FeesManagement } from "./pages/management/FeesManagement";
import { ReportsAnalytics } from "./pages/management/ReportsAnalytics";
import { Settings } from "./pages/management/Settings";
import { NotificationCenter } from "../features/notifications/components/NotificationCenter";


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
