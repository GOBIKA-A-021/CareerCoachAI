import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// ── Layouts ───────────────────────────────────────────────────────────────────
import PublicLayout       from './components/Layout/PublicLayout'
import AuthenticatedLayout from './components/Layout/AuthenticatedLayout'

// ── Public pages ──────────────────────────────────────────────────────────────
import Home     from './pages/Home/HomeNew'
import Features from './pages/Features/Features'
import About    from './pages/About/About'
import Contact  from './pages/Contact/Contact'
import Login    from './pages/Login/LoginNew'
import Register from './pages/Register/RegisterNew'

// ── Authenticated pages ───────────────────────────────────────────────────────
import Dashboard          from './pages/Dashboard/DashboardNew'
import UploadResume       from './pages/UploadResume/UploadResume'
import ResumeAnalysis     from './pages/ResumeAnalysis/ResumeAnalysis'
import ATSReport          from './pages/ATSReport/ATSReport'
import SkillGap           from './pages/SkillGap/SkillGap'
import CareerRoadmap      from './pages/CareerRoadmap/CareerRoadmap'
import InterviewQuestions from './pages/InterviewQuestions/InterviewQuestions'
import PlacementScore     from './pages/PlacementScore/PlacementScore'
import Reports            from './pages/Reports/Reports'
import Profile            from './pages/Profile/Profile'
import Settings           from './pages/Settings/Settings'
import Admin              from './pages/Admin/Admin'

// ── Route guards ──────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <PublicLayout>{children}</PublicLayout>
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public (guest-only) ── */}
        <Route path="/"        element={<GuestRoute><Home /></GuestRoute>} />
        <Route path="/features" element={<GuestRoute><Features /></GuestRoute>} />
        <Route path="/about"    element={<GuestRoute><About /></GuestRoute>} />
        <Route path="/contact"  element={<GuestRoute><Contact /></GuestRoute>} />
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* ── Protected (authenticated) ── */}
        <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload-resume"      element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
        <Route path="/resume-analysis"    element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
        <Route path="/ats-report"         element={<ProtectedRoute><ATSReport /></ProtectedRoute>} />
        <Route path="/skill-gap"          element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
        <Route path="/career-roadmap"     element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
        <Route path="/interview-questions" element={<ProtectedRoute><InterviewQuestions /></ProtectedRoute>} />
        <Route path="/placement-score"    element={<ProtectedRoute><PlacementScore /></ProtectedRoute>} />
        <Route path="/reports"            element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings"           element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
