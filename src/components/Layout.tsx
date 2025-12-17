import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, Globe, Facebook, Instagram, Twitter, MapPin, ArrowRight, Search } from 'lucide-react';
import SEO from './SEO';
import { dataService } from '../services/dataService';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG, BARCELONA_ZONES } from '../constants';
import CallbackWidget from './CallbackWidget';
import SearchOverlay from './SearchOverlay';

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const location = useLocation();

  useEffect(() => {
    dataService.getSiteConfig().then(setConfig);
  }, [location.pathname]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLang = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { path: '/', label: t('nav_home') },
    { path: '/services', label: t('nav_services') },
    { path: '/booking', label: t('nav_booking') },
    { path: '/blog', label: t('nav_blog') },
    { path: '/contact', label: t('nav_contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Helpers to format links safely
  const phoneLink = `tel:${config.contact.phone.replace(/\D/g, '')}`;
  const waLink = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}`;

  // SEO: Structured Data for Local Business
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "ServicioHogar24",
    "logo": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=200&h=200", 
    "image": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189",
    "telephone": config.contact.phone,
    "email": config.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.contact.address,
      "addressLocality": "Barcelona",
      "addressRegion": "CT",
      "postalCode": "08001",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.3851,
      "longitude": 2.1734
    },
    "url": window.location.origin,
    "priceRange": "€€",
    "areaServed": BARCELONA_ZONES
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 relative">
      <SEO 
        title="ServicioHogar24 - Urgencias 24h Barcelona"
        description="Servicios de fontanería, electricidad, cerrajería y climatización 24 horas en Barcelona. Llegamos en 30 minutos."
        url={window.location.href}
        jsonLd={jsonLd}
      />

      {/* Top Bar - Contact Info & Lang */}
      <div className="bg-slate-900 text-white py-2 px-4 text-xs md:text-sm flex justify-between items-center z-50">
        <div className="flex gap-4">
          <a href={phoneLink} className="flex items-center gap-1 hover:text-blue-300 transition-colors">
            <Phone size={14} /> {config.contact.phone}
          </a>
          <span className="hidden md:flex items-center gap-1 text-green-400 font-bold">{t('topbar_24h')}</span>
        </div>
        <button 
          onClick={toggleLang} 
          className="flex items-center gap-1 hover:text-blue-300 transition-colors uppercase font-semibold"
        >
          <Globe size={14} /> {i18n.language}
        </button>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeMenu}>
                 <div className="bg-blue-700 p-1.5 rounded-lg">
                    <div className="h-6 w-6 border-2 border-white rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">24</span>
                    </div>
                 </div>
                <span className="font-bold text-xl tracking-tight text-blue-900">
                  ServicioHogar<span className="text-blue-600">24</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path) 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link 
                to="/contact" 
                className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
              >
                {t('cta_call')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-600 hover:text-blue-600"
              >
                <Search size={24} />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-blue-700 focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Floating Widgets */}
      <CallbackWidget />

      {/* Floating WhatsApp Button (Desktop/Tablet) */}
      <a 
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 items-center justify-center hover:bg-green-600 group"
        aria-label="WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-white text-slate-800 px-3 py-1 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t('cta_whatsapp')}
        </span>
        <MessageCircle size={32} className="animate-pulse" />
      </a>

      {/* Sticky Bottom Actions (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 grid grid-cols-2 gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href={phoneLink} className="bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold shadow active:scale-95 transition-transform">
          <Phone size={20} /> Llamar
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white flex items-center justify-center gap-2 py-3 rounded-lg font-bold shadow active:scale-95 transition-transform">
          <MessageCircle size={20} /> WhatsApp
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">ServicioHogar24</h3>
            <p className="mb-4">
              {config.texts.footerText || config.texts.heroSubtitle || t('hero_subtitle')}
            </p>
            <div className="flex gap-4 mb-4">
                {config.social?.facebook && <a href={config.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500"><Facebook size={20}/></a>}
                {config.social?.instagram && <a href={config.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><Instagram size={20}/></a>}
                {config.social?.twitter && <a href={config.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500"><Twitter size={20}/></a>}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('nav_services')}</h3>
            <ul className="space-y-2">
              <li><Link to="/zona/barcelona/plumbing" className="hover:text-white transition">Fontanería Urgente</Link></li>
              <li><Link to="/zona/barcelona/electricity" className="hover:text-white transition">Electricistas 24h</Link></li>
              <li><Link to="/zona/barcelona/locksmith" className="hover:text-white transition">Cerrajería Rápida</Link></li>
              <li><Link to="/zona/barcelona/hvac" className="hover:text-white transition">Aire Acondicionado</Link></li>
            </ul>
          </div>

          {/* Local SEO Zones Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={16}/> Zonas de Servicio</h3>
            <ul className="space-y-2 grid grid-cols-1">
              {BARCELONA_ZONES.slice(0, 5).map(zone => (
                  <li key={zone}>
                      <Link to={`/zona/${zone.toLowerCase().replace(/\s+/g, '-')}/plumbing`} className="hover:text-white transition text-xs flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span> {zone}
                      </Link>
                  </li>
              ))}
              <li>
                  <Link to="/cobertura" className="text-blue-400 hover:text-white transition text-xs font-bold flex items-center gap-1 mt-2">
                    <ArrowRight size={12} /> Ver todos los barrios
                  </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('contact_title')}</h3>
            <p className="mb-2 flex items-center gap-2">
                <Phone size={16}/> 
                <a href={phoneLink} className="hover:text-white">{config.contact.phone}</a>
            </p>
            <p className="mb-4 flex items-center gap-2 text-green-400">
                <MessageCircle size={16}/> 
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-green-300">{config.contact.whatsapp}</a>
            </p>
             <p className="mb-4 text-xs text-slate-500">
                {config.contact.email}
             </p>
            <Link to="/admin" className="text-slate-600 hover:text-slate-400 text-xs mt-4 block">
              {t('admin_login')}
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} ServicioHogar24. {t('footer_rights')}</p>
          <div className="flex gap-6">
             <Link to="/aviso-legal" className="hover:text-slate-300 transition">Aviso Legal</Link>
             <Link to="/politica-privacidad" className="hover:text-slate-300 transition">Política de Privacidad</Link>
             <Link to="/politica-cookies" className="hover:text-slate-300 transition">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;