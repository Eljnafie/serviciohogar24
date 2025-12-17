import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';

// Lazy Load Pages
const Home = lazy(() => import('./components/Home'));
const Services = lazy(() => import('./components/Services'));
const Contact = lazy(() => import('./components/Contact'));
const Blog = lazy(() => import('./components/Blog'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const BookingWizard = lazy(() => import('./components/BookingWizard'));
const BlogPostDetail = lazy(() => import('./components/BlogPostDetail'));
const ServiceZone = lazy(() => import('./components/ServiceZone'));
const CoverageDirectory = lazy(() => import('./components/CoverageDirectory'));
const NotFound = lazy(() => import('./components/NotFound'));

// Loading Spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ToastProvider>
      <HashRouter>
        <ScrollToTop />
        <CookieConsent />
        <ToastContainer />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="booking" element={<BookingWizard />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPostDetail />} />
              <Route path="zona/:zone/:serviceSlug" element={<ServiceZone />} />
              <Route path="cobertura" element={<CoverageDirectory />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ToastProvider>
  );
};

export default App;