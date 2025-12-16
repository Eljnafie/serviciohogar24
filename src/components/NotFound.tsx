import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, Phone } from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../constants';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-slate-50">
      <div className="bg-yellow-100 p-6 rounded-full mb-6 animate-pulse">
        <AlertTriangle size={64} className="text-yellow-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-4">Página no encontrada</h2>
      <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
        Parece que la página que buscas se ha mudado o no existe. 
        Si tienes una urgencia, no pierdas tiempo y llámanos.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg"
        >
            <Home size={20} /> Volver al Inicio
        </Link>
        <a 
            href={`tel:${DEFAULT_SITE_CONFIG.contact.phone}`} 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
        >
            <Phone size={20} /> Llamar Urgencias
        </a>
      </div>
    </div>
  );
};

export default NotFound;