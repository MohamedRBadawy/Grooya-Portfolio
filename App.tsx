
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AppProvider, useApp } from './contexts/LocalizationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PortfolioListPage from './pages/PortfolioListPage';
import PortfolioEditorPage from './pages/PortfolioEditorPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import ProjectListPage from './pages/ProjectListPage';
import ResumeListPage from './pages/ResumeListPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import { Toaster } from 'react-hot-toast';

/**
 * A wrapper component for routes that require authentication.
 * It checks if the user is authenticated using the useAuth hook.
 * If authenticated, it renders the nested routes within an AuthenticatedLayout.
 * If not, it redirects the user to the login page, saving the intended location.
 */
const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

/**
 * A small component to render the Toaster within the AppProvider context,
 * allowing it to be styled dynamically based on the current theme.
 */
const AppToaster = () => {
    const { theme } = useApp();
    return (
        <Toaster
            position="bottom-center"
            toastOptions={{
                className: 'font-sans',
                style: {
                    borderRadius: '10px',
                    background: theme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 or white
                    color: theme === 'dark' ? '#f1f5f9' : '#1e293b', // slate-100 or slate-800
                    border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}` // slate-700 or slate-200
                },
            }}
        />
    )
}

/**
 * The main application component.
 * It sets up all the global context providers (App, Data, Auth) and the routing structure.
 */
const App: React.FC = () => {
  return (
    // Global providers for localization, data, and authentication
    <AppProvider>
      <DataProvider>
        <AuthProvider>
          {/* HashRouter is used for client-side routing, compatible with static hosting */}
          <HashRouter>
            <AppToaster />
            <div className="min-h-screen">
              <Routes>
                {/* Public routes accessible to everyone */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portfolio/:slug/*" element={<PublicPortfolioPage />} />

                {/* Private routes that require authentication */}
                <Route element={<PrivateRoutes />}>
                   <Route path="/" element={<PortfolioListPage />} />
                   <Route path="/edit/:portfolioId" element={<PortfolioEditorPage />} />
                   <Route path="/profile" element={<ProfilePage />} />
                   <Route path="/projects" element={<ProjectListPage />} />
                   <Route path="/resumes" element={<ResumeListPage />} />
                   <Route path="/resumes/edit/:resumeId" element={<ResumeEditorPage />} />
                </Route>
              </Routes>
            </div>
          </HashRouter>
        </AuthProvider>
      </DataProvider>
    </AppProvider>
  );
};

export default App;