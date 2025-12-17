import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { BlogPost, SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';
import SEO from './SEO';
import { Calendar, Tag, ArrowLeft, User, Clock, Share2, Home, ChevronRight, Phone } from 'lucide-react';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load config for phone number
    dataService.getSiteConfig().then(setConfig);

    if (slug) {
      setLoading(true);
      dataService.getBlogPostBySlug(slug).then((data) => {
        setPost(data || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <SEO title="Artículo no encontrado | ServicioHogar24" additionalMeta={[{name: 'robots', content: 'noindex'}]} />
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Artículo no encontrado</h2>
        <Link to="/blog" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Volver al Blog
        </Link>
      </div>
    );
  }

  // --- STRUCTURED DATA (SCHEMA.ORG) ---
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "headline": post.seo?.metaTitle || post.title,
    "description": post.seo?.metaDescription || post.excerpt,
    "image": post.imageUrl ? [post.imageUrl] : [],
    "datePublished": post.date,
    "dateModified": post.date, 
    "author": {
      "@type": "Organization",
      "name": "Equipo ServicioHogar24",
      "url": window.location.origin
    },
    "publisher": {
      "@type": "Organization",
      "name": "ServicioHogar24",
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=200&h=200"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": window.location.origin
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": `${window.location.origin}/#/blog`
    },{
      "@type": "ListItem",
      "position": 3,
      "name": post.title
    }]
  };

  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema]
  };

  // Helper for phone link - Removes spaces but keeps the + sign
  const phoneLink = `tel:${config.contact.phone.replace(/\s+/g, '')}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 relative">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-[100] transition-all duration-150"
        style={{ width: `${scrollProgress * 100}%` }}
      ></div>

      <SEO 
        title={`${post.seo?.metaTitle || post.title} | Blog ServicioHogar24`}
        description={post.seo?.metaDescription || post.excerpt}
        image={post.imageUrl}
        type="article"
        jsonLd={fullSchema}
        additionalMeta={[
            { property: 'article:published_time', content: post.date },
            { property: 'article:section', content: post.category }
        ]}
      />

      {/* Hero Image */}
      <div className="h-64 md:h-96 w-full relative bg-slate-900">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.imageAlt || post.title} 
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          {/* Visual Breadcrumbs (Mobile/Desktop) */}
          <nav className="flex items-center gap-2 text-xs md:text-sm text-blue-200 mb-6 font-medium">
            <Link to="/" className="hover:text-white flex items-center gap-1"><Home size={14}/> Inicio</Link>
            <ChevronRight size={14} className="opacity-50"/>
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight size={14} className="opacity-50"/>
            <span className="text-white truncate max-w-[150px] md:max-w-md">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-300 font-bold mb-4 uppercase tracking-wider">
            <span className="bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-2 text-white">
              <Tag size={14} /> {post.category}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} /> {post.date}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight shadow-sm max-w-4xl">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-12">
            {/* Meta header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Equipo ServicioHogar24</p>
                        <p className="text-xs text-slate-500">Redacción Expertos</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-bold" onClick={() => {
                    navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
                }}>
                    <Share2 size={18} /> Compartir
                </button>
            </div>

            {/* Article Body */}
            <article className="text-slate-700 text-lg leading-relaxed">
                <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-blue-500 pl-4 bg-slate-50 py-4 rounded-r-lg">
                    {post.excerpt}
                </p>
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                  className="
                    [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-5
                    [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mt-8 [&_h3]:mb-4
                    [&_p]:mb-6 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:marker:text-blue-500
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:marker:text-blue-500
                    [&_li]:pl-1
                    [&_strong]:font-bold [&_strong]:text-slate-900
                    [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-blue-50 [&_blockquote]:p-4 [&_blockquote]:rounded-r-lg
                    [&_a]:text-blue-600 [&_a]:underline [&_a]:font-bold hover:[&_a]:text-blue-800
                    [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-8 [&_img]:w-full [&_img]:border [&_img]:border-slate-100
                  " 
                />
            </article>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Emergency Card - Sticky Desktop */}
          <div className="sticky top-24 space-y-8">
              <div className="bg-blue-600 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda urgente?</h3>
                    <p className="text-blue-100 mb-6">Nuestros técnicos están disponibles 24/7 en Barcelona y alrededores.</p>
                    <a href={phoneLink} className="flex items-center justify-center gap-3 bg-white text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg mb-4">
                        <Phone size={20} /> Llamar Ahora
                    </a>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                        <Clock size={16} /> Llegamos en 30-60 min
                    </div>
                 </div>
              </div>

              {/* Categories/Tags */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hidden md:block">
                 <h3 className="font-bold text-slate-800 mb-4">Temas Relacionados</h3>
                 <div className="flex flex-wrap gap-2">
                    <Link to="/blog" className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition">Mantenimiento</Link>
                    <Link to="/blog" className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition">Ahorro Energía</Link>
                    <Link to="/blog" className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition">Seguridad</Link>
                    <Link to="/blog" className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition">Reformas</Link>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;