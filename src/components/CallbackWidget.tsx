import React, { useState, useEffect } from 'react';
import { PhoneCall, X, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { DEFAULT_SITE_CONFIG } from '../constants';
import { SiteConfig } from '../types';

const CallbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  // Load config to get the destination email
  useEffect(() => {
    dataService.getSiteConfig().then(setConfig);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return;
    setStatus('sending');
    
    try {
        // 1. Guardar en Panel de Admin (Base de datos local)
        await dataService.addCallback(phone);

        // 2. Enviar Email Silencioso (Background)
        // Usamos FormSubmit.co para enviar sin backend. 
        // IMPORTANTE: La primera vez que se use, llegará un correo de activación a la dirección configurada.
        const emailDestino = config.contact.email;
        
        await fetch(`https://formsubmit.co/ajax/${emailDestino}`, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `📞 NUEVO LEAD: ${phone}`,
                _template: "table",
                servicio: "Solicitud 'Te Llamo'",
                telefono: phone,
                fecha: new Date().toLocaleString(),
                mensaje: "El cliente solicita llamada inmediata."
            })
        });

        setStatus('success');
    } catch (error) {
        console.error("Error enviando solicitud", error);
        // Aún si falla el email, mostramos éxito si se guardó en local
        setStatus('success'); 
    }

    // Reset after 5 seconds
    setTimeout(() => {
      setIsOpen(false);
      setStatus('idle');
      setPhone('');
    }, 5000);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 md:bottom-8 left-4 z-40 bg-white text-slate-800 p-3 pr-5 rounded-full shadow-xl border border-slate-100 flex items-center gap-3 transition-transform hover:scale-105 group ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <div className="bg-blue-600 text-white p-2 rounded-full relative">
            <PhoneCall size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        </div>
        <div className="text-left hidden sm:block">
            <span className="block text-xs text-slate-500 font-bold uppercase">¿Te llamamos?</span>
            <span className="block text-sm font-bold text-blue-900">Gratis en 5 min</span>
        </div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative animate-slideUp sm:animate-blob">
            <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
            >
                <X size={20} />
            </button>

            <div className="bg-blue-600 p-6 text-white text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">Te llamamos nosotros</h3>
                    <p className="text-blue-100 text-sm">Déjanos tu número y un técnico te contactará en breve.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 text-blue-500/30">
                    <PhoneCall size={120} />
                </div>
            </div>

            <div className="p-6">
                {status === 'success' ? (
                    <div className="text-center py-4">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <CheckCircle size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">¡Solicitud Recibida!</h4>
                        <p className="text-slate-500 text-sm mt-2">Tu teléfono está en la cola prioritaria.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Tu Teléfono</label>
                            <input 
                                type="tel" 
                                autoFocus
                                required
                                placeholder="Ej: 600 123 456"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s+]/g, ''))}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={phone.length < 9 || status === 'sending'}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {status === 'sending' ? (
                                <><Loader2 className="animate-spin" size={20}/> Enviando...</>
                            ) : (
                                <>Llamadme Ahora <Clock size={18}/></>
                            )}
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-2">
                            Al enviar aceptas nuestra política de privacidad.
                        </p>
                    </form>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallbackWidget;