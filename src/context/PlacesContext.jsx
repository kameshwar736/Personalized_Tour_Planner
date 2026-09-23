import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLocal, setLocal, INITIAL_PLACES } from '../utils/storage';

const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlacesData = async () => {
      setLoading(true);
      const storedPlaces = getLocal('apiData', null);

      if (storedPlaces && storedPlaces.length > 0) {
        setPlaces(storedPlaces);
        setLoading(false);
        return;
      }

      const placesApi = import.meta.env.VITE_API_PLACE_URL;
      const splashKey = import.meta.env.VITE_API_SPLASH_KEY;

      try {
        if (placesApi) {
          const res = await fetch(placesApi);
          if (res.ok) {
            const apiPlaces = await res.json();

            // Enrich with splash images if splash key available
            const enriched = await Promise.all(
              apiPlaces.map(async (place) => {
                if (splashKey) {
                  try {
                    const imgRes = await fetch(
                      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                        place.name
                      )}&client_id=${splashKey}&per_page=4`
                    );
                    if (imgRes.ok) {
                      const imgData = await imgRes.json();
                      const photos = imgData.results?.map((item) => item.urls?.regular);
                      if (photos && photos.length > 0) {
                        return { ...place, image: photos };
                      }
                    }
                  } catch (e) {
                    console.warn(`Unsplash fetch failed for ${place.name}:`, e);
                  }
                }
                return place;
              })
            );

            setLocal('apiData', enriched);
            setPlaces(enriched);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch failed, falling back to curated places:', err);
      }

      // Fallback
      setLocal('apiData', INITIAL_PLACES);
      setPlaces(INITIAL_PLACES);
      setLoading(false);
    };

    loadPlacesData();
  }, []);

  return (
    <PlacesContext.Provider value={{ places, loading, setPlaces }}>
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => useContext(PlacesContext);

export default PlacesContext;