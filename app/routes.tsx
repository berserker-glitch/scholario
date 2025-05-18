import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import DashboardPage from './components/dashboard/DashboardPage';
import SubjectsPage from './components/subjects/SubjectsPage';

// Lazy-loaded routes
const StudentsPage = lazy(() => import('./components/students/StudentsPage'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'));
const LoginPage = lazy(() => import('./components/auth/LoginPage'));

// Loading fallback
const Loading = () => (
  <Flex justify="center" align="center" height="100vh">
    <Spinner size="xl" />
  </Flex>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 