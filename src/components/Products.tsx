import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Droplet, Wrench, Sprout, Zap, CheckCircle2, Loader2, ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react';

const iconMap: Record<string, any> = { Droplet, Wrench, Sprout, Zap };

const localCategories = [
  // ... local categories same as before as fallback
  {
    id: 'plumbing',
    title: 'Hardware & Plumbing',
    icon: Droplet,
    color: 'bg-blue-50 text-brand-blue',
    items: [
      'PVC / UPVC / CPVC Pipes & Fittings',
      'Bathroom fittings & sanitary items',
      'Valves, taps, connectors',
      'Adhesives, sealants'
    ],
    images: [
      'https://picsum.photos/seed/plumbing1/1200/800',
      'https://picsum.photos/seed/faucet1/1200/800',
      'https://picsum.photos/seed/valves/1200/800'
    ]
  },
  {
    id: 'water',
    title: 'Water & Pump Solutions',
    icon: Sprout,
    color: 'bg-green-50 text-green-600',
    items: [
      'Water tanks (1000L & more)',
      'Agricultural motor pumps',
      'Submersible pumps',
      'Quality Pipe systems'
    ],
    images: [
      'https://picsum.photos/seed/waterpump1/1200/800',
      'https://picsum.photos/seed/watertank1/1200/800',
      'https://picsum.photos/seed/irrigation1/1200/800'
    ]
  },
  {
    id: 'tools',
    title: 'Tools & Equipment',
    icon: Wrench,
    color: 'bg-orange-50 text-brand-orange',
    items: [
      'Hand tools & power tools',
      'Chain saws & sprayers',
      'Agricultural tools',
      'Construction equipment'
    ],
    images: [
      'https://picsum.photos/seed/tools1/1200/800',
      'https://picsum.photos/seed/drill1/1200/800',
      'https://picsum.photos/seed/hammer1/1200/800'
    ]
  },
  {
    id: 'other',
    title: 'Other Products',
    icon: Zap,
    color: 'bg-purple-50 text-purple-600',
    items: [
      'Electrical items',
      'Cleaning products',
      'Household hardware',
      'Fasteners & Screws'
    ],
    images: [
      'https://picsum.photos/seed/electrical1/1200/800',
      'https://picsum.photos/seed/cleaning1/1200/800',
      'https://picsum.photos/seed/screws1/1200/800'
    ]
  }
];

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  
  // Modal & Carousel State
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('id'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = doc.data();
        return {
          ...item,
          icon: iconMap[item.icon] || iconMap['Wrench']
        };
      });
      
      if (data.length > 0) {
        setProducts(data);
      } else {
        setProducts(localCategories);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Keyboard navigation for the modal carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCategory) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory]);

  const openModal = (category: any) => {
    setSelectedCategory(category);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden'; // prevent scrolling
  };

  const closeModal = () => {
    setSelectedCategory(null);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedCategory.images.length);
    }
  };

  const prevImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedCategory.images.length) % selectedCategory.images.length);
    }
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">Our Catalog</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Products & Gallery
          </h3>
          <div className="w-20 h-1 bg-brand-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600">
            Click on any category below to browse our complete image gallery and range of hardware solutions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <Loader2 size={48} className="text-brand-orange animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Loading categories & galleries...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => openModal(category)}
                  className="bg-white border text-left border-gray-100 flex flex-col rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all hover:border-brand-blue/30 group cursor-pointer relative overflow-hidden"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${category.color}`}>
                    <Icon size={28} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h4>
                  
                  <ul className="space-y-3 mb-6 relative z-10 flex-grow">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2 text-brand-orange font-medium text-sm group-hover:text-brand-orange-light transition-colors relative z-10">
                    <ImageIcon size={18} />
                    View Image Gallery
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-gray-900 hover:bg-brand-blue text-white px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer shadow-lg"
          >
            Inquire For Bulk Orders
          </a>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-12">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-sm transition-colors md:bg-gray-100 md:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Carousel Section */}
              <div className="w-full md:w-3/5 relative bg-gray-100 min-h-[300px] h-64 md:h-auto group flex items-center justify-center">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={selectedCategory.images[currentImageIndex]}
                    alt={`${selectedCategory.title} image ${currentImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full md:absolute inset-0 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none md:-ml-2 md:group-hover:ml-0 hidden sm:flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none md:-mr-2 md:group-hover:mr-0 hidden sm:flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Mobile arrows (always visible on small screens) */}
                <div className="sm:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
                  <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 bg-white/60 rounded-full text-gray-900"><ChevronLeft size={20} /></button>
                  <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 bg-white/60 rounded-full text-gray-900"><ChevronRight size={20} /></button>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                  {selectedCategory.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                      className={`w-2.5 h-2.5 rounded-full transition-all focus:outline-none ${
                        currentImageIndex === idx ? 'bg-white w-6 shadow-[0_0_5px_rgba(0,0,0,0.5)]' : 'bg-white/50 hover:bg-white/90 shadow-sm'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col overflow-y-auto">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shrink-0 ${selectedCategory.color}`}>
                  <selectedCategory.icon size={28} />
                </div>
                
                <h4 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                  {selectedCategory.title}
                </h4>
                
                <div className="flex-grow">
                  <h5 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Available Hardware</h5>
                  <ul className="space-y-4">
                    {selectedCategory.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 border-b border-gray-50 pb-3 last:border-0">
                        <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500 mb-4">Need to see these products in person? Visit our store in Pulgaon.</p>
                  <a
                    href="#contact"
                    onClick={closeModal}
                    className="w-full inline-flex justify-center items-center py-3.5 px-6 rounded-lg bg-gray-900 hover:bg-brand-blue text-white font-medium transition-colors"
                  >
                    Contact For Pricing
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
