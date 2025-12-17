import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, FileText, Wrench } from 'lucide-react';
import { dataService } from '../services/dataService';
import { ServiceItem, BlogPost } from '../types';
import { useTranslation } from 'react-i18next';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredResults, setFilteredResults] = useState<{ services: ServiceItem[], posts: BlogPost[] }>({ services: [], posts: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Load data once
  useEffect(() => {
    Promise.all([dataService.getServices(), dataService.getBlogPosts()])
      .then(([s, p]) => {
        setServices(s);
        setPosts(p);
      });
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Filter logic
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults({ services: [], posts: [] });
      return;
    }
    const lowerQ = query.toLowerCase();
    
    const matchedServices = services.filter(s => 
      s.title.toLowerCase().includes(lowerQ) || 
      s.description.toLowerCase().includes(lowerQ) ||
      t(s.titleKey || '').toLowerCase().includes(lowerQ)
    );

    const matchedPosts = posts.filter(p => 
      p.title.toLowerCase().includes(lowerQ) || 
      p.excerpt.toLowerCase().includes(lowerQ)
    );

    setFilteredResults({ services: matchedServices, posts: matchedPosts });
  }, [query, services, posts, t]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 md:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header / Input */}
        <div className="flex items-center border-b border-slate-100 p-4 gap-3">
          <Search className="text-slate-400" size={24} />
          <input 
            ref={inputRef}
            type="text" 
            className="flex-grow text-lg outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            placeholder={t('admin_search_ph') || "Buscar servicio, avería o consejo..."} // Fallback if translation missing
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition">
            <span className="hidden md:inline text-xs font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded mr-2">ESC</span>
            <X size={20} className="inline"/>
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-2 bg-slate-50">
          {query === '' && (
            <div className="p-8 text-center text-slate-400">
               <Search size={48} className="mx-auto mb-4 opacity-20" />
               <p className="text-sm">Escribe para buscar servicios urgentes o artículos.</p>
            </div>
          )}

          {query !== '' && filteredResults.services.length === 0 && filteredResults.posts.length === 0 && (
             <div className="p-8 text-center text-slate-500">
                No se encontraron resultados para "<strong>{query}</strong>"
             </div>
          )}

          {filteredResults.services.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-2">Servicios</h3>
              {filteredResults.services.map(s => (
                <button 
                  key={s.id}
                  onClick={() => handleNavigate('/booking')} 
                  className="w-full text-left flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm rounded-lg group transition border border-transparent hover:border-slate-200"
                >
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                    <Wrench size={20} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">{s.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{s.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          )}

          {filteredResults.posts.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-2">Blog y Consejos</h3>
              {filteredResults.posts.map(p => (
                <button 
                  key={p.id}
                  onClick={() => handleNavigate(`/blog/${p.slug}`)} 
                  className="w-full text-left flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm rounded-lg group transition border border-transparent hover:border-slate-200"
                >
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                    <FileText size={20} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">{p.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.excerpt}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-600" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-100 p-3 text-xs text-slate-500 border-t border-slate-200 flex justify-between items-center px-6">
            <span><strong>ServicioHogar24</strong> Search</span>
            <span className="hidden md:inline">Usa las flechas para navegar y Enter para seleccionar</span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;