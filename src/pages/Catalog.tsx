import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
    Search, Filter, Package, ChevronRight, Tag, 
    ArrowRight, ShoppingBag, Grid, List as ListIcon,
    Loader2, Phone, MessageSquare, Maximize2, X, Eye,
    ZoomIn, ZoomOut, ChevronLeft, Play, Share2, Check
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    price?: string;
    imageUrl: string;
    images?: string[]; // Supporting multiple images
    videoUrl?: string; // Tutorial or Demo video URL
    videoTitle?: string; // Title for the video section
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    featured: boolean;
}

interface Category {
    id: string;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!selectedProduct) {
            setActiveImageIndex(0);
            setIsZoomed(false);
        }
    }, [selectedProduct]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    useEffect(() => {
        // Fetch Global Config for Header
        getDoc(doc(db, 'site_config', 'global')).then(docSnap => {
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            }
        });

        // Fetch Categories
        const unsubCats = onSnapshot(
            query(collection(db, 'categories'), orderBy('title')), 
            (snapshot) => {
                setCategories(snapshot.docs.map(doc => ({ 
                    id: doc.data().id, 
                    title: doc.data().title,
                    seoTitle: doc.data().seoTitle,
                    seoDescription: doc.data().seoDescription,
                    seoKeywords: doc.data().seoKeywords
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

    const activeCategory = categories.find(c => c.id === selectedCategory);
    const activeCategoryTitle = activeCategory?.title || 'All Products';

    // Handle SEO Meta Tags
    useEffect(() => {
        // If a product is selected for Quick View, use its SEO info
        if (selectedProduct) {
            document.title = selectedProduct.seoTitle || `${selectedProduct.title} | Saify Machinery`;
            
            const metaDesc = document.querySelector('meta[name="description"]');
            const desc = selectedProduct.seoDescription || selectedProduct.description.substring(0, 160);
            metaDesc?.setAttribute('content', desc);

            let keywordsMeta = document.querySelector('meta[name="keywords"]');
            if (!keywordsMeta) {
                keywordsMeta = document.createElement('meta');
                keywordsMeta.setAttribute('name', 'keywords');
                document.head.appendChild(keywordsMeta);
            }
            const keywords = selectedProduct.seoKeywords || 'machinery, hardware, ' + selectedProduct.title.toLowerCase();
            keywordsMeta.setAttribute('content', keywords);

            return; // Exit early if product is selected
        }

        // 1. Title
        if (selectedCategory !== 'all' && activeCategory?.seoTitle) {
            document.title = activeCategory.seoTitle;
        } else {
            document.title = selectedCategory === 'all' 
                ? 'Saify Machinery Catalog | All Products' 
                : `${activeCategoryTitle} | Saify Machinery Catalog`;
        }
        
        // 2. Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (selectedCategory !== 'all' && activeCategory?.seoDescription) {
            metaDesc?.setAttribute('content', activeCategory.seoDescription);
        } else {
            const description = `Browse our extensive collection of ${activeCategoryTitle.toLowerCase()} products. High-quality machinery and hardware available at Saify Machinery, Pulgaon.`;
            metaDesc?.setAttribute('content', description);
        }

        // 3. Keywords
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsMeta);
        }

        if (selectedCategory !== 'all' && activeCategory?.seoKeywords) {
            keywordsMeta.setAttribute('content', activeCategory.seoKeywords);
        } else {
            keywordsMeta.setAttribute('content', 'machinery, hardware, tools, pulgaon, saify machinery, industrial equipment');
        }
    }, [selectedCategory, activeCategory, activeCategoryTitle, selectedProduct]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Page Title & Hero - Redesigned for Impact */}
            <div className="pt-36 pb-20 bg-brand-blue-dark text-white relative overflow-hidden">
                {/* Patterns & Overlays */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#F9731633,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
                
                {/* Animated Light Blobs */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange rounded-full blur-[120px] -z-0"
                />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6"
                            >
                                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authorized Hardware Hub</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-heading font-black italic mb-6 leading-[0.9] tracking-tighter"
                            >
                                {config?.catalogHeaderTitle || 'Saify Catalog'}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl"
                            >
                                {config?.catalogHeaderSubtitle || 'Explore our extensive range of machinery, hardware, and industrial solutions. Quality equipment for every project in Pulgaon.'}
                            </motion.p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="px-8 py-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col items-center text-center w-full sm:w-auto">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-2">Total Selection</p>
                                <p className="text-5xl font-black font-mono tracking-tighter">{products.length}</p>
                                <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Products Active</p>
                            </div>
                            <div className="px-8 py-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col items-center text-center w-full sm:w-auto">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Categories</p>
                                <p className="text-5xl font-black font-mono tracking-tighter">{categories.length}</p>
                                <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">Specialized Wings</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Main area */}
            <main className="flex-grow py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* Sidebar Filters - Redesigned as a Professional Console */}
                        <aside className="lg:col-span-1 space-y-8">
                            <div className="sticky top-24 space-y-8">
                                {/* Console Box */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-blue opacity-50"></div>
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-orange/5 rounded-2xl flex items-center justify-center text-brand-orange">
                                                <Filter size={18} />
                                            </div>
                                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Console</h2>
                                        </div>
                                        {(selectedCategory !== 'all' || searchTerm) && (
                                            <button 
                                                onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                                                className="text-[10px] font-black text-brand-orange hover:scale-110 transition-transform uppercase tracking-[0.2em]"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-10">
                                        {/* Search Filter */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Search Module</label>
                                            <div className="relative group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={18} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Model or Keywords..." 
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:bg-white focus:border-brand-orange/30 focus:ring-4 focus:ring-brand-orange/5 outline-none transition-all text-sm font-bold shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        {/* Category Filter */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Filter segments</label>
                                            <div className="flex flex-col gap-2">
                                                <button 
                                                    onClick={() => setSelectedCategory('all')}
                                                    className={`flex items-center justify-between px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all group ${
                                                        selectedCategory === 'all' 
                                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-[1.02]' 
                                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Grid size={16} className={selectedCategory === 'all' ? 'text-white' : 'text-gray-400'} />
                                                        <span>Full Inventory</span>
                                                    </div>
                                                    <ChevronRight size={14} className={`transition-all duration-300 ${selectedCategory === 'all' ? 'rotate-90 translate-x-1' : 'opacity-30 group-hover:opacity-100'}`} />
                                                </button>

                                                <div className="space-y-2 mt-2">
                                                    {loading && categories.length === 0 ? (
                                                        [...Array(6)].map((_, i) => (
                                                            <div key={i} className="h-14 bg-gray-50 rounded-[1.25rem] animate-pulse"></div>
                                                        ))
                                                    ) : (
                                                        categories.map((cat) => {
                                                            const isActive = selectedCategory === cat.id;
                                                            const productCount = products.filter(p => p.categoryId === cat.id).length;
                                                            
                                                            return (
                                                                <button 
                                                                    key={cat.id}
                                                                    onClick={() => setSelectedCategory(cat.id)}
                                                                    className={`flex items-center justify-between px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all group ${
                                                                        isActive 
                                                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-[1.02]' 
                                                                        : 'bg-gray-50/50 text-gray-600 hover:bg-white hover:shadow-md hover:border-gray-100 border border-transparent'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange'}`}>
                                                                            <Package size={14} />
                                                                        </div>
                                                                        <span className="truncate max-w-[120px]">{cat.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-[9px] font-black px-2 py-1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200/50 text-gray-400 group-hover:bg-brand-orange/20 group-hover:text-brand-orange'}`}>
                                                                            {productCount}
                                                                        </span>
                                                                        <ChevronRight size={14} className={`transition-all duration-300 ${isActive ? 'rotate-90 translate-x-1' : 'opacity-20 group-hover:opacity-100'}`} />
                                                                    </div>
                                                                </button>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Info Card in Sidebar */}
                                <div className="bg-brand-orange/5 p-6 rounded-[2rem] border border-brand-orange/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange mb-3">Professional Support</h4>
                                    <p className="text-sm font-medium text-orange-900/60 leading-relaxed italic mb-4 line-clamp-3">Not finding a specific model? Contact us for specialized procurement.</p>
                                    <a href={`https://wa.me/${config?.whatsapp || '919021313113'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-orange font-bold text-xs hover:gap-3 transition-all">
                                        WhatsApp Connect <ArrowRight size={14} />
                                    </a>
                                </div>
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
                                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex items-center gap-6 p-4 md:p-6' : 'flex flex-col'}`}>
                                            <div className={`${viewMode === 'list' ? 'w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl' : 'aspect-square'} bg-gray-200`}></div>
                                            <div className={`p-6 flex flex-col flex-grow space-y-3 ${viewMode === 'list' ? 'p-0' : ''}`}>
                                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                                                    <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {filteredProducts.length > 0 ? (
                                        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-6"}>
                                            <AnimatePresence mode="popLayout">
                                                {filteredProducts.map((prod, index) => (
                                                    <motion.div 
                                                        layout
                                                        key={prod.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 hover:border-brand-orange/30 transition-all duration-500
                                                            ${viewMode === 'list' ? 'flex flex-col md:flex-row p-6 items-center gap-8' : 'flex flex-col'}
                                                        `}
                                                    >
                                                        {/* Image Container */}
                                                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-56 h-56 md:h-56 shrink-0 rounded-[1.5rem]' : 'aspect-square'}`}>
                                                            <motion.img 
                                                                whileHover={{ scale: 1.1 }}
                                                                transition={{ duration: 0.6 }}
                                                                src={prod.imageUrl} 
                                                                alt={prod.title} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                            
                                                            {/* Badges Overlay */}
                                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                                {prod.featured && (
                                                                    <div className="bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl shadow-brand-orange/30">
                                                                        Top Pick
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Quick Action Overlay */}
                                                            <div className="absolute inset-0 bg-brand-blue-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                                <button 
                                                                    onClick={() => setSelectedProduct(prod)}
                                                                    className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-brand-orange hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                                                                >
                                                                    <Eye size={16} />
                                                                    Quick View
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Content Section */}
                                                        <div className={`p-8 flex flex-col flex-grow ${viewMode === 'list' ? 'p-0 text-center md:text-left' : ''}`}>
                                                            <div className="mb-4 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                                                                <span className="text-[9px] font-black uppercase text-brand-orange tracking-[0.15em] px-3 py-1 bg-brand-orange/5 rounded-full border border-brand-orange/10">
                                                                    {categories.find(c => c.id === prod.categoryId)?.title || 'Industrial'}
                                                                </span>
                                                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.15em] px-3 py-1 bg-gray-50 rounded-full border border-gray-100 italic">
                                                                    Model: {prod.id.substring(0, 8).toUpperCase()}
                                                                </span>
                                                            </div>

                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-orange transition-colors mb-4 line-clamp-1">
                                                                {prod.title}
                                                            </h3>
                                                            
                                                            <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                                                                {prod.description}
                                                            </p>
                                                            
                                                            {/* Footer Actions */}
                                                            <div className="mt-auto pt-6 flex items-center justify-between gap-4 border-t border-gray-50">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Est. Pricing</span>
                                                                    <div className="text-brand-blue font-black text-lg font-mono tracking-tighter">
                                                                        {prod.price ? (
                                                                            <span className="flex items-center gap-1">
                                                                                <Tag size={14} className="opacity-30" />
                                                                                {prod.price}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enquiry only</span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <button 
                                                                        onClick={() => setSelectedProduct(prod)}
                                                                        className="p-3 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-2xl transition-all border border-transparent hover:border-brand-blue/20"
                                                                        title="Technical Details"
                                                                    >
                                                                        <Maximize2 size={20} />
                                                                    </button>
                                                                    <a 
                                                                        href={`https://wa.me/${config?.whatsapp || '919021313113'}?text=Bhai, I am interested in ${prod.title} (Model: ${prod.id})`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="bg-green-500 text-white p-3.5 rounded-2xl shadow-xl shadow-green-100 hover:bg-green-600 transition-all hover:scale-110 active:scale-95"
                                                                    >
                                                                        <MessageSquare size={20} />
                                                                    </a>
                                                                </div>
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

            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-brand-blue-dark/95 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col md:flex-row border border-white/20"
                        >
                            {/* Close button - Floating style */}
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-8 right-8 z-[60] p-3 bg-white/80 backdrop-blur-xl hover:bg-brand-orange hover:text-white rounded-2xl text-gray-900 shadow-2xl transition-all border border-gray-100 ring-4 ring-black/5"
                            >
                                <X size={20} />
                            </button>

                            {/* Left: Enhanced Gallery Section */}
                            <div className="w-full md:w-3/5 bg-gray-50 flex flex-col relative group/gallery border-r border-gray-100">
                                <div 
                                    className="flex-grow flex items-center justify-center relative overflow-hidden cursor-zoom-in"
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.img 
                                            key={activeImageIndex}
                                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                            animate={{ 
                                                opacity: 1,
                                                scale: isZoomed ? 2.5 : 1,
                                                filter: 'blur(0px)',
                                                x: isZoomed ? `${50 - zoomPos.x}%` : 0,
                                                y: isZoomed ? `${50 - zoomPos.y}%` : 0
                                            }}
                                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                                            transition={{ 
                                                opacity: { duration: 0.3 },
                                                scale: { duration: 0.2 },
                                                x: { duration: isZoomed ? 0 : 0.3 },
                                                y: { duration: isZoomed ? 0 : 0.3 },
                                                filter: { duration: 0.3 }
                                            }}
                                            src={[selectedProduct.imageUrl, ...(selectedProduct.images || [])][activeImageIndex]} 
                                            alt={selectedProduct.title} 
                                            className="w-full h-full object-contain p-12 md:p-20 drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                                        />
                                    </AnimatePresence>

                                    {/* Navigation Arrows */}
                                    {[selectedProduct.imageUrl, ...(selectedProduct.images || [])].length > 1 && (
                                        <>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const total = [selectedProduct.imageUrl, ...(selectedProduct.images || [])].length;
                                                    setActiveImageIndex(prev => (prev - 1 + total) % total);
                                                    setIsZoomed(false);
                                                }}
                                                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-xl hover:bg-white rounded-2xl text-gray-900 shadow-xl border border-white/50 opacity-0 group-hover/gallery:opacity-100 transition-all z-20"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const total = [selectedProduct.imageUrl, ...(selectedProduct.images || [])].length;
                                                    setActiveImageIndex(prev => (prev + 1) % total);
                                                    setIsZoomed(false);
                                                }}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-xl hover:bg-white rounded-2xl text-gray-900 shadow-xl border border-white/50 opacity-0 group-hover/gallery:opacity-100 transition-all z-20"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </>
                                    )}
                                    
                                    {/* Zoom Status Badge */}
                                    <div className="absolute bottom-10 right-10 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-xl border border-gray-100 opacity-0 group-hover/gallery:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
                                        {isZoomed ? 'Active Zoom Engine' : 'Hover over image to Zoom'}
                                    </div>

                                    {selectedProduct.featured && (
                                        <div className="absolute top-10 left-10 bg-brand-orange text-white text-[10px] font-black px-4 py-2 rounded-full shadow-2xl shadow-brand-orange/40 uppercase tracking-[0.2em] z-10">
                                            Authorized Hub Pick
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Engine Bar */}
                                <div className="p-8 bg-white border-t border-gray-100">
                                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {[selectedProduct.imageUrl, ...(selectedProduct.images || [])].map((img, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => { setActiveImageIndex(idx); setIsZoomed(false); }}
                                                className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all group/thumb
                                                    ${activeImageIndex === idx ? 'border-brand-orange ring-8 ring-brand-orange/5' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}
                                                `}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Technical Control Section */}
                            <div className="w-full md:w-2/5 p-10 md:p-14 flex flex-col h-full overflow-y-auto bg-white">
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-4 py-1.5 bg-brand-blue/5 text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-brand-blue/10">
                                            {categories.find(c => c.id === selectedProduct.categoryId)?.title || 'Industrial'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Inventory</span>
                                        </div>
                                        {selectedProduct.videoUrl && (
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full border border-brand-orange/20 animate-bounce-subtle">
                                                <Play size={10} className="fill-brand-orange" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Video Guide</span>
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-heading font-black italic text-gray-900 leading-none tracking-tighter mb-6">
                                        {selectedProduct.title}
                                    </h2>
                                    <div className="flex items-center gap-3 font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg w-fit border border-gray-100">
                                        <span className="text-brand-orange">ID:</span> {selectedProduct.id.substring(0, 12).toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-10 flex-grow">
                                    {/* Data Sheet */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                            <div className="w-6 h-[1px] bg-gray-200"></div> Technical Sheet
                                        </label>
                                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                <Package size={80} />
                                            </div>
                                            <p className="text-gray-600 leading-relaxed text-base font-medium italic relative z-10">
                                                {selectedProduct.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 group hover:bg-brand-blue hover:text-white transition-all duration-500">
                                            <p className="text-[9px] font-black text-brand-blue group-hover:text-white/70 uppercase tracking-[0.2em] mb-2">Price Index</p>
                                            <p className="text-2xl font-black font-mono tracking-tighter">
                                                {selectedProduct.price || <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-white">Ask Quote</span>}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group hover:border-brand-orange/30 transition-all">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Warranty</p>
                                            <p className="text-2xl font-black font-mono tracking-tighter text-gray-900 group-hover:text-brand-orange transition-colors">Standard</p>
                                        </div>
                                    </div>

                                    {/* Video Tutorial Section */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                            <div className="w-6 h-[1px] bg-gray-200"></div> Video Support
                                        </label>
                                        {selectedProduct.videoUrl ? (
                                            <div className="bg-black rounded-3xl overflow-hidden aspect-video relative group/video border-4 border-gray-100 shadow-xl">
                                                <iframe 
                                                    src={selectedProduct.videoUrl.replace('watch?v=', 'embed/').split('&')[0]} 
                                                    className="w-full h-full"
                                                    title={selectedProduct.videoTitle || 'Product Tutorial'}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                                                    <Play size={10} className="fill-white" />
                                                    {selectedProduct.videoTitle || 'Technical Demonstration'}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-3xl p-6 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <Loader2 size={20} className="text-gray-300" />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Video Guide Pending</p>
                                                <p className="text-xs text-gray-500 max-w-[200px]">Request a custom installation or usage video via WhatsApp.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Controller Actions */}
                                <div className="mt-14 space-y-4">
                                    <a 
                                        href={`https://wa.me/${config?.whatsapp || '919021313113'}?text=Bhai, I need a detailed quote for ${selectedProduct.title} (Model Ref: ${selectedProduct.id})`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-6 bg-green-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-green-100 hover:bg-green-600 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        <MessageSquare size={20} />
                                        Request Quote
                                    </a>
                                    <div className="grid grid-cols-2 gap-4">
                                        <a href={`tel:${config?.phone || '9021313113'}`} className="py-4 bg-gray-900 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                                            <Phone size={14} /> Call Engine
                                        </a>
                                        <button 
                                            onClick={() => {
                                                const shareData = {
                                                    title: selectedProduct.title,
                                                    text: `Check out ${selectedProduct.title} at Saify Machinery!`,
                                                    url: window.location.href
                                                };
                                                if (navigator.share) {
                                                    navigator.share(shareData).catch(() => {});
                                                } else {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }
                                            }}
                                            className={`py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest border transition-all flex items-center justify-center gap-2
                                                ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:shadow-xl'}
                                            `}
                                        >
                                            {copied ? <Check size={14} /> : <Share2 size={14} />}
                                            {copied ? 'Link Copied' : 'Share Product'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-between opacity-30 grayscale pointer-events-none">
                                    <p className="text-[8px] font-black tracking-[0.3em]">GENUINE MODULES ONLY</p>
                                    <p className="text-[8px] font-black tracking-[0.3em]">PULGAON-HARDWARE-HUB</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
