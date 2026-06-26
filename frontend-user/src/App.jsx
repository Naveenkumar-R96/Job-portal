import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './routes/PrivateRoute';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main pages
import Landing from './pages/Landing';
import Jobs from './pages/jobs/Jobs';
import JobDetail from './pages/jobs/JobDetail';

// Profile pages (protected)
import Profile from './pages/profile/Profile';
import AppliedJobs from './pages/profile/AppliedJobs';
import SavedItems from './pages/profile/SavedItems';

// Interview pages
import Interview from './pages/interview/Interview';
import CompanyPrep from './pages/interview/CompanyPrep';
import RolePrep from './pages/interview/RolePrep';

// Contact
import Contact from './pages/contact/Contact';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#111827',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview/company/:id" element={<CompanyPrep />} />
            <Route path="/interview/role/:id" element={<RolePrep />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected routes */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/applied-jobs" element={<PrivateRoute><AppliedJobs /></PrivateRoute>} />
            <Route path="/saved" element={<PrivateRoute><SavedItems /></PrivateRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="text-8xl font-black text-primary-100 mb-4">404</div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h2>
                <p className="text-text-secondary mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                  Go Home
                </a>
              </div>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
