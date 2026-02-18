
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ActiveWorkout from './pages/ActiveWorkout.tsx';
import History from './pages/History.tsx';
import SessionDetails from './pages/SessionDetails.tsx';
import Progress from './pages/Progress.tsx';
import WeightTracker from './pages/WeightTracker.tsx';
import Education from './pages/Education.tsx';
import Settings from './pages/Settings.tsx';
import ProgramEditor from './pages/ProgramEditor.tsx';
import Achievements from './pages/Achievements.tsx';
import Coach from './pages/Coach.tsx';
import Layout from './components/Layout.tsx';

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
              <Route path="coach" element={<Coach />} />
              <Route path="weight" element={<WeightTracker />} />
              <Route path="workout/:dayId" element={<ActiveWorkout />} />
              <Route path="history" element={<History />} />
              <Route path="history/:sessionId" element={<SessionDetails />} />
              <Route path="achievements" element={<Achievements />} />
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
