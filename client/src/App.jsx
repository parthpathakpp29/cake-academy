import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/Routes/Protected-route';
import AdminRoute from './components/Routes/Admin-Route';
import { Loader2 } from 'lucide-react';

// Lazy load components
const Hero = lazy(() => import('./components/Hero'));
const FeaturedCourses = lazy(() => import('./components/FeaturedCourses'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const SignIn = lazy(() => import('./pages/auth/SignIn'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/user/Admin/AdminDashboard'));
const CreateCourse = lazy(() => import('./pages/user/Admin/CreateNewCourse'));
const AllCourses = lazy(() => import('./pages/courses/AllCourses'));
const CourseDetails = lazy(() => import('./pages/courses/CourseDetails'));
const VideoPlayerPage = lazy(() => import('./pages/courses/VideoPlayerPage'));
const EditCourse = lazy(() => import('./pages/user/Admin/EditCourse'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const HomeLayout = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Hero />
      <FeaturedCourses />
      <WhyChooseUs />
      <Testimonials />
    </Suspense>
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
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;