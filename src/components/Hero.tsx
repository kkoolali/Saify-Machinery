import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Wrench, Droplet, Zap, Loader2 } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Hero: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    title: 'Complete Plumbing & Machinery Solutions Under One Roof',
    description: 'Quality Products. Best Prices. Trusted Service. Serving farmers, plumbers, contractors, and households since 2019.',
    backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=2070&auto=format&fit=crop',
    ctaText: 'Explore Products',
    badgeText: "Pulgaon's Trusted Hardware Partner"
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={config.backgroundImage}
          alt="Industrial equipment"
          className="w-full h-full object-cover transition-opacity duration-1000"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-brand-blue-dark/80 bg-gradient-to-r from-brand-blue-dark/95 to-brand-blue/60 mix-blend-multiply"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              {config.badgeText}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black italic text-white leading-tight mb-6">
              {config.title.split('&').map((text, i, arr) => (
                <React.Fragment key={i}>
                  {text}
                  {i < arr.length - 1 && <span className="text-brand-orange">&</span>}
                </React.Fragment>
              ))}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              {config.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="bg-brand-orange hover:bg-brand-orange-light text-white px-8 py-4 rounded-xl font-bold italic transition-all flex items-center gap-2 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {config.ctaText}
                <ArrowRight size={20} />
              </a>
              <a
                href="#contact"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold italic transition-all backdrop-blur-sm text-lg"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-16 max-w-4xl"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-brand-orange/20 rounded-lg text-brand-orange shrink-0">
              <Wrench size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Hardware & Tools</h3>
              <p className="text-gray-300 text-sm">Comprehensive range of hand and power tools.</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-blue-400/20 rounded-lg text-blue-300 shrink-0">
              <Droplet size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Pumps & Pipes</h3>
              <p className="text-gray-300 text-sm">Authorized Texmo dealer in Pulgaon.</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-green-400/20 rounded-lg text-green-300 shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Electrical</h3>
              <p className="text-gray-300 text-sm">Quality items for all your needs.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
