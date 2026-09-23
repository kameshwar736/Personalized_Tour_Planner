import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { GalleryProvider } from './context/GalleryContext.jsx'
import { PlanProvider } from './context/TourPlanner.jsx'
import { PlacesProvider } from './context/PlacesContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlacesProvider>
          <PlanProvider>
            <GalleryProvider>
              <App />
            </GalleryProvider>
          </PlanProvider>
        </PlacesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
