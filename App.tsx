

import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AppProvider, useApp } from './contexts/LocalizationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PortfolioListPage from './pages/PortfolioListPage';
import PortfolioEditorPage from './pages/PortfolioEditorPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import ProfilePage from './pages/ProfilePage';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';
import ProjectListPage from './pages/ProjectListPage';
import ResumeListPage from './pages/ResumeListPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import UpgradePage from './pages/UpgradePage';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminPortfolioManagementPage from './pages/admin/AdminPortfolioManagementPage';
import AdminTemplateManagementPage from './pages/admin/AdminTemplateManagementPage';
import AdminTemplateEditorPage from './pages/admin/AdminTemplateEditorPage';
import TemplateShowcasePage from './pages/TemplateShowcasePage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PublicLayout from './components/layout/PublicLayout';
import TemplatePreviewPage from './pages/TemplatePreviewPage';
import PrintResumePage from './pages/PrintResumePage';
import { useData } from './contexts/DataContext';
import AnalyticsPage from './pages/AnalyticsPage';

/**
 * A wrapper component for routes that require authentication.
 * If the user is not authenticated, it redirects them to the login page.
 */
const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
};

/**
 * A wrapper for private routes that don't need the main application layout.
 */
const PrivateSimpleLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

/**
 * A wrapper component to protect admin-only routes.
 * It checks for both authentication and the 'admin' role.
 */
const AdminRoutes = () => {
    const { isAuthenticated } = useAuth();
    const { user } = useData();
    
    // Redirect if not authenticated or if the user is not an admin.
    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    )
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
                {/* Public marketing and auth routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/templates/:templateId" element={<TemplatePreviewPage />} />
                </Route>

                {/* Public portfolio route remains accessible */}
                <Route path="/portfolio/:slug/*" element={<PublicPortfolioPage />} />

                {/* A private route for printing resumes that doesn't use the main layout */}
                <Route element={<PrivateSimpleLayout />}>
                    <Route path="/print/resume/:resumeId" element={<PrintResumePage />} />
                </Route>

                {/* All main app routes are now nested under /dashboard and are protected */}
                <Route path="/dashboard" element={<PrivateRoutes />}>
                   <Route index element={<PortfolioListPage />} />
                   <Route path="edit/:portfolioId" element={<PortfolioEditorPage />} />
                   <Route path="profile" element={<ProfilePage />} />
                   <Route path="projects" element={<ProjectListPage />} />
                   <Route path="resumes" element={<ResumeListPage />} />
                   <Route path="resumes/edit/:resumeId" element={<ResumeEditorPage />} />
                   <Route path="upgrade" element={<UpgradePage />} />
                   <Route path="templates" element={<TemplateShowcasePage />} />
                   <Route path="analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Admin-only routes */}
                <Route path="/admin" element={<PrivateRoutes />}>
                    <Route element={<AdminRoutes />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="users" element={<AdminUserManagementPage />} />
                        <Route path="users/:userId" element={<AdminUserDetailPage />} />
                        <Route path="portfolios" element={<AdminPortfolioManagementPage />} />
                        <Route path="templates" element={<AdminTemplateManagementPage />} />
                        <Route path="templates/new" element={<AdminTemplateEditorPage />} />
                        <Route path="templates/edit/:templateId" element={<AdminTemplateEditorPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                    </Route>
                </Route>
                
                {/* Catch-all for not found pages */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </HashRouter>
        </AuthProvider>
      </DataProvider>
    </AppProvider>
  );
};

export default App;