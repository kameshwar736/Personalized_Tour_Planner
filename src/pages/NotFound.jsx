import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home as HomeIcon, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-full animate-pulse">
        <Compass className="w-16 h-16 text-indigo-600" />
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-indigo-600">
        404
      </h1>
      <h2 className="text-2xl font-black text-slate-900">Destination Not Found</h2>
      <p className="text-slate-500 max-w-md text-sm font-medium leading-relaxed">
        Looks like you've wandered off the trail. The page or destination you're looking for doesn't exist or has moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-200"
        >
          <HomeIcon className="w-4 h-4" />
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm transition-all border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
