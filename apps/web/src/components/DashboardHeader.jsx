 import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function DashboardHeader() {
const [userEmail, setUserEmail] = useState('');

useEffect(() => {
  async function loadUser() {
    try {
      const user = await getCurrentUser();
      setUserEmail(user.signInDetails?.loginId || user.username || '');
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  loadUser();
}, []);
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-[#050009]/90 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="min-w-fit">
          <img
            src="/assets/ast_logo_horizontal_cropped.png"
            alt="ArtSupplyTracker"
            className="h-10 md:h-12 lg:h-14 w-auto max-w-[320px] object-contain"
          />
        </div>

        {/* Top nav removed: workspace navigation lives in Studio Tools/sidebar */}

        {/* Actions */}
        <div className="flex min-w-fit items-center gap-3">
          {/* Placeholder: last-session resume — wire to last active project/view when session state exists */}
          <button className="flex items-center gap-2 rounded-xl border border-ast-purple/30 bg-white/5 px-3 py-1.5 text-sm text-pink-300 transition hover:border-ast-yellow/70 hover:bg-ast-yellow/20 hover:text-ast-yellow">
            <span>✧</span>
            What was I working on?
          </button>
<span className="text-sm font-medium bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
  {userEmail || 'Artist'}
</span>
          <button
  onClick={handleSignOut}
  className="rounded-xl border border-pink-400/60 px-4 py-2 text-sm text-pink-200 hover:bg-pink-500/20"
>
  Sign Out
</button>
        </div>
      </div>
    </header>
  );
}