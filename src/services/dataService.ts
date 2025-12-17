import { INITIAL_BLOG_POSTS, MOCK_SERVICES, DEFAULT_SITE_CONFIG, TRANSLATIONS, MOCK_FAQS, PRICING_CONFIG } from '../constants';
import { BlogPost, ServiceItem, SiteConfig, FAQItem, CallbackRequest, AdminCredentials } from '../types';

const STORAGE_KEY = 'serviciohogar24_posts';
const CONFIG_STORAGE_KEY = 'serviciohogar24_config';
const SERVICES_STORAGE_KEY = 'serviciohogar24_services';
const FAQS_STORAGE_KEY = 'serviciohogar24_faqs';
const CALLBACKS_STORAGE_KEY = 'serviciohogar24_callbacks';
const ADMIN_STORAGE_KEY = 'serviciohogar24_admin';

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
    const t = TRANSLATIONS.es.translation as Record<string, string>;
    return MOCK_SERVICES.map(s => ({
        ...s,
        title: (s.titleKey && t[s.titleKey]) ? t[s.titleKey] : s.title,
        description: (s.descriptionKey && t[s.descriptionKey]) ? t[s.descriptionKey] : s.description,
        // @ts-ignore
        price: PRICING_CONFIG.services[s.id as keyof typeof PRICING_CONFIG.services] || 0
    }));
};

const getInitialFAQs = (): FAQItem[] => {
    try {
        const stored = localStorage.getItem(FAQS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {}

    // @ts-ignore
    const t = TRANSLATIONS.es.translation as Record<string, string>;
    return MOCK_FAQS.map((f, index) => ({
        id: `faq_${index}`,
        question: (f.questionKey && t[f.questionKey]) || f.questionKey,
        answer: (f.answerKey && t[f.answerKey]) || f.answerKey
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

  // --- CALLBACKS / LEADS ---
  getCallbacks: async (): Promise<CallbackRequest[]> => {
    return new Promise((resolve) => {
      try {
        const stored = localStorage.getItem(CALLBACKS_STORAGE_KEY);
        resolve(stored ? JSON.parse(stored) : []);
      } catch { resolve([]); }
    });
  },

  addCallback: async (phone: string): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(CALLBACKS_STORAGE_KEY);
      const callbacks: CallbackRequest[] = stored ? JSON.parse(stored) : [];
      const newCallback: CallbackRequest = {
        id: Date.now().toString(),
        phone,
        date: new Date().toISOString(),
        status: 'pending'
      };
      localStorage.setItem(CALLBACKS_STORAGE_KEY, JSON.stringify([newCallback, ...callbacks]));
      resolve();
    });
  },

  updateCallbackStatus: async (id: string, status: 'pending' | 'called'): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(CALLBACKS_STORAGE_KEY);
      if (stored) {
        let callbacks: CallbackRequest[] = JSON.parse(stored);
        callbacks = callbacks.map(c => c.id === id ? { ...c, status } : c);
        localStorage.setItem(CALLBACKS_STORAGE_KEY, JSON.stringify(callbacks));
      }
      resolve();
    });
  },

  deleteCallback: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(CALLBACKS_STORAGE_KEY);
      if (stored) {
        const callbacks: CallbackRequest[] = JSON.parse(stored);
        localStorage.setItem(CALLBACKS_STORAGE_KEY, JSON.stringify(callbacks.filter(c => c.id !== id)));
      }
      resolve();
    });
  },

  // --- ADMIN AUTH ---
  getAdminCredentials: async (): Promise<AdminCredentials> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      // Default credentials
      if (!stored) {
        resolve({ email: 'admin@admin.com', password: 'admin' });
      } else {
        resolve(JSON.parse(stored));
      }
    });
  },

  updateAdminCredentials: async (creds: AdminCredentials): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(creds));
      resolve();
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