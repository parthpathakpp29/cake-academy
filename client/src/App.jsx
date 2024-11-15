import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCourses from './components/FeaturedCourses';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import Dashboard from './pages/user/Dashboard';
import ProtectedRoute from './components/Routes/Protected-route';
import AdminRoute from './components/Routes/Admin-Route';
import AdminDashboard from './pages/user/Admin/AdminDashboard';
import CreateCourse from './pages/user/Admin/CreateNewCourse';
import AllCourses from './pages/courses/AllCourses';
import CourseDetails from './pages/courses/CourseDetails';
import VideoPlayerPage from './pages/courses/VideoPlayerPage';
import EditCourse from './pages/user/Admin/EditCourse';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const HomeLayout = () => {
  return (
    <>
      <Hero />
      <FeaturedCourses />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-background">
            <Toaster position="top-right" richColors />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomeLayout />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses/:courseId/lecture/:lectureIndex" element={<VideoPlayerPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/courses/create" element={<CreateCourse />} />
                <Route path="/admin/courses/:id/edit" element={<EditCourse />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;