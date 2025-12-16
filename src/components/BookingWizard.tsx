import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BOOKING_STEPS, SERVICE_QUESTIONS, DEFAULT_SITE_CONFIG } from '../constants';
import { AlertTriangle, Phone, Calendar, Check, ArrowRight, ArrowLeft, Calculator, MessageCircle, Droplets, Zap, Key, Thermometer, Flame, Wrench } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SiteConfig, ServiceItem } from '../types';
import SEO from './SEO'; // Import SEO for noindex

const BookingWizard: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({
    serviceId: null,
    answers: {},
    date: null,
    timeSlot: null,
    contact: { name: '', phone: '' }
  });
  const [showUrgencyModal, setShowUrgencyModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    dataService.getSiteConfig().then(setConfig);
    dataService.getServices().then(setServices);
  }, []);

  const ICON_MAP: Record<string, React.ElementType> = { Droplets, Zap, Key, Thermometer, Flame, Wrench };

  const getIcon = (iconName: string, size = 24) => {
    const Icon = ICON_MAP[iconName] || Wrench;
    return <Icon size={size} />;
  };

  const handleServiceSelect = (id: string) => {
    setBookingData({ ...bookingData, serviceId: id, answers: {} });
    setCurrentStep(2);
  };

  const handleAnswerChange = (questionId: string, value: any, isUrgent: boolean) => {
    const newAnswers = { ...bookingData.answers, [questionId]: value };
    setBookingData({ ...bookingData, answers: newAnswers });
    if (isUrgent && value === true) {
        setShowUrgencyModal(true);
    }
  };

  const handleDateSelect = (date: string, slot: string) => {
    setBookingData({ ...bookingData, date, timeSlot: slot });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const getNextDays = () => {
    const days = [];
    for(let i=1; i<=3; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        days.push(d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));
    }
    return days;
  };

  // --- Budget Calculator Logic ---
  const calculateBudget = () => {
    if (!bookingData.serviceId) return { min: 0, max: 0, breakdown: [] };

    let total = config.pricing.baseFee;
    const breakdown = [{ label: t('budget_item_base'), amount: config.pricing.baseFee }];
    
    // Dynamic Service Base Fee
    const selectedService = services.find(s => s.id === bookingData.serviceId);
    const serviceFee = selectedService?.price || 0;
    
    total += serviceFee;
    breakdown.push({ label: t('budget_item_service'), amount: serviceFee });

    // Urgency Check
    const questions = SERVICE_QUESTIONS[bookingData.serviceId as keyof typeof SERVICE_QUESTIONS] || [];
    let isUrgent = false;
    questions.forEach(q => { if (q.urgent && bookingData.answers[q.id] === true) isUrgent = true; });

    if (isUrgent) {
        total += config.pricing.urgencyFee;
        breakdown.push({ label: t('budget_item_urgency'), amount: config.pricing.urgencyFee });
    }

    return { min: total, max: total * 1.3, breakdown };
  };

  const budget = calculateBudget();
  const selectedServiceTitle = services.find(s => s.id === bookingData.serviceId)?.title || '';

  const submitBooking = () => {
    setIsSuccess(true);
    
    // Construct WhatsApp Message
    const phoneNumber = config.contact.whatsapp.replace(/\D/g, '');
    const budgetRange = `${budget.min}€ - ${Math.round(budget.max)}€`;
    
    // Format Diagnosis
    let diagnosisText = "";
    // @ts-ignore
    const questions = SERVICE_QUESTIONS[bookingData.serviceId] || [];
    questions.forEach((q: any) => {
        const answer = bookingData.answers[q.id];
        if (answer !== undefined) {
            const displayAnswer = typeof answer === 'boolean' ? (answer ? 'Sí' : 'No') : answer;
            diagnosisText += `- ${t(q.labelKey)}: ${displayAnswer}\n`;
        }
    });

    const message = `
*NUEVA RESERVA ONLINE* 📅
-----------------------
🛠 *Servicio:* ${selectedServiceTitle}
👤 *Cliente:* ${bookingData.contact.name}
📱 *Tel:* ${bookingData.contact.phone}

📝 *Diagnóstico:*
${diagnosisText}
🗓 *Fecha:* ${bookingData.date}
⏰ *Turno:* ${t(bookingData.timeSlot)}

💰 *Presupuesto Est:* ${budgetRange}
-----------------------
Solicito confirmación de cita.
    `.trim();

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp after a short delay to show success animation
    setTimeout(() => {
        window.open(url, '_blank');
    }, 1500);
  };

  if (isSuccess) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl shadow-lg border border-green-100 max-w-2xl mx-auto my-12">
            <SEO title="Reserva Confirmada" noindex={true} />
            <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce"><Check size={48} className="text-green-600" /></div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('book_success')}</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">{t('book_success_msg')} Si no se abre WhatsApp automáticamente, pulsa el botón.</p>
            <div className="flex flex-col gap-4">
                <button onClick={submitBooking} className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-green-600 transition">
                    <MessageCircle className="w-5 h-5"/> Abrir WhatsApp
                </button>
                <button onClick={() => window.location.reload()} className="text-slate-500 font-bold hover:text-slate-800 underline">
                    {t('nav_home')}
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <SEO title="Reserva Online de Servicios | ServicioHogar24" noindex={true} />
      <div className="mb-12 text-center"><h1 className="text-4xl font-extrabold text-slate-900 mb-2">{t('book_title')}</h1><p className="text-slate-500">{t('book_subtitle')}</p></div>
      {/* Steps UI */}
      <div className="flex justify-between items-center mb-12 relative max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
        {BOOKING_STEPS.map((step) => (
            <div key={step.id} className={`flex flex-col items-center gap-2 bg-slate-50 p-2 rounded-lg ${currentStep >= step.id ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>{step.id}</div>
                <span className="text-xs hidden sm:block">{t(step.key)}</span>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[400px] flex flex-col relative">
            <AnimatePresence>
                {showUrgencyModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-red-50/95 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-red-500 max-w-md text-center">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-red-600" /></div>
                            <h3 className="text-2xl font-bold text-red-700 mb-2">{t('book_urgent_title')}</h3><p className="text-slate-600 mb-6">{t('book_urgent_desc')}</p>
                            <a href={`tel:${config.contact.phone}`} className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition mb-4 shadow-lg animate-pulse"><Phone size={24} /> {t('book_call_now')}</a>
                            <button onClick={() => setShowUrgencyModal(false)} className="text-sm text-slate-500 underline hover:text-slate-700">{t('book_continue_anyway')}</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-8 flex-grow">
                {currentStep === 1 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-center">{t('book_select_service')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {services.map(service => (
                                <button key={service.id} onClick={() => handleServiceSelect(service.id)} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg flex flex-col items-center gap-4 text-center ${bookingData.serviceId === service.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}>
                                    <div className={`${bookingData.serviceId === service.id ? 'text-blue-600' : 'text-slate-400'}`}>{getIcon(service.icon, 40)}</div>
                                    <span className="font-bold text-slate-700">{service.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-xl font-bold mb-6 text-center">{t('book_diagnosis')}</h2>
                        <div className="space-y-6">
                            {/* @ts-ignore */}
                            {SERVICE_QUESTIONS[bookingData.serviceId]?.map((q: any) => (
                                <div key={q.id} className="bg-slate-50 p-4 rounded-lg">
                                    <label className="block text-sm font-bold text-slate-700 mb-3">{t(q.labelKey)}</label>
                                    {q.type === 'boolean' && (<div className="flex gap-4"><button onClick={() => handleAnswerChange(q.id, true, q.urgent)} className={`flex-1 py-2 rounded-lg border-2 font-medium ${bookingData.answers[q.id] === true ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white hover:border-blue-300'}`}>Sí</button><button onClick={() => handleAnswerChange(q.id, false, q.urgent)} className={`flex-1 py-2 rounded-lg border-2 font-medium ${bookingData.answers[q.id] === false ? 'border-slate-600 bg-slate-600 text-white' : 'border-slate-200 bg-white hover:border-slate-300'}`}>No</button></div>)}
                                    {q.type === 'select' && (<select className="w-full p-2 rounded border border-slate-300" onChange={(e) => handleAnswerChange(q.id, e.target.value, false)}><option value="">Select...</option>{q.options.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}</select>)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        <h2 className="text-xl font-bold mb-6 text-center">{t('book_select_date')}</h2>
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {getNextDays().map((day, idx) => (
                                <button key={idx} onClick={() => handleDateSelect(day, bookingData.timeSlot)} className={`p-4 rounded-xl border-2 text-center transition ${bookingData.date === day ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                                    <Calendar className={`mx-auto mb-2 ${bookingData.date === day ? 'text-blue-600' : 'text-slate-400'}`} />
                                    <span className="font-bold block capitalize">{day}</span>
                                </button>
                            ))}
                        </div>
                        {bookingData.date && (<div className="space-y-3 max-w-md mx-auto">{['book_morning', 'book_afternoon', 'book_evening'].map((slot) => (<button key={slot} onClick={() => setBookingData({...bookingData, timeSlot: slot})} className={`w-full p-4 rounded-lg border-2 flex items-center justify-between ${bookingData.timeSlot === slot ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 hover:border-green-200'}`}><span className="font-medium">{t(slot)}</span>{bookingData.timeSlot === slot && <Check size={20}/>}</button>))}</div>)}
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-6 text-center">{t('book_summary')}</h2>
                        <div className="bg-slate-50 p-6 rounded-xl space-y-4 mb-6">
                            <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">{t('step_service')}</span><span className="font-bold">{selectedServiceTitle}</span></div>
                            <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">{t('step_datetime')}</span><span className="font-bold capitalize">{bookingData.date} - {bookingData.timeSlot ? t(bookingData.timeSlot) : ''}</span></div>
                            <div><span className="text-slate-500 block mb-2">{t('contact_title')}</span><input placeholder={t('form_name')} className="w-full p-2 mb-2 border rounded" value={bookingData.contact.name} onChange={e => setBookingData({...bookingData, contact: {...bookingData.contact, name: e.target.value}})} /><input placeholder={t('form_phone')} className="w-full p-2 border rounded" value={bookingData.contact.phone} onChange={e => setBookingData({...bookingData, contact: {...bookingData.contact, phone: e.target.value}})} /></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
                {currentStep > 1 ? (<button onClick={prevStep} className="text-slate-500 font-bold flex items-center gap-2 hover:text-slate-800"><ArrowLeft size={18} /> {t('btn_back')}</button>) : <div></div>}
                {currentStep < 4 ? (<button onClick={nextStep} disabled={(currentStep === 1 && !bookingData.serviceId) || (currentStep === 3 && (!bookingData.date || !bookingData.timeSlot))} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{t('btn_next')} <ArrowRight size={18} /></button>) : (<button onClick={submitBooking} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200">{t('btn_confirm')} <Check size={18} /></button>)}
            </div>
        </div>
        <div className={`lg:block ${currentStep > 1 ? 'block' : 'hidden'}`}>
             <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl sticky top-24">
                <div className="flex items-center gap-2 mb-4 text-blue-300"><Calculator size={20} /><h3 className="font-bold uppercase tracking-wider text-sm">{t('budget_est_title')}</h3></div>
                {bookingData.serviceId ? (
                    <div className="space-y-4">
                        <div className="text-4xl font-extrabold flex items-baseline gap-1">{budget.min}€ <span className="text-base font-normal text-slate-400">- {Math.round(budget.max)}€</span></div><p className="text-xs text-slate-400">{t('budget_range')}</p>
                        <div className="border-t border-slate-700 pt-4 space-y-2 text-sm">{budget.breakdown.map((item, idx) => (<div key={idx} className="flex justify-between"><span className="text-slate-300">{item.label}</span><span className="font-mono">{item.amount}€</span></div>))}</div>
                        <div className="bg-blue-900/50 p-3 rounded text-xs text-blue-200 mt-4">{t('budget_note')}</div>
                    </div>
                ) : (<div className="text-slate-500 text-sm py-8 text-center italic">Selecciona un servicio para ver el presupuesto estimado.</div>)}
             </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;