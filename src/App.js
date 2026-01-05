import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import VenuePage from './components/VenuePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateVenue from './pages/CreateVenue';
import CreateProfile from './pages/CreateProfile';
import VenueDashboard from './pages/VenueDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PublicVenuesPage from './pages/PublicVenuesPage';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './components/ui/toast-provider';

// Wrapper for /v/:id
import Layout from './components/Layout';

// Wrapper for /v/:id
const VenueRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <Layout showFooter={false}>
      <VenuePage venueId={id} onBack={() => navigate('/')} />
    </Layout>
  );
};

function App() {
  return (
    <LanguageProvider>
      <ToastProvider> {/* Added ToastProvider here */}
        <Router>
          <Routes>
            <Route path="/" element={
              <Layout>
                <LandingPage />
              </Layout>
            } />
            <Route path="/login" element={
              <Layout showFooter={false}>
                <Login />
              </Layout>
            } />
            <Route path="/signup" element={
              <Layout showFooter={false}>
                <SignUp />
              </Layout>
            } />

            <Route path="/create-venue" element={
              <Layout showFooter={false}>
                <CreateVenue />
              </Layout>
            } />
            <Route path="/edit-venue/:id" element={
              <Layout showFooter={false}>
                <CreateVenue />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <Layout showFooter={false}>
                <VenueDashboard />
              </Layout>
            } />
            <Route path="/create-profile" element={
              <Layout showFooter={false}>
                <CreateProfile />
              </Layout>
            } />
            <Route path="/venues" element={
              <PublicVenuesPage />
            } />
            <Route path="/admin" element={
              <Layout showFooter={false}>
                <AdminDashboard />
              </Layout>
            } />
            <Route path="/v/:id" element={<VenueRoute />} />
            {/* Slug-based route - must be last to avoid matching other routes */}
            <Route path="/:slug" element={<VenueRoute />} />
          </Routes>
        </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
