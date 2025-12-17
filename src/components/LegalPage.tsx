import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';
import SEO from './SEO';

interface LegalPageProps {
  type: 'legal' | 'privacy' | 'cookies';
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const location = useLocation();

  useEffect(() => {
    dataService.getSiteConfig().then(setConfig);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getContent = () => {
    switch (type) {
      case 'legal':
        return {
          title: 'Aviso Legal',
          content: config.legal?.legalNotice || DEFAULT_SITE_CONFIG.legal.legalNotice
        };
      case 'privacy':
        return {
          title: 'Política de Privacidad',
          content: config.legal?.privacyPolicy || DEFAULT_SITE_CONFIG.legal.privacyPolicy
        };
      case 'cookies':
        return {
          title: 'Política de Cookies',
          content: config.legal?.cookiesPolicy || DEFAULT_SITE_CONFIG.legal.cookiesPolicy
        };
      default:
        return { title: 'Legal', content: '' };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[70vh]">
      <SEO 
        title={`${title} | ServicioHogar24`}
        noindex={true}
      />
      <h1 className="text-3xl font-bold mb-8 text-slate-900 border-b pb-4">{title}</h1>
      <div 
        className="prose prose-slate max-w-none text-slate-600 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-8 [&_h2]:mb-4"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};

export default LegalPage;