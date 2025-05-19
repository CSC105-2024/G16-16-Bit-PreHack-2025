import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const MapView = ({ 
  location, 
  isEditable = false, 
  onLocationChange,
  height = "400px"
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBVF0jgp4oHCSyrrJf-it4xjLZskMGpy3U"
  });
  
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({
    lat: location?.lat || 40.7128,
    lng: location?.lng || -74.0060
  });
  
  useEffect(() => {
    if (location) {
      setCenter({ lat: location.lat, lng: location.lng });
    }
  }, [location]);
  
  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);
  
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  
  const handleMapClick = useCallback((e) => {
    if (!isEditable || !onLocationChange) return;
    
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;
    
    // In a real app, we would use a geocoding service to get the address from coordinates
    // This is simplified for the demo
    const newLocation = {
      lat,
      lng,
      address: `Selected Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
      city: "Unknown City",
      country: "Unknown Country"
    };
    
    onLocationChange(newLocation);
  }, [isEditable, onLocationChange]);
  
  if (!isLoaded) {
    return (
      <div 
        className="bg-gray-100 animate-pulse rounded-lg flex items-center justify-center" 
        style={{ height }}
      >
        <div className="text-gray-400">Loading map...</div>
      </div>
    );
  }
  
  return (
    <div style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true
        }}
      >
        {location && (
          <Marker
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => setSelectedLocation(location)}
            icon={{
              url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%233b82f6" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
              scaledSize: new window.google.maps.Size(36, 36),
              anchor: new window.google.maps.Point(18, 36)
            }}
          />
        )}
        
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-1">
              <p className="font-medium text-sm">{selectedLocation.address}</p>
              <p className="text-xs text-gray-500">{selectedLocation.city}, {selectedLocation.country}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {isEditable && (
        <div className="mt-2 text-sm text-gray-500">
          {location ? 
            <p>Click on the map to change the location.</p> : 
            <p>Click on the map to select a location.</p>
          }
        </div>
      )}
    </div>
  );
};

export default MapView;