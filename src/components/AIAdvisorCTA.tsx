import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Target, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIAdvisorCTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-brand-blue-dark">
      {/* Abstract Background Decals */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/20 rounded-full blur-[100px] -ml-40 -mb-40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            >
              <Sparkles size={16} className="text-brand-orange animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Intelligent Procurement</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black italic text-white leading-none tracking-tighter"
            >
              Don't know which <span className="text-brand-orange text-stroke-white">Pump</span> you need?
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg md:text-xl font-medium leading-relaxed italic"
            >
              Our "Saify Neural Engine" analyzes your technical requirements—building height, water source, or family size—and recommends the perfect machinery in seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link 
                to="/products" 
                className="w-full sm:w-auto px-10 py-5 bg-brand-orange text-white rounded-2xl font-black italic shadow-2xl shadow-brand-orange/30 hover:scale-105 transition-all text-center flex items-center justify-center gap-3"
              >
                Launch AI Advisor <ArrowRight size={20} />
              </Link>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-blue-dark bg-gray-800 flex items-center justify-center">
                    <HardHat size={16} className="text-gray-400" />
                  </div>
                ))}
                <span className="ml-4 text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center">Join 500+ Local Projects</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Feature Grid */}
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group"
              >
                <Zap size={30} className="text-brand-orange mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-white font-bold mb-2 italic">Instant Matching</h4>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest font-mono">Processing: 0.8s</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-brand-orange p-8 rounded-[2.5rem] shadow-2xl shadow-brand-orange/20"
              >
                <Target size={30} className="text-white mb-4" />
                <h4 className="text-white font-black italic mb-2">99% Accuracy</h4>
                <p className="text-brand-blue-dark text-[10px] uppercase font-black tracking-widest font-mono italic">Pulgaon Certified</p>
              </motion.div>
            </div>
            <div className="space-y-4 pt-12">
               <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-brand-blue p-8 rounded-[2.5rem] shadow-2xl shadow-brand-blue/20"
              >
                <Sparkles size={30} className="text-white mb-4" />
                <h4 className="text-white font-black italic mb-2">Technical AI</h4>
                <p className="text-white/50 text-[10px] uppercase font-black tracking-widest font-mono">Expert Neural V3</p>
              </motion.div>
               <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                   <Target size={120} className="text-white" />
                </div>
                <h4 className="text-white font-bold mb-2 italic">Data Driven</h4>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest font-mono italic">Verified Catalog</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
      `}</style>
    </section>
  );
}
