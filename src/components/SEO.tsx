import React, { useEffect } from 'react';

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any>;
  additionalMeta?: MetaTag[];
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website', jsonLd, additionalMeta, noindex = false }) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to find or create meta tags
    const updateMeta = (key: string, value: string, attr: 'name' | 'property' = 'name') => {
      if (!value) return;
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // 3. Update Standard Meta Tags
    updateMeta('description', description || '');
    
    // 4. Update Open Graph Tags
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description || '', 'property');
    updateMeta('og:type', type, 'property');
    if (image) updateMeta('og:image', image, 'property');
    if (url) updateMeta('og:url', url, 'property');

    // 5. Robots Control
    if (noindex) {
        updateMeta('robots', 'noindex, nofollow');
    } else {
        updateMeta('robots', 'index, follow');
    }

    // 6. Update Additional Tags
    additionalMeta?.forEach(meta => {
        if (meta.name) updateMeta(meta.name, meta.content, 'name');
        if (meta.property) updateMeta(meta.property, meta.content, 'property');
    });

    // 7. Manage JSON-LD Schema
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
        existingScript.remove();
    }

    if (jsonLd) {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
    }

    return () => {
        const script = document.querySelector('script[type="application/ld+json"]');
        if (script) script.remove();
    };
  }, [title, description, image, url, type, jsonLd, additionalMeta, noindex]);

  return null;
};

export default SEO;