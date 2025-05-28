import React from 'react';

interface CustomMarkerProps {
  event: any;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  event,
  isSelected = false,
  onClick,
}) => {
  const formatPrice = (price?: number) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const markerStyle: React.CSSProperties = {
    position: 'relative',
    cursor: 'pointer',
    transform: 'translate(-50%, -100%)',
    transition: 'all 0.2s ease-in-out',
    zIndex: isSelected ? 1000 : 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  };

  const imageContainerStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const fallbackIconStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#666',
  };

  const nameTagStyle: React.CSSProperties = {
    backgroundColor: isSelected ? '#2563eb' : '#ef4444',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    border: '2px solid white',
    maxWidth: '200px',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const pinStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: `12px solid ${isSelected ? '#2563eb' : '#ef4444'}`,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
  };

  const pulseStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: isSelected ? '#2563eb' : '#ef4444',
    opacity: 0.2,
    transform: 'translate(-50%, -50%)',
    animation: isSelected ? 'pulse 2s infinite' : 'none',
    zIndex: -1,
  };

  // Get category icon
  const getCategoryIcon = (categories: string[]) => {
    if (!categories || categories.length === 0) return '📅';

    const category = categories[0].toLowerCase();
    const iconMap: { [key: string]: string } = {
      music: '🎵',
      sports: '⚽',
      theater: '🎭',
      art: '🎨',
      food: '🍽️',
      technology: '💻',
      business: '💼',
      education: '📚',
      health: '🏥',
      entertainment: '🎪',
      festival: '🎉',
      conference: '🎤',
      workshop: '🔧',
      exhibition: '🖼️',
      comedy: '😂',
      dance: '💃',
      film: '🎬',
      fashion: '👗',
      gaming: '🎮',
      travel: '✈️',
    };

    return iconMap[category] || '📅';
  };

  return (
    <div style={markerStyle} onClick={onClick}>
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.2;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 0.1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.2;
            }
          }
        `}
      </style>

      {/* Pulse effect */}
      <div style={pulseStyle} />

      {/* Event image or category icon */}
      <div style={imageContainerStyle}>
        {event.eventLogoUrl || event.eventBannerUrl ? (
          <img
            src={event.eventLogoUrl || event.eventBannerUrl}
            alt={event.eventName}
            style={imageStyle}
            onError={(e) => {
              // Fallback to category icon if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}
        <span
          style={{
            ...fallbackIconStyle,
            display:
              event.eventLogoUrl || event.eventBannerUrl ? 'none' : 'block',
          }}
        >
          {getCategoryIcon(event.categories)}
        </span>
      </div>

      {/* Name tag */}
      <div style={{ position: 'relative' }}>
        <div style={nameTagStyle}>{event.eventName}</div>
        <div style={pinStyle} />
      </div>
    </div>
  );
};
