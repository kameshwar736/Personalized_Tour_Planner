import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocal, setLocal } from '../utils/storage';

const TourPlannerContext = createContext();

export const PlanProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleTourPlan = (tourPlace) => {
    // Add destination to currentTour array if not already present
    const currentTours = getLocal('currentTour', []);
    const exists = currentTours.find((t) => t.id === tourPlace.id);

    if (!exists) {
      const updatedTours = [...currentTours, tourPlace];
      setLocal('currentTour', updatedTours);
    }

    setLocal('tempPlan', tourPlace.id);
    navigate('/planner');
  };

  const handleView = (id) => {
    setLocal('tempPlan', id);
    navigate('/planner');
  };

  return (
    <TourPlannerContext.Provider value={{ handleTourPlan, handleView }}>
      {children}
    </TourPlannerContext.Provider>
  );
};

export const useTourPlanner = () => useContext(TourPlannerContext);

export default TourPlannerContext;