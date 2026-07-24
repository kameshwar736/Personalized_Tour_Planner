import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {GalleryProvider} from '../src/context/GalleryContext.jsx'
import { PlanProvider } from './context/TourPlanner.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <PlanProvider>
    <GalleryProvider>
      <App />
    </GalleryProvider>
  </PlanProvider>
  </BrowserRouter>
)
