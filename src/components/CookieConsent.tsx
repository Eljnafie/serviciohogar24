import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('serviciohogar24_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('serviciohogar24_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur text-white p-4 z-[60] shadow-2xl border-t border-slate-700 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-full hidden sm:block">
                <Cookie size={24} />
            </div>
            <p className="text-sm text-slate-300">
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios y analizar el tráfico. 
              Al continuar navegando, aceptas su uso conforme a nuestra política de privacidad.
            </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setIsVisible(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition whitespace-nowrap">Cerrar</button>
            <button onClick={handleAccept} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold transition w-full md:w-auto whitespace-nowrap shadow-lg shadow-blue-900/50">Aceptar Cookies</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;