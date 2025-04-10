import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// // no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(
  () => import('@/components/layouts/AuthLayout/AuthLayout'),
);

import MainLayout from '@/components/layouts/main/MainLayout/MainLayout';

import RequireAuth from '@/components/router/RequireAuth';
const EventDetailPage = React.lazy(() => import('@/pages/EventDetailPage'));
const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const SearchResult = React.lazy(() => import('@/pages/SearchResult'));
const InterestedPage = React.lazy(() => import('@/pages/InterestedPage'));
const OrderHistory = React.lazy(() => import('@/pages/OrderHistory'));
const TicketOrder = React.lazy(() => import('@/pages/TicketOrder'));

import { withLoading } from '@/hocs/withLoading.hoc';
import { SignIn, SignUp } from '@clerk/clerk-react';

const AuthLayoutFallback = withLoading(AuthLayout);
export const HOME_PATH = '/';

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PATH} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search-result" element={<SearchResult />} />
          <Route path="interested" element={<InterestedPage />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="ticket-order/:orderId" element={<TicketOrder />} />
        </Route>

        <Route path={HOME_PATH} element={protectedLayout}>
          <Route path=":slug" element={<EventDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<SignIn signUpUrl="/auth/sign-up" />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
