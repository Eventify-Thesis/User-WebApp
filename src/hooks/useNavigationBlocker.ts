import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bookingClient } from '@/api/booking.client';
import { getBookingCode, removeBookingCode } from '@/services/localStorage.service';

export function useNavigationBlocker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showId, eventId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [targetLocation, setTargetLocation] = useState<string | null>(null);

  // Handle browser back/forward buttons and programmatic navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (!showModal) {
        setShowModal(true);
        setTargetLocation(window.location.pathname);
        // Push current path to prevent navigation
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.history.pushState(null, '', location.pathname);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname, showModal]);

  const handleConfirmNavigationClick = useCallback(async () => {
    try {
      const bookingCode = showId ? getBookingCode(showId) : null;
      
      // First navigate to select-ticket to avoid the booking code check redirect
      const targetPath = `/events/${eventId}/bookings/${showId}/select-ticket`;
      navigate(targetPath, { replace: true });

      // Then clean up the booking
      if (bookingCode) {
        removeBookingCode(showId);
        try {
          await bookingClient.cancelBooking(Number(showId), bookingCode);
        } catch (error) {
          console.error('Failed to cancel booking:', error);
        }
      }

      // Close modal after everything is done
      setShowModal(false);
    } catch (error) {
      console.error('Navigation error:', error);
      // Ensure we still navigate even if there's an error
      const fallbackPath = `/events/${eventId}/bookings/${showId}/select-ticket`;
      navigate(fallbackPath, { replace: true });
    }
  }, [showId, eventId, navigate]);

  const handleCancelNavigationClick = useCallback(() => {
    setShowModal(false);
    setTargetLocation(null);
    // Stay on current page
    window.history.pushState(null, '', location.pathname);
  }, [location.pathname]);

  // Block programmatic navigation
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (location.pathname !== currentPath && !showModal) {
      setShowModal(true);
      setTargetLocation(location.pathname);
      window.history.pushState(null, '', currentPath);
    }
  }, [location.pathname, showModal]);

  return {
    showModal,
    handleConfirmNavigationClick,
    handleCancelNavigationClick,
  };
}
