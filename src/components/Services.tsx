import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { ServiceItem } from '../types';
import { Droplets, Zap, Key, Thermometer, Flame, Wrench } from 'lucide-react';
import Skeleton from './Skeleton';

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        const data = await dataService.getServices();
        setServices(data);
        setLoading(false);
    };
    load();
  }, []);

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = { Droplets, Zap, Key, Thermometer, Flame, Wrench }[iconName] || Wrench;
    return <Icon size={48} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('nav_services')}</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Soluciones profesionales para cada rincón de tu hogar o negocio. 
                Garantía por escrito en todos nuestros trabajos.
            </p>
        </div>

        <div className="space-y-12">
            {loading ? (
                // SKELETONS
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <Skeleton className="w-full md:w-1/2 h-80 rounded-2xl" />
                        <div className="w-full md:w-1/2 space-y-4">
                            <Skeleton className="w-16 h-16 rounded-xl" />
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="pt-4">
                                <Skeleton className="h-12 w-40 rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                // CONTENT
                services.map((service, index) => (
                    <div 
                        key={service.id} 
                        className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="w-full md:w-1/2 h-80 rounded-2xl overflow-hidden shadow-lg bg-slate-100">
                            <img 
                                src={service.imageUrl} 
                                alt={service.title} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                loading="lazy" 
                            />
                        </div>
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="text-blue-600 p-3 bg-blue-50 w-fit rounded-xl">
                                {getIcon(service.icon)}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">{service.title}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {service.description} 
                            </p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Disponibilidad inmediata</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Presupuesto sin compromiso</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Precio base: {service.price}€ + IVA</li>
                            </ul>
                            <div className="pt-4">
                                <Link 
                                    to="/booking" 
                                    className="inline-block bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-700 transition"
                                >
                                    {t('req_service')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default Services;