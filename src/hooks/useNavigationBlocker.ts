// src/hooks/useNavigationBlocker.ts
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

enum CheckoutStep {
  QUESTION_FORM = 'question-form',
  PAYMENT_INFO = 'payment-info',
}

export function useNavigationBlocker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showId, eventId, step } = useParams<{
    showId: string;
    eventId: string;
    step: string;
  }>();

  // only block when we're actually on the question-form step
  const isBlocking = step === CheckoutStep.QUESTION_FORM;

  const [showModal, setShowModal] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);

  // expose unblock so you could programmatically turn it off if needed
  const unblock = useCallback(() => {
    setShowModal(false);
  }, []);

  // only hook into popstate & beforeunload when blocking
  useEffect(() => {
    if (!isBlocking) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setTargetPath(window.location.pathname);
      setShowModal(true);
      // restore original
      window.history.pushState(null, '', location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    // prime history so back/forward will fire a popstate
    window.history.pushState(null, '', location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isBlocking, location.pathname]);

  const handleConfirmNavigationClick = useCallback(async () => {
    // user chose “yes, leave”
    const next = targetPath ?? `/events/${eventId}/bookings/${showId}/select-ticket`;
    unblock();                     // close modal & disable blocking
    navigate(next, { replace: true });
  }, [eventId, showId, navigate, targetPath, unblock]);

  const handleCancelNavigationClick = useCallback(() => {
    // user chose “stay”
    setShowModal(false);
    // restore the URL to what it was
    window.history.pushState(null, '', location.pathname);
  }, [location.pathname]);

  return {
    showModal,
    handleConfirmNavigationClick,
    handleCancelNavigationClick,
    unblock,
  };
}
