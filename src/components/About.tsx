import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Lightbulb, Users, ThumbsUp } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const About: React.FC = () => {
  const [config, setConfig] = useState({
    badge: 'About Us',
    title: 'Building Trust Since 2019',
    description: 'Saify Machinery is a trusted hardware and machinery store based in Pulgaon, Maharashtra, serving farmers, plumbers, contractors, and households with high-quality products and reliable service.',
    experienceTitle: 'Your One-Stop Solution',
    experienceDescription: 'We specialize in providing a complete range of plumbing materials, motor pumps, pipes, fittings, and hardware tools under one roof, making us a one-stop solution for all construction and agricultural needs.',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2062&auto=format&fit=crop',
    ownerName: 'Aliasgar Hakimuddin Saify'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return unsub;
  }, []);

  return (
    <section id="about" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-20 animate-in fade-in duration-700">
          <h2 className="text-xs font-black text-brand-orange uppercase tracking-[0.3em] mb-4">{config.badge}</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 mb-8 italic">
            {config.title}
          </h3>
          <div className="w-24 h-1.5 bg-brand-orange mx-auto mb-10 rounded-full"></div>
          <p className="text-xl text-gray-600 leading-relaxed font-medium italic">
            "{config.description}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
              <img
                src={config.image}
                alt="Saify Machinery Store"
                className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-10">
                <p className="text-white text-2xl font-black italic mb-2 tracking-tight">Owner: {config.ownerName}</p>
                <div className="flex gap-4 text-brand-orange text-sm font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2"><ThumbsUp size={18}/> 4.8 Rating (GMB)</span>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h4 className="text-2xl font-black text-gray-900 mb-6 italic tracking-tight">{config.experienceTitle}</h4>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                {config.experienceDescription || "We specialize in providing a complete range of plumbing materials, motor pumps, pipes, fittings, and hardware tools under one roof."}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Target size={30} />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2 italic">Our Vision</h5>
                  <p className="text-gray-600 font-medium">To become Pulgaon's most reliable hardware destination, prioritizing quality over everything else.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb size={30} />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2 italic">Our Commitment</h5>
                  <p className="text-gray-600 font-medium">Providing local farmers and contractors with high-performance tools that never let them down on the field.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Users size={30} />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2 italic">Who We Serve</h5>
                  <p className="text-gray-600 font-medium">Farmers, Plumbers, Contractors, Builders, and Pulgaon's local households.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
