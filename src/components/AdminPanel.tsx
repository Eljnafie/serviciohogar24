import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { dataService } from '../services/dataService';
import { BlogPost, SiteConfig, ServiceItem, FAQItem, CallbackRequest } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';
import { Trash2, Plus, LogOut, Loader2, Save, ArrowLeft, Search, Check, X, Image as ImageIcon, Globe, Heading, Wand2, Bot, CheckCircle2, Sparkles, RefreshCw, Settings, Euro, Phone as PhoneIcon, Wrench, HelpCircle, User, PhoneIncoming, Clock, Scale, Facebook, Instagram, Twitter, MessageSquare, LayoutTemplate, Upload } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import SEO from './SEO';
import { useToast } from '../context/ToastContext';

// Helper to safely access API Key in browser environments
const getApiKey = () => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {}
  
  // Fallback for other environments safely
  try {
    const w = window as any;
    if (w.process && w.process.env && w.process.env.API_KEY) {
        return w.process.env.API_KEY;
    }
  } catch (e) {}
  
  return '';
};

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Data State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(false);
  
  // View State
  const [view, setView] = useState<string>('list');
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  // Profile Settings State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // AI & Editors State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showImageAiModal, setShowImageAiModal] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // SEO Validation State
  const [seoScore, setSeoScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState({
    keywordInTitle: false,
    keywordInDesc: false,
    contentLength: false,
    hasH2: false,
    hasImageAlt: false
  });

  // Blog Form State
  const [form, setForm] = useState<Partial<BlogPost>>({
    title: '', slug: '', excerpt: '', content: '', category: 'General', language: 'es', status: 'draft', imageUrl: '', imageAlt: '', seo: { metaTitle: '', metaDescription: '', focusKeyword: '' }
  });

  const fetchData = async () => {
    const pData = await dataService.getBlogPosts();
    const cData = await dataService.getSiteConfig();
    const sData = await dataService.getServices();
    const fData = await dataService.getFAQs();
    const callData = await dataService.getCallbacks();
    setPosts(pData);
    setSiteConfig(cData);
    setServices(sData);
    setFaqs(fData);
    setCallbacks(callData);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (view === 'create' || view === 'edit') {
        const keyword = form.seo?.focusKeyword?.toLowerCase() || '';
        const title = form.title?.toLowerCase() || '';
        const desc = form.seo?.metaDescription?.toLowerCase() || '';
        const content = form.content || '';
        
        const checks = {
            keywordInTitle: keyword ? title.includes(keyword) : false,
            keywordInDesc: keyword ? desc.includes(keyword) : false,
            contentLength: content.split(' ').length > 300,
            hasH2: content.includes('<h2>') || content.includes('H2:'),
            hasImageAlt: !!form.imageAlt
        };
        setSeoChecks(checks);
        const score = Object.values(checks).filter(Boolean).length * 20;
        setSeoScore(score);
    }
  }, [form, view]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const creds = await dataService.getAdminCredentials();
    if (email === creds.email && password === creds.password) {
      setIsAuthenticated(true);
      setNewEmail(creds.email);
      addToast('Sesión iniciada correctamente', 'success');
    } else {
      addToast('Credenciales incorrectas', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    addToast('Sesión cerrada', 'info');
  };

  const handleUpdateProfile = async () => {
      if (!newEmail || !newPassword) {
          addToast('Email y contraseña requeridos', 'error');
          return;
      }
      await dataService.updateAdminCredentials({ email: newEmail, password: newPassword });
      addToast('Credenciales actualizadas. Usa las nuevas para entrar.', 'success');
  };

  // --- CALLBACKS ---
  const handleToggleCallback = async (id: string, status: 'pending' | 'called') => {
      const newStatus = status === 'pending' ? 'called' : 'pending';
      await dataService.updateCallbackStatus(id, newStatus);
      setCallbacks(callbacks.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDeleteCallback = async (id: string) => {
      if(confirm('¿Borrar registro?')) {
          await dataService.deleteCallback(id);
          setCallbacks(callbacks.filter(c => c.id !== id));
      }
  };

  // --- SERVICES MANAGEMENT ---
  const handleServiceChange = (id: string, field: keyof ServiceItem, value: any) => {
      setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleServiceImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              handleServiceChange(id, 'imageUrl', reader.result);
              addToast('Imagen cargada localmente', 'info');
          };
          reader.readAsDataURL(file);
      }
  };

  const addService = () => {
      const newService: ServiceItem = {
          id: Date.now().toString(),
          title: 'Nuevo Servicio',
          description: 'Descripción del servicio...',
          price: 50,
          imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
          icon: 'Zap'
      };
      setServices([...services, newService]);
      addToast('Servicio añadido', 'info');
  };

  const deleteService = (id: string) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
          setServices(services.filter(s => s.id !== id));
          addToast('Servicio eliminado', 'info');
      }
  };

  const saveServices = async () => {
      setLoading(true);
      await dataService.updateServices(services);
      setLoading(false);
      addToast('Lista de servicios guardada', 'success');
  };

  // --- FAQS MANAGEMENT ---
  const handleFaqChange = (id: string, field: keyof FAQItem, value: any) => {
      setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  const deleteFaq = async (id: string) => {
      if(window.confirm('¿Borrar esta pregunta?')) {
          setFaqs(faqs.filter(f => f.id !== id));
          addToast('Pregunta eliminada', 'info');
      }
  };
  const addFaq = () => {
      const newFaq: FAQItem = {
          id: `faq_${Date.now()}`,
          question: 'Nueva Pregunta',
          answer: 'Respuesta...'
      };
      setFaqs([...faqs, newFaq]);
  };
  const saveFaqs = async () => {
      setLoading(true);
      await dataService.updateFAQs(faqs);
      setLoading(false);
      addToast('FAQs actualizadas', 'success');
  };

  // --- BLOG LOGIC ---
  const initCreate = () => {
    setForm({
      title: '', slug: '', excerpt: '', content: '', category: 'General', language: 'es', status: 'draft', imageUrl: '', imageAlt: '', seo: { metaTitle: '', metaDescription: '', focusKeyword: '' }
    });
    setView('create');
  };

  const initEdit = (post: BlogPost) => {
    setForm(post);
    setCurrentPostId(post.id);
    setView('edit');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    setForm(prev => ({
        ...prev, title: newTitle, slug: prev.slug === '' || view === 'create' ? autoSlug : prev.slug, seo: { ...prev.seo!, metaTitle: newTitle.substring(0, 60) }
    }));
  };

  const handleSave = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    setLoading(true);
    const postData = { ...form, status: status, date: form.date || new Date().toISOString().split('T')[0], imageUrl: form.imageUrl || `https://picsum.photos/800/400?random=${Date.now()}` } as BlogPost;
    if (view === 'edit' && currentPostId) await dataService.updateBlogPost(postData);
    else await dataService.addBlogPost(postData);
    setLoading(false);
    setView('list');
    await fetchData();
    addToast(`Artículo ${status === 'published' ? 'publicado' : 'guardado'}`, 'success');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar este artículo permanentemente?')) {
        await dataService.deleteBlogPost(id);
        await fetchData();
        addToast('Artículo eliminado', 'info');
    }
  };
  
  const handleSaveConfig = async () => {
    setLoading(true);
    await dataService.updateSiteConfig(siteConfig);
    setLoading(false);
    addToast('Configuración guardada', 'success');
  };

  // --- EDITOR HELPERS (Tags, Autoformat, AI) ---
  const insertTag = (tagStart: string, tagEnd: string = '') => {
    if (!textAreaRef.current) return;
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart; const end = textarea.selectionEnd; const text = form.content || '';
    const newText = text.substring(0, start) + tagStart + text.substring(start, end) + tagEnd + text.substring(end);
    setForm({ ...form, content: newText });
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + tagStart.length, end + tagStart.length); }, 0);
  };

  const handleAutoFormat = () => {
    if (!form.content) return;
    let text = form.content;
    text = text.replace(/^H2:\s*(.+)$/gm, '<h2 class="text-2xl font-bold text-slate-800 mt-8 mb-4">$1</h2>');
    text = text.replace(/^H3:\s*(.+)$/gm, '<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">$1</h3>');
    text = text.replace(/^Tip:\s*(.+)$/gm, '<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 italic text-slate-700 flex gap-2"><span class="font-bold">Tip:</span> $1</div>');
    text = text.replace(/^-\s*(.+)$/gm, '<li class="ml-4 list-disc marker:text-blue-500 mb-2">$1</li>');
    const lines = text.split('\n\n');
    const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<')) return trimmed;
        return `<p class="mb-4 leading-relaxed text-slate-600">${trimmed}</p>`;
    });
    setForm({ ...form, content: formattedLines.join('\n') });
    addToast('Formato automático aplicado', 'info');
  };

  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Simple size check (5MB)
        if (file.size > 5000000) {
            addToast('Imagen demasiado grande. Máximo 5MB.', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, imageUrl: reader.result as string });
            addToast('Imagen cargada localmente', 'info');
        };
        reader.readAsDataURL(file);
    }
  };

  const generateAiPrompt = () => {
      return `
      Actúa como un redactor SEO profesional especializado en SEO local para negocios de servicios del hogar.
      
      OBJETIVO:
      Crear un artículo informativo, útil y optimizado para posicionar en Google en la zona de Barcelona.

      TEMA: "${aiTopic}"
      IDIOMA: ${form.language === 'es' ? 'Español' : 'Inglés'}.
      UBICACIÓN: Barcelona (usar términos locales como Barna, área metropolitana).
      NEGOCIO: ServiciosHogar24 (fontanería, electricidad, cerrajería, climatización 24h).

      REQUISITOS SEO OBLIGATORIOS:
      1. Título SEO: 40-60 caracteres, atractivo.
      2. Meta Descripción: 130-155 caracteres, persuasiva.
      3. Estructura: NO usar H1 en el contenido. Empezar con H2. Usar párrafos cortos.
      4. Palabras Clave: Incluir keyword principal en primer párrafo y H2.
      5. Longitud: Mínimo 800 palabras.

      ENLACES INTERNOS (CRÍTICO):
      Debes incluir de 3 a 5 enlaces internos HTML en el texto.
      IMPORTANTE: Usar formato HashRouter (con #) para que funcionen en la Web App:
      - Para servicios: <a href="#/services">Nuestros servicios</a>
      - Para contacto: <a href="#/contact">Contáctanos</a>
      - Para reservas: <a href="#/booking">Pedir presupuesto</a>
      - Para blog: <a href="#/blog">Más consejos</a>
      - Para inicio: <a href="#/">ServicioHogar24</a>
      
      *Los anchor text deben ser naturales dentro de la frase.*

      FORMATO JSON RESPUESTA:
      {
        "seoTitle": "...",
        "metaDescription": "...",
        "slug": "...",
        "focusKeyword": "...",
        "content": "... HTML del cuerpo (con <h2>, <p>, <ul>, <a>) ...",
        "imageAlt": "..."
      }
      `;
  };
  
  const handleGenerateWithAi = async () => {
    setIsGeneratingAi(true);
    try {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("Falta la API Key (VITE_GEMINI_API_KEY o API_KEY)");
        
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: generateAiPrompt(),
            config: { 
                responseMimeType: "application/json", 
                responseSchema: { 
                    type: Type.OBJECT, 
                    properties: { 
                        seoTitle: { type: Type.STRING }, 
                        metaDescription: { type: Type.STRING }, 
                        slug: { type: Type.STRING }, 
                        focusKeyword: { type: Type.STRING }, 
                        content: { type: Type.STRING }, 
                        imageAlt: { type: Type.STRING }, 
                    }, 
                    required: ["seoTitle", "metaDescription", "slug", "focusKeyword", "content", "imageAlt"] 
                } 
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response text");

        const data = JSON.parse(text);
        if (data) {
            setForm(prev => ({ 
                ...prev, 
                title: data.seoTitle, 
                slug: data.slug, 
                excerpt: data.metaDescription, 
                content: data.content, 
                imageAlt: data.imageAlt, 
                imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(data.focusKeyword || 'home repair')}?width=1200&height=630&nologo=true`, 
                seo: { 
                    metaTitle: data.seoTitle, 
                    metaDescription: data.metaDescription, 
                    focusKeyword: data.focusKeyword 
                } 
            }));
            setShowAiModal(false);
            addToast('Contenido generado con éxito', 'success');
        }
    } catch (error) { 
        console.error(error);
        addToast("Error generando con IA. Verifica la API KEY.", 'error'); 
    } finally { 
        setIsGeneratingAi(false); 
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
        const generatedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=630&nologo=true&seed=${Date.now()}`;
        let altText = imagePrompt;
        
        try {
             const apiKey = getApiKey();
             if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({ 
                    model: "gemini-2.5-flash", 
                    contents: `Genera un texto ALT SEO (max 10 palabras) para: "${imagePrompt}"` 
                });
                altText = response.text || imagePrompt;
             }
        } catch (e) {
            console.warn("No se pudo generar ALT text con IA, usando prompt original.");
        }
        
        setForm(prev => ({ ...prev, imageUrl: generatedUrl, imageAlt: altText?.trim() || imagePrompt }));
        setShowImageAiModal(false);
        addToast('Imagen generada', 'success');
    } catch (error) { 
        addToast("Error generando imagen", 'error'); 
    } finally { 
        setIsGeneratingImage(false); 
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
        <SEO title="Admin Login" noindex={true} />
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">{t('admin_login')}</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="admin@admin.com" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="admin" />
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-lg font-bold">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: LEGAL EDIT ---
  if (view === 'legal') {
      return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800"><ArrowLeft size={24} /></button>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><Scale className="text-blue-600"/> Textos Legales</h1>
            </div>
            <div className="grid gap-8">
                <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                    <h3 className="font-bold mb-2">Aviso Legal</h3>
                    <textarea 
                        className="w-full h-40 p-3 border rounded font-mono text-sm" 
                        value={siteConfig.legal?.legalNotice || ''} 
                        onChange={(e) => setSiteConfig({...siteConfig, legal: {...(siteConfig.legal || { legalNotice:'', privacyPolicy:'', cookiesPolicy:'' }), legalNotice: e.target.value}})}
                    />
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                    <h3 className="font-bold mb-2">Política de Privacidad</h3>
                    <textarea 
                        className="w-full h-40 p-3 border rounded font-mono text-sm" 
                        value={siteConfig.legal?.privacyPolicy || ''} 
                        onChange={(e) => setSiteConfig({...siteConfig, legal: {...(siteConfig.legal || { legalNotice:'', privacyPolicy:'', cookiesPolicy:'' }), privacyPolicy: e.target.value}})}
                    />
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                    <h3 className="font-bold mb-2">Política de Cookies</h3>
                    <textarea 
                        className="w-full h-40 p-3 border rounded font-mono text-sm" 
                        value={siteConfig.legal?.cookiesPolicy || ''} 
                        onChange={(e) => setSiteConfig({...siteConfig, legal: {...(siteConfig.legal || { legalNotice:'', privacyPolicy:'', cookiesPolicy:'' }), cookiesPolicy: e.target.value}})}
                    />
                </div>
                <div className="sticky bottom-4 flex justify-end">
                     <button onClick={handleSaveConfig} disabled={loading} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex gap-2 shadow-2xl hover:scale-105 transition">{loading ? <Loader2 className="animate-spin" /> : <Save />} Guardar Legal</button>
                 </div>
            </div>
        </div>
      );
  }

  // --- VIEW: PROFILE SETTINGS ---
  if (view === 'profile') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800"><ArrowLeft size={24} /></button>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><User className="text-blue-600"/> Mi Perfil</h1>
            </div>
            <div className="bg-white p-8 rounded-xl shadow border border-slate-100">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">Cambiar Credenciales</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Nuevo Email</label>
                        <input className="w-full border p-2 rounded" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1">Nueva Contraseña</label>
                        <input className="w-full border p-2 rounded" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <button onClick={handleUpdateProfile} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 w-full">Guardar Cambios</button>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: CALLBACKS / LEADS ---
  if (view === 'callbacks') {
      return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800"><ArrowLeft size={24} /></button>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><PhoneIncoming className="text-green-600"/> Leads / Llamadas</h1>
            </div>
            <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Fecha/Hora</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {callbacks.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400">No hay solicitudes pendientes.</td></tr>
                        ) : callbacks.map(call => (
                            <tr key={call.id} className={call.status === 'pending' ? 'bg-white' : 'bg-slate-50 opacity-60'}>
                                <td className="p-4 font-mono text-lg font-bold text-slate-800">{call.phone}</td>
                                <td className="p-4 text-sm text-slate-600 flex items-center gap-2">
                                    <Clock size={14}/> {new Date(call.date).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${call.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {call.status === 'pending' ? 'Pendiente' : 'Contactado'}
                                    </span>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleToggleCallback(call.id, call.status)} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Marcar contactado">
                                        <Check size={18}/>
                                    </button>
                                    <button onClick={() => handleDeleteCallback(call.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Borrar">
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      );
  }

  // --- GENERIC VIEW HANDLERS ---
  if (view === 'settings') {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
             <div className="flex justify-between items-center mb-8">
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800"><ArrowLeft size={24} /></button>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><Settings className="text-blue-600"/> Configuración Web</h1>
            </div>
            
            <div className="grid gap-8">
                 {/* Contacto */}
                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2"><PhoneIcon size={20}/> Datos de Contacto</h2>
                     <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Teléfono Principal</label>
                            <input className="w-full border p-2 rounded" value={siteConfig.contact.phone} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp</label>
                            <input className="w-full border p-2 rounded" value={siteConfig.contact.whatsapp} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, whatsapp: e.target.value}})} />
                        </div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                            <input className="w-full border p-2 rounded" value={siteConfig.contact.email} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})} />
                        </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Dirección Física</label>
                            <input className="w-full border p-2 rounded" value={siteConfig.contact.address} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, address: e.target.value}})} />
                        </div>
                     </div>
                 </div>

                 {/* Redes Sociales */}
                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2"><MessageSquare size={20}/> Redes Sociales</h2>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Facebook size={18} className="text-blue-600"/>
                            <input className="w-full border p-2 rounded" placeholder="Facebook URL" value={siteConfig.social?.facebook || ''} onChange={(e) => setSiteConfig({...siteConfig, social: {...(siteConfig.social || { facebook: '', instagram: '', twitter: '' }), facebook: e.target.value}})} />
                        </div>
                         <div className="flex items-center gap-2">
                            <Instagram size={18} className="text-pink-600"/>
                            <input className="w-full border p-2 rounded" placeholder="Instagram URL" value={siteConfig.social?.instagram || ''} onChange={(e) => setSiteConfig({...siteConfig, social: {...(siteConfig.social || { facebook: '', instagram: '', twitter: '' }), instagram: e.target.value}})} />
                        </div>
                         <div className="flex items-center gap-2">
                            <Twitter size={18} className="text-sky-500"/>
                            <input className="w-full border p-2 rounded" placeholder="Twitter URL" value={siteConfig.social?.twitter || ''} onChange={(e) => setSiteConfig({...siteConfig, social: {...(siteConfig.social || { facebook: '', instagram: '', twitter: '' }), twitter: e.target.value}})} />
                        </div>
                     </div>
                 </div>

                 {/* Textos Web */}
                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2"><LayoutTemplate size={20}/> Textos y Portada</h2>
                     <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Título Principal (H1)</label>
                            <input className="w-full border p-2 rounded" value={siteConfig.texts.heroTitle} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, heroTitle: e.target.value}})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Subtítulo</label>
                            <input className="w-full border p-2 rounded" value={siteConfig.texts.heroSubtitle} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, heroSubtitle: e.target.value}})} />
                        </div>
                     </div>
                     <h3 className="font-bold text-sm text-slate-600 mb-2 border-t pt-4">Destacados (Iconos Portada)</h3>
                     <div className="grid md:grid-cols-3 gap-4">
                         <div className="p-3 border rounded bg-slate-50">
                             <input className="w-full border p-1 rounded text-sm font-bold mb-1" value={siteConfig.texts.feature1Title || ''} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, feature1Title: e.target.value}})} placeholder="Título 1"/>
                             <textarea rows={2} className="w-full border p-1 rounded text-xs" value={siteConfig.texts.feature1Desc || ''} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, feature1Desc: e.target.value}})} placeholder="Desc 1"/>
                         </div>
                         <div className="p-3 border rounded bg-slate-50">
                             <input className="w-full border p-1 rounded text-sm font-bold mb-1" value={siteConfig.texts.feature2Title || ''} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, feature2Title: e.target.value}})} placeholder="Título 2"/>
                             <textarea rows={2} className="w-full border p-1 rounded text-xs" value={siteConfig.texts.feature2Desc || ''} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, feature2Desc: e.target.value}})} placeholder="Desc 2"/>
                         </div>
                         <div className="p-3 border rounded bg-slate-50">
                             <input className="w-full border p-1 rounded text-sm font-bold mb-1" value={siteConfig.texts.feature3Title || ''} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, feature3Title: e.target.value}})} placeholder="Título 3"/>
                             <textarea rows={2} className="w-full border p-1 rounded text-xs" value={siteConfig.texts.feature3Desc || ''} onChange={(e) => setSiteConfig({...siteConfig, texts: {...siteConfig.texts, feature3Desc: e.target.value}})} placeholder="Desc 3"/>
                         </div>
                     </div>
                 </div>

                 {/* Precios */}
                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                     <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-2"><Euro size={20}/> Precios Base</h2>
                     <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Tarifa Desplazamiento</label>
                            <input type="number" className="w-full border p-2 rounded" value={siteConfig.pricing.baseFee} onChange={(e) => setSiteConfig({...siteConfig, pricing: {...siteConfig.pricing, baseFee: Number(e.target.value)}})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Plus Urgencia</label>
                            <input type="number" className="w-full border p-2 rounded" value={siteConfig.pricing.urgencyFee} onChange={(e) => setSiteConfig({...siteConfig, pricing: {...siteConfig.pricing, urgencyFee: Number(e.target.value)}})} />
                        </div>
                     </div>
                 </div>
                 
                 <div className="sticky bottom-4 flex justify-end">
                     <button onClick={handleSaveConfig} disabled={loading} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex gap-2 shadow-2xl hover:scale-105 transition">{loading ? <Loader2 className="animate-spin" /> : <Save />} Guardar Configuración</button>
                 </div>
            </div>
        </div>
    );
  }

  if (view === 'services') {
      return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800"><ArrowLeft size={24} /></button>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><Wrench className="text-blue-600"/> Gestión de Servicios</h1>
                <div className="flex gap-2">
                    <button onClick={addService} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"><Plus size={18}/> Nuevo Servicio</button>
                    <button onClick={saveServices} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">{loading ? <Loader2 className="animate-spin"/> : <Save/>} Guardar Todos</button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {services.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col md:flex-row gap-6 relative group">
                        <button onClick={() => deleteService(service.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 p-2"><Trash2 size={20}/></button>
                        <div className="w-full md:w-1/4">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Imagen</label>
                            <div className="relative group/img cursor-pointer">
                                <img src={service.imageUrl} className="w-full h-32 object-cover rounded-lg mb-2 border hover:opacity-80 transition" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/img:opacity-100 text-white font-bold text-xs bg-black/40 rounded-lg">Cambiar Foto</div>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleServiceImageUpload(service.id, e)} />
                            </div>
                            <input className="w-full text-xs p-2 border rounded" placeholder="o pegar URL..." value={service.imageUrl} onChange={(e) => handleServiceChange(service.id, 'imageUrl', e.target.value)} />
                        </div>
                        <div className="flex-grow space-y-4 pr-10">
                            <div className="flex gap-4">
                                <div className="flex-grow">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Título del Servicio</label>
                                    <input className="w-full p-2 border rounded font-bold text-lg" value={service.title} onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)} />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Precio Base (€)</label>
                                    <input type="number" className="w-full p-2 border rounded font-bold" value={service.price} onChange={(e) => handleServiceChange(service.id, 'price', Number(e.target.value))} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                                <textarea rows={3} className="w-full p-2 border rounded text-sm text-slate-600" value={service.description} onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} />
                            </div>
                            <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase">Icono (Nombre Lucide)</label>
                                 <select className="w-full p-2 border rounded bg-white text-sm" value={service.icon} onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value)}>
                                     <option value="Droplets">Fontanería (Droplets)</option>
                                     <option value="Zap">Electricidad (Zap)</option>
                                     <option value="Key">Cerrajería (Key)</option>
                                     <option value="Thermometer">Climatización (Thermometer)</option>
                                     <option value="Flame">Calefacción (Flame)</option>
                                     <option value="Wrench">General (Wrench)</option>
                                 </select>
                            </div>
                        </div>
                    </div>
                ))}
                {services.length === 0 && <div className="text-center py-12 text-slate-400">No hay servicios. Añade uno nuevo.</div>}
            </div>
        </div>
      );
  }

  if (view === 'faqs') {
      return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => setView('list')} className="text-slate-500 hover:text-slate-800"><ArrowLeft size={24} /></button>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><HelpCircle className="text-blue-600"/> Gestión FAQs</h1>
                <div className="flex gap-2">
                    <button onClick={addFaq} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700"><Plus size={18}/> Añadir Pregunta</button>
                    <button onClick={saveFaqs} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">{loading ? <Loader2 className="animate-spin"/> : <Save/>} Guardar</button>
                </div>
            </div>
            <div className="space-y-4">
                {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white p-4 rounded-xl shadow border border-slate-100 relative group">
                        <button onClick={() => deleteFaq(faq.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                        <div className="pr-10 space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Pregunta</label>
                                <input className="w-full p-2 border rounded font-bold" value={faq.question} onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Respuesta</label>
                                <textarea rows={2} className="w-full p-2 border rounded text-sm text-slate-600" value={faq.answer} onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );
  }

  // --- DASHBOARD LIST VIEW ---
  if (view === 'list') {
      return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">{t('admin_dashboard')}</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setView('callbacks')} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 font-bold transition hover:bg-green-100 relative">
                        <PhoneIncoming size={18} /> Leads
                        {callbacks.filter(c => c.status === 'pending').length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
                    </button>
                    <button onClick={() => setView('services')} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg border hover:bg-blue-50 hover:text-blue-700 font-bold transition">
                        <Wrench size={18} /> Servicios
                    </button>
                    <button onClick={() => setView('faqs')} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg border hover:bg-purple-50 hover:text-purple-700 font-bold transition">
                        <HelpCircle size={18} /> FAQs
                    </button>
                    <button onClick={() => setView('settings')} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg border hover:bg-slate-50 hover:text-slate-900 font-bold transition">
                        <Settings size={18} /> Config
                    </button>
                    <button onClick={() => setView('legal')} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg border hover:bg-slate-50 hover:text-slate-900 font-bold transition">
                        <Scale size={18} /> Legal
                    </button>
                    <button onClick={() => setView('profile')} className="flex items-center gap-2 bg-white text-slate-500 hover:text-blue-600 px-3 py-2 rounded-lg border ml-2">
                        <User size={18} />
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-600 ml-2">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Llamadas Pendientes</p>
                    <p className="text-2xl font-bold text-red-500">{callbacks.filter(c => c.status === 'pending').length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Total Artículos</p>
                    <p className="text-2xl font-bold text-blue-600">{posts.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Servicios Activos</p>
                    <p className="text-2xl font-bold text-slate-700">{services.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase font-bold">Estado Web</p>
                    <p className="text-2xl font-bold text-green-500 flex items-center gap-1"><CheckCircle2 size={20}/> Online</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Artículos del Blog</h2>
                    <button onClick={initCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700">
                        <Plus size={18} /> Nuevo Artículo
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr><th className="p-3">Título</th><th className="p-3">Estado</th><th className="p-3">Idioma</th><th className="p-3 text-right">Acciones</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50 transition">
                                    <td className="p-3 font-medium cursor-pointer hover:text-blue-600" onClick={() => initEdit(post)}>{post.title}</td>
                                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100'}`}>{post.status}</span></td>
                                    <td className="p-3 uppercase text-xs font-bold text-slate-500">{post.language}</td>
                                    <td className="p-3 text-right"><button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      );
  }

  // --- BLOG EDITOR VIEW ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 font-bold"><ArrowLeft size={20} /> Volver</button>
            <div className="flex gap-3">
                <button onClick={(e) => handleSave(e, 'draft')} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Guardar Borrador</button>
                <button onClick={(e) => handleSave(e, 'published')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex gap-2 hover:bg-blue-700">{loading ? <Loader2 className="animate-spin"/> : <Save/>} Publicar</button>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow border border-slate-100 space-y-4">
                     <input className="w-full text-xl font-bold p-3 border rounded-lg" placeholder="Título (H1)" value={form.title} onChange={handleTitleChange} />
                     <div className="flex gap-4">
                        <select className="p-2 border rounded" value={form.language} onChange={(e) => setForm({...form, language: e.target.value as any})}><option value="es">ES</option><option value="en">EN</option></select>
                        <input className="flex-grow p-2 border rounded text-sm text-slate-600" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="url-slug"/>
                        <select className="p-2 border rounded" value={form.category} onChange={(e) => setForm({...form, category: e.target.value as any})}><option value="General">General</option><option value="Plumbing">Fontanería</option><option value="Electricity">Electricidad</option></select>
                     </div>
                </div>
                <div className="bg-white rounded-xl shadow border border-slate-100">
                    <div className="bg-slate-50 p-2 flex gap-2 border-b">
                         <button onClick={() => insertTag('H2: ', '')} className="p-1 hover:bg-slate-200 rounded"><Heading size={18}/></button>
                         <button onClick={() => insertTag('Tip: ', '')} className="p-1 hover:bg-slate-200 rounded text-xs font-bold">Tip</button>
                         <button onClick={handleAutoFormat} className="p-1 px-2 bg-purple-100 text-purple-700 rounded text-xs font-bold flex gap-1"><Wand2 size={14}/> Auto</button>
                         <button onClick={() => setShowAiModal(true)} className="p-1 px-2 bg-green-100 text-green-700 rounded text-xs font-bold flex gap-1"><Bot size={14}/> IA</button>
                    </div>
                    <textarea ref={textAreaRef} className="w-full h-96 p-4 outline-none font-mono text-sm" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} placeholder="Contenido HTML..." />
                </div>
                <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                     <div className="flex justify-between mb-2"><h3 className="font-bold flex gap-2"><ImageIcon size={18}/> Multimedia</h3><button onClick={() => setShowImageAiModal(true)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded flex gap-1"><Sparkles size={12}/> Generar IA</button></div>
                     <div className="flex gap-2">
                        <input className="flex-grow p-2 border rounded text-sm" placeholder="URL Imagen" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} />
                        <label className="cursor-pointer bg-slate-100 p-2 rounded hover:bg-slate-200 border border-slate-200 flex items-center justify-center w-10" title="Subir desde PC">
                            <Upload size={20} className="text-slate-600"/>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePostImageUpload} />
                        </label>
                     </div>
                     <input className="w-full mt-2 p-2 border rounded text-sm" placeholder="Texto ALT" value={form.imageAlt} onChange={(e) => setForm({...form, imageAlt: e.target.value})} />
                     {form.imageUrl && <img src={form.imageUrl} className="h-32 object-cover rounded mt-4 border" />}
                </div>
            </div>
            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                     <h3 className="font-bold mb-4 flex gap-2 items-center"><CheckCircle2 size={18} className="text-green-600"/> Análisis SEO ({seoScore}%)</h3>
                     <ul className="space-y-2 text-sm">
                        <li className={`flex items-center gap-2 ${seoChecks.keywordInTitle ? 'text-green-600' : 'text-slate-400'}`}>
                            {seoChecks.keywordInTitle ? <Check size={14}/> : <X size={14}/>} Keyword en Título
                        </li>
                        <li className={`flex items-center gap-2 ${seoChecks.keywordInDesc ? 'text-green-600' : 'text-slate-400'}`}>
                            {seoChecks.keywordInDesc ? <Check size={14}/> : <X size={14}/>} Keyword en Descripción
                        </li>
                        <li className={`flex items-center gap-2 ${seoChecks.contentLength ? 'text-green-600' : 'text-slate-400'}`}>
                            {seoChecks.contentLength ? <Check size={14}/> : <X size={14}/>} +300 Palabras
                        </li>
                        <li className={`flex items-center gap-2 ${seoChecks.hasH2 ? 'text-green-600' : 'text-slate-400'}`}>
                            {seoChecks.hasH2 ? <Check size={14}/> : <X size={14}/>} Usa Subtítulos (H2)
                        </li>
                         <li className={`flex items-center gap-2 ${seoChecks.hasImageAlt ? 'text-green-600' : 'text-slate-400'}`}>
                            {seoChecks.hasImageAlt ? <Check size={14}/> : <X size={14}/>} Texto ALT Imagen
                        </li>
                     </ul>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                    <h3 className="font-bold mb-4 flex gap-2"><Globe size={18}/> Google Preview</h3>
                    <div className="text-xs text-slate-500 mb-1">serviciohogar24.com › blog</div>
                    <div className="text-[#1a0dab] text-lg hover:underline truncate cursor-pointer">{form.seo?.metaTitle || form.title}</div>
                    <div className="text-sm text-[#4d5156] line-clamp-2">{form.seo?.metaDescription || form.excerpt}</div>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow border border-slate-100 space-y-3">
                     <h3 className="font-bold mb-2"><Search size={18}/> SEO</h3>
                     <input className="w-full p-2 border rounded text-sm" placeholder="Keyword" value={form.seo?.focusKeyword} onChange={(e) => setForm({...form, seo: {...form.seo!, focusKeyword: e.target.value}})} />
                     <input className="w-full p-2 border rounded text-sm" placeholder="Meta Title" value={form.seo?.metaTitle} onChange={(e) => setForm({...form, seo: {...form.seo!, metaTitle: e.target.value}})} />
                     <textarea className="w-full p-2 border rounded text-sm" placeholder="Meta Desc" value={form.seo?.metaDescription} onChange={(e) => setForm({...form, seo: {...form.seo!, metaDescription: e.target.value}})} />
                 </div>
            </div>
        </div>
        {showAiModal && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative"><button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4"><X/></button><h3 className="text-xl font-bold mb-4 flex gap-2"><Bot/> Redactor SEO Pro</h3><p className="text-sm text-slate-500 mb-4">Genera un artículo experto (+900 palabras) con enlazado interno estratégico y optimización local.</p><input className="w-full p-2 border rounded mb-4" placeholder="Tema (ej: Reparar fuga de agua)" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} /><button onClick={handleGenerateWithAi} disabled={isGeneratingAi} className="w-full bg-blue-600 text-white py-2 rounded font-bold flex justify-center gap-2">{isGeneratingAi ? <Loader2 className="animate-spin"/> : <Sparkles/>} Generar Artículo Completo</button></div></div>}
        {showImageAiModal && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative"><button onClick={() => setShowImageAiModal(false)} className="absolute top-4 right-4"><X/></button><h3 className="text-xl font-bold mb-4 flex gap-2"><ImageIcon/> Generador Imagen</h3><textarea className="w-full p-2 border rounded mb-4" placeholder="Describe la imagen..." value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} /><button onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full bg-indigo-600 text-white py-2 rounded font-bold flex justify-center gap-2">{isGeneratingImage ? <Loader2 className="animate-spin"/> : <RefreshCw/>} Generar</button></div></div>}
    </div>
  );
};

export default AdminPanel;