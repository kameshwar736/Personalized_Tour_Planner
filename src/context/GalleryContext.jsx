import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLocal } from '../utils/storage';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleDetail = (destinationData) => {
    setLocal('tempData', destinationData);
    navigate('/about');
  };

  return (
    <GalleryContext.Provider value={{ handleDetail }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => useContext(GalleryContext);

export default GalleryContext;