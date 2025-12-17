import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, MapPin, Mail, Send } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';
import { useToast } from '../context/ToastContext';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Plumbing',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    dataService.getSiteConfig().then(setConfig);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
        setSent(true);
        setFormData({ name: '', phone: '', type: 'Plumbing', message: '' });
        addToast('Solicitud enviada correctamente', 'success');
    }, 1000);
  };

  // Helpers to format links safely (Removing non-digits)
  const phoneLink = `tel:${config.contact.phone.replace(/\D/g, '')}`;
  const waLink = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}`;

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('contact_title')}</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    Estamos disponibles 24 horas al día, 365 días al año. 
                    Si es una urgencia, te recomendamos llamar directamente.
                </p>
                
                <div className="space-y-6">
                    <a href={phoneLink} className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition group">
                        <div className="bg-blue-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase">Urgencias 24h</p>
                            <p className="text-xl font-bold text-blue-900">{config.contact.phone}</p>
                        </div>
                    </a>

                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition group">
                         <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase">WhatsApp</p>
                            <p className="text-xl font-bold text-green-700">{config.contact.whatsapp}</p>
                        </div>
                    </a>
                    
                    <a href={`mailto:${config.contact.email}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition group border border-slate-100">
                         <div className="bg-slate-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase">Email</p>
                            <p className="text-lg font-bold text-slate-800 break-all">{config.contact.email}</p>
                        </div>
                    </a>

                    <div className="flex flex-col gap-4 p-4 border border-slate-100 rounded-xl overflow-hidden">
                         <div className="flex items-center gap-4">
                             <div className="bg-slate-200 text-slate-600 p-3 rounded-full">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-bold uppercase">Oficina</p>
                                <p className="text-lg text-slate-800">{config.contact.address}</p>
                            </div>
                         </div>
                         
                         <div className="w-full h-48 rounded-xl overflow-hidden relative shadow-md group">
                             <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src="https://maps.google.com/maps?q=Barcelona&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                className="w-full h-full border-0 grayscale hover:grayscale-0 transition duration-700"
                                title="Barcelona Map"
                             ></iframe>
                         </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                {sent ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fadeIn">
                        <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                            <Send size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">¡Mensaje Enviado!</h3>
                        <p className="text-slate-600 mt-2">Un técnico contactará contigo en breve.</p>
                        <button onClick={() => setSent(false)} className="mt-6 text-blue-600 font-bold underline">Enviar otro</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Formulario Online</h2>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('form_name')}</label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('form_phone')}</label>
                            <input 
                                required
                                type="tel" 
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('form_type')}</label>
                            <select 
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="Plumbing">{t('service_plumbing')}</option>
                                <option value="Electricity">{t('service_electricity')}</option>
                                <option value="Locksmith">{t('service_locksmith')}</option>
                                <option value="HVAC">{t('service_hvac')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('form_message')}</label>
                            <textarea 
                                required
                                rows={4}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition shadow-lg">
                            {t('form_submit')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
  );
};

export default Contact;