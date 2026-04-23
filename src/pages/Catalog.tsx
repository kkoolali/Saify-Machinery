import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { 
    Search, Filter, Package, ChevronRight, Tag, 
    ArrowRight, ShoppingBag, Grid, List as ListIcon,
    Loader2, Phone, MessageSquare, Maximize2, X, Eye,
    ZoomIn, ZoomOut, ChevronLeft, Play, Share2, Check,
    ArrowLeftRight, Scale, SlidersHorizontal, Sparkles, Heart
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import TechnicalAdvisor from '../components/TechnicalAdvisor';

interface Variant {
    id: string;
    name: string;
    price?: string;
    imageUrl?: string;
}

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
    enquiryOnly?: boolean;
    variants?: Variant[];
    variantLabel?: string;
}

interface Category {
    id: string;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
}

interface ProductCardProps {
    prod: Product;
    index: number;
    viewMode: 'grid' | 'list';
    categories: Category[];
    compareList: any[];
    toggleCompare: (p: Product) => void;
    onSelect: (p: Product, initialVariant?: Variant) => void;
    whatsappNumber: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
    prod, index, viewMode, categories, compareList, toggleCompare, onSelect, whatsappNumber 
}) => {
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const displayPrice = selectedVariant?.price || prod.price;
    const displayImage = selectedVariant?.imageUrl || prod.imageUrl;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (prod.enquiryOnly) return;
        addToCart({
            productId: prod.id,
            productTitle: prod.title,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
            quantity: 1,
            price: displayPrice || '0',
            imageUrl: displayImage
        });
    };

    return (
        <motion.div 
            layout
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
                    key={displayImage}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={displayImage} 
                    alt={prod.title} 
                    className="w-full h-full object-cover" 
                />
                
                {/* Overlay Effect on Hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {prod.featured && (
                        <div className="bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl shadow-brand-orange/30">
                            Top Pick
                        </div>
                    )}
                    {prod.variants && prod.variants.length > 0 && (
                        <div className="bg-white/95 backdrop-blur-md text-brand-blue text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-brand-blue/20 flex items-center gap-1.5">
                            <SlidersHorizontal size={10} className="text-brand-orange" />
                            {prod.variants.length} {prod.variantLabel || 'Options'}
                        </div>
                    )}
                    {prod.videoUrl && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(prod, selectedVariant || undefined);
                            }}
                            className="bg-white/90 backdrop-blur-md text-brand-orange text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-brand-orange/20 flex items-center gap-1.5 animate-pulse-slow hover:bg-brand-orange hover:text-white transition-all pointer-events-auto"
                        >
                            <Play size={10} className="fill-current" />
                            Watch Tutorial
                        </button>
                    )}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-brand-blue-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-20">
                    {!prod.enquiryOnly && (
                        <button 
                            onClick={handleAddToCart}
                            className="bg-brand-orange text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white hover:text-brand-orange transition-all transform -translate-y-4 group-hover:translate-y-0 w-48 justify-center shadow-xl shadow-brand-orange/20"
                        >
                            <ShoppingBag size={16} className="fill-current" />
                            Add to Cart
                        </button>
                    )}
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                        }}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all transform translate-y-4 group-hover:translate-y-0 w-48 justify-center shadow-xl
                            ${isInWishlist(prod.id) 
                                ? 'bg-white text-brand-orange hover:bg-gray-100' 
                                : 'bg-white/10 text-white hover:bg-brand-orange border border-white/20 hover:border-transparent'}
                        `}
                    >
                        <Heart size={16} className={isInWishlist(prod.id) ? 'fill-current' : ''} />
                        {isInWishlist(prod.id) ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(prod);
                        }}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all transform translate-y-4 group-hover:translate-y-0 w-48 justify-center shadow-xl
                            ${compareList.find(p => p.id === prod.id) 
                                ? 'bg-white text-brand-blue hover:bg-gray-100' 
                                : 'bg-white/10 text-white hover:bg-brand-blue border border-white/20 hover:border-transparent'}
                        `}
                    >
                        <ArrowLeftRight size={16} />
                        Compare
                    </button>
                    
                    <div className="flex gap-2 mt-2 w-48">
                        <button 
                            onClick={() => onSelect(prod, selectedVariant || undefined)}
                            className="bg-white/10 text-white border border-white/20 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-gray-900 transition-all flex-1"
                            title="Quick View"
                        >
                            <Eye size={16} />
                        </button>
                        <Link 
                            to={`/product/${prod.id}`}
                            className="bg-white/10 text-white border border-white/20 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-brand-orange transition-all flex-1"
                            title="Full Details Page"
                        >
                            <ArrowRight size={16} />
                        </Link>
                    </div>
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

                <Link to={`/product/${prod.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-orange transition-colors mb-4 line-clamp-1">
                        {prod.title}
                    </h3>
                </Link>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
                    {prod.description}
                </p>

                {/* Inline Variant Selection */}
                {prod.variants && prod.variants.length > 0 && (
                    <div className="mb-6 space-y-2">
                        <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">{prod.variantLabel || 'Select Variant'}:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {prod.variants.slice(0, 4).map((v) => (
                                <button
                                    key={v.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedVariant(v);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border
                                        ${selectedVariant?.id === v.id 
                                            ? 'bg-brand-blue border-brand-blue text-white shadow-md' 
                                            : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-brand-blue/30'}
                                    `}
                                >
                                    {v.name}
                                </button>
                            ))}
                            {prod.variants.length > 4 && (
                                <button 
                                    onClick={() => onSelect(prod)}
                                    className="px-3 py-1.5 rounded-lg text-[9px] font-bold bg-white border border-dashed border-gray-200 text-gray-400 hover:border-brand-orange"
                                >
                                    +{prod.variants.length - 4} more
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Footer Actions */}
                <div className="mt-auto pt-6 flex items-center justify-between gap-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Est. Pricing</span>
                        <div className="text-brand-blue font-black text-lg font-mono tracking-tighter transition-all">
                            {prod.enquiryOnly ? (
                                <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest">Enquiry Only</span>
                            ) : displayPrice ? (
                                <span className="flex items-center gap-1">
                                    <Tag size={14} className="opacity-30" />
                                    {(!selectedVariant && prod.variants && prod.variants.length > 0) ? <span className="text-[8px] uppercase text-gray-400 mr-1">From</span> : null}
                                    {displayPrice}
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enquiry only</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!prod.enquiryOnly && (
                            <button 
                                onClick={handleAddToCart}
                                className="bg-brand-blue text-white p-3.5 rounded-2xl shadow-xl shadow-brand-blue/20 hover:bg-brand-orange hover:shadow-brand-orange/30 transition-all hover:scale-110 active:scale-95"
                                title="Add to Cart"
                            >
                                <ShoppingBag size={20} />
                            </button>
                        )}
                        <button 
                            onClick={() => onSelect(prod, selectedVariant || undefined)}
                            className="p-3 text-gray-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-2xl transition-all border border-transparent hover:border-brand-blue/20"
                            title="Technical Details"
                        >
                            <Maximize2 size={20} />
                        </button>
                        <a 
                            href={`https://wa.me/${whatsappNumber}?text=Bhai, I am interested in ${prod.title}${selectedVariant ? ` (${selectedVariant.name})` : ''} (Model: ${prod.id})`}
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
    );
};

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
    const [advisorQuery, setAdvisorQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [copied, setCopied] = useState(false);
    const { 
        compareList, 
        toggleCompare, 
        clearCompare, 
        showCompareModal, 
        setShowCompareModal 
    } = useCompare();
    const { addToCart } = useCart();

    const handleSelectProduct = (p: Product, initialVariant?: Variant) => {
        setSelectedProduct(p);
        setSelectedVariant(initialVariant || (p.variants?.[0] || null));
        setActiveImageIndex(0);
        setIsZoomed(false);
    };

    // Dynamic Max Price for Slider
    const maxItemPrice = useMemo(() => {
        if (products.length === 0) return 100000;
        const prices = products
            .map(p => {
                const priceStr = String(p.price || '');
                if (!priceStr) return 0;
                const match = priceStr.match(/\d+/g);
                return match ? parseInt(match.join('')) : 0;
            })
            .filter(price => price > 0);
        return prices.length > 0 ? Math.max(...prices) : 100000;
    }, [products]);

    useEffect(() => {
        if (maxPrice === '' && products.length > 0) {
            setMaxPrice(maxItemPrice);
        }
    }, [maxItemPrice, products.length]);

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

    const parsePrice = (priceVal?: any) => {
        if (!priceVal) return 0;
        const priceStr = String(priceVal);
        const numericPart = priceStr.replace(/[^\d.]/g, '');
        return parseFloat(numericPart) || 0;
    };

    const filteredProducts = useMemo(() => {
        const searchLow = searchTerm.toLowerCase();
        return products.filter(p => {
            const title = String(p.title || '').toLowerCase();
            const desc = String(p.description || '').toLowerCase();
            
            const matchesSearch = title.includes(searchLow) || desc.includes(searchLow);
            const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
            
            const matchesAvailability = selectedAvailability === 'all' || 
                (selectedAvailability === 'in-stock' && !p.enquiryOnly) || 
                (selectedAvailability === 'enquiry-only' && p.enquiryOnly);

            const priceNum = parsePrice(p.price);
            const matchesMinPrice = minPrice === '' || priceNum >= minPrice;
            const matchesMaxPrice = maxPrice === '' || priceNum <= maxPrice;
            
            return matchesSearch && matchesCategory && matchesAvailability && matchesMinPrice && matchesMaxPrice;
        });
    }, [products, searchTerm, selectedCategory, selectedAvailability, minPrice, maxPrice]);

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
                    <div className="mb-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
                        <ChevronRight size={14} className="text-gray-600" />
                        <button 
                            onClick={() => setSelectedCategory('all')} 
                            className={`${selectedCategory === 'all' ? 'text-brand-orange' : 'hover:text-brand-orange transition-colors'}`}
                        >
                            All Products
                        </button>
                        {selectedCategory !== 'all' && activeCategoryTitle && (
                            <>
                                <ChevronRight size={14} className="text-gray-600" />
                                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">{activeCategoryTitle}</span>
                            </>
                        )}
                        {selectedProduct && (
                            <>
                                <ChevronRight size={14} className="text-gray-600" />
                                <span className="text-white bg-white/10 px-2 py-0.5 rounded-md truncate max-w-[200px]">{selectedProduct.title}</span>
                            </>
                        )}
                    </div>

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
                                className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mb-10"
                            >
                                {config?.catalogHeaderSubtitle || 'Explore our extensive range of machinery, hardware, and industrial solutions. Quality equipment for every project in Pulgaon.'}
                            </motion.p>

                            {/* Prominent AI Advisor Input */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="max-w-2xl relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-orange-400 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setIsAdvisorOpen(true);
                                    }}
                                    className="relative flex items-center bg-brand-blue-dark/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 pr-4 shadow-2xl"
                                >
                                    <div className="pl-6 pr-4 text-brand-orange">
                                        <Sparkles size={24} className="animate-pulse" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={advisorQuery}
                                        onChange={(e) => setAdvisorQuery(e.target.value)}
                                        placeholder="Bhai, what do you need? (e.g. Pump for 3 floors)"
                                        className="flex-grow bg-transparent border-none text-white placeholder:text-white/30 text-lg py-4 px-2 focus:ring-0 outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-brand-orange hover:bg-brand-orange-light text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-orange/20 flex items-center gap-2"
                                    >
                                        Ask AI <ArrowRight size={16} />
                                    </button>
                                </form>
                            </motion.div>
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
                        <aside className={`lg:col-span-1 space-y-8 lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
                            <div className="sticky top-24 space-y-8">
                                {/* Console Box */}
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-blue opacity-50"></div>
                                    
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-orange/5 rounded-2xl flex items-center justify-center text-brand-orange pointer-events-none">
                                                <Filter size={18} />
                                            </div>
                                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Console</h2>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {(selectedCategory !== 'all' || searchTerm || selectedAvailability !== 'all' || minPrice !== '' || maxPrice !== maxItemPrice) && (
                                                <button 
                                                    onClick={() => { 
                                                        setSelectedCategory('all'); 
                                                        setSearchTerm(''); 
                                                        setSelectedAvailability('all');
                                                        setMinPrice('');
                                                        setMaxPrice(maxItemPrice);
                                                        setIsCategoryDropdownOpen(false);
                                                    }}
                                                    className="text-[10px] font-black text-brand-orange hover:scale-110 transition-transform uppercase tracking-[0.2em]"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setIsFilterOpen(false)}
                                                className="lg:hidden text-gray-400 hover:text-gray-900"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {/* AI Advisor Shortcut */}
                                        <div className="bg-brand-blue-dark rounded-3xl p-6 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Sparkles size={20} className="text-brand-orange animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Neural Expert</span>
                                                </div>
                                                <h3 className="text-lg font-black italic tracking-tight leading-tight mb-4">Confused Bhai?<br/><span className="text-gray-400">Let AI help you.</span></h3>
                                                <button 
                                                    onClick={() => setIsAdvisorOpen(true)}
                                                    className="w-full py-3 bg-white text-brand-blue-dark rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-xl shadow-black/5"
                                                >
                                                    Open Advisor
                                                </button>
                                            </div>
                                        </div>

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

                                        {/* Category Selection Module */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Technical Category</label>
                                            <div className="flex flex-col gap-2">
                                                <button 
                                                    onClick={() => setSelectedCategory('all')}
                                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border
                                                        ${selectedCategory === 'all' 
                                                            ? 'bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/20' 
                                                            : 'bg-white border-gray-100 text-gray-600 hover:border-brand-orange/30 hover:bg-brand-orange/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-brand-blue/5 text-brand-blue'}`}>
                                                            <Grid size={18} />
                                                        </div>
                                                        <span className="font-bold text-sm">Full Inventory</span>
                                                    </div>
                                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        {products.length}
                                                    </span>
                                                </button>
                                                
                                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                                    {categories.map(cat => {
                                                        const count = products.filter(p => p.categoryId === cat.id).length;
                                                        return (
                                                            <button 
                                                                key={cat.id}
                                                                onClick={() => setSelectedCategory(cat.id)}
                                                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border
                                                                    ${selectedCategory === cat.id 
                                                                        ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/20' 
                                                                        : 'bg-white border-gray-100 text-gray-600 hover:border-brand-blue/30 hover:bg-brand-blue/5'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-2 rounded-xl ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-brand-orange/5 text-brand-orange'}`}>
                                                                        <Package size={18} />
                                                                    </div>
                                                                    <span className="font-bold text-sm truncate">{cat.title}</span>
                                                                </div>
                                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                                    {count}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Availability Filter (Checkboxes) */}
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Status</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { id: 'all', label: 'All Status', icon: <Package size={14} />, count: products.length },
                                                    { id: 'in-stock', label: 'In-Stock', icon: <Check size={14} />, count: products.filter(p => !p.enquiryOnly).length },
                                                    { id: 'enquiry-only', label: 'Enquiry Only', icon: <Phone size={14} />, count: products.filter(p => p.enquiryOnly).length }
                                                ].map(option => (
                                                    <label 
                                                        key={option.id}
                                                        className={`flex items-center justify-between px-5 py-4 rounded-[1.25rem] cursor-pointer transition-all border-2 ${
                                                            selectedAvailability === option.id 
                                                            ? 'bg-brand-blue/5 border-brand-blue text-brand-blue' 
                                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedAvailability === option.id ? 'bg-brand-blue border-brand-blue' : 'border-gray-200'}`}>
                                                                <input 
                                                                    type="radio" 
                                                                    name="availability"
                                                                    checked={selectedAvailability === option.id}
                                                                    onChange={() => setSelectedAvailability(option.id)}
                                                                    className="hidden" 
                                                                />
                                                                {selectedAvailability === option.id && <Check size={12} className="text-white" />}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {option.icon}
                                                                <span className="text-xs font-bold">{option.label}</span>
                                                            </div>
                                                        </div>
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${selectedAvailability === option.id ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {option.count}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Range Slider */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Budget Index</label>
                                                <span className="text-[10px] font-black text-brand-orange italic">₹{maxPrice || maxItemPrice}</span>
                                            </div>
                                            <div className="pb-4">
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max={maxItemPrice} 
                                                    step="1000"
                                                    value={maxPrice || maxItemPrice}
                                                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                                                />
                                                <div className="flex justify-between mt-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                    <span>₹0</span>
                                                    <span>₹{maxItemPrice.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Price</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0" 
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : '')}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-brand-orange/30 outline-none text-xs font-bold shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Price</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder={maxItemPrice.toString()} 
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : '')}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-brand-orange/30 outline-none text-xs font-bold shadow-inner"
                                                    />
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
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setIsAdvisorOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-all"
                                    >
                                        <Sparkles size={16} />
                                        <span className="hidden sm:inline">AI Advisor</span>
                                    </button>

                                    <button 
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isFilterOpen ? 'bg-brand-blue text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                    >
                                        <SlidersHorizontal size={16} />
                                        {isFilterOpen ? 'Close Filters' : 'Show Filters'}
                                    </button>
                                    
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
                                                    <ProductCard 
                                                        key={prod.id}
                                                        prod={prod}
                                                        index={index}
                                                        viewMode={viewMode}
                                                        categories={categories}
                                                        compareList={compareList}
                                                        toggleCompare={toggleCompare}
                                                        onSelect={handleSelectProduct}
                                                        whatsappNumber={config?.whatsapp || '919021313113'}
                                                    />
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
                {isAdvisorOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdvisorOpen(false)}
                            className="absolute inset-0 bg-brand-blue-dark/95 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border border-white/20"
                        >
                            <TechnicalAdvisor 
                                products={products} 
                                onClose={() => setIsAdvisorOpen(false)} 
                                onSelectProduct={setSelectedProduct}
                                initialQuery={advisorQuery}
                            />
                        </motion.div>
                    </div>
                )}

                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setSelectedProduct(null); setSelectedVariant(null); }}
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
                                onClick={() => { setSelectedProduct(null); setSelectedVariant(null); }}
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
                                                    key={selectedVariant?.imageUrl || activeImageIndex}
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
                                                    src={(selectedVariant?.imageUrl && activeImageIndex === 0) 
                                                        ? selectedVariant.imageUrl 
                                                        : [selectedProduct.imageUrl, ...(selectedProduct.images || [])][activeImageIndex]
                                                    } 
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

                                    {/* Variant Selection Hub */}
                                    {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                                    <div className="w-6 h-[1px] bg-gray-200"></div> {selectedProduct.variantLabel || 'Available Options'}
                                                </label>
                                                {selectedVariant && (
                                                    <button 
                                                        onClick={() => setSelectedVariant(null)}
                                                        className="text-[9px] font-black text-brand-orange uppercase tracking-widest hover:underline"
                                                    >
                                                        Clear Selection
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProduct.variants.map((variant) => (
                                                    <button
                                                        key={variant.id}
                                                        onClick={() => {
                                                            setSelectedVariant(variant);
                                                            setActiveImageIndex(0); // Reset to primary view when variant changes
                                                            setIsZoomed(false);
                                                        }}
                                                        className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2
                                                            ${selectedVariant?.id === variant.id 
                                                                ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-105' 
                                                                : 'bg-white border-gray-100 text-gray-400 hover:border-brand-orange/30 hover:text-brand-orange'}
                                                        `}
                                                    >
                                                        {selectedVariant?.id === variant.id && <Check size={12} />}
                                                        {variant.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 group hover:bg-brand-blue hover:text-white transition-all duration-500">
                                            <p className="text-[9px] font-black text-brand-blue group-hover:text-white/70 uppercase tracking-[0.2em] mb-2">Price Index</p>
                                            <p className="text-2xl font-black font-mono tracking-tighter">
                                                {selectedProduct.enquiryOnly ? 
                                                    <span className="text-[12px] uppercase font-bold text-brand-orange group-hover:text-white">Enquiry Only</span> 
                                                    : (selectedVariant?.price || selectedProduct.price || <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-white">Ask Quote</span>)
                                                }
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group hover:border-brand-orange/30 transition-all">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Warranty</p>
                                            <p className="text-2xl font-black font-mono tracking-tighter text-gray-900 group-hover:text-brand-orange transition-colors">Standard</p>
                                        </div>
                                    </div>

                                    {/* Video Tutorial Section */}
                                    {selectedProduct.videoUrl && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                                <div className="w-6 h-[1px] bg-gray-200"></div> Video Support
                                            </label>
                                            <div className="bg-black rounded-3xl overflow-hidden aspect-video relative group/video border-4 border-gray-100 shadow-xl">
                                                {(selectedProduct.videoUrl.includes('youtube.com') || selectedProduct.videoUrl.includes('youtu.be') || selectedProduct.videoUrl.includes('vimeo.com')) ? (
                                                    <iframe 
                                                        src={selectedProduct.videoUrl.includes('youtu.be') 
                                                            ? `https://www.youtube.com/embed/${selectedProduct.videoUrl.split('/').pop()?.split('?')[0]}`
                                                            : selectedProduct.videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                                                        } 
                                                        className="w-full h-full"
                                                        title={selectedProduct.videoTitle || 'Product Tutorial'}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video 
                                                        src={selectedProduct.videoUrl} 
                                                        className="w-full h-full object-cover" 
                                                        controls 
                                                        playsInline
                                                    />
                                                )}
                                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10 z-10 pointer-events-none">
                                                    <Play size={10} className="fill-white" />
                                                    {selectedProduct.videoTitle || 'Technical Demonstration'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Controller Actions */}
                                <div className="mt-14 space-y-4">
                                    {!selectedProduct.enquiryOnly && (
                                        <button 
                                            onClick={() => {
                                                addToCart({
                                                    productId: selectedProduct.id,
                                                    productTitle: selectedProduct.title,
                                                    variantId: selectedVariant?.id,
                                                    variantName: selectedVariant?.name,
                                                    quantity: 1,
                                                    price: selectedVariant?.price || selectedProduct.price || '0',
                                                    imageUrl: selectedVariant?.imageUrl || selectedProduct.imageUrl
                                                });
                                            }}
                                            className="w-full py-6 bg-brand-blue text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-brand-blue/20 hover:bg-brand-orange hover:shadow-brand-orange/30 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <ShoppingBag size={20} />
                                            Add to Order
                                        </button>
                                    )}
                                    <a 
                                        href={`https://wa.me/${config?.whatsapp || '919021313113'}?text=Bhai, I need a detailed quote for ${selectedProduct.title}${selectedVariant ? ` (${selectedProduct.variantLabel || 'Option'}: ${selectedVariant.name})` : ''} (Model Ref: ${selectedProduct.id})`}
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
