export interface ServiceItem {
  id: string;
  titleKey?: string; 
  descriptionKey?: string; 
  icon: string;
  imageUrl: string;
  title: string;
  description: string;
  price?: number; 
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl?: string;
  imageAlt?: string;
  category: 'Plumbing' | 'Electricity' | 'Locksmith' | 'HVAC' | 'General';
  language: 'es' | 'en';
  status: 'draft' | 'published';
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  textKey: string;
  service: string;
  rating: number;
}

export interface ContactFormState {
  name: string;
  phone: string;
  serviceType: string;
  message: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteConfig {
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  pricing: {
    baseFee: number;
    urgencyFee: number;
    nightFee: number;
  };
  texts: {
    heroTitle: string;
    heroSubtitle: string;
    footerText: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
}