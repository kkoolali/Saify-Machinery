import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Brand {
  docId: string;
  name: string;
  logo: string;
  website?: string;
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as Brand[];
      setBrands(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const nextSlide = () => {
    if (brands.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % brands.length);
  };

  const prevSlide = () => {
    if (brands.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + brands.length) % brands.length);
  };

  useEffect(() => {
    if (brands.length <= 1) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [brands.length]);

  return (
    <section id="brands" className="py-24 bg-brand-blue-dark text-white relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xs font-black text-brand-orange uppercase tracking-[0.3em] mb-4">Trusted Quality</h2>
            <h3 className="text-4xl md:text-6xl font-heading font-black mb-8 italic tracking-tight">
              Certifications <span className="text-brand-orange">&</span> Top Brands
            </h3>
            <div className="w-24 h-1.5 bg-brand-orange mb-10 rounded-full"></div>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 font-medium italic">
              "We partner with industry-leading manufacturers like TEXMO to ensure our customers receive only the best, most durable products available in the market."
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all border border-white/5">
                  <Award size={28} className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 italic">Authorized Distributor</h4>
                  <p className="text-gray-400 font-medium">Texmo Pipes & Products Limited</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all border border-white/5">
                  <ShieldCheck size={28} className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1 italic">Performance Awards</h4>
                  <p className="text-gray-400 font-medium">Recognized for excellence in retail supply across Pulgaon region.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Carousel Container */}
            <div className="relative w-full max-w-lg mx-auto group">
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-[16/10] bg-white p-12 shadow-2xl border-4 border-white/10">
                {loading ? (
                   <div className="absolute inset-0 flex items-center justify-center text-brand-blue-dark"><Loader2 className="animate-spin" size={40} /></div>
                ) : brands.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                      className="absolute inset-0 flex items-center justify-center p-12"
                    >
                      <img 
                        src={brands[currentIndex].logo} 
                        alt={brands[currentIndex].name} 
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic font-medium">Partner Logos Coming Soon...</div>
                )}
              </div>

              {/* Navigation Arrows */}
              {brands.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 focus:outline-none z-20 hover:scale-110 active:scale-95"
                    aria-label="Previous Brand"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 focus:outline-none z-20 hover:scale-110 active:scale-95"
                    aria-label="Next Brand"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Indicators */}
              <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-4">
                {brands.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === index ? 'w-8 bg-brand-orange' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-20 w-full max-w-lg text-center">
              <a 
                href="#products" 
                className="inline-flex items-center justify-center w-full px-10 py-5 text-lg font-black italic text-brand-blue-dark bg-white rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1 group"
              >
                View Premium Partner Brands
                <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
