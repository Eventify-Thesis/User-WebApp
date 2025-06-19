import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  OverlayView,
} from '@react-google-maps/api';
import { Grid, Box, Loader } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { ModernEventFilters } from '@/components/search-result/ModernEventFilters';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import * as s from '@/components/search-result/SearchResult.styles';
import { Loading } from '@/components/common/Loading/Loading';
import type { FilterData } from '@/components/search-result/ModernEventFilters';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { CustomMarker } from '@/components/search-result/CustomMarker';
import { GridEventCard } from '@/components/search-result/GridEventCard';
import { GoogleMapsProvider } from '@/components/providers/GoogleMapsProvider';

function useQueryParam(key: string) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(key);
}

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: 10.8231, // Ho Chi Minh City coordinates
  lng: 106.6297,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  // Disable automatic location detection
  clickableIcons: false,
  gestureHandling: 'greedy',
};

function SearchResults() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const query = useQueryParam('query') || '';
  const categoryParam = useQueryParam('categories');
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null]);
  const [filterData, setFilterData] = useState<FilterData>({
    locationValue: '',
    locationDisplay: '',
    categories: categoryParam ? categoryParam.split(',') : [],
  });
  const { userId } = useAuth();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [mapBounds, setMapBounds] = useState<{
    min_lat?: number;
    max_lat?: number;
    min_lon?: number;
    max_lon?: number;
  }>({});
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [shouldAutoFit, setShouldAutoFit] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const searchParams = {
    query,
    limit: 12, // Increased for grid layout
    page,
    startDate: selectedDates[0]
      ? selectedDates[0].format('YYYY-MM-DD')
      : undefined,
    endDate: selectedDates[1]
      ? selectedDates[1].format('YYYY-MM-DD')
      : undefined,
    categories: filterData?.categories?.length ? filterData.categories : [],
    city: filterData.locationValue || undefined,
    // Only include map bounds if user has interacted with the map
    ...(isInitialLoad ? {} : mapBounds),
  };

  console.log('Search params with bounds:', searchParams);
  console.log('Map bounds state:', mapBounds);
  console.log('Is initial load:', isInitialLoad);

  const { data: searchResults = [], isFetching } =
    useSearchSemanticEvents(searchParams);

  // Debounced function to handle map bounds change
  const debouncedBoundsChange = useDebouncedCallback(
    (bounds: google.maps.LatLngBounds) => {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const newBounds = {
        min_lat: sw.lat(),
        max_lat: ne.lat(),
        min_lon: sw.lng(),
        max_lon: ne.lng(),
      };

      setMapBounds(newBounds);
      setPage(1); // Reset to first page when bounds change
      setMapLoading(false);
      setIsInitialLoad(false); // Mark that we're no longer in initial load
    },
    300,
  );

  // Handle map idle event (when user stops dragging/zooming)
  const handleMapIdle = useCallback(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        if (isInitialLoad) {
          // First time user interacts with map - start applying bounds
          setIsInitialLoad(false);
        } else {
          // User has interacted before - apply bounds filtering
          setMapLoading(true);
          debouncedBoundsChange(bounds);
        }
      }
    }
  }, [debouncedBoundsChange, isInitialLoad]);

  // Handle map load
  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      setIsMapLoaded(true);
      console.log('Map loaded successfully');

      // Disable any automatic location detection
      try {
        // Prevent the map from automatically centering to user location
        if (navigator.geolocation) {
          const originalGetCurrentPosition =
            navigator.geolocation.getCurrentPosition;
          navigator.geolocation.getCurrentPosition = () => {
            console.log('Blocked automatic geolocation request');
          };

          // Restore after a delay
          setTimeout(() => {
            navigator.geolocation.getCurrentPosition =
              originalGetCurrentPosition;
          }, 5000);
        }
      } catch (error) {
        console.log('Could not disable geolocation:', error);
      }

      // Add listeners for user interaction
      map.addListener('dragstart', () => {
        console.log('User started dragging - disabling auto fit');
        setIsInitialLoad(false);
        setShouldAutoFit(false);
      });

      map.addListener('zoom_changed', () => {
        console.log('User changed zoom - disabling auto fit');
        setIsInitialLoad(false);
        setShouldAutoFit(false);
      });
    },
    [isInitialLoad],
  );

  // Accumulate results and check if we have more to load
  useEffect(() => {
    if (page === 1) {
      setEvents(searchResults);
    } else if (searchResults.length) {
      setEvents((prev) => [...prev, ...searchResults]);
    }
    setHasMore(searchResults.length >= 1);
  }, [searchResults, page]);

  // Handle scroll to bottom for infinite loading
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Setup scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (categoryParam) {
      setFilterData((fd) => ({ ...fd, categories: [categoryParam] }));
    }
  }, [categoryParam]);

  useEffect(() => {
    if (query) {
      setPage(1); // Reset to first page when query changes
    }
  }, [query]);

  // Reset auto-fit when any filters change
  useEffect(() => {
    // Reset auto-fit behavior when any filter changes
    setShouldAutoFit(true);
    setIsInitialLoad(true);
    setMapBounds({}); // Clear map bounds to show all events initially
    console.log('🔄 Filters changed - resetting auto-fit for:', {
      query,
      categories: filterData.categories,
      location: filterData.locationValue,
      startDate: selectedDates[0]?.format('YYYY-MM-DD'),
      endDate: selectedDates[1]?.format('YYYY-MM-DD'),
    });
  }, [
    query,
    selectedDates[0]?.format('YYYY-MM-DD'), // Format to string to avoid object comparison issues
    selectedDates[1]?.format('YYYY-MM-DD'),
    JSON.stringify(filterData.categories), // Stringify array for proper comparison
    filterData.locationValue,
  ]);

  const formattedEvents = events.map((event) => ({
    id: event.id.toString(),
    eventName: event.eventName,
    minimumPrice: event.minimumPrice,
    startTime: event.startTime,
    eventLogoUrl: event.eventLogoUrl,
    isInterested: event.isInterested ?? false,
    // Handle both formats: nested location object and direct lat/lng fields
    latitude: event.location?.lat || event.latitude,
    longitude: event.location?.lon || event.longitude,
    formattedAddress: event.formattedAddress,
    ...event,
  }));

  // Filter events that have valid coordinates for map display
  const eventsWithCoordinates = formattedEvents.filter(
    (event) => event.latitude && event.longitude,
  );

  // Simple bounds fitting - only runs once when conditions are met
  useEffect(() => {
    if (
      isMapLoaded &&
      eventsWithCoordinates.length > 0 &&
      shouldAutoFit &&
      mapRef.current
    ) {
      console.log('🗺️ Auto-fitting map to events');

      const bounds = new google.maps.LatLngBounds();
      eventsWithCoordinates.forEach((event) => {
        if (event.latitude && event.longitude) {
          bounds.extend(
            new google.maps.LatLng(event.latitude, event.longitude),
          );
        }
      });

      if (!bounds.isEmpty()) {
        // Simple one-time fit with a small delay to ensure events are rendered
        setTimeout(() => {
          if (mapRef.current && shouldAutoFit) {
            mapRef.current.fitBounds(bounds);
            console.log('✅ Map fitted to events');
            setShouldAutoFit(false); // Disable auto-fit after first successful fit
          }
        }, 500); // Reduced delay for better responsiveness
      }
    }
  }, [isMapLoaded, eventsWithCoordinates, shouldAutoFit]); // Changed dependency to eventsWithCoordinates instead of just length

  // Manual bounds fitting function for testing
  const manualFitBounds = () => {
    if (mapRef.current && eventsWithCoordinates.length > 0) {
      console.log('🔧 MANUAL BOUNDS FITTING TRIGGERED');
      const bounds = new google.maps.LatLngBounds();
      eventsWithCoordinates.forEach((event) => {
        if (event.latitude && event.longitude) {
          bounds.extend(
            new google.maps.LatLng(event.latitude, event.longitude),
          );
        }
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds);
        console.log('🔧 Manual fit completed');
      }
    }
  };

  // Reset bounds fitting function
  const resetBoundsFitting = () => {
    setShouldAutoFit(true);
    console.log('🔄 Auto-fit enabled - will auto-fit on next update');
  };

  // Format price for InfoWindow
  const formatPrice = (price?: number) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Responsive styles
  const getResponsiveContainerStyle = () => ({
    height: isMobile ? '50vh' : '100vh',
    zIndex: 10,
  });

  const getResponsiveMapStyle = () => ({
    width: '100%',
    height: isMobile ? '50vh' : '100%',
    zIndex: 10,
  });

  return (
    <Grid
      style={{
        margin: 0,
        height: '100vh',
        padding: '0 0 !important',
      }}
    >
      {/* Left side: Filters and Results */}
      <Grid.Col
        span={{ base: 12, md: 6 }}
        style={{
          padding: '0 0 !important',
          ...getResponsiveContainerStyle(),
        }}
      >
        <Box
          id="sub-main-content"
          ref={containerRef}
          style={{
            height: '100%',
            overflowY: 'auto',
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ModernEventFilters
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            filterData={filterData}
            setFilterData={setFilterData}
          />
          {isFetching && page === 1 ? (
            <Loading />
          ) : formattedEvents.length > 0 ? (
            <>
              <div
                style={{
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  alignItems: 'start',
                  flex: 1,
                }}
              >
                {formattedEvents.map((event) => (
                  <GridEventCard
                    key={event.id}
                    event={event}
                    onInterestToggle={(eventId: string) => {
                      // Handle interest toggle
                      // TODO: Implement interest toggle API call
                    }}
                    onClick={() => {
                      // Navigate to event detail page
                      navigate(`/${event.url}-${event.id}`);
                    }}
                  />
                ))}
              </div>
              {isFetching && <Loading />}
              {!hasMore && (
                <p
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    padding: '16px',
                  }}
                >
                  No more events to load
                </p>
              )}
            </>
          ) : (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '40px 20px',
              }}
            >
              <s.SadIcon />
              <s.NoEventsText>
                {t('searchResult.noAvailableEvents')}
              </s.NoEventsText>
            </Box>
          )}
        </Box>
      </Grid.Col>

      {/* Right side: Google Map */}
      <Grid.Col
        span={{ base: 12, md: 6 }}
        style={{
          padding: 0,
          position: 'relative',
          ...getResponsiveContainerStyle(),
        }}
      >
        <GoogleMap
          mapContainerStyle={getResponsiveMapStyle()}
          center={defaultCenter}
          zoom={12}
          options={mapOptions}
          onLoad={handleMapLoad}
          onIdle={handleMapIdle}
        >
          {/* Render custom markers for events with coordinates */}
          {eventsWithCoordinates.map((event) => (
            <OverlayView
              key={event.id}
              position={{
                lat: event.latitude,
                lng: event.longitude,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CustomMarker
                event={event}
                isSelected={selectedEvent?.id === event.id}
                onClick={() => setSelectedEvent(event)}
              />
            </OverlayView>
          ))}

          {/* Info window for selected event */}
          {selectedEvent && (
            <InfoWindow
              position={{
                lat: selectedEvent.latitude,
                lng: selectedEvent.longitude,
              }}
              onCloseClick={() => setSelectedEvent(null)}
            >
              <div
                style={{ color: 'black', maxWidth: '280px', padding: '4px' }}
              >
                {/* Event Image */}
                {(selectedEvent.eventLogoUrl ||
                  selectedEvent.eventBannerUrl) && (
                  <div
                    style={{
                      width: '100%',
                      height: '120px',
                      marginBottom: '12px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    <img
                      src={
                        selectedEvent.eventLogoUrl ||
                        selectedEvent.eventBannerUrl
                      }
                      alt={selectedEvent.eventName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        navigate(`/${selectedEvent.url}-${selectedEvent.id}`)
                      }
                      onError={(e) => {
                        // Hide image if it fails to load
                        const target = e.target as HTMLImageElement;
                        target.parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.3',
                    cursor: 'pointer',
                    color: '#1a1a1a',
                  }}
                  onClick={() =>
                    navigate(`/${selectedEvent.url}-${selectedEvent.id}`)
                  }
                >
                  {selectedEvent.eventName}
                </h3>

                {selectedEvent.venueName && (
                  <p
                    style={{
                      margin: '0 0 6px 0',
                      fontSize: '13px',
                      color: '#555',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    📍 {selectedEvent.venueName}
                  </p>
                )}

                {selectedEvent.formattedAddress && (
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '11px',
                      color: '#777',
                      lineHeight: '1.3',
                    }}
                  >
                    {selectedEvent.formattedAddress}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '12px',
                  }}
                >
                  {selectedEvent.minimumPrice !== undefined && (
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color:
                          selectedEvent.minimumPrice === 0
                            ? '#28a745'
                            : '#2563eb',
                      }}
                    >
                      {formatPrice(selectedEvent.minimumPrice)}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/${selectedEvent.url}-${selectedEvent.id}`);
                    }}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* No events with coordinates message */}
        {formattedEvents.length > 0 && eventsWithCoordinates.length === 0 && (
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            <p style={{ margin: '0', fontSize: '14px' }}>
              {t(
                'searchResult.noEventsWithLocation',
                'No events found with location data in this area',
              )}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
              Try adjusting your search filters or zoom out to see more events
            </p>
          </Box>
        )}

        {/* Manual fit bounds buttons */}
        <Box
          style={{
            position: 'absolute',
            top: '16px',
            left: '10px',
            zIndex: 10,
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={manualFitBounds}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            Fit to Events ({eventsWithCoordinates.length})
          </button>
          <button
            onClick={resetBoundsFitting}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            Reset Auto-Fit
          </button>
        </Box>

        {/* Map loading indicator */}
        {mapLoading && (
          <Box
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1000,
            }}
          >
            <Loader size="sm" color="white" />
            <span style={{ fontSize: '12px' }}>Updating results...</span>
          </Box>
        )}
      </Grid.Col>
    </Grid>
  );
}

// Wrap the SearchResults component with GoogleMapsProvider
export default function SearchResultWithGoogleMaps() {
  return (
    <GoogleMapsProvider>
      <SearchResults />
    </GoogleMapsProvider>
  );
}
