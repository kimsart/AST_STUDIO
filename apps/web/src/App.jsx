import { Routes, Route, Navigate } from 'react-router-dom'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import Dashboard from './dashboard/Dashboard'
import StubPage from './components/StubPage'

function AuthenticatedApp() {
  const { user, signOut } = useAuthenticator((context) => [context.user])

  return (
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
  )
}

function AuthLanding() {
  const { route } = useAuthenticator((context) => [context.route])

  if (route === 'authenticated') {
    return <AuthenticatedApp />
  }

  return (
    <div className="min-h-screen bg-[#050009] text-[#F7F2FF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-8 md:grid-cols-[1fr_420px] items-center">
        <section className="space-y-5">
          <img
            src="/assets/ast_logo_horizontal_cropped.png"
            alt="Art Supply Tracker"
            className="h-14 w-auto max-w-[280px]"
          />

          <p className="text-[#F4F27A] font-semibold tracking-wide">
            🎨 Calling All Artists
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Join the Art Supply Tracker Artist Beta
          </h1>

          <p className="text-lg text-[#DCC7FF] max-w-xl">
            A studio assistant built by an artist, for artists. Organize supplies,
            projects, notes, and creative workflows so you can spend less time
            searching and more time creating.
          </p>

          <p className="text-sm text-[#DCC7FF]">
            After creating your account, please check your spam or junk folder if
            you don’t receive your confirmation email within a few minutes.
          </p>
        </section>

        <div className="w-full">
  <Authenticator />
</div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Authenticator.Provider>
      <AuthLanding />
    </Authenticator.Provider>
  )
}