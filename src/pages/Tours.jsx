import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTourPlanner } from '../context/TourPlanner';
import { useAuth } from '../context/AuthContext';
import { getLocal, setLocal } from '../utils/storage';
import ConfirmModal from '../component/ConfirmModal';
import {
  Map,
  Calendar,
  Users,
  Plane,
  Car,
  Bike,
  Bus,
  Train,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';

const Tours = () => {
  const navigate = useNavigate();
  const { handleView } = useTourPlanner();
  const { showToast } = useAuth();

  const [tourPlans, setTourPlans] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    const plans = getLocal('currentTour', []);
    setTourPlans(plans);
  }, []);

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    const updated = tourPlans.filter((item) => String(item.id) !== String(deleteTargetId));
    setLocal('currentTour', updated);
    setTourPlans(updated);
    setDeleteTargetId(null);
    showToast('Itinerary removed successfully', 'info');
  };

  const getTransportIcon = (mode) => {
    switch (mode) {
      case 'Flight':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'Car':
      case 'car':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'Bike':
      case 'bike':
        return <Bike className="w-4 h-4 text-amber-600" />;
      case 'Bus':
      case 'bus':
        return <Bus className="w-4 h-4 text-purple-600" />;
      default:
        return <Train className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getImageSrc = (item) => {
    if (Array.isArray(item?.image) && item.image[1]) return item.image[1];
    if (Array.isArray(item?.image) && item.image[0]) return item.image[0];
    if (typeof item?.image === 'string') return item.image;
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-7 h-7 text-indigo-600" /> My Saved Tour Plans
          </h1>
          <p className="text-sm text-slate-500">
            Manage your customized travel itineraries and estimated budgets
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Plan New Trip
        </button>
      </div>

      {tourPlans.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Map className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Tour Plans Created Yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't saved any travel itineraries. Browse our curated destinations and start crafting your custom trip schedule.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md shadow-indigo-200"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        /* Tour Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourPlans.map((item) => {
            const plan = item.tourPlan || {};
            const img = getImageSrc(item);
            const duration = plan.duration || plan.Duration || 3;
            const travelers = plan.peopleCount || 1;
            const budget = plan.budget || item.pricePerDay || 3500;
            const totalEst = travelers * budget * duration;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                {/* Header Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img src={img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-indigo-600" />
                    {item.state}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <h3 className="text-xl font-extrabold truncate">{item.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/30">
                      {plan.tourMode || 'Solo'}
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block mb-0.5 font-medium">Start Date</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {plan.startFrom || 'Flexible'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block mb-0.5 font-medium">Travel Mode</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        {getTransportIcon(plan.travelMode || plan.tarvelMode)}
                        {plan.travelMode || plan.tarvelMode || 'Flight'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block mb-0.5 font-medium">Duration</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {duration} Days
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-slate-400 block mb-0.5 font-medium">Travelers</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        {travelers} Person(s)
                      </span>
                    </div>
                  </div>

                  {/* Budget Highlight */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">Total Est. Budget</span>
                    <span className="text-base font-black text-emerald-600">
                      ₹{totalEst.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleView(item.id)}
                      className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View / Edit
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accessible Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Tour Itinerary?"
        message="Are you sure you want to remove this tour plan? This action cannot be undone."
        confirmText="Delete Plan"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default Tours;