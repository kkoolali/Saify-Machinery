import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import TechnicalAdvisor from '../components/TechnicalAdvisor';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { 
    ChevronRight, ChevronLeft, ShoppingBag, MessageSquare, 
    Phone, Play, Check, Share2, Package, Tag, ArrowLeftRight, Heart, ZoomIn, Loader2
} from 'lucide-react';

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
    images?: string[];
    videoUrl?: string;
    videoTitle?: string;
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
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<any>(null);

    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [copied, setCopied] = useState(false);
    const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { toggleCompare, items: compareList } = useCompare();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Fetch product
                const productDoc = await getDoc(doc(db, 'products', id));
                if (productDoc.exists()) {
                    setProduct({ id: productDoc.id, ...productDoc.data() } as Product);
                } else {
                    navigate('/products');
                    return;
                }

                // Fetch Categories
                const catSnapshot = await getDocs(collection(db, 'categories'));
                setCategories(catSnapshot.docs.map(d => ({ id: d.data().id, title: d.data().title } as Category)));

                // Fetch Global Config
                const configDoc = await getDoc(doc(db, 'settings', 'global'));
                if (configDoc.exists()) {
                    setConfig(configDoc.data());
                }
            } catch (err) {
                console.error("Error fetching product details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (product) {
            document.title = product.seoTitle || `${product.title} | Saify Machinery`;
            const metaDesc = document.querySelector('meta[name="description"]');
            metaDesc?.setAttribute('content', product.seoDescription || product.description.substring(0, 160));
        }
    }, [product]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Header />
                <Loader2 size={48} className="text-brand-orange animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Specifications...</p>
                <Footer />
            </div>
        );
    }

    if (!product) return null;

    const allImages = [product.imageUrl, ...(product.images || [])];
    const displayImage = (selectedVariant?.imageUrl && activeImageIndex === 0) 
        ? selectedVariant.imageUrl 
        : allImages[activeImageIndex];
    const categoryName = categories.find(c => c.id === product.categoryId)?.title || 'Industrial';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Breadcrumb Layer */}
            <div className="pt-32 pb-6 px-4 md:px-8 bg-brand-blue-dark text-white relative z-10 w-full overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="container mx-auto relative z-10">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
                        <ChevronRight size={14} className="text-gray-600" />
                        <Link to="/products" className="hover:text-brand-orange transition-colors">Catalog</Link>
                        <ChevronRight size={14} className="text-gray-600" />
                        <span className="text-white bg-white/10 px-3 py-1 rounded-md border border-white/10">{categoryName}</span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-8 py-10 lg:py-16 flex-grow">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col lg:flex-row border border-gray-100">
                    
                    {/* Left: Enhanced Gallery Section */}
                    <div className="w-full lg:w-1/2 bg-gray-50/50 flex flex-col relative group/gallery border-b lg:border-b-0 lg:border-r border-gray-100">
                        <div 
                            className="flex-grow flex items-center justify-center relative overflow-hidden min-h-[400px] lg:min-h-[600px] cursor-zoom-in"
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
                                    transition={{ duration: 0.3 }}
                                    src={displayImage} 
                                    alt={product.title} 
                                    className="w-full h-full object-contain p-12 md:p-20 drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                                />
                            </AnimatePresence>

                            {/* Top Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-3 z-10 pointer-events-none">
                                {product.featured && (
                                    <div className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-2xl shadow-brand-orange/40 w-fit">
                                        Top Pick
                                    </div>
                                )}
                                {product.videoUrl && (
                                    <div className="bg-white/90 backdrop-blur-md text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl border border-brand-orange/20 flex items-center gap-2 w-fit">
                                        <Play size={12} className="fill-brand-orange" />
                                        Video
                                    </div>
                                )}
                            </div>

                            <div className="absolute top-8 right-8 flex flex-col gap-3 z-10">
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleWishlist(product);
                                    }}
                                    className={`p-3 rounded-2xl border-2 transition-all shadow-lg flex items-center justify-center
                                        ${isInWishlist(product.id) ? 'bg-brand-orange border-brand-orange text-white shadow-brand-orange/30' : 'bg-white/80 border-gray-200 text-gray-500 hover:text-brand-orange hover:border-brand-orange/50 backdrop-blur-md'}
                                    `}
                                >
                                    <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleCompare(product);
                                    }}
                                    className={`p-3 rounded-2xl border-2 transition-all shadow-lg flex items-center justify-center
                                        ${compareList.find((p: any) => p.id === product.id) ? 'bg-brand-blue border-brand-blue text-white shadow-brand-blue/30' : 'bg-white/80 border-gray-200 text-gray-500 hover:text-brand-blue hover:border-brand-blue/50 backdrop-blur-md'}
                                    `}
                                >
                                    <ArrowLeftRight size={20} />
                                </button>
                            </div>

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
                                            setIsZoomed(false);
                                        }}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-xl hover:bg-white rounded-2xl text-gray-900 shadow-xl border border-white/50 opacity-0 group-hover/gallery:opacity-100 transition-all z-20"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveImageIndex(prev => (prev + 1) % allImages.length);
                                            setIsZoomed(false);
                                        }}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/50 backdrop-blur-xl hover:bg-white rounded-2xl text-gray-900 shadow-xl border border-white/50 opacity-0 group-hover/gallery:opacity-100 transition-all z-20"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Bar */}
                        <div className="p-8 bg-white border-t border-gray-100 mt-auto">
                            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
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

                    {/* Right: Info Section */}
                    <div className="w-full lg:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col relative">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="px-4 py-1.5 bg-brand-blue/5 text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-brand-blue/10">
                                    {categoryName}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">In Stock</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-heading font-black italic text-gray-900 leading-none tracking-tighter mb-6">
                                {product.title}
                            </h1>
                            
                            <div className="flex items-center gap-3 font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg w-fit border border-gray-100">
                                <span className="text-brand-orange">ID:</span> {product.id.substring(0, 12).toUpperCase()}
                            </div>
                        </div>

                        <div className="space-y-12 flex-grow">
                            {/* Price Plate */}
                            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity">
                                    <Tag size={100} />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Price Estimate</p>
                                <div className="text-4xl font-black font-mono tracking-tighter text-brand-blue flex flex-col items-start gap-2">
                                    {product.enquiryOnly ? 
                                        <span className="text-2xl uppercase text-brand-orange bg-brand-orange/10 px-4 py-2 rounded-xl">Enquiry Only</span> 
                                        : (selectedVariant?.price || product.price || <span className="text-2xl text-gray-400 bg-gray-100 px-4 py-2 rounded-xl">Ask for Quote</span>)
                                    }
                                </div>
                            </div>

                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                            <div className="w-6 h-[1px] bg-gray-200"></div> {product.variantLabel || 'Available Options'}
                                        </label>
                                        {selectedVariant && (
                                            <button 
                                                onClick={() => { setSelectedVariant(null); setActiveImageIndex(0); }}
                                                className="text-[9px] font-black text-brand-orange uppercase tracking-widest hover:underline"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => {
                                                    setSelectedVariant(variant);
                                                    setActiveImageIndex(0);
                                                }}
                                                className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2
                                                    ${selectedVariant?.id === variant.id 
                                                        ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/20 scale-[1.02]' 
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-brand-orange/30 hover:text-brand-orange hover:bg-orange-50/30'}
                                                `}
                                            >
                                                {selectedVariant?.id === variant.id && <Check size={14} />}
                                                {variant.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Data Sheet */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-6 h-[1px] bg-gray-200"></div> Technical Details
                                </label>
                                <div className="prose prose-gray max-w-none text-gray-600 font-medium">
                                    <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                                </div>
                            </div>
                            
                            {/* Technical Advisor Hook */}
                            <div className="bg-brand-blue-dark text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group border border-white/10 mt-8">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,#F9731633,transparent_50%)]"></div>
                                <div className="absolute top-4 right-4 text-brand-orange/20 group-hover:scale-110 transition-transform">
                                    <MessageSquare size={64} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <h4 className="font-heading font-black italic text-2xl tracking-tighter">Need Technical Advice?</h4>
                                    <p className="text-sm text-gray-400 font-medium">Not sure if this fits your setup? Our AI engineer is ready.</p>
                                    <button 
                                        onClick={() => setIsAdvisorOpen(true)}
                                        className="bg-brand-orange text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-colors flex items-center gap-2 shadow-lg shadow-brand-orange/20"
                                    >
                                        <Sparkles size={16} /> Ask AI Engine
                                    </button>
                                </div>
                            </div>

                            {/* Video */}
                            {product.videoUrl && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                        <div className="w-6 h-[1px] bg-gray-200"></div> Media Guide
                                    </label>
                                    <div className="bg-black rounded-3xl overflow-hidden aspect-video relative group/video border-4 border-gray-100 shadow-xl">
                                        {(product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') || product.videoUrl.includes('vimeo.com')) ? (
                                            <iframe 
                                                src={product.videoUrl.includes('youtu.be') 
                                                    ? `https://www.youtube.com/embed/${product.videoUrl.split('/').pop()?.split('?')[0]}`
                                                    : product.videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                                                } 
                                                className="w-full h-full"
                                                title={product.videoTitle || 'Product Tutorial'}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video 
                                                src={product.videoUrl} 
                                                className="w-full h-full object-cover" 
                                                controls 
                                                playsInline
                                            />
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Sticky Action Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-100 space-y-4 sticky bottom-0 bg-white/95 backdrop-blur-xl z-20 pb-4">
                            {!product.enquiryOnly && (
                                <button 
                                    onClick={() => {
                                        addToCart({
                                            productId: product.id,
                                            productTitle: product.title,
                                            variantId: selectedVariant?.id,
                                            variantName: selectedVariant?.name,
                                            quantity: 1,
                                            price: selectedVariant?.price || product.price || '0',
                                            imageUrl: selectedVariant?.imageUrl || product.imageUrl
                                        });
                                    }}
                                    className="w-full py-6 bg-brand-blue text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-brand-blue/30 hover:bg-brand-orange hover:shadow-brand-orange/40 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <ShoppingBag size={20} /> Add to Cart
                                </button>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <a 
                                    href={`https://wa.me/${config?.whatsapp || '919021313113'}?text=Bhai, I need a quote for ${product.title}${selectedVariant ? ` (${product.variantLabel || 'Option'}: ${selectedVariant.name})` : ''} (Model Ref: ${product.id})`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-5 bg-green-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-600 hover:-translate-y-1 transition-all"
                                >
                                    <MessageSquare size={16} /> WhatsApp Quote
                                </a>
                                <button 
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }
                                    }}
                                    className={`py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-3
                                        ${copied ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 hover:bg-white hover:shadow-lg hover:border-gray-300 text-gray-700'}
                                    `}
                                >
                                    {copied ? <Check size={16} /> : <Share2 size={16} />} Share Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <TechnicalAdvisor 
                isOpen={isAdvisorOpen} 
                onClose={() => setIsAdvisorOpen(false)} 
                initialQuery={`I'm looking at the ${product.title}. Does it fit my requirements?`}
            />

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
