import { INITIAL_BLOG_POSTS, MOCK_SERVICES, DEFAULT_SITE_CONFIG, TRANSLATIONS, MOCK_FAQS, PRICING_CONFIG } from '../constants';
import { BlogPost, ServiceItem, SiteConfig, FAQItem } from '../types';

const STORAGE_KEY = 'serviciohogar24_posts';
const CONFIG_STORAGE_KEY = 'serviciohogar24_config';
const SERVICES_STORAGE_KEY = 'serviciohogar24_services';
const FAQS_STORAGE_KEY = 'serviciohogar24_faqs';

// --- BLOG POSTS ---
const getInitialPosts = (): BlogPost[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) { console.error(err); }
  return [...INITIAL_BLOG_POSTS];
};

let memoryPosts = getInitialPosts();

const savePosts = (posts: BlogPost[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch (err) { console.error(err); }
};

// --- SERVICES & FAQS HYDRATION ---
const getInitialServices = (): ServiceItem[] => {
    try {
        const stored = localStorage.getItem(SERVICES_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}

    // Hydrate from constants
    // @ts-ignore
    const t = TRANSLATIONS.es.translation;
    return MOCK_SERVICES.map(s => ({
        ...s,
        title: t[s.titleKey] || s.titleKey,
        description: t[s.descriptionKey] || s.descriptionKey,
        // @ts-ignore
        price: PRICING_CONFIG.services[s.id] || 0
    }));
};

const getInitialFAQs = (): FAQItem[] => {
    try {
        const stored = localStorage.getItem(FAQS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}

    // @ts-ignore
    const t = TRANSLATIONS.es.translation;
    return MOCK_FAQS.map((f, index) => ({
        id: `faq_${index}`,
        question: t[f.questionKey] || f.questionKey,
        answer: t[f.answerKey] || f.answerKey
    }));
};


export const dataService = {
  // --- SERVICES ---
  getServices: async (): Promise<ServiceItem[]> => {
    const services = getInitialServices();
    return new Promise((resolve) => {
      setTimeout(() => resolve(services), 200);
    });
  },

  updateServices: async (services: ServiceItem[]): Promise<ServiceItem[]> => {
      return new Promise((resolve) => {
          localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
          setTimeout(() => resolve(services), 300);
      });
  },

  // --- FAQS ---
  getFAQs: async (): Promise<FAQItem[]> => {
      const faqs = getInitialFAQs();
      return new Promise((resolve) => setTimeout(() => resolve(faqs), 200));
  },

  updateFAQs: async (faqs: FAQItem[]): Promise<FAQItem[]> => {
      return new Promise((resolve) => {
          localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(faqs));
          setTimeout(() => resolve(faqs), 300);
      });
  },

  // --- BLOG ---
  getBlogPosts: async (): Promise<BlogPost[]> => {
    memoryPosts = getInitialPosts();
    return new Promise((resolve) => {
      setTimeout(() => resolve(memoryPosts), 300);
    });
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    memoryPosts = getInitialPosts();
    return new Promise((resolve) => {
      const post = memoryPosts.find(p => p.slug === slug);
      setTimeout(() => resolve(post), 300);
    });
  },

  addBlogPost: async (post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> => {
    return new Promise((resolve) => {
      const newPost: BlogPost = {
        ...post,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
      };
      memoryPosts = [newPost, ...memoryPosts];
      savePosts(memoryPosts); 
      setTimeout(() => resolve(newPost), 500);
    });
  },
  
  updateBlogPost: async (post: BlogPost): Promise<BlogPost> => {
    return new Promise((resolve) => {
        memoryPosts = memoryPosts.map(p => p.id === post.id ? post : p);
        savePosts(memoryPosts);
        setTimeout(() => resolve(post), 500);
    });
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      memoryPosts = memoryPosts.filter(p => p.id !== id);
      savePosts(memoryPosts);
      setTimeout(() => resolve(), 300);
    });
  },

  // --- CONFIG ---
  getSiteConfig: async (): Promise<SiteConfig> => {
    return new Promise((resolve) => {
      try {
        const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (stored) {
          resolve(JSON.parse(stored));
        } else {
          resolve(DEFAULT_SITE_CONFIG);
        }
      } catch (e) {
        resolve(DEFAULT_SITE_CONFIG);
      }
    });
  },

  updateSiteConfig: async (config: SiteConfig): Promise<SiteConfig> => {
    return new Promise((resolve) => {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      setTimeout(() => resolve(config), 300);
    });
  }
};