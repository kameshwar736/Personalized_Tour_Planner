import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const typeStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-100',
    error: 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-100',
    warning: 'bg-amber-50 border-amber-300 text-amber-900 shadow-amber-100',
    info: 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-indigo-100'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 max-w-md ${
          typeStyles[toast.type] || typeStyles.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-semibold leading-relaxed">{toast.message}</p>
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-500 hover:text-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
