import React from 'react';
import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white min-w-[300px] max-w-sm animate-slideIn backdrop-blur-md border border-white/10
            ${toast.type === 'success' ? 'bg-green-600/95' : toast.type === 'error' ? 'bg-red-600/95' : 'bg-blue-600/95'}
          `}
          role="alert"
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <span className="flex-grow text-sm font-bold shadow-sm">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)} 
            className="hover:bg-white/20 p-1 rounded transition-colors flex-shrink-0"
            aria-label="Cerrar notificación"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;