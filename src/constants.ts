
import { ServiceItem, BlogPost, Testimonial, FAQItem, SiteConfig } from './types';

export const COLORS = {
  primary: '#1D4ED8', // blue-700
  secondary: '#22c55e', // green-500 (WhatsApp)
};

export const BARCELONA_ZONES = [
  'Eixample', 'Gràcia', 'Sants-Montjuïc', 'Les Corts', 
  'Sarrià-Sant Gervasi', 'Ciutat Vella', 'Horta-Guinardó', 
  'Nou Barris', 'Sant Andreu', 'Sant Martí'
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  contact: {
    phone: '+34 602 698 605',
    whatsapp: '+34 602 698 605',
    email: 'ServicioHogar24@gmail.com',
    address: 'Carrer de Mallorca, Barcelona'
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com'
  },
  pricing: {
    baseFee: 35,
    urgencyFee: 45,
    nightFee: 30
  },
  texts: {
    heroTitle: 'ServicioHogar24.com – Urgencias 24h en Barcelona',
    heroSubtitle: 'Fontanería, Electricidad, Cerrajería, Climatización, Calentadores',
    footerText: 'Servicios profesionales de confianza en toda el área metropolitana.',
    feature1Title: 'Respuesta en 60 min',
    feature1Desc: 'Tiempo medio de llegada en Barcelona',
    feature2Title: 'Servicio Profesional',
    feature2Desc: 'Calidad y eficiencia asegurada en cada trabajo',
    feature3Title: 'Todos los Barrios',
    feature3Desc: 'Eixample, Gràcia, Sants, Poblenou...'
  }
};

export const PRICING_CONFIG = {
  baseFee: DEFAULT_SITE_CONFIG.pricing.baseFee,
  urgencyFee: DEFAULT_SITE_CONFIG.pricing.urgencyFee,
  nightFee: DEFAULT_SITE_CONFIG.pricing.nightFee,
  taxRate: 0.21,
  services: {
    '1': 55, // Plumbing base
    '2': 65, // Electricity base
    '3': 80, // Locksmith base
    '4': 70, // HVAC base
    '5': 60, // Heater base
  }
};

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    titleKey: 'service_plumbing',
    descriptionKey: 'service_plumbing_desc',
    icon: 'Droplets',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '2',
    titleKey: 'service_electricity',
    descriptionKey: 'service_electricity_desc',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1555963966-926031914a8a?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '3',
    titleKey: 'service_locksmith',
    descriptionKey: 'service_locksmith_desc',
    icon: 'Key',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '4',
    titleKey: 'service_hvac',
    descriptionKey: 'service_hvac_desc',
    icon: 'Thermometer',
    imageUrl: 'https://images.unsplash.com/photo-1631557026770-49271607730d?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '5',
    titleKey: 'service_heater',
    descriptionKey: 'service_heater_desc',
    icon: 'Flame',
    imageUrl: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Garcia',
    textKey: 'testimonial_1',
    service: 'Plumbing',
    rating: 5,
  },
  {
    id: '2',
    name: 'John Smith',
    textKey: 'testimonial_2',
    service: 'Locksmith',
    rating: 5,
  },
  {
    id: '3',
    name: 'Carla Ruiz',
    textKey: 'testimonial_3',
    service: 'HVAC',
    rating: 4,
  },
];

