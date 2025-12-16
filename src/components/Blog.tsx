import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { BlogPost } from '../types';
import { Calendar, Tag } from 'lucide-react';
import Skeleton from './Skeleton';

const Blog: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        // Simulate a slight network delay to show off the skeleton (remove in prod if desired)
        // await new Promise(r => setTimeout(r, 500)); 
        const data = await dataService.getBlogPosts();
        setPosts(data);
        setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Blog & Consejos</h1>
            <p className="text-xl text-slate-500">Noticias, tips de mantenimiento y novedades del sector.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                // SKELETON LOADING STATE
                Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-6 flex flex-col gap-4 flex-grow">
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                // REAL CONTENT
                posts.map((post) => (
                    <article key={post.id} className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                        <Link to={`/blog/${post.slug}`} className="h-48 overflow-hidden bg-slate-100 block group">
                            {post.imageUrl && (
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}
                        </Link>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                                <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"><Tag size={12}/> {post.category}</span>
                            </div>
                            <Link to={`/blog/${post.slug}`} className="block">
                                <h2 className="text-xl font-bold text-slate-800 mb-3 hover:text-blue-700 transition-colors">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <div className="mt-auto pt-4 border-t border-slate-100">
                                 <Link to={`/blog/${post.slug}`} className="text-blue-700 font-bold text-sm hover:underline">
                                    Leer más &rarr;
                                </Link>
                            </div>
                        </div>
                    </article>
                ))
            )}
        </div>
    </div>
  );
};

export default Blog;