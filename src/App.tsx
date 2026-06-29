import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { PatientDashboard } from './pages/PatientDashboard';
import { FacilityProfile } from './pages/FacilityProfile';
import { Messages } from './pages/Messages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/signin" />;
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    document.title = "HealthLink | Telemedicine Simplified";
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            
            <Route path="dashboard" element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="facility/:id" element={
              <ProtectedRoute>
                <FacilityProfile />
              </ProtectedRoute>
            } />

            <Route path="messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            
            <Route path="facility-dashboard" element={
              <ProtectedRoute>
                {/* We'll use PatientDashboard for now or create a simple one */}
                <PatientDashboard /> 
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
