import React from 'react';
import { LoadScriptOnlyIfNeeded } from './LoadScriptsOnlyIfNeeded';

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  return (
    <LoadScriptOnlyIfNeeded
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      libraries={[]}
    >
      {children}
    </LoadScriptOnlyIfNeeded>
  );
};
