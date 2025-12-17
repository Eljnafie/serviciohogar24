
import { ServiceItem, BlogPost, Testimonial, SiteConfig } from './types';

export const COLORS = {
  primary: '#1D4ED8', // blue-700
  secondary: '#22c55e', // green-500 (WhatsApp)
};

export const BARCELONA_ZONES = [
  'Ciutat Vella',
  'Eixample',
  'Sants-Montjuïc',
  'Les Corts',
  'Sarrià-Sant Gervasi',
  'Gràcia',
  'Horta-Guinardó',
  'Nou Barris',
  'Sant Andreu',
  'Sant Martí'
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
  },
  legal: {
    legalNotice: `
      <h2>1. Datos Identificativos</h2>
      <p>En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos: la empresa titular de dominio web es ServicioHogar24 (en adelante ServicioHogar24), con domicilio a estos efectos en Carrer de Mallorca, Barcelona.</p>
      
      <h2>2. Usuarios</h2>
      <p>El acceso y/o uso de este portal de ServicioHogar24 atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.</p>
      
      <h2>3. Uso del Portal</h2>
      <p>ServicioHogar24.com proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a ServicioHogar24 o a sus licenciantes a los que el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal.</p>
      
      <h2>4. Propiedad Intelectual e Industrial</h2>
      <p>ServicioHogar24 por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma.</p>
      
      <h2>5. Exclusión de Garantías y Responsabilidad</h2>
      <p>ServicioHogar24 no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.</p>
    `,
    privacyPolicy: `
      <h2>1. Responsable del Tratamiento</h2>
      <p>Los datos de carácter personal que se pudieran recabar directamente del interesado serán tratados de forma confidencial y quedarán incorporados a la correspondiente actividad de tratamiento titularidad de ServicioHogar24.</p>
      
      <h2>2. Finalidad</h2>
      <p>La finalidad del tratamiento de los datos corresponde a la gestión de las solicitudes de servicios de reparaciones del hogar, gestión de presupuestos y comunicaciones comerciales relacionadas con nuestros servicios.</p>
      
      <h2>3. Legitimación</h2>
      <p>El tratamiento de sus datos se realiza para el cumplimiento de la relación contractual o precontractual solicitada por el usuario (presupuestos, reparaciones).</p>
      
      <h2>4. Conservación de datos</h2>
      <p>Los datos personales proporcionados se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se recaban y para determinar las posibles responsabilidades que se pudieran derivar de la finalidad.</p>
      
      <h2>5. Comunicación de datos</h2>
      <p>Con carácter general no se comunicarán datos personales a terceros, salvo obligación legal o cuando sea necesario para la prestación del servicio (ej. técnicos autónomos colaboradores).</p>
      
      <h2>6. Derechos de los interesados</h2>
      <p>Cualquier persona tiene derecho a obtener confirmación sobre los tratamientos que de sus datos que se llevan a cabo por ServicioHogar24. Puede ejercer sus derechos de acceso, rectificación, supresión y portabilidad de sus datos, de limitación y oposición a su tratamiento, así como a no ser objeto de decisiones basadas únicamente en el tratamiento automatizado de sus datos, ante la dirección de correo electrónico indicada en la sección de contacto.</p>
    `,
    cookiesPolicy: `
      <h2>1. ¿Qué son las cookies?</h2>
      <p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.</p>
      
      <h2>2. Tipos de cookies que utiliza esta web</h2>
      <ul>
        <li><strong>Cookies técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.</li>
        <li><strong>Cookies de análisis:</strong> Son aquellas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado.</li>
      </ul>
      
      <h2>3. Revocación y eliminación de cookies</h2>
      <p>Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador.</p>
    `
  }
};