export const MOCK_FAQS = [
    { questionKey: 'faq_q1', answerKey: 'faq_a1' },
    { questionKey: 'faq_q2', answerKey: 'faq_a2' },
    { questionKey: 'faq_q3', answerKey: 'faq_a3' },
    { questionKey: 'faq_q4', answerKey: 'faq_a4' },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Mantenimiento preventivo de aire acondicionado',
    slug: 'mantenimiento-aire-acondicionado',
    excerpt: 'Descubre por qué es importante revisar tu equipo antes del verano para ahorrar en tu factura eléctrica.',
    content: 'El mantenimiento del aire acondicionado es crucial para ahorrar energía y evitar averías costosas. <h2>Importancia de los filtros</h2> Los filtros sucios pueden reducir la eficiencia...',
    date: '2023-10-15',
    category: 'HVAC',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    imageAlt: 'Técnico reparando aire acondicionado',
    language: 'es',
    status: 'published',
    seo: {
      metaTitle: 'Mantenimiento de Aire Acondicionado en Barcelona | ServicioHogar24',
      metaDescription: 'Guía completa sobre el mantenimiento de aire acondicionado. Ahorra energía y evita averías con nuestros consejos de expertos.',
      focusKeyword: 'mantenimiento aire acondicionado'
    }
  },
  {
    id: '2',
    title: 'Emergency Water Leak: What to do?',
    slug: 'emergency-water-leak-guide',
    excerpt: 'Steps to minimize damage while waiting for the plumber.',
    content: 'First step is to shut off the main water valve. Then try to locate the source of the leak...',
    date: '2023-11-02',
    category: 'Plumbing',
    imageUrl: 'https://picsum.photos/800/400?random=11',
    imageAlt: 'Water leak under sink',
    language: 'en',
    status: 'published',
    seo: {
      metaTitle: 'Emergency Water Leak Repair Barcelona | 24h Plumbers',
      metaDescription: 'Urgent steps to take when you have a water leak. Call our 24h plumbers in Barcelona for immediate assistance.',
      focusKeyword: 'water leak'
    }
  },
  {
    id: '3',
    title: 'Mejorar la seguridad de tu hogar en Barcelona',
    slug: 'seguridad-hogar-barcelona',
    excerpt: 'Tipos de cerraduras antibumping y escudos protectores para evitar robos.',
    content: 'Barcelona es una ciudad segura, pero nunca está de más actualizar la seguridad de tu puerta. <h2>Cerraduras Antibumping</h2> Este tipo de cerraduras...',
    date: '2023-11-20',
    category: 'Locksmith',
    imageUrl: 'https://picsum.photos/800/400?random=12',
    imageAlt: 'Cerradura de alta seguridad',
    language: 'es',
    status: 'published',
    seo: {
      metaTitle: 'Mejorar Seguridad Hogar Barcelona | Cerrajeros 24h',
      metaDescription: 'Consejos de cerrajeros expertos para mejorar la seguridad de tu hogar en Barcelona. Cerraduras antibumping y más.',
      focusKeyword: 'seguridad hogar'
    }
  },
];

export const BOOKING_STEPS = [
    { id: 1, key: 'step_service' },
    { id: 2, key: 'step_details' },
    { id: 3, key: 'step_datetime' },
    { id: 4, key: 'step_confirm' }
];

export const SERVICE_QUESTIONS = {
    '1': [ // Plumbing
        { id: 'q_leak', labelKey: 'q_leak', type: 'boolean', urgent: true },
        { id: 'q_clog', labelKey: 'q_clog', type: 'boolean', urgent: false },
        { id: 'q_location', labelKey: 'q_location_plumbing', type: 'select', options: ['Kitchen', 'Bathroom', 'General'] }
    ],
    '2': [ // Electricity
        { id: 'q_outage', labelKey: 'q_outage', type: 'boolean', urgent: true },
        { id: 'q_spark', labelKey: 'q_spark', type: 'boolean', urgent: true },
        { id: 'q_location', labelKey: 'q_location_elec', type: 'select', options: ['Panel', 'Socket', 'Lighting'] }
    ],
    '3': [ // Locksmith
        { id: 'q_locked_out', labelKey: 'q_locked_out', type: 'boolean', urgent: true },
        { id: 'q_broken_key', labelKey: 'q_broken_key', type: 'boolean', urgent: false },
    ],
    '4': [ // HVAC
        { id: 'q_wont_start', labelKey: 'q_wont_start', type: 'boolean', urgent: false },
        { id: 'q_leaking_water', labelKey: 'q_leaking_water', type: 'boolean', urgent: false },
    ],
    '5': [ // Heater
        { id: 'q_no_hot_water', labelKey: 'q_no_hot_water', type: 'boolean', urgent: true },
        { id: 'q_gas_smell', labelKey: 'q_gas_smell', type: 'boolean', urgent: true },
    ]
};

