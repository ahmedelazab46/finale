import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminNavbar from './components/layout/AdminNavbar';
import InstructorNavbar from './components/layout/InstructorNavbar';
import StudentNavbar from './components/layout/StudentNavbar';
import Navbar from './components/layout/Navbar23';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Courses from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/Admin/admin_dashboard';
import InstructorDashboard from './components/dashboard/InstructorDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddInstructor from './pages/Admin/AddInstructor';
import ManageInstructors from './pages/Admin/ManageInstructors';
import ManageCourses from './pages/Admin/ManageCourses';
import ManageStudents from './pages/Admin/ManageStudents';
import AddCourse from './components/courses/AddCourse';
import EditCourse from './components/courses/EditCourse';
import MyCourses from './components/courses/MyCourses';
import InstructorProfile from './components/profile/InstructorProfile';
import StudentProfile from './components/profile/StudentProfile';
import AdminProfile from './components/profile/AdminProfile';
import CourseDetail from './pages/CourseDetail';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './styles/AdminDashboard.css';
import AuthLayout from './components/layouts/AuthLayout';
import StudentMyCourses from './pages/student/MyCourses';
import Certificates from './pages/Certificates';
import InstructorStudents from './components/courses/InstructorStudents'
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isInstructorRoute = location.pathname.startsWith('/instructor');
  const isStudentRoute = location.pathname.startsWith('/student');
  const isAuthRoute = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  const isPublicRoute = !isAdminRoute && !isInstructorRoute && !isStudentRoute && !isAuthRoute;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AuthProvider>
      <div className={isAdminRoute ? 'admin-layout' : ''}>
        {!isAuthRoute && !isAdminRoute && (
          <>
            {isInstructorRoute && <InstructorNavbar />}
            {isStudentRoute && <StudentNavbar />}
            {isPublicRoute && <Navbar isScrolled={isScrolled} />}
          </>
        )}
        <main className={isAdminRoute ? 'admin-main' : 'flex-grow-1'}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Home /></>} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            
            {/* Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/add-instructor" element={
              <ProtectedRoute>
                <AddInstructor />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/manage-instructors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageInstructors />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/manage-courses" element={<ProtectedRoute allowedRoles={['admin']}><ManageCourses /></ProtectedRoute>} />
            <Route path="/admin/manage-students" element={<ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>} />
            
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/student/courses" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMyCourses />
              </ProtectedRoute>
            } />
            
            <Route path="/student/certificates" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Certificates />
              </ProtectedRoute>
            } />
            
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/profile" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/add-course" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <AddCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/edit-course/:courseId" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <EditCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/courses" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <MyCourses />
              </ProtectedRoute>
            } />
            
            <Route path="/instructor/profile" element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorProfile />
              </ProtectedRoute>
            } />
            <Route path="/instructor/students" element={<InstructorStudents />} />
            {/* Redirect based on user role */}
            <Route path="/dashboard" element={<HomeRedirect />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
            
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />
          </Routes>
        </main>
        {isPublicRoute && !isAuthRoute && <Footer />}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .admin-layout {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .admin-main {
            flex: 1;
            margin: 0;
            padding: 0;
          }
          .auth-layout .navbar,
          .auth-layout .footer {
            display: none;
          }
        `
      }} />
    </AuthProvider>
  );
}

function HomeRedirect() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.is_superuser) return <Navigate to="/admin/dashboard" />;
  if (user.is_instructor) return <Navigate to="/instructor/dashboard" />;
  return <Navigate to="/student/dashboard" />;
}

export default App;