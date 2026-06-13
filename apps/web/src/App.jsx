import { Routes, Route, Navigate } from 'react-router-dom'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import Dashboard from './dashboard/Dashboard'
import StubPage from './components/StubPage'

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard defaultView="home" user={user} signOut={signOut} />} />
          <Route path="/projects" element={<Dashboard defaultView="projects" user={user} signOut={signOut} />} />
          <Route path="/supplies" element={<Dashboard defaultView="supplies" user={user} signOut={signOut} />} />
          <Route path="/inspiration" element={<Dashboard defaultView="inspiration" user={user} signOut={signOut} />} />
          <Route path="/partners" element={<StubPage title="Partners" />} />
          <Route path="/beta" element={<StubPage title="Beta" />} />
          <Route path="/investors" element={<StubPage title="Investors" />} />
          <Route path="/privacy" element={<StubPage title="Privacy & Terms" />} />
        </Routes>
      )}
    </Authenticator>
  )
}