export const TRANSLATIONS = {
  es: {
    translation: {
      nav_home: 'Inicio',
      nav_services: 'Servicios',
      nav_blog: 'Blog',
      nav_contact: 'Contacto',
      nav_booking: 'Reserva Online',
      hero_title: 'ServicioHogar24.com – Urgencias 24h en Barcelona',
      hero_subtitle: 'Fontanería, Electricidad, Cerrajería, Climatización, Calentadores',
      hero_badge: 'Barcelona - Servicio 24H',
      hero_feat_1_title: 'Respuesta en 60 min',
      hero_feat_1_desc: 'Tiempo medio de llegada en Barcelona',
      hero_feat_2_title: 'Servicio Profesional',
      hero_feat_2_desc: 'Calidad y eficiencia asegurada en cada trabajo',
      hero_feat_3_title: 'Todos los Barrios',
      hero_feat_3_desc: 'Eixample, Gràcia, Sants, Poblenou...',
      topbar_24h: 'SERVICIO 24H',
      cta_call: 'Llamar ahora',
      cta_whatsapp: 'WhatsApp Urgente',
      cta_budget: 'Calcular Presupuesto Online',
      service_plumbing: 'Fontanería Urgente',
      service_plumbing_desc: 'Solución inmediata a fugas de agua, desatascos de tuberías y reparación de grifería. Servicio 24h para evitar daños mayores en su hogar.',
      service_electricity: 'Electricistas Autorizados',
      service_electricity_desc: 'Restablecimiento de luz, reparación de cortocircuitos y emisión de boletines. Garantizamos instalaciones seguras y normativas.',
      service_locksmith: 'Cerrajería 24h',
      service_locksmith_desc: 'Apertura de puertas sin daños, cambio de bombines antibumping y seguridad para su hogar. Llegamos en 30 minutos.',
      service_hvac: 'Climatización y Aire',
      service_hvac_desc: 'Reparación, carga de gas y mantenimiento de aire acondicionado. Recupere el confort térmico de su hogar hoy mismo.',
      service_heater: 'Calderas y Calentadores',
      service_heater_desc: 'Expertos en calderas de gas y calentadores eléctricos. Reparación de averías y revisiones preventivas para asegurar agua caliente.',
      req_service: 'Solicitar servicio',
      latest_news: 'Últimas noticias',
      home_blog_title: 'Consejos de Expertos',
      home_blog_subtitle: 'Manténgase informado con nuestros artículos sobre mantenimiento, ahorro energético y soluciones para su hogar.',
      faq_title: 'Preguntas Frecuentes',
      faq_q1: '¿Cuánto tardan en llegar a mi domicilio?',
      faq_a1: 'Nuestro tiempo medio de llegada en Barcelona y área metropolitana es de 30 a 60 minutos para servicios urgentes.',
      faq_q2: '¿Ofrecen garantía en las reparaciones?',
      faq_a2: 'Sí, todas nuestras reparaciones cuentan con una garantía mínima de 12 meses por escrito.',
      faq_q3: '¿Trabajan en días festivos y fines de semana?',
      faq_a3: 'Absolutamente. Nuestro servicio de urgencias está operativo las 24 horas, los 365 días del año.',
      faq_q4: '¿Cobran por el presupuesto?',
      faq_a4: 'Ofrecemos presupuestos gratuitos y sin compromiso en horario laboral estándar. Para urgencias, consulte nuestras tarifas.',
      testimonials_title: 'Lo que dicen nuestros clientes',
      contact_title: 'Contáctanos',
      form_name: 'Nombre completo',
      form_phone: 'Teléfono',
      form_type: 'Tipo de avería',
      form_message: 'Mensaje',
      form_submit: 'Enviar Solicitud',
      footer_rights: 'Todos los derechos reservados.',
      testimonial_1: 'Excelente servicio, llegaron en 20 minutos y arreglaron la fuga.',
      testimonial_2: 'Me dejé las llaves dentro y el cerrajero fue muy profesional.',
      testimonial_3: 'Instalación de aire acondicionado rápida y limpia.',
      admin_login: 'Acceso Admin',
      admin_dashboard: 'Panel de Administración',
      admin_add_post: 'Añadir Artículo',
      admin_logout: 'Cerrar Sesión',
      admin_title_ph: 'Título del artículo',
      admin_excerpt_ph: 'Resumen corto (Meta description)',
      admin_content_ph: 'Contenido completo...',
      admin_save: 'Publicar Artículo',
      book_title: 'Reserva Inteligente',
      book_subtitle: 'Diagnóstico rápido y cita en 3 pasos',
      step_service: 'Servicio',
      step_details: 'Diagnóstico',
      step_datetime: 'Fecha',
      step_confirm: 'Confirmar',
      book_select_service: '¿Qué necesitas reparar?',
      book_urgent_title: '¡Detectamos una Urgencia!',
      book_urgent_desc: 'Por seguridad, te recomendamos llamar inmediatamente para este tipo de problema.',
      book_call_now: 'Llamar al Técnico Ahora',
      book_continue_anyway: 'Continuar con reserva normal',
      book_diagnosis: 'Ayúdanos a prepararnos',
      q_leak: '¿Hay una fuga de agua activa?',
      q_clog: '¿Es un atasco?',
      q_location_plumbing: 'Ubicación',
      q_outage: '¿Sin luz en toda la casa?',
      q_spark: '¿Hubo chispas o humo?',
      q_location_elec: 'Ubicación de la avería',
      q_locked_out: '¿No puedes entrar a casa?',
      q_broken_key: '¿Llave rota dentro?',
      q_wont_start: '¿El equipo no enciende?',
      q_leaking_water: '¿Gotea agua?',
      q_no_hot_water: '¿No sale agua caliente?',
      q_no_hot_water_label: 'No agua caliente',
      q_gas_smell: '¿Huele a gas?',
      book_select_date: 'Elige tu horario preferido',
      book_morning: 'Mañana (09:00 - 13:00)',
      book_afternoon: 'Tarde (14:00 - 18:00)',
      book_evening: 'Noche (19:00 - 22:00)',
      book_summary: 'Resumen de Cita',
      book_success: '¡Cita Confirmada!',
      book_success_msg: 'Hemos enviado los detalles a tu WhatsApp.',
      btn_next: 'Siguiente',
      btn_back: 'Atrás',
      btn_confirm: 'Confirmar Cita',
      budget_est_title: 'Presupuesto Estimado',
      budget_range: 'Rango de precio',
      budget_item_base: 'Desplazamiento',
      budget_item_service: 'Servicio Base',
      budget_item_urgency: 'Plus Urgencia',
      budget_note: '* Precio final sujeto a valoración presencial.',
      home_budget_title: 'Calcula tu Presupuesto',
      home_budget_subtitle: 'Obtén una estimación instantánea sin compromiso.',
      home_budget_select: 'Selecciona Servicio',
      home_budget_result_label: 'Precio Estimado',
      home_budget_cta: 'Reservar Cita Ahora',
      home_budget_legal: '*Precios sin IVA. Sujeto a valoración final.'
    },
  },
  en: {
    translation: {
      nav_home: 'Home',
      nav_services: 'Services',
      nav_blog: 'Blog',
      nav_contact: 'Contact',
      nav_booking: 'Book Online',
      hero_title: 'ServicioHogar24.com – 24h Emergencies in Barcelona',
      hero_subtitle: 'Plumbing, Electricity, Locksmith, HVAC, Water Heaters',
      hero_badge: 'Barcelona 24/7',
      hero_feat_1_title: '60 min Response',
      hero_feat_1_desc: 'Average arrival time in Barcelona',
      hero_feat_2_title: 'Professional Service',
      hero_feat_2_desc: 'Quality and efficiency ensured in every job',
      hero_feat_3_title: 'All Neighborhoods',
      hero_feat_3_desc: 'Eixample, Gràcia, Sants, Poblenou...',
      topbar_24h: '24H SERVICE',
      cta_call: 'Call Now',
      cta_whatsapp: 'Urgent WhatsApp',
      cta_budget: 'Get Online Quote',
      service_plumbing: 'Urgent Plumbing',
      service_plumbing_desc: 'Immediate solution for water leaks, pipe unclogging, and faucet repair. 24h service to prevent further damage to your home.',
      service_electricity: 'Licensed Electricians',
      service_electricity_desc: 'Power restoration, short circuit repair, and certificates. We guarantee safe and compliant electrical installations.',
      service_locksmith: 'Locksmith 24h',
      service_locksmith_desc: 'Non-destructive door opening, anti-bumping lock changes, and home security. We arrive in 30 minutes.',
      service_hvac: 'HVAC & Air Con',
      service_hvac_desc: 'Repair, gas refill, and air conditioning maintenance. Restore thermal comfort to your home today.',
      service_heater: 'Boilers & Heaters',
      service_heater_desc: 'Experts in gas boilers and electric water heaters. Repair of breakdowns and preventive checks to ensure hot water.',
      req_service: 'Request Service',
      latest_news: 'Latest News',
      home_blog_title: 'Expert Advice',
      home_blog_subtitle: 'Stay informed with our articles on maintenance, energy saving, and home solutions.',
      faq_title: 'Frequently Asked Questions',
      faq_q1: 'How long does it take to arrive?',
      faq_a1: 'Our average arrival time in Barcelona and metropolitan area is 30 to 60 minutes for urgent services.',
      faq_q2: 'Do you offer warranty on repairs?',
      faq_a2: 'Yes, all our repairs come with a minimum 12-month written warranty.',
      faq_q3: 'Do you work on holidays and weekends?',
      faq_a3: 'Absolutely. Our emergency service operates 24 hours a day, 365 days a year.',
      faq_q4: 'Do you charge for the quote?',
      faq_a4: 'We offer free, no-obligation quotes during standard business hours. For emergencies, please consult our rates.',
      testimonials_title: 'What our clients say',
      contact_title: 'Contact Us',
      form_name: 'Full Name',
      form_phone: 'Phone Number',
      form_type: 'Issue Type',
      form_message: 'Message',
      form_submit: 'Send Request',
      footer_rights: 'All rights reserved.',
      testimonial_1: 'Excellent service, they arrived in 20 minutes and fixed the leak.',
      testimonial_2: 'Locked myself out and the locksmith was very professional.',
      testimonial_3: 'Air conditioning installation was fast and clean.',
      admin_login: 'Admin Access',
      admin_dashboard: 'Admin Dashboard',
      admin_add_post: 'Add Post',
      admin_logout: 'Logout',
      admin_title_ph: 'Article Title',
      admin_excerpt_ph: 'Short excerpt (Meta description)',
      admin_content_ph: 'Full content...',
      admin_save: 'Publish Article',
       book_title: 'Smart Booking',
       book_subtitle: 'Quick diagnosis and booking in 3 steps',
       step_service: 'Service',
       step_details: 'Diagnosis',
       step_datetime: 'Date',
       step_confirm: 'Confirm',
       book_select_service: 'What do you need repaired?',
       book_urgent_title: 'Urgency Detected!',
       book_urgent_desc: 'For safety, we recommend calling immediately for this type of issue.',
       book_call_now: 'Call Technician Now',
       book_continue_anyway: 'Continue with normal booking',
       book_diagnosis: 'Help us prepare',
       q_leak: 'Is there an active water leak?',
       q_clog: 'Is it a clog?',
       q_location_plumbing: 'Location',
       q_outage: 'No power in the whole house?',
       q_spark: 'Sparks or smoke?',
       q_location_elec: 'Fault location',
       q_locked_out: 'Locked out of house?',
       q_broken_key: 'Key broken inside?',
       q_wont_start: 'Equipment won\'t start?',
       q_leaking_water: 'Is water leaking?',
       q_no_hot_water: 'No hot water?',
       q_gas_smell: 'Gas smell?',
       book_select_date: 'Choose your preferred slot',
       book_morning: 'Morning (09:00 - 13:00)',
       book_afternoon: 'Afternoon (14:00 - 18:00)',
       book_evening: 'Evening (19:00 - 22:00)',
       book_summary: 'Appointment Summary',
       book_success: 'Appointment Confirmed!',
       book_success_msg: 'We have sent details to your WhatsApp.',
       btn_next: 'Next',
       btn_back: 'Back',
       btn_confirm: 'Confirm Booking',
       budget_est_title: 'Estimated Budget',
       budget_range: 'Price range',
       budget_item_base: 'Call-out Fee',
       budget_item_service: 'Service Base',
       budget_item_urgency: 'Urgency Fee',
       budget_note: '* Final price subject to onsite assessment.',
       home_budget_title: 'Calculate Budget',
       home_budget_subtitle: 'Get an instant estimate without obligation.',
       home_budget_select: 'Select Service',
       home_budget_result_label: 'Estimated Price',
       home_budget_cta: 'Book Appointment Now',
       home_budget_legal: '*Prices excl. VAT. Subject to final assessment.'
    },
  },
};
