import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
    Search, Filter, Package, ChevronRight, Tag, 
    ArrowRight, ShoppingBag, Grid, List as ListIcon,
    Loader2, Phone, MessageSquare
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    price?: string;
    imageUrl: string;
    featured: boolean;
}

interface Category {
    id: string;
    title: string;
}

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        // Fetch Categories
        const unsubCats = onSnapshot(
            query(collection(db, 'categories'), orderBy('title')), 
            (snapshot) => {
                setCategories(snapshot.docs.map(doc => ({ 
                    id: doc.data().id, 
                    title: doc.data().title 
                })));
            },
            (error) => {
                console.error("Error fetching categories:", error);
            }
        );

        // Fetch Products
        const unsubProds = onSnapshot(
            query(collection(db, 'products'), orderBy('updatedAt', 'desc')), 
            (snapshot) => {
                setProducts(snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                })) as Product[]);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching products:", error);
                setLoading(false); // Resolve loading even on error
            }
        );

        return () => {
            unsubCats();
            unsubProds();
        };
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                p.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const activeCategoryTitle = categories.find(c => c.id === selectedCategory)?.title || 'All Products';

    // Handle SEO Meta Tags
    useEffect(() => {
        document.title = selectedCategory === 'all' 
            ? 'Saify Machinery Catalog | All Products' 
            : `${activeCategoryTitle} | Saify Machinery Catalog`;
        
        const description = `Browse our extensive collection of ${activeCategoryTitle.toLowerCase()} products. High-quality machinery and hardware available at Saify Machinery, Pulgaon.`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }, [selectedCategory, activeCategoryTitle]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Page Title & Hero */}
            <div className="pt-32 pb-12 bg-brand-blue-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,#F97316,transparent)]"></div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-heading font-black italic mb-4">Saify Catalog</h1>
                            <p className="text-gray-300 text-lg">Explore our extensive range of machinery, hardware, and industrial solutions. Quality equipment for every project in Pulgaon.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-orange/20">
                                <ShoppingBag className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-brand-orange">Total Catalog</p>
                                <p className="text-2xl font-bold">{products.length} Products</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Main area */}
            <main className="flex-grow py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* Sidebar Filters */}
                        <aside className="lg:col-span-1 space-y-8">
                            {/* Search */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Search size={18} className="text-brand-orange" />
                                    Search Items
                                </h3>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Enter keywords..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Filter size={18} className="text-brand-orange" />
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium text-sm
                                            ${selectedCategory === 'all' ? 'bg-brand-orange text-white' : 'hover:bg-gray-50 text-gray-600'}
                                        `}
                                    >
                                        <span>Show All</span>
                                        <ChevronRight size={14} opacity={selectedCategory === 'all' ? 1 : 0.3} />
                                    </button>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium text-sm
                                                ${selectedCategory === cat.id ? 'bg-brand-orange text-white' : 'hover:bg-gray-50 text-gray-600'}
                                            `}
                                        >
                                            <span className="truncate">{cat.title}</span>
                                            <ChevronRight size={14} opacity={selectedCategory === cat.id ? 1 : 0.3} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Box */}
                            <div className="bg-brand-blue rounded-3xl p-6 text-white text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Phone size={80} />
                                </div>
                                <h4 className="text-xl font-black italic mb-2 relative z-10">Direct Order?</h4>
                                <p className="text-blue-100 text-sm mb-6 relative z-10 leading-relaxed">Can't find what you need? Call us directly for special machinery requests.</p>
                                <a 
                                    href="tel:9021313113" 
                                    className="block w-full bg-white text-brand-blue py-3 rounded-xl font-black italic shadow-lg hover:bg-orange-50 transition-colors"
                                >
                                    9021313113
                                </a>
                            </div>
                        </aside>

                        {/* Product Grid area */}
                        <div className="lg:col-span-3">
                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 leading-none">{activeCategoryTitle}</h2>
                                        <p className="text-xs text-gray-500 mt-1">{filteredProducts.length} Results found</p>
                                    </div>
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-orange' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ListIcon size={18} />
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 opacity-30">
                                    <Loader2 size={40} className="animate-spin mb-4" />
                                    <p className="font-bold">Syncing Catalog...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredProducts.length > 0 ? (
                                        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                            <AnimatePresence mode="popLayout">
                                                {filteredProducts.map((prod) => (
                                                    <motion.div 
                                                        layout
                                                        key={prod.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:border-brand-orange/30 transition-all
                                                            ${viewMode === 'list' ? 'flex items-center gap-6 p-4 md:p-6' : 'flex flex-col'}
                                                        `}
                                                    >
                                                        <div className={`${viewMode === 'list' ? 'w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl' : 'aspect-square'} overflow-hidden relative`}>
                                                            <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            {prod.featured && (
                                                                <div className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-black italic px-2 py-1 rounded shadow-lg uppercase tracking-wider">
                                                                    Top Pick
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`p-6 flex flex-col flex-grow ${viewMode === 'list' ? 'p-0' : ''}`}>
                                                            <div className="mb-2">
                                                                <span className="text-[10px] font-black uppercase text-brand-blue tracking-widest px-2 py-0.5 bg-brand-blue/5 rounded">
                                                                    {categories.find(c => c.id === prod.categoryId)?.title || 'Machinery'}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-orange transition-colors mb-2">{prod.title}</h3>
                                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{prod.description}</p>
                                                            
                                                            <div className="mt-auto pt-4 flex items-center justify-between gap-4 border-t border-gray-50">
                                                                <div className="text-brand-blue font-bold">
                                                                    {prod.price || <span className="text-xs text-gray-400">Ask for Price</span>}
                                                                </div>
                                                                <a 
                                                                    href={`https://wa.me/919021313113?text=Bhai, I am interested in ${prod.title}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-green-500 text-white p-2 rounded-xl shadow-lg shadow-green-100 hover:bg-green-600 transition-all hover:scale-110"
                                                                >
                                                                    <MessageSquare size={18} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Package size={32} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No matching items</h3>
                                            <p className="text-gray-500 max-w-xs mx-auto">Try changing your search or category filter to browse other high-quality hardware products.</p>
                                            <button 
                                                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                                className="mt-8 text-brand-orange font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
                                            >
                                                Clear filters <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
