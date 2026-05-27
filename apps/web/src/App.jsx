import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import StubPage from './components/StubPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard defaultView="home" />} />
      <Route path="/projects" element={<Dashboard defaultView="projects" />} />
      <Route path="/supplies" element={<Dashboard defaultView="supplies" />} />
      <Route path="/partners" element={<StubPage title="Partners" description="Partner integrations, product demos, and supply deals coming soon." />} />
      <Route path="/beta" element={<StubPage title="Beta" description="Beta program information coming soon." />} />
      <Route path="/investors" element={<StubPage title="Investors" description="Investor relations coming soon." />} />
      <Route path="/privacy" element={<StubPage title="Privacy & Trust" description="Privacy policy and trust information coming soon." />} />
    </Routes>
  );
}
