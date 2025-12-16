import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Star, CheckCircle, MapPin, ArrowRight, Calculator, ChevronDown, Activity, Tag, Droplets, Zap, Key, Thermometer, Flame, Wrench } from 'lucide-react';
import { dataService } from '../services/dataService';
import { ServiceItem, BlogPost, SiteConfig, FAQItem } from '../types';
import { MOCK_TESTIMONIALS, SERVICE_QUESTIONS, DEFAULT_SITE_CONFIG } from '../constants';

const ICON_MAP: Record<string, React.ElementType> = { Droplets, Zap, Key, Thermometer, Flame, Wrench };

export default function Home() {
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  
  // Quick Budget State
  const [budgetService, setBudgetService] = useState<string>('');
  const [budgetAnswers, setBudgetAnswers] = useState<Record<string, any>>({});
  const [estimatedTotal, setEstimatedTotal] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const loadData = async () => {
        setServices(await dataService.getServices());
        setRecentPosts((await dataService.getBlogPosts()).slice(0, 3));
        setFaqs(await dataService.getFAQs());
        setConfig(await dataService.getSiteConfig());
    };
    loadData();
  }, []);
  
  // Budget Calculation Logic
  useEffect(() => {
    if (!budgetService) { setEstimatedTotal({ min: 0, max: 0 }); return; }

    let total = config.pricing.baseFee;
    const selectedService = services.find(s => s.id === budgetService);
    const serviceFee = selectedService?.price || 0;
    total += serviceFee;

    const questions = SERVICE_QUESTIONS[budgetService as keyof typeof SERVICE_QUESTIONS] || [];
    let isUrgent = false;
    questions.forEach(q => { if (q.urgent && budgetAnswers[q.id] === true) isUrgent = true; });

    if (isUrgent) total += config.pricing.urgencyFee;

    setEstimatedTotal({ min: total, max: total * 1.3 });
  }, [budgetService, budgetAnswers, config, services]);

  const getIcon = (iconName: string) => { const Icon = ICON_MAP[iconName] || Wrench; return Icon ? <Icon size={32} /> : null; };
  
  // Helpers to format links safely (Removing non-digits)
  const phoneLink = `tel:${config.contact.phone.replace(/\D/g, '')}`;
  const waLink = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}`;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-slate-900/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 lg:py-32 grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 relative z-10 max-w-2xl">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">{t('hero_badge')}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">{config.texts.heroTitle || t('hero_title')}</h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">{config.texts.heroSubtitle || t('hero_subtitle')}</p>
            <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                    <a href={phoneLink} className="flex items-center justify-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-slate-100 transition shadow-lg text-lg active:scale-95"><Phone className="w-6 h-6" /> {t('cta_call')}</a>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-600 transition shadow-lg text-lg active:scale-95"><MessageCircle className="w-6 h-6" /> {t('cta_whatsapp')}</a>
                </div>
                <Link to="/booking" className="inline-flex items-center justify-center gap-3 bg-blue-800/50 backdrop-blur-sm border border-blue-400/30 text-blue-100 px-8 py-3 rounded-lg font-bold hover:bg-blue-800 hover:text-white transition shadow-lg text-base active:scale-95 w-full sm:w-fit"><Calculator className="w-5 h-5" /> {t('cta_budget')}</Link>
            </div>
          </div>
          <div className="hidden md:grid justify-end relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-sm lg:max-w-md transform transition hover:scale-105 duration-300">
                <div className="space-y-6">
                    <div className="flex items-center gap-4"><div className="bg-green-500/20 p-3 rounded-full border border-green-500/30 flex-shrink-0"><CheckCircle className="text-green-400 w-6 h-6"/></div><div><h3 className="font-bold text-lg text-white leading-tight">{config.texts.feature1Title || t('hero_feat_1_title')}</h3><p className="text-sm text-slate-300">{config.texts.feature1Desc || t('hero_feat_1_desc')}</p></div></div>
                    <div className="flex items-center gap-4"><div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30 flex-shrink-0"><Star className="text-blue-400 w-6 h-6"/></div><div><h3 className="font-bold text-lg text-white leading-tight">{config.texts.feature2Title || t('hero_feat_2_title')}</h3><p className="text-sm text-slate-300">{config.texts.feature2Desc || t('hero_feat_2_desc')}</p></div></div>
                    <div className="flex items-center gap-4"><div className="bg-orange-500/20 p-3 rounded-full border border-orange-500/30 flex-shrink-0"><MapPin className="text-orange-400 w-6 h-6"/></div><div><h3 className="font-bold text-lg text-white leading-tight">{config.texts.feature3Title || t('hero_feat_3_title')}</h3><p className="text-sm text-slate-300">{config.texts.feature3Desc || t('hero_feat_3_desc')}</p></div></div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid (Dynamic) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16"><h2 className="text-3xl font-bold text-slate-900 mb-4">{t('nav_services')}</h2><div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
                <div className="h-48 overflow-hidden bg-slate-200 relative">
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-blue-700 text-xs font-bold shadow-sm">24h Disponbile</div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4"><div className="text-blue-600 bg-blue-50 p-2 rounded-lg">{getIcon(service.icon)}</div><h3 className="text-xl font-bold text-slate-800">{service.title}</h3></div>
                  <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
                  <Link to="/booking" className="inline-flex items-center text-blue-700 font-bold hover:gap-2 transition-all mt-auto bg-blue-50 py-2 px-4 rounded-lg w-fit hover:bg-blue-100">{t('req_service')} <ArrowRight size={16} className="ml-1" /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Budget Calculator */}
      <section className="py-16 bg-blue-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3"><Calculator className="text-blue-300" size={32} />{t('home_budget_title')}</h2>
                <p className="text-blue-200 mb-8 text-lg">{t('home_budget_subtitle')}</p>
                <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                     <label className="block text-sm font-bold text-blue-200 mb-2">{t('home_budget_select')}</label>
                     <select className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white mb-6 focus:ring-2 focus:ring-blue-400 outline-none" value={budgetService} onChange={(e) => { setBudgetService(e.target.value); setBudgetAnswers({}); }}>
                        <option value="">-- {t('home_budget_select')} --</option>
                        {services.map(s => (<option key={s.id} value={s.id}>{s.title}</option>))}
                     </select>
                     {budgetService && (<div className="space-y-4 animate-fadeIn">
                        {SERVICE_QUESTIONS[budgetService as keyof typeof SERVICE_QUESTIONS]?.map((q: any) => (
                                 <div key={q.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                    <span className="text-sm font-medium">{t(q.labelKey)}</span>
                                     {q.type === 'boolean' ? (
                                        <div className="flex gap-2"><button onClick={() => setBudgetAnswers({...budgetAnswers, [q.id]: true})} className={`px-3 py-1 rounded text-xs font-bold transition ${budgetAnswers[q.id] === true ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>Sí</button><button onClick={() => setBudgetAnswers({...budgetAnswers, [q.id]: false})} className={`px-3 py-1 rounded text-xs font-bold transition ${budgetAnswers[q.id] === false ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-400'}`}>No</button></div>
                                     ) : (<select className="bg-slate-700 text-xs rounded p-1 border-none outline-none text-white" onChange={(e) => setBudgetAnswers({...budgetAnswers, [q.id]: e.target.value})}><option value="">-</option>{q.options.map((o:string) => <option key={o} value={o}>{o}</option>)}</select>)}
                                 </div>
                        ))}</div>)}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-sm relative">
                     <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">{t('home_budget_result_label')}</div>
                     <div className="text-center mt-4">
                        {estimatedTotal.min > 0 ? (
                            <><div className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">{estimatedTotal.min}€</div>
                                <p className="text-slate-500 text-sm mb-6">{t('budget_range')}: {estimatedTotal.min}€ - {Math.round(estimatedTotal.max)}€</p>
                                <ul className="space-y-3 text-left bg-slate-50 p-4 rounded-xl mb-6 text-sm">
                                    <li className="flex justify-between"><span className="text-slate-500">{t('budget_item_base')}</span><span className="font-bold">{config.pricing.baseFee}€</span></li>
                                    <li className="flex justify-between"><span className="text-slate-500">{t('budget_item_service')}</span><span className="font-bold">{services.find(s=>s.id===budgetService)?.price}€</span></li>
                                    {estimatedTotal.min > (config.pricing.baseFee + (services.find(s=>s.id===budgetService)?.price || 0)) && (<li className="flex justify-between text-red-500"><span className="font-bold flex items-center gap-1"><Zap size={12}/> {t('budget_item_urgency')}</span><span className="font-bold">+{config.pricing.urgencyFee}€</span></li>)}
                                </ul></>
                        ) : (<div className="py-12 flex flex-col items-center text-slate-400"><Calculator size={48} className="mb-4 opacity-20" /><p className="text-sm">Configura tu servicio para ver el precio.</p></div>)}
                        <Link to="/booking" className="block w-full bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl active:scale-95">{t('home_budget_cta')}</Link>
                        <p className="text-xs text-slate-400 mt-4 text-center">{t('home_budget_legal')}</p>
                     </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Blog & Testimonials Sections */}
      <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
               <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                   <div className="max-w-2xl"><h2 className="text-3xl font-bold text-slate-900 mb-2">{t('home_blog_title')}</h2><p className="text-slate-500 text-lg">{t('home_blog_subtitle')}</p></div>
                   <Link to="/blog" className="text-blue-700 font-bold hover:gap-2 transition-all flex items-center">{t('nav_blog')} <ArrowRight size={18} className="ml-1"/></Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {recentPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                             <Link to={`/blog/${post.slug}`} className="h-48 overflow-hidden bg-slate-200 block">{post.imageUrl && <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={post.title}/>}</Link>
                             <div className="p-6"><div className="flex items-center gap-2 text-xs text-blue-600 font-bold mb-2"><Tag size={12} /> {post.category}</div><Link to={`/blog/${post.slug}`}><h3 className="font-bold text-lg mb-2 text-slate-800 hover:text-blue-700">{post.title}</h3></Link><p className="text-sm text-slate-500 line-clamp-2 mb-4">{post.excerpt}</p><Link to={`/blog/${post.slug}`} className="text-sm font-bold text-slate-900 hover:text-blue-700">Leer artículo &rarr;</Link></div>
                        </div>
                   ))}
               </div>
          </div>
      </section>
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10"><h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">{t('testimonials_title')}</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{MOCK_TESTIMONIALS.map((test, index) => (<div key={test.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-300"><div className="absolute top-6 right-6 text-blue-500/20"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg></div><div className="flex gap-1 text-yellow-400 mb-6">{[...Array(test.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div><p className="text-slate-300 italic mb-8 text-lg leading-relaxed">"{t(test.textKey)}"</p><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{test.name.charAt(0)}</div><div><span className="font-bold block text-white">{test.name}</span><span className="text-xs text-blue-400 uppercase font-bold tracking-wider">{test.service}</span></div></div></div>))}</div></div>
      </section>

       {/* Visual Coverage Panel */}
       <section className="h-[500px] relative w-full bg-slate-200 overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center grayscale opacity-50"></div>
           <div className="absolute inset-0 bg-blue-900/20"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-400/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-500/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
           <div className="absolute bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50 z-10"><div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-3"><Activity className="text-green-500 animate-pulse" /><div><h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Estado del Servicio</h3><p className="text-xs text-green-600 font-bold">● Operativo 24h</p></div></div><div className="space-y-3"><div className="flex justify-between text-sm"><span className="text-slate-500">Técnicos Activos</span><span className="font-bold text-slate-800">8 en zona</span></div><div className="flex justify-between text-sm"><span className="text-slate-500">Tiempo estimado</span><span className="font-bold text-blue-600">~25 min</span></div></div></div>
       </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{t('faq_title')}</h2>
            <div className="space-y-4">
                {faqs.map((faq) => (
                    <details key={faq.id} className="group bg-slate-50 rounded-xl border border-slate-100">
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-bold text-slate-800 group-open:text-blue-700 transition">
                            {faq.question}
                            <span className="transition group-open:rotate-180 bg-white p-1 rounded-full shadow-sm text-slate-400 group-open:text-blue-600"><ChevronDown size={20} /></span>
                        </summary>
                        <div className="px-6 pb-6 text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">{faq.answer}</div>
                    </details>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}