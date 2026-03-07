import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalHeader from './components/header/GlobalHeader';
import { GlobalLoaderProvider } from './context/GlobalLoaderContext';
import PageLoader from './components/common/PageLoader';

const HomePage = lazy(() => import('./pages/HomePage'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const ExperienceDetailPage = lazy(() => import('./pages/ExperienceDetailPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const OfferDetailPage = lazy(() => import('./pages/OfferDetailPage'));
const PropertyDetail = lazy(() => import('./components/property/PropertyDetail'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TransportPage = lazy(() => import('./pages/TransportPage'));
const ItineraryPage = lazy(() => import('./pages/ItineraryPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

function App() {
  return (
    <Router>
      <GlobalLoaderProvider>
        <Suspense fallback={<PageLoader fullScreen />}>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stays" element={<SearchResultsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route
            path="/category/:categoryName"
            element={
              <>
                <GlobalHeader />
                <CategoryPage />
              </>
            }
          />
          <Route
            path="/experiences"
            element={
              <>
                <GlobalHeader />
                <ExperiencesPage />
              </>
            }
          />
          <Route
            path="/experiences/:id"
            element={
              <>
                <GlobalHeader />
                <ExperienceDetailPage />
              </>
            }
          />
          <Route
            path="/transport"
            element={
              <>
                <GlobalHeader />
                <TransportPage />
              </>
            }
          />
          <Route
            path="/itinerary"
            element={
              <>
                <GlobalHeader />
                <ItineraryPage />
              </>
            }
          />
          <Route
            path="/offers"
            element={
              <>
                <GlobalHeader />
                <OffersPage />
              </>
            }
          />
          <Route
            path="/offers/:id"
            element={
              <>
                <GlobalHeader />
                <OfferDetailPage />
              </>
            }
          />
          <Route
            path="/property/:id"
            element={
              <>
                <GlobalHeader />
                <PropertyDetail />
              </>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <>
                <GlobalHeader />
                <BookingPage />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <GlobalHeader />
                <UserDashboard />
              </>
            }
          />
          <Route
            path="/support"
            element={
              <>
                <GlobalHeader />
                <SupportPage />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <GlobalHeader />
                <LoginPage />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <GlobalHeader />
                <LoginPage />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <GlobalHeader />
                <LoginPage />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <GlobalHeader />
                <LoginPage />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <GlobalHeader />
                <ForgotPasswordPage />
              </>
            }
          />
          <Route
            path="/reset-password"
            element={
              <>
                <GlobalHeader />
                <ResetPasswordPage />
              </>
            }
          />
          </Routes>
        </Suspense>
      </GlobalLoaderProvider>
    </Router>
  );
}

export default App;
