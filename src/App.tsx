/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SecretPasscodeModal } from './components/SecretPasscodeModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LandingPageView } from './components/LandingPageView';
import { getLocalContent, SiteContent } from './lib/contentStore';

export default function App() {
  const [content, setContent] = React.useState<SiteContent>(() => getLocalContent());
  const [isAdminRoute, setIsAdminRoute] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin';
  });
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = React.useState(false);

  // Listen to browser navigation (back/forward, URL hash)
  React.useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      setIsAdminRoute(path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin');
    };
    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, []);

  // Listen to content updates
  React.useEffect(() => {
    const handleContentUpdate = () => {
      setContent(getLocalContent());
    };
    window.addEventListener('contentUpdated', handleContentUpdate);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate);
  }, []);

  // Secret Multi-Tap Listener: 5 taps in 1.5 seconds on brand crest or footer
  const tapTimestampsRef = React.useRef<number[]>([]);
  const handleSecretTap = () => {
    const now = Date.now();
    tapTimestampsRef.current = [...tapTimestampsRef.current.filter((t) => now - t <= 1500), now];
    if (tapTimestampsRef.current.length >= 5) {
      tapTimestampsRef.current = [];
      setIsPasscodeModalOpen(true);
    }
  };

  // Keyboard shortcut Ctrl+Shift+A or Cmd+Shift+A
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsPasscodeModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  if (isAdminRoute) {
    return <AdminDashboard onExit={navigateToHome} />;
  }

  return (
    <>
      <LandingPageView content={content} onSecretTap={handleSecretTap} />

      {/* SECRET PASSCODE GATEWAY MODAL (Accessible via 5-tap on footer/logo or Ctrl+Shift+A) */}
      <SecretPasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        correctPasscode={content.general?.passcode || '1234'}
        onSuccess={() => {
          setIsPasscodeModalOpen(false);
          navigateToAdmin();
        }}
      />
    </>
  );
}