export const PRICING_CONFIG = {
  baseFee: DEFAULT_SITE_CONFIG.pricing.baseFee, // Default fallback
  urgencyFee: DEFAULT_SITE_CONFIG.pricing.urgencyFee, // Default fallback
  nightFee: DEFAULT_SITE_CONFIG.pricing.nightFee, // Default fallback
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
    // Image: Professional plumber fixing a sink with clear tools
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '2',
    titleKey: 'service_electricity',
    descriptionKey: 'service_electricity_desc',
    icon: 'Zap',
    // Image: Electrical panel work, clean and technical
    imageUrl: 'https://images.unsplash.com/photo-1555963966-926031914a8a?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '3',
    titleKey: 'service_locksmith',
    descriptionKey: 'service_locksmith_desc',
    icon: 'Key',
    // Image: Modern lock installation
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '4',
    titleKey: 'service_hvac',
    descriptionKey: 'service_hvac_desc',
    icon: 'Thermometer',
    // Image: Modern AC unit maintenance
    imageUrl: 'https://images.unsplash.com/photo-1631557026770-49271607730d?auto=format&fit=crop&w=800&q=80',
    title: '',
    description: '',
  },
  {
    id: '5',
    titleKey: 'service_heater',
    descriptionKey: 'service_heater_desc',
    icon: 'Flame',
    // Image: Boiler system details
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
    content: 'El mantenimiento del aire acondicionado es crucial para ahorrar energía y evitar averías costosas. <h2>Importancia de los filtros</h2> Los filtros sucios pueden reducir la eficiencia del sistema hasta en un 15%. Recomendamos <a href="#/booking">contactar con un profesional</a> para una revisión anual. <h2>Niveles de Gas</h2> Si notas que el aire no enfría como antes, puede ser falta de gas. En <a href="#/services">ServicioHogar24</a> somos expertos en recargas.',
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
    content: 'First step is to shut off the main water valve. Then try to locate the source of the leak. If you need urgent assistance, please <a href="#/contact">contact our 24h service</a> immediately.',
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
    content: 'Barcelona es una ciudad segura, pero nunca está de más actualizar la seguridad de tu puerta. <h2>Cerraduras Antibumping</h2> Este tipo de cerraduras impiden la técnica de robo más común. Puedes solicitar un <a href="#/booking">presupuesto sin compromiso</a> para actualizar tu cerradura hoy mismo.',
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

// Intelligent Booking Configuration
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
        { id: 'q_gas_smell', labelKey: 'q_gas_smell', type: 'boolean', urgent: true }, // CRITICAL
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
      
      // Updated warranty text to be less binding
      hero_feat_2_title: 'Servicio Profesional',
      hero_feat_2_desc: 'Calidad y eficiencia asegurada en cada trabajo',
      
      hero_feat_3_title: 'Todos los Barrios',
      hero_feat_3_desc: 'Eixample, Gràcia, Sants, Poblenou...',
      topbar_24h: 'SERVICIO 24H',
      cta_call: 'Llamar ahora',
      cta_whatsapp: 'WhatsApp Urgente',
      cta_budget: 'Calcular Presupuesto Online',
      
      // Updated Service Descriptions (More attractive)
      service_plumbing: 'Fontanería Urgente',
      service_plumbing_desc: 'Solución inmediata a fugas de agua, desatascos de tuberías y reparación de grifería. Servicio 24h para evitar daños mayores en su hogar.',
      service_electricity: 'Electricistas Autorizados',
      service_electricity_desc: 'Restablecimiento de luz, reparación de cortocircuitos y emisión de boletines. Garantizamos instalaciones seguras y normativas.',
      service_locksmith: 'Cerrajería 24h',
      service_locksmith_desc: 'Apertura de puertas sin daños, cambio de bombines antibumping y seguridad para su hogar. Llegamos en 30 minutos.',
      service_hvac: 'Climatización y Aire',
      service_hvac_desc: 'Reparación, carga de gas y mantenimiento de aire acondicionado. Recupere el confort térmico de su hogar hoy mismo.',
      service_heater: 'Calderas y Calentadores',
      service_heater_desc: 'Experts in calderas de gas y calentadores eléctricos. Reparación de averías y revisiones preventivas para asegurar agua caliente.',
      
      req_service: 'Solicitar servicio',
      latest_news: 'Últimas noticias',
      
      // Updated Blog Text
      home_blog_title: 'Consejos de Expertos',
      home_blog_subtitle: 'Manténgase informado con nuestros artículos sobre mantenimiento, ahorro energético y soluciones para su hogar.',
      
      // FAQ
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
      
      // Booking Wizard
      book_title: 'Reserva Inteligente',
      book_subtitle: 'Diagnóstico rápido y cita en 3 pasos',
      step_service: 'Service',
      step_details: 'Diagnóstico',
      step_datetime: 'Fecha',
      step_confirm: 'Confirmar',
      book_select_service: '¿Qué necesitas reparar?',
      book_urgent_title: 'Urgency Detected!',
      book_urgent_desc: 'Por seguridad, te recomendamos llamar inmediatamente para este tipo de problema.',
      book_call_now: 'Llamar al Técnico Ahora',
      book_continue_anyway: 'Continue with normal booking',
      book_diagnosis: 'Ayúdanos a prepararnos',
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
      
      // Budget Calculator
      budget_est_title: 'Estimated Budget',
      budget_range: 'Price range',
      budget_item_base: 'Call-out Fee',
      budget_item_service: 'Service Base',
      budget_item_urgency: 'Urgency Fee',
      budget_note: '* Final price subject to onsite assessment.',
      
      // Home Calculator
      home_budget_title: 'Calculate Budget',
      home_budget_subtitle: 'Get an instant estimate without obligation.',
      home_budget_select: 'Select Service',
      home_budget_result_label: 'Estimated Price',
      home_budget_cta: 'Book Appointment Now',
      home_budget_legal: '*Prices excl. VAT. Subject to final assessment.',
      admin_search_ph: "Search service, issue or advice..."
    },
  },
};