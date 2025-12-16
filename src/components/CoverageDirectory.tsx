import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowRight } from 'lucide-react';
import SEO from './SEO';
import { BARCELONA_ZONES, MOCK_SERVICES } from '../constants';

const CoverageDirectory: React.FC = () => {
  const { t } = useTranslation();

  // Helper to get slug from service
  const getServiceSlug = (serviceTitleKey: string) => {
      return serviceTitleKey.replace('service_', '');
  };

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <SEO 
        title="Cobertura de Servicios en Barcelona | Listado Completo de Barrios"
        description="Consulte nuestra zona de cobertura. Atendemos averías en todos los distritos y barrios de Barcelona y área metropolitana. Fontaneros, electricistas y cerrajeros cerca de ti."
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Zonas de Cobertura 24h</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Desplegamos unidades móviles en puntos estratégicos de la ciudad para garantizar tiempos de respuesta inferiores a 30 minutos en todos estos barrios.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BARCELONA_ZONES.map((zone) => (
                <div key={zone} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md transition">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                        <MapPin className="text-blue-600" size={20} />
                        {zone}
                    </h2>
                    <ul className="space-y-2">
                        {MOCK_SERVICES.map((service) => (
                            <li key={service.id}>
                                <Link 
                                    to={`/zona/${zone.toLowerCase().replace(/\s+/g, '-')}/${getServiceSlug(service.titleKey || '')}`}
                                    className="text-slate-600 hover:text-blue-700 hover:underline text-sm flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-blue-500 transition-colors"></span>
                                    {t(service.titleKey || '')} en {zone}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="mt-16 bg-blue-900 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">¿No encuentras tu localidad?</h2>
            <p className="text-blue-200 mb-8">
                También atendemos en Hospitalet, Badalona, Santa Coloma y el resto del área metropolitana bajo petición.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                Consultar disponibilidad <ArrowRight size={18} />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CoverageDirectory;