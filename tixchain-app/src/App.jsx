import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import EventListing from './pages/EventListing';
import TicketDetail from './pages/TicketDetail';
import UserDashboard from './pages/UserDashboard';
import SecondaryMarket from './pages/SecondaryMarket';
import CheckInMobile from './pages/CheckInMobile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventListing />} />
            <Route path="/event/:id" element={<TicketDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/market" element={<SecondaryMarket />} />
            <Route path="/checkin/:id" element={<CheckInMobile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
