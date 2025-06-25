import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import PersonalizedSignup from '@/components/ui/personalized-signup';
import SignUpTestForm from '@/components/auth/SignUpTestForm';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

// Client Pages
import ExplorePage from '@/pages/client/ExplorePage';
import ChatPage from '@/pages/client/ChatPage';
import SavedPage from '@/pages/client/SavedPage';
import TripDetailPage from '@/pages/client/TripDetailPage';
import ProfilePage from '@/pages/client/ProfilePage';

// Advisor Pages
import DashboardPage from '@/pages/advisor/DashboardPage';
import TasksPage from '@/pages/advisor/TasksPage';
import DestinationChecksPage from '@/pages/advisor/DestinationChecksPage';

// Admin Pages
import QuestionnaireBuilderPage from '@/pages/admin/QuestionnaireBuilderPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import TripElementsPage from '@/pages/admin/TripElementsPage';
import AccessPage from '@/pages/admin/AccessPage';
import ComponentsShowcasePage from '@/pages/admin/ComponentsShowcasePage';

import './App.css';

// Wrapper component for the home route that handles navigation
function HomeRouteWrapper() {
  const navigate = useNavigate();

  const handlePersonalizedSignupSubmit = (userType: string) => {
    console.log('Navigating to signup test with user type:', userType);
    navigate('/signup-test');
  };

  return (
    <PersonalizedSignup onSubmit={handlePersonalizedSignupSubmit} />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing/Signup Page - No Layout */}
        <Route path="/" element={<HomeRouteWrapper />} />
        
        {/* Test Sign-Up Form - No Layout */}
        <Route path="/signup-test" element={<SignUpTestForm />} />
        
        {/* Client Routes - Client Layout */}
        <Route path="/explore" element={
          <Layout userRole="client">
            <ExplorePage />
          </Layout>
        } />
        <Route path="/client/chat" element={
          <Layout userRole="client">
            <ChatPage />
          </Layout>
        } />
        <Route path="/client/saved" element={
          <Layout userRole="client">
            <SavedPage />
          </Layout>
        } />
        <Route path="/client/trip/:id" element={
          <Layout userRole="client">
            <TripDetailPage />
          </Layout>
        } />
        <Route path="/client/profile" element={
          <Layout userRole="client">
            <ProfilePage />
          </Layout>
        } />
        
        {/* Advisor Routes - Advisor Layout */}
        <Route path="/advisor/dashboard" element={
          <Layout userRole="advisor">
            <DashboardPage />
          </Layout>
        } />
        <Route path="/advisor/tasks" element={
          <Layout userRole="advisor">
            <TasksPage />
          </Layout>
        } />
        <Route path="/advisor/destination-checks" element={
          <Layout userRole="advisor">
            <DestinationChecksPage />
          </Layout>
        } />
        
        {/* Admin Routes - Admin Layout */}
        <Route path="/advisor/admin/questionnaire-builder" element={
          <Layout userRole="admin">
            <QuestionnaireBuilderPage />
          </Layout>
        } />
        <Route path="/advisor/admin/settings" element={
          <Layout userRole="admin">
            <SettingsPage />
          </Layout>
        } />
        <Route path="/advisor/admin/trip-elements" element={
          <Layout userRole="admin">
            <TripElementsPage />
          </Layout>
        } />
        <Route path="/advisor/admin/access" element={
          <Layout userRole="admin">
            <AccessPage />
          </Layout>
        } />
        <Route path="/advisor/admin/components" element={
          <Layout userRole="admin">
            <ComponentsShowcasePage />
          </Layout>
        } />
      </Routes>
      
      {/* Toast notifications container */}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;