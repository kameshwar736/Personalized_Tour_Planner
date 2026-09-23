import React from 'react'
import Navbar from './component/Navbar'
import AppRoutes from './routes/AppRoutes'
import Toast from './component/Toast'
import { useAuth } from './context/AuthContext'
import { Compass, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const App = () => {
  const { toast, showToast } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppRoutes />
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  RoamCraft
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                Your personalized AI-inspired trip planner. Craft custom itineraries, explore weather conditions, discover top destinations, and save your favorite travel memories.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/" className="hover:text-indigo-600 transition-colors">Explore Places</Link></li>
                <li><Link to="/tours" className="hover:text-indigo-600 transition-colors">My Itineraries</Link></li>
                <li><Link to="/profile" className="hover:text-indigo-600 transition-colors">User Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Top Hubs</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-600" /> Rajasthan Forts</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> Kerala Backwaters</li>
                <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-rose-600" /> Himalayan Trails</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} RoamCraft. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for travelers worldwide.
            </p>
          </div>
        </div>
      </footer>

      <Toast toast={toast} onClose={() => showToast(null)} />
    </div>
  )
}

export default App