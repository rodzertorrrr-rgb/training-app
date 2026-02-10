
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import History from './pages/History';
import SessionDetails from './pages/SessionDetails';
import Progress from './pages/Progress';
import Education from './pages/Education';
import Settings from './pages/Settings';
import ProgramEditor from './pages/ProgramEditor';
import Layout from './components/Layout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="workout/:dayId" element={<ActiveWorkout />} />
              <Route path="history" element={<History />} />
              <Route path="history/:sessionId" element={<SessionDetails />} />
              <Route path="progress" element={<Progress />} />
              <Route path="education" element={<Education />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/program-editor" element={<ProgramEditor />} />
              <Route path="settings/program-editor/:programId" element={<ProgramEditor />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;