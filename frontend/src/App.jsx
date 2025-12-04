import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useThemeStore from './store/useThemeStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

// Public Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmailSent from './pages/VerifyEmailSent';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import PendingApproval from './pages/PendingApproval';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SystemOverview from './pages/SystemOverview';
import AdminUsers from './pages/AdminUsers';
import AdminUserProfile from './pages/AdminUserProfile';
import AdminProjects from './pages/AdminProjects';
import AdminSkills from './pages/AdminSkills';
import AdminExperience from './pages/AdminExperience';
import AdminEducation from './pages/AdminEducation';
import AdminAbout from './pages/AdminAbout';
import AdminSocialMedia from './pages/AdminSocialMedia';
import AdminContactInfo from './pages/AdminContactInfo';
import AdminMessages from './pages/AdminMessages';

// Protected Routes
import AdminRoute from './auth/AdminRoute';
import UserRoute from './auth/UserRoute';

// User Dashboard Pages
import UserDashboard from './pages/UserDashboard';
import UserLayout from './layouts/UserLayout';
import UserMessages from './pages/UserMessages';

// Portfolio Pages
import PortfolioLayout from './layouts/PortfolioLayout';
import PortfolioHero from './pages/PortfolioHero';
import PortfolioAbout from './pages/PortfolioAbout';
import PortfolioProjects from './pages/PortfolioProjects';
import PortfolioExperience from './pages/PortfolioExperience';
import PortfolioEducation from './pages/PortfolioEducation';
import PortfolioSkills from './pages/PortfolioSkills';
import PortfolioContact from './pages/PortfolioContact';

function App() {
  const { darkMode, setDarkMode } = useThemeStore();

  useEffect(() => {
    // Initialize dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes - Must be before dynamic username route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* User Dashboard Routes - Must be before dynamic username route */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <UserLayout />
            </UserRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="social-media" element={<AdminSocialMedia />} />
          <Route path="messages" element={<UserMessages />} />
        </Route>

        {/* Public Portfolio Routes (Legacy - for system portfolio) */}
        <Route path="/portfolio" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes - Super Admin Dashboard (Staff/Superuser only) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <SuperAdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<SystemOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:userId/profile" element={<AdminUserProfile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="social-media" element={<AdminSocialMedia />} />
          <Route path="contact-info" element={<AdminContactInfo />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* User Portfolio Routes - Dynamic username routes (MUST be last to avoid conflicts) */}
        <Route path="/:username" element={<PortfolioLayout />}>
          <Route index element={<PortfolioHero />} />
          <Route path="about" element={<PortfolioAbout />} />
          <Route path="projects" element={<PortfolioProjects />} />
          <Route path="experience" element={<PortfolioExperience />} />
          <Route path="education" element={<PortfolioEducation />} />
          <Route path="skills" element={<PortfolioSkills />} />
          <Route path="contact" element={<PortfolioContact />} />
        </Route>

        {/* Catch all - redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
