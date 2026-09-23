import React, { useState, useMemo } from 'react';
import { usePlaces } from '../context/PlacesContext';
import { useGallery } from '../context/GalleryContext';
import { useTourPlanner } from '../context/TourPlanner';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Compass,
  SlidersHorizontal,
  X
} from 'lucide-react';

import B1 from '../assets/banner/Banner1.png';
import B2 from '../assets/banner/Banner2.png';
import B3 from '../assets/banner/Banner3.png';

const Home = () => {
  const { places, loading } = usePlaces();
  const { handleDetail } = useGallery();
  const { handleTourPlan } = useTourPlanner();
  const { activeUser, toggleFavorite } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // Hero carousel state
  const heroImages = [B1, B2, B3];
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const nextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  // Unique states
  const statesList = useMemo(() => {
    if (!places) return [];
    return [...new Set(places.map((p) => p.state))].filter(Boolean);
  }, [places]);

  const handleStateFilterClick = (stateName) => {
    setSelectedState((prev) => (prev === stateName ? '' : stateName));
  };

  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.state?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedState) {
      result = result.filter(
        (p) => p.state?.toLowerCase() === selectedState.toLowerCase()
      );
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    }

    return result;
  }, [places, search, selectedState, sortBy]);

  const getImageSrc = (item, index = 0) => {
    if (Array.isArray(item?.image) && item.image[index]) {
      return item.image[index];
    }
    if (typeof item?.image === 'string') {
      return item.image;
    }
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner Section */}
      <section className="relative w-full h-[420px] md:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        <div className="absolute inset-0 bg-slate-900">
          <img
            src={heroImages[currentHeroSlide]}
            alt={`Travel Hero Slide ${currentHeroSlide + 1}`}
            className="w-full h-full object-cover opacity-75 transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md w-fit shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Personalized Tour Planner
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Craft Your Dream <br />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
              Travel Adventure
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-200 line-clamp-2 max-w-xl leading-relaxed">
            Discover breathtaking places, check real-time weather forecasts, build customized day-by-day itineraries, and explore top destinations across India.
          </p>
        </div>

        {/* Banner Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-slate-900 border border-slate-200 backdrop-blur-md transition-all hover:scale-110 shadow-lg z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-slate-900 border border-slate-200 backdrop-blur-md transition-all hover:scale-110 shadow-lg z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Banner Indicators */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentHeroSlide === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Search and Filter Control Panel */}
      <section className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by destination name, state (e.g., Jaipur, Goa, Kerala)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 text-sm transition-all font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* State Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Filter by State</span>
            {selectedState && (
              <button
                onClick={() => setSelectedState('')}
                className="text-indigo-600 hover:underline lowercase font-semibold"
              >
                clear state filter
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedState('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedState === ''
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All States ({places?.length || 0})
            </button>
            {statesList.map((st) => {
              const count = places.filter((p) => p.state === st).length;
              const isSelected = selectedState === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStateFilterClick(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  {st} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destinations Grid Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-600" />
              {selectedState ? `${selectedState} Destinations` : 'Popular Destinations'}
            </h2>
            <p className="text-sm text-slate-500">
              Showing {filteredPlaces.length} destination{filteredPlaces.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse p-4 space-y-4"
              >
                <div className="h-40 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredPlaces.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No destinations found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any places matching "{search}". Try searching for another city, state, or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedState('');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => {
              const isFav = activeUser?.favPlace?.includes(place.name);
              const mainImg = getImageSrc(place, 0);

              return (
                <div
                  key={place.id || place.name}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-indigo-300 transition-all duration-300 hover:shadow-xl flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={mainImg}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                    {/* State Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-indigo-600" />
                      {place.state}
                    </div>

                    {/* Favorite Heart Button */}
                    <button
                      onClick={() => toggleFavorite(place.name)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
                        isFav
                          ? 'bg-rose-500 text-white scale-110'
                          : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-amber-600 text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{place.rating || '4.8'}</span>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {place.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {place.description ||
                          `Explore the stunning landscapes, rich culture, and historical landmarks of ${place.name}, ${place.state}.`}
                      </p>
                    </div>

                    {/* Specs / Tags */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Est. Cost</span>
                        <span className="text-emerald-700 font-bold text-sm">
                          ₹{place.pricePerDay || 3500} / day
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block font-medium">Best Season</span>
                        <span className="text-indigo-600 font-semibold">
                          {place.bestSeason || 'Oct - Mar'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleDetail(place)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleTourPlan(place)}
                        className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Plan Trip
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;