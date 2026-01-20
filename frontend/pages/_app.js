import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnifiedProvider } from '../src/context/UnifiedContext';
import { RequestCallbackProvider } from '../src/context/RequestCallbackContext';
import { AuthProvider } from '../src/context/AuthContext';
import { AuthGate } from '../src/components/auth';
import NavigationBar from '../src/components/NavigationBar';
import MicrosoftClarity from '../src/components/analytics/MicrosoftClarity';
import '../src/styles/globals.css';
import useGTMSectionTracking from '../src/hooks/useGTMSectionTracking';
import { initializeUtmPropagation } from '../src/utils/analytics';
import lazyLoadGtm, { pushServerEvents } from '../src/utils/gtm';
import tracker from '../src/utils/tracker';
import { getURLWithUTMParams } from '../src/utils/url';
import attribution from '../src/utils/attribution';
import { PRODUCTS } from '../src/constants/analytics';

function MyApp({ Component, pageProps }) {
  const [quizProgress, setQuizProgress] = useState(0);
  const [quizMode, setQuizMode] = useState('final'); // Default to 'final' mode
  const router = useRouter();
  useGTMSectionTracking();

  // Single ping on app load to wake up backend (if deployed)
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    fetch(`${apiUrl}/health`, { method: 'GET' })
      .then(() => {})
      .catch(() => {}); // Silent fail
  }, []);

  // Initialize UTM propagation and GTM (once)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    initializeUtmPropagation();
    lazyLoadGtm();
    pushServerEvents();
    if (window.clarity) {
      window.clarity('set', 'experiment', 'new_crt_revamp');
    }
  }, []);

  // Track pageviews on route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const product = PRODUCTS.CRT_PAGE;
    const subProduct = 'career_roadmap_tool';

    const sendPageView = () => {
      const pageUrl = getURLWithUTMParams();
      const url = new URL(window.location.href);

      tracker.superAttributes = {
        attributes: {
          product,
          subproduct: subProduct,
          page_path: url.pathname,
          page_url: url.href,
          query_params: Object.fromEntries(url.searchParams.entries()),
          page_variant: url.pathname === '/roadmap-experimental-v2' ? 'roadmap_experimental_v2' : undefined
        }
      };

      attribution.setPlatform();
      attribution.setProduct(product);
      tracker.pageview({
        page_url: pageUrl
      });
    };

    // Initial pageview
    sendPageView();
    // SPA route change pageviews
    const handleRouteChange = () => {
      sendPageView();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Roadmap pages have their own navbar - ALWAYS hide the old NavigationBar
  const isRoadmapPage = ['/roadmap', '/roadmap-new', '/roadmap-new-2', '/roadmap-experimental', '/roadmap-experimental-v2'].includes(router.pathname);
  // Quiz and home page hide nav only in final mode
  const hideNavForQuizMode = quizMode === 'final' && (router.pathname === '/quiz' || router.pathname === '/');
  const shouldShowNav = !(isRoadmapPage || hideNavForQuizMode);

  // Admin pages have their own auth - skip AuthGate for them
  const isAdminPage = router.pathname.startsWith('/admin');

  const pageContent = (
    <>
      {shouldShowNav && (
        <NavigationBar
          progress={quizProgress}
          quizMode={quizMode}
          onQuizModeChange={setQuizMode}
        />
      )}
      <Component
        {...pageProps}
        onProgressChange={setQuizProgress}
        quizMode={quizMode}
      />
    </>
  );

  return (
    <>
      <MicrosoftClarity />
      <AuthProvider>
        <UnifiedProvider>
          <RequestCallbackProvider>
            {isAdminPage ? (
              // Admin pages have their own authentication
              pageContent
            ) : (
              <AuthGate
                loadingMessage="Loading..."
                loadingSubtitle="Please wait while we verify your session"
                redirectDelay={3}
              >
                {pageContent}
              </AuthGate>
            )}
          </RequestCallbackProvider>
        </UnifiedProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
