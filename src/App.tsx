import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginView } from './components/auth/LoginView';
import { RegistrationView } from './components/auth/RegistrationView';
import { DedicatedClientPortal } from './components/portals/DedicatedClientPortal';
import { DashboardView } from './components/dashboard/DashboardView';
import { UsersView } from './components/users/UsersView';
import { InquiriesView } from './components/inquiries/InquiriesView';
import { BlogView } from './components/blog/BlogView';
import { EventsView } from './components/events/EventsView';
import { FacilitiesView } from './components/facilities/FacilitiesView';
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ComplianceView } from './components/compliance/ComplianceView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { AccountInfoView } from './components/profile/AccountInfoView';
import { ProfileModal } from './components/profile/ProfileModal';
import { RoleDashboardRouter } from './components/dashboards/RoleDashboardRouter';
import { PendingApprovalsView } from './components/users/PendingApprovalsView';
import { InternalStaffView } from './components/users/InternalStaffView';
import { ComplianceAuditLogs } from './components/compliance/ComplianceAuditLogs';
import { MainWebsiteComponentUI } from './components/website/MainWebsiteComponentUI';
import { UserCategory, NeonUser, USER_CATEGORIES } from './types';

const MainAppLayout: React.FC = () => {
  const {
    isLoggedIn,
    activeTab,
    setActiveTab,
    activeClientUser,
    setActiveClientUser,
    activeClientCategory,
    setActiveClientCategory,
    refreshNeonUsers,
  } = useAdmin();

  const [authScreen, setAuthScreen] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // If a client user is authenticated or reviewing their dedicated portal:
  const isClientPortalActive = activeTab === 'portals' || Boolean(activeClientUser);

  // If activeTab is 'website_publications', render the Main Website Component UI
  if (activeTab === 'website_publications') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <MainWebsiteComponentUI />
        <ToastContainer />
      </div>
    );
  }

  // If not logged in as admin AND no client is in portal session, show Login/Register view
  if (!isLoggedIn && !activeClientUser) {
    if (authScreen === 'REGISTER') {
      return (
        <>
          <RegistrationView
            onSuccess={(user: NeonUser) => {
              setActiveClientUser(user);
              const cat = (user.portal_category || user.partner_type || USER_CATEGORIES[0]) as UserCategory;
              setActiveClientCategory(cat);
              setActiveTab('portals');
              refreshNeonUsers();
            }}
            onSwitchToLogin={() => setAuthScreen('LOGIN')}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <LoginView
          onClientAuthenticated={(user: NeonUser) => {
            setActiveClientUser(user);
            const cat = (user.portal_category || user.partner_type || USER_CATEGORIES[0]) as UserCategory;
            setActiveClientCategory(cat);
            setActiveTab('portals');
            refreshNeonUsers();
          }}
          onSwitchToRegister={() => setAuthScreen('REGISTER')}
          onExplorePortalsDirectly={(cat: UserCategory) => {
            setActiveClientCategory(cat);
            setActiveTab('portals');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  // If viewing the Main Website Component UI (Public Visitor View):
  if (activeTab === 'website_publications') {
    return (
      <>
        <MainWebsiteComponentUI />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'portals':
        return (
          <DedicatedClientPortal
            category={activeClientCategory}
            currentUser={activeClientUser}
            onSwitchCategory={(cat: UserCategory) => setActiveClientCategory(cat)}
            onOpenAdminPanel={() => {
              setActiveClientUser(null);
              setActiveTab('dashboard');
            }}
          />
        );
      case 'role_dashboard':
        return <RoleDashboardRouter />;
      case 'pending_approvals':
        return <PendingApprovalsView />;
      case 'staff_management':
        return <InternalStaffView />;
      case 'audit_trail':
        return <ComplianceAuditLogs />;
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return (
          <UsersView
            initialSubTab="users"
            onOpenPortalForUser={(cat: UserCategory, user: NeonUser) => {
              setActiveClientUser(user);
              setActiveClientCategory(cat);
              setActiveTab('portals');
            }}
          />
        );
      case 'investors':
        return <UsersView initialSubTab="investors" />;
      case 'partners':
        return <UsersView initialSubTab="partners" />;
      case 'inquiries':
        return <InquiriesView />;
      case 'blog':
        return <BlogView />;
      case 'website_publications':
        return <MainWebsiteComponentUI />;
      case 'events':
        return <EventsView />;
      case 'facilities':
        return <FacilitiesView initialTab="spaces" />;
      case 'equipment':
        return <FacilitiesView initialTab="equipment" />;
      case 'opportunities':
        return <OpportunitiesView />;
      case 'documents':
        return <DocumentsView />;
      case 'compliance':
        return <ComplianceView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'account':
        return <AccountInfoView onOpenPhotoModal={() => setProfileModalOpen(true)} />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-row text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar onOpenProfileModal={() => setProfileModalOpen(true)} />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Profile Photo Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <MainAppLayout />
    </AdminProvider>
  );
}
