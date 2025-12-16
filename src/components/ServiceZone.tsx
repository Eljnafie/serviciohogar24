import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from './SEO';
import { MOCK_SERVICES, DEFAULT_SITE_CONFIG } from '../constants';
import { MapPin, Phone, CheckCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../types';

const ServiceZone: React.FC = () => {
  const { zone, serviceSlug } = useParams<{ zone: string; serviceSlug: string }>();
  const { t } = useTranslation();
  const [service, setService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    // Basic matching logic: find service by simplified slug match
    // Real app would have a slug field on services
    const found = MOCK_SERVICES.find(s => {
        const slug = s.titleKey?.replace('service_', '') || 'general';
        return slug === serviceSlug || (serviceSlug === 'general' && s.id === '1'); // Default fallback
    });
    setService(found || MOCK_SERVICES[0]);
  }, [serviceSlug]);

  if (!service || !zone) return null;

  // Capitalize helpers
  const zoneName = zone.charAt(0).toUpperCase() + zone.slice(1).replace('-', ' ');
  const serviceName = t(service.titleKey || '');

  // Dynamic SEO Data
  const title = `${serviceName} en ${zoneName} | Urgencias 24h - Llegamos en 20min`;
  const description = `¿Buscas ${serviceName.toLowerCase()} en ${zoneName}? ServicioHogar24 ofrece atención urgente, precios económicos y garantía por escrito. ¡Llama ahora!`;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "provider": {
      "@type": "LocalBusiness",
      "name": "ServicioHogar24",
      "telephone": DEFAULT_SITE_CONFIG.contact.phone,
      "priceRange": "€€"
    },
    "areaServed": {
      "@type": "Place",
      "name": zoneName
    },
    "description": description
  };

  // Helper for cross-linking
  const getOtherServices = () => {
      return MOCK_SERVICES.filter(s => s.id !== service.id);
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      <SEO 
        title={title}
        description={description}
        jsonLd={jsonLd}
        url={window.location.href}
      />

      {/* Local Hero */}
      <div className="bg-slate-900 text-white relative overflow-hidden py-16 md:py-24">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
             <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-1 rounded-full text-blue-300 font-bold text-sm mb-6">
                <MapPin size={16} /> Servicio activo en {zoneName}
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                {serviceName} en <span className="text-blue-500">{zoneName}</span>
             </h1>
             <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                Técnicos autorizados disponibles ahora mismo en tu barrio. 
                Sin intermediarios, precios claros y garantía total.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`tel:${DEFAULT_SITE_CONFIG.contact.phone}`} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition">
                    <Phone size={24} /> Llamar al Técnico
                </a>
                <Link to="/booking" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition">
                    Ver Precios Online
                </Link>
             </div>
         </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                      <Clock size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Rápidos en {zoneName}</h3>
                  <p className="text-slate-600">Al tener unidades móviles cerca de {zoneName}, reducimos el tiempo de espera a menos de 30 minutos.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-green-600 mb-4">
                      <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Garantía por Escrito</h3>
                  <p className="text-slate-600">Todos nuestros trabajos de {serviceName.toLowerCase()} incluyen factura y garantía mínima de 12 meses.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center text-orange-600 mb-4">
                      <CheckCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Precios Transparentes</h3>
                  <p className="text-slate-600">Sin sorpresas. Presupuesto previo antes de empezar cualquier reparación en tu domicilio.</p>
              </div>
          </div>
      </div>

      {/* Content Block SEO */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="prose prose-lg text-slate-700 mx-auto">
              <h2 className="text-3xl font-bold text-slate-900">¿Por qué elegir ServicioHogar24 en {zoneName}?</h2>
              <p>
                  Si vives en <strong>{zoneName}</strong> y buscas un servicio de <strong>{serviceName}</strong> fiable, somos tu mejor opción. 
                  Llevamos más de 15 años atendiendo urgencias y mantenimientos en el barrio, conociendo las tipologías de edificios y las averías más comunes de la zona.
              </p>
              <h3>Servicios que ofrecemos en {zoneName}</h3>
              <ul className="grid md:grid-cols-2 gap-2 list-none pl-0">
                  {[
                      'Urgencias 24 horas', 'Mantenimiento preventivo', 'Instalaciones nuevas', 
                      'Reparación de averías', 'Boletines y certificados', 'Reformas integrales'
                  ].map(item => (
                      <li key={item} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <CheckCircle size={16} className="text-green-500" /> {item}
                      </li>
                  ))}
              </ul>
              <p className="mt-8 bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 italic">
                  "Nuestro compromiso es resolver tu problema en la primera visita siempre que sea posible. Llevamos recambios originales en nuestras furgonetas."
              </p>
          </div>
      </div>

      {/* Cross-Linking / Related Services in Same Zone (SEO GOLD) */}
      <div className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Otros servicios disponibles en {zoneName}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getOtherServices().map(s => {
                      const slug = s.titleKey?.replace('service_', '') || '';
                      return (
                        <Link 
                            key={s.id} 
                            to={`/zona/${zone}/${slug}`}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition flex items-center justify-between group"
                        >
                            <span className="font-bold text-slate-700 group-hover:text-blue-700">{t(s.titleKey || '')}</span>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                        </Link>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-slate-900 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">¿Vives en {zoneName}? Te atendemos hoy mismo.</h2>
              <p className="mb-8 text-slate-300">No cobramos desplazamiento si aceptas el presupuesto de reparación.</p>
              <div className="flex justify-center gap-4">
                  <a href={`tel:${DEFAULT_SITE_CONFIG.contact.phone}`} className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                      <Phone size={20} /> Llama Gratis
                  </a>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ServiceZone;