import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { initZalo } from './lib/zalo-init';
import { WelcomePage } from './pages/index';
import { ConsentPage } from './pages/consent';
import { PrivacyPage } from './pages/privacy';
import { NewReadingPage } from './pages/reading/new';
import { UploadPage } from './pages/reading/[id]/upload';
import { SurveyPage } from './pages/reading/[id]/survey';
import { ProcessingPage } from './pages/reading/[id]/processing';
import { ReportPage } from './pages/reading/[id]/report';
import { MentorPage } from './pages/reading/[id]/mentor';
import { DashboardPage } from './pages/dashboard';

/**
 * Root component.
 *
 * `HashRouter` keeps every route under a single `index.html` — required by
 * the Zalo Mini App CDN, which doesn't rewrite arbitrary paths.
 *
 * Zalo SDK is initialized once on mount; failures fall back to a guest profile
 * (allows local Vite dev outside the Zalo client).
 */
export function App() {
  useEffect(() => {
    // Fire-and-forget. Failures cached as guest user inside initZalo.
    void initZalo()
      .then((u) => {
        window.sessionStorage.setItem('hieu.user_id', u.id);
        window.sessionStorage.setItem('hieu.user_name', u.name);
      })
      .catch((err) => {
        console.warn('[app] initZalo unexpected error:', err);
      });
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/consent" element={<ConsentPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/reading/new" element={<NewReadingPage />} />
        <Route path="/reading/:id/upload" element={<UploadPage />} />
        <Route path="/reading/:id/survey" element={<SurveyPage />} />
        <Route path="/reading/:id/processing" element={<ProcessingPage />} />
        <Route path="/reading/:id/report" element={<ReportPage />} />
        <Route path="/reading/:id/mentor" element={<MentorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  );
}
