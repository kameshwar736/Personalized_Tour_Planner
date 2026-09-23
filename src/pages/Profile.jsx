import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlaces } from '../context/PlacesContext';
import { useGallery } from '../context/GalleryContext';
import { getLocal } from '../utils/storage';
import {
  User,
  Mail,
  MapPin,
  Heart,
  Edit2,
  Save,
  X,
  Trash2
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { activeUser, updateProfile, toggleFavorite } = useAuth();
  const { places } = usePlaces();
  const { handleDetail } = useGallery();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userState: '',
    userBio: ''
  });

  useEffect(() => {
    if (activeUser) {
      setFormData({
        userName: activeUser.userName || '',
        userEmail: activeUser.userEmail || '',
        userPhone: activeUser.userPhone || '',
        userState: activeUser.userState || '',
        userBio: activeUser.userBio || 'Passionate traveler exploring top Indian destinations.'
      });
    }
  }, [activeUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const favPlaceNames = activeUser?.favPlace || [];
  const favPlaceObjects = places.filter((p) => favPlaceNames.includes(p.name));
  const savedToursCount = getLocal('currentTour', []).length;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header Profile Card */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-md shadow-indigo-200 shrink-0">
              {activeUser?.userName ? activeUser.userName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  {activeUser?.userName || 'Traveler'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  Explorer
                </span>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                {activeUser?.userEmail}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {activeUser?.userState || 'State not specified'}
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
              <span className="text-2xl font-black text-indigo-600">{savedToursCount}</span>
              <span className="text-[11px] text-slate-500 block font-semibold">Saved Tours</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
              <span className="text-2xl font-black text-rose-600">{favPlaceNames.length}</span>
              <span className="text-[11px] text-slate-500 block font-semibold">Favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Edit Section */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Profile Information
          </h2>

          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          /* Form Mode */
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email (Read Only)</label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  name="userPhone"
                  placeholder="+91 9876543210"
                  value={formData.userPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Home State</label>
                <input
                  type="text"
                  name="userState"
                  placeholder="e.g., Delhi, Maharashtra, Karnataka"
                  value={formData.userState}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Travel Bio</label>
              <textarea
                name="userBio"
                rows="3"
                value={formData.userBio}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-200 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-medium">Full Name</span>
                <span className="text-sm font-bold text-slate-900">
                  {activeUser?.userName || 'Not set'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-medium">Email Address</span>
                <span className="text-sm font-bold text-slate-900">
                  {activeUser?.userEmail || 'Not set'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-400 block mb-1 font-medium">Phone Number</span>
                <span className="text-sm font-bold text-slate-900">
                  {activeUser?.userPhone || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Travel Bio</span>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {activeUser?.userBio || 'Passionate traveler exploring the world.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Favorite Places Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Favorite Destinations
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {favPlaceNames.length} place(s) saved
          </span>
        </div>

        {favPlaceNames.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
            <Heart className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-900">No Favorite Places Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the heart icon on any destination card on the Explore page to bookmark places here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200"
            >
              Discover Places
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favPlaceObjects.map((place) => (
              <div
                key={place.id || place.name}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img
                    src={
                      Array.isArray(place.image)
                        ? place.image[0]
                        : place.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                  <button
                    onClick={() => toggleFavorite(place.name)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white shadow-md transition-all hover:scale-110"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{place.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-indigo-600" /> {place.state}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDetail(place)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    View Destination Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;