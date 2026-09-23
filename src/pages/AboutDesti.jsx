import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTourPlanner } from '../context/TourPlanner';
import { useAuth } from '../context/AuthContext';
import { usePlaces } from '../context/PlacesContext';
import { useGallery } from '../context/GalleryContext';
import { getLocal } from '../utils/storage';
import {
  MapPin,
  Star,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Calendar,
  DollarSign,
  Heart,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  Utensils,
  Camera,
  ShoppingBag,
  Info,
  ChevronRight,
  Maximize2,
  X,
  Navigation
} from 'lucide-react';

const AboutDesti = () => {
  const navigate = useNavigate();
  const { handleTourPlan } = useTourPlanner();
  const { activeUser, toggleFavorite } = useAuth();
  const { places } = usePlaces();
  const { handleDetail } = useGallery();

  const [detail, setDetail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const [weather, setWeather] = useState({
    loading: true,
    error: false,
    city: '',
    temp: '--',
    minTemp: '--',
    maxTemp: '--',
    feelsLike: '--',
    humidity: '--',
    windSpeed: '--',
    condition: 'Clear'
  });

  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const data = getLocal('tempData', null);
    if (!data) {
      const allPlaces = getLocal('apiData', []);
      if (allPlaces.length > 0) {
        setDetail(allPlaces[0]);
      } else {
        navigate('/');
      }
      return;
    }
    setDetail(data);

    if (data?.name) {
      fetchWeather(data.name);
    }
  }, []);

  const fetchWeather = async (cityName) => {
    setWeather((prev) => ({ ...prev, loading: true, error: false }));
    try {
      if (!weatherApiKey) {
        throw new Error('No weather API key found');
      }
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${weatherApiKey}&units=metric`
      );
      if (!res.ok) throw new Error('Weather API request failed');

      const data = await res.json();
      setWeather({
        loading: false,
        error: false,
        city: data.name || cityName,
        temp: Math.round(data.main.temp),
        minTemp: Math.round(data.main.temp_min),
        maxTemp: Math.round(data.main.temp_max),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        condition: data.weather[0]?.main || 'Clear'
      });
    } catch (err) {
      console.warn('Weather fetch error, using fallback state:', err);
      setWeather({
        loading: false,
        error: true,
        city: cityName,
        temp: 24,
        minTemp: 18,
        maxTemp: 28,
        feelsLike: 25,
        humidity: 62,
        windSpeed: 12,
        condition: 'Pleasant'
      });
    }
  };

  if (!detail) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFav = activeUser?.favPlace?.includes(detail.name);
  const imagesList = Array.isArray(detail.image)
    ? detail.image
    : [detail.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'];

  const relatedPlaces = places
    ? places.filter((p) => p.name !== detail.name && p.state === detail.state).slice(0, 3)
    : [];

  const otherRecommendations = relatedPlaces.length > 0
    ? relatedPlaces
    : places ? places.filter((p) => p.name !== detail.name).slice(0, 3) : [];

  const getWeatherIcon = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-slate-400" />;
      default:
        return <Sun className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* Breadcrumbs & Action Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">
            Destinations
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700">{detail.state}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-600 font-bold">{detail.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleFavorite(detail.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isFav
                ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            {isFav ? 'Saved in Favorites' : 'Add to Favorites'}
          </button>

          <button
            onClick={() => handleTourPlan(detail)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200"
          >
            <Calendar className="w-4 h-4" />
            Plan Trip
          </button>
        </div>
      </div>

      {/* Destination Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
            <MapPin className="w-4 h-4" /> {detail.state}, India
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            {detail.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 shadow-sm">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-[11px] text-slate-400 block font-semibold uppercase">Rating</span>
              <span className="text-sm font-extrabold text-slate-900">{detail.rating || '4.8'} / 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Image Showcase & Gallery Bar */}
      <div className="space-y-4">
        <div className="relative h-[380px] md:h-[480px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-lg group">
          <img
            src={imagesList[selectedImage] || imagesList[0]}
            alt={detail.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

          {/* Badge & Zoom Overlay */}
          <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Featured Location Showcase</span>
          </div>

          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute bottom-4 right-4 p-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md transition-all shadow-md font-semibold text-xs flex items-center gap-1.5"
          >
            <Maximize2 className="w-4 h-4 text-indigo-600" /> Fullscreen View
          </button>
        </div>

        {/* Horizontal Thumbnails Strip */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {imagesList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                selectedImage === idx
                  ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md scale-98'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Est. Daily Budget</span>
            <span className="text-sm font-extrabold text-slate-900">₹{detail.pricePerDay || 3500} / day</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Best Visiting Time</span>
            <span className="text-sm font-extrabold text-slate-900">{detail.bestSeason || 'Oct - Mar'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Ideal Stay</span>
            <span className="text-sm font-extrabold text-slate-900">3 - 5 Days</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">State Region</span>
            <span className="text-sm font-extrabold text-slate-900">{detail.state}</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Left Column 8, Right Sidebar 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview & Description Section */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" /> About & Highlights
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {detail.description ||
                `${detail.name} is one of the most mesmerizing travel spots in ${detail.state}. Rich in scenic natural views, vibrant culture, authentic culinary delights, and unforgettable sightseeing activities.`}
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Whether you are planning a solo soul-searching trip, a romantic getaway, or a memorable vacation with family and friends, {detail.name} offers a harmonious blend of heritage, scenic vistas, and modern travel conveniences.
            </p>
          </div>

          {/* Must-Witness Attractions Section */}
          {detail.tags && detail.tags.length > 0 && (
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Top Attractions & Key Landmarks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{tag}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Must-visit hotspot offering iconic photo opportunities and historical charm.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Travel Experiences */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Recommended Experiences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Authentic Local Cuisine</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Savor traditional street food delicacies, regional thalis, and famous local sweets unique to {detail.state}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Photography & Sightseeing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Capture panoramic viewpoints, architectural wonders, and golden hour sunrise/sunset vistas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Bazaar & Souvenir Shopping</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Explore vibrant local markets, handcrafted artifacts, textiles, and authentic regional souvenirs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Day Trips & Exploration</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Take short scenic drives to surrounding valleys, ancient temples, or nearby nature trails.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Weather Forecast Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-white border border-indigo-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Live Weather Forecast
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {weather.city || detail.name}
              </span>
            </div>

            {weather.loading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Fetching forecast...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weather.condition)}
                    <div>
                      <span className="text-4xl font-black text-slate-900">
                        {weather.temp}°C
                      </span>
                      <span className="text-xs text-slate-500 block capitalize font-semibold">
                        {weather.condition}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500 space-y-0.5 font-medium">
                    <p>Feels like: <strong className="text-slate-800">{weather.feelsLike}°C</strong></p>
                    <p>Min / Max: <strong className="text-slate-800">{weather.minTemp}° / {weather.maxTemp}°</strong></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-slate-400 block font-medium">Humidity</span>
                      <span className="font-extrabold text-slate-800">{weather.humidity}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <div>
                      <span className="text-slate-400 block font-medium">Wind Speed</span>
                      <span className="font-extrabold text-slate-800">{weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => handleTourPlan(detail)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              Start Customized Planning
            </button>
          </div>

          {/* Quick Trip Cost Calculation Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Trip Cost Estimator</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Stay (3 Days approx)</span>
                <span className="font-bold text-slate-900">₹{((detail.pricePerDay || 3500) * 3).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Local Transport & Sightseeing</span>
                <span className="font-bold text-slate-900">₹2,500</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Food & Dining</span>
                <span className="font-bold text-slate-900">₹3,000</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold text-emerald-600">
                <span>Est. Total per person</span>
                <span>₹{((detail.pricePerDay || 3500) * 3 + 5500).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Other Destinations Section */}
      {otherRecommendations.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Compass className="w-6 h-6 text-indigo-600" /> More Recommended Destinations
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Explore other top places to add to your bucket list
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherRecommendations.map((place) => (
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

                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-slate-800 text-[11px] font-bold shadow-sm">
                    {place.state}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {place.description || `Beautiful location in ${place.state}.`}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleDetail(place);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    View Destination
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Photo View Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsPhotoModalOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imagesList[selectedImage] || imagesList[0]}
            alt={detail.name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default AboutDesti;