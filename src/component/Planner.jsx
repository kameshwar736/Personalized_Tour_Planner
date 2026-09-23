import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLocal, setLocal } from '../utils/storage';
import {
  Calendar,
  Users,
  Plane,
  Car,
  Bike,
  Bus,
  Train,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle2,
  Save,
  ArrowLeft,
  MapPin
} from 'lucide-react';

const Planner = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [currentTour, setCurrentTour] = useState(null);
  const [userInfo, setUserInfo] = useState({
    tourMode: 'Solo',
    peopleCount: 1,
    travelMode: 'Flight',
    duration: 3,
    startFrom: new Date().toISOString().split('T')[0],
    budget: 3500
  });

  useEffect(() => {
    const tempID = getLocal('tempPlan', null);
    const allTours = getLocal('currentTour', []);

    let target = null;
    if (tempID) {
      target = allTours.find((t) => String(t.id) === String(tempID));
    }

    if (!target && allTours.length > 0) {
      target = allTours[0];
    }

    if (target) {
      setCurrentTour(target);
      if (target.tourPlan) {
        setUserInfo({
          tourMode: target.tourPlan.tourMode || 'Solo',
          peopleCount: target.tourPlan.peopleCount || 1,
          travelMode: target.tourPlan.travelMode || target.tourPlan.tarvelMode || 'Flight',
          duration: target.tourPlan.duration || target.tourPlan.Duration || 3,
          startFrom: target.tourPlan.startFrom || new Date().toISOString().split('T')[0],
          budget: target.tourPlan.budget || target.pricePerDay || 3500
        });
      } else {
        setUserInfo((prev) => ({
          ...prev,
          budget: target.pricePerDay || 3500
        }));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePlan = () => {
    if (!currentTour) {
      showToast('No destination selected to plan', 'error');
      return;
    }

    const updatedTour = {
      ...currentTour,
      tourPlan: { ...userInfo }
    };

    const allTours = getLocal('currentTour', []);
    const exists = allTours.some((t) => String(t.id) === String(currentTour.id));

    let updatedList;
    if (exists) {
      updatedList = allTours.map((t) =>
        String(t.id) === String(currentTour.id) ? updatedTour : t
      );
    } else {
      updatedList = [...allTours, updatedTour];
    }

    setLocal('currentTour', updatedList);
    showToast(`Trip plan for ${currentTour.name} saved!`, 'success');
    navigate('/tours');
  };

  if (!currentTour) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <Calendar className="w-12 h-12 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900">No Destination Selected</h2>
        <p className="text-slate-500 text-sm max-w-md">
          Pick a place from the Explore page to start customizing your travel itinerary.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          Explore Destinations
        </button>
      </div>
    );
  }

  const totalCostEstimate =
    (Number(userInfo.peopleCount) || 1) *
    (Number(userInfo.budget) || 3500) *
    (Number(userInfo.duration) || 1);

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

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </button>
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
            <MapPin className="w-4 h-4" /> {currentTour.state}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Customize Itinerary: {currentTour.name}
          </h1>
        </div>

        <button
          onClick={handleSavePlan}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Save className="w-4 h-4" /> Save Itinerary
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Trip Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Tour Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> Travel Companion
              </label>
              <select
                name="tourMode"
                value={userInfo.tourMode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="Solo">Solo Traveler</option>
                <option value="Couple">Couple / Partner</option>
                <option value="Friends">Friends Group</option>
                <option value="Family">Family Trip</option>
              </select>
            </div>

            {/* People Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> No. of Travelers
              </label>
              <input
                type="number"
                min="1"
                max="50"
                name="peopleCount"
                value={userInfo.peopleCount}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Travel Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-indigo-600" /> Mode of Transport
              </label>
              <select
                name="travelMode"
                value={userInfo.travelMode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="Flight">Flight</option>
                <option value="Car">Rental / Own Car</option>
                <option value="Bike">Motorbike / Scooter</option>
                <option value="Bus">Luxury Bus</option>
                <option value="Train">Express Train</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                name="duration"
                value={userInfo.duration}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Departure Date
              </label>
              <input
                type="date"
                name="startFrom"
                value={userInfo.startFrom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Daily Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" /> Daily Budget / Person (₹)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                name="budget"
                value={userInfo.budget}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Live Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-white border border-indigo-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Itinerary Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Destination</span>
                <span className="font-extrabold text-slate-900">{currentTour.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Companion Type</span>
                <span className="font-bold text-indigo-600">{userInfo.tourMode}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Travelers</span>
                <span className="font-semibold text-slate-800">{userInfo.peopleCount} person(s)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Transport</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  {getTransportIcon(userInfo.travelMode)} {userInfo.travelMode}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Duration</span>
                <span className="font-semibold text-slate-800">{userInfo.duration} Days</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Start Date</span>
                <span className="font-semibold text-slate-800">{userInfo.startFrom}</span>
              </div>
            </div>

            {/* Total Cost Estimate Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-center shadow-sm">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Estimated Total Trip Budget
              </span>
              <div className="text-3xl font-black text-emerald-600">
                ₹{totalCostEstimate.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 block font-medium">
                ({userInfo.peopleCount} traveler(s) × ₹{userInfo.budget} × {userInfo.duration} days)
              </span>
            </div>

            {/* Must Witnesses Highlights */}
            {currentTour.tags && currentTour.tags.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Top Attractions to Witness
                </span>
                <div className="space-y-1.5">
                  {currentTour.tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSavePlan}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save & View My Tours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;