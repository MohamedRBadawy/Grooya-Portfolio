
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import { AppProvider, useApp } from './contexts/LocalizationContext';
import { AuthProvider } from './contexts/AuthContext';
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

/**
 * A wrapper component for routes that require authentication.
 * It has been simplified to always render the authenticated layout.
 */
const PrivateRoutes = () => {
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
};

/**
 * A wrapper component to protect admin-only routes.
 */
const AdminRoutes = () => {
    const { user } = useData();
    if (user?.role !== 'admin') {
        // Redirect non-admin users to the main dashboard
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
                {/* Redirect root to the dashboard to focus on the in-app experience */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public portfolio route remains accessible */}
                <Route path="/portfolio/:slug/*" element={<PublicPortfolioPage />} />

                {/* All main app routes are now nested under /dashboard */}
                <Route path="/dashboard" element={<PrivateRoutes />}>
                   <Route index element={<PortfolioListPage />} />
                   <Route path="edit/:portfolioId" element={<PortfolioEditorPage />} />
                   <Route path="profile" element={<ProfilePage />} />
                   <Route path="projects" element={<ProjectListPage />} />
                   <Route path="resumes" element={<ResumeListPage />} />
                   <Route path="resumes/edit/:resumeId" element={<ResumeEditorPage />} />
                   <Route path="upgrade" element={<UpgradePage />} />
                   <Route path="templates" element={<TemplateShowcasePage />} />
                </Route>

                {/* Admin-only routes */}
                <Route path="/admin" element={<AdminRoutes />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="users" element={<AdminUserManagementPage />} />
                    <Route path="users/:userId" element={<AdminUserDetailPage />} />
                    <Route path="portfolios" element={<AdminPortfolioManagementPage />} />
                    <Route path="templates" element={<AdminTemplateManagementPage />} />
                    <Route path="templates/new" element={<AdminTemplateEditorPage />} />
                    <Route path="templates/edit/:templateId" element={<AdminTemplateEditorPage />} />
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
