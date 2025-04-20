import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bookingClient } from '@/api/booking.client';
import { getBookingCode } from '@/services/localStorage.service';

export function useNavigationBlocker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showId, eventId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [lastLocation, setLastLocation] = useState<string | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);


  const handleConfirmNavigationClick = useCallback(async () => {
    setShowModal(false);
    const bookingCode = showId ? getBookingCode(showId) : null;
    if (bookingCode) {
      try {
        await bookingClient.cancelBooking(Number(showId), bookingCode);
        // Clear booking code from localStorage after successful cancellation
        localStorage.removeItem(`booking_code_${showId}`);
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
    // Set confirmed navigation to true and navigate
    setConfirmedNavigation(true);

    console.log('herhehrhe hre s00')
    navigate(`/events/${eventId}/bookings/${showId}/select-ticket`, { replace: true });
  }, [showId, eventId, navigate]);

  const handleCancelNavigationClick = useCallback(() => {
    setShowModal(false);
    window.history.pushState(null, '', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation);
    }
  }, [confirmedNavigation, lastLocation, navigate]);

  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);

    const handlePopstate = (event: PopStateEvent) => {
      event.preventDefault();
      if (!showModal) {
        setLastLocation(window.location.pathname);
        setShowModal(true);
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [location.pathname, showModal]);

  return {
    showModal,
    handleConfirmNavigationClick,
    handleCancelNavigationClick,
  };
}
