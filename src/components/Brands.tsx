import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const carouselItems = [
  {
    id: "texmo",
    content: (
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center aspect-[16/9] w-full h-full shadow-2xl border border-gray-100">
        <img 
          src="https://texmopipe.com/wp-content/uploads/2022/10/Texmo-logo-2022-1.png" 
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/texmo-logo.png";
          }}
          alt="Texmo Pipes and Products Limited" 
          className="w-full h-full object-contain drop-shadow-sm"
          loading="lazy"
        />
      </div>
    )
  },
  {
    id: "ajanta",
    content: (
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center aspect-[16/9] w-full h-full shadow-2xl border border-gray-100">
        <div className="text-center flex flex-col items-center justify-center w-full h-full">
          <h3 className="text-5xl md:text-6xl font-black text-blue-800 tracking-tighter uppercase" style={{ fontFamily: 'Arial Black, Impact, sans-serif'}}>Ajanta</h3>
          <p className="text-blue-600 font-bold mt-2 tracking-[0.3em] text-lg uppercase">Pumps</p>
        </div>
      </div>
    )
  },
  {
    id: "viking",
    content: (
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center aspect-[16/9] w-full h-full shadow-2xl border border-gray-100">
        <div className="text-center flex flex-col items-center justify-center w-full h-full">
          <h3 className="text-5xl md:text-6xl font-black text-red-600 tracking-tighter uppercase italic" style={{ fontFamily: 'Arial Black, Impact, sans-serif'}}>Viking</h3>
          <p className="text-gray-800 font-bold mt-2 tracking-widest text-sm uppercase border-t-2 border-red-600 pt-2">Water Pumps</p>
        </div>
      </div>
    )
  }
];

export default function Brands() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="brands" className="py-20 bg-brand-blue-dark text-white relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">Trusted Quality</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Certifications & Top Brands
            </h3>
            <div className="w-20 h-1 bg-brand-orange mb-8 rounded-full"></div>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              We partner with industry-leading manufacturers to ensure our customers receive only the best, most durable products available in the market.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Award size={24} className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Authorized Distributor</h4>
                  <p className="text-gray-400">Texmo Pipes & Products</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} className="text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Performance Awards</h4>
                  <p className="text-gray-400">Recognized performance award from Ajanta Pumps & others.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Carousel Container */}
            <div className="relative w-full max-w-lg mx-auto group">
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9] shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    {carouselItems[currentIndex].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-600 focus:outline-none z-20"
                aria-label="Previous Brand"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-600 focus:outline-none z-20"
                aria-label="Next Brand"
              >
                <ChevronRight size={20} />
              </button>

              {/* Indicators */}
              <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-3">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentIndex === index ? 'bg-brand-orange' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-16 w-full max-w-lg text-center">
              <a 
                href="#products" 
                className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold text-brand-blue-dark bg-white rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl group"
              >
                View All Premium Brands
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
