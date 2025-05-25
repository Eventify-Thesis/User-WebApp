import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

// // no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(
  () => import('@/components/layouts/AuthLayout/AuthLayout'),
);

import MainLayout from '@/components/layouts/main/MainLayout/MainLayout';

import RequireAuth from '@/components/router/RequireAuth';
const EventDetailPage = React.lazy(() => import('@/pages/EventDetailPage'));
const PurchasedEventDetailPage = React.lazy(
  () => import('@/pages/PurchasedEventDetailPage'),
);
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const SearchResult = React.lazy(() => import('@/pages/SearchResult'));
const InterestedPage = React.lazy(() => import('@/pages/InterestedPage'));
const OrderHistory = React.lazy(() => import('@/pages/OrderHistory'));
const TicketOrder = React.lazy(() => import('@/pages/TicketOrder'));
const QuizPage = React.lazy(() => import('@/pages/QuizPage'));
const QuizResultPage = React.lazy(() => import('@/pages/QuizResultPage'));
const EventSelectTicketPage = React.lazy(
  () => import('@/pages/EventSelectTicketPage'),
);

const CheckoutSuccessPage = React.lazy(
  () => import('@/pages/CheckoutSuccessPage'),
);

// New Mantine quiz pages
const QuizCodeEntryPage = React.lazy(() => import('@/pages/QuizCodeEntryPage'));
const QuizWaitingRoomPage = React.lazy(
  () => import('@/pages/QuizWaitingRoomPage'),
);
const QuizPlayPage = React.lazy(() => import('@/pages/QuizPlayPage'));

import { withLoading } from '@/hocs/withLoading.hoc';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { PaymentStep, QuestionStep } from '../checkout/steps';
import ScrollToTop from '@/components/common/ScrollToTop';

const AuthLayoutFallback = withLoading(AuthLayout);
export const HOME_PATH = '/';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* everything lives under the same MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* public pages */}
          <Route index element={<HomePage />} />
          <Route path="search-result" element={<SearchResult />} />
          <Route path="interested" element={<InterestedPage />} />
          <Route path="tickets" element={<OrderHistory />} />
          <Route path="orders/:orderId" element={<TicketOrder />} />
          <Route path=":slug" element={<EventDetailPage />} />
          <Route
            path="purchased/:slug/:showId"
            element={<PurchasedEventDetailPage />}
          />
          {/* Legacy quiz pages */}
          <Route path="quiz/:showId" element={<QuizPage />} />
          <Route path="quiz-result/:showId" element={<QuizResultPage />} />

          {/* New Mantine quiz pages */}
          <Route path="quiz-entry" element={<QuizCodeEntryPage />} />
          <Route path="quiz-waiting/:code" element={<QuizWaitingRoomPage />} />
          <Route path="quiz-play/:code" element={<QuizPlayPage />} />

          {/* protected subtree */}
          <Route
            element={
              <RequireAuth>
                <Outlet />
              </RequireAuth>
            }
          >
            <Route
              path="events/:eventId/bookings/:showId/select-ticket"
              element={<EventSelectTicketPage />}
            />

            <Route
              path="events/:eventId/bookings/:showId"
              element={<CheckoutPage />}
            >
              {/* nested steps here */}+{' '}
              <Route index element={<Navigate to="question-form" replace />} />
              <Route path="question-form" element={<QuestionStep />} />
              <Route path="payment-info" element={<PaymentStep />} />
            </Route>

            <Route
              path="checkout/:orderId/success"
              element={<CheckoutSuccessPage />}
            />
          </Route>
        </Route>

        {/* auth routes (outside MainLayout) */}
        <Route path="auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<SignIn signUpUrl="/auth/sign-up" />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
