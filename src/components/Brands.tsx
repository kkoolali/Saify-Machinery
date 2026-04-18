import { motion } from 'motion/react';
import { Award, ShieldCheck } from 'lucide-react';

export default function Brands() {
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
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Brand Cards */}
            <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center aspect-video hover:scale-105 transition-transform duration-300">
              {/* Texmo Pipes Logo */}
              <img 
                src="https://texmopipe.com/wp-content/uploads/2022/10/Texmo-logo-2022-1.png" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/texmo-logo.png"; // User can drag their logo here
                }}
                alt="Texmo Pipes and Products Limited" 
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            
            <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center aspect-video hover:scale-105 transition-transform duration-300">
               <h3 className="text-3xl font-black text-blue-800 tracking-tighter uppercase text-center">Ajanta</h3>
              <p className="text-gray-500 font-bold mt-1 tracking-widest text-sm">PUMPS</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 flex items-center justify-center aspect-video hover:scale-105 transition-transform duration-300">
               <h3 className="text-3xl font-black text-red-600 tracking-tighter uppercase text-center">Viking</h3>
            </div>
            
            <div className="bg-white rounded-xl p-8 flex items-center justify-center aspect-video hover:scale-105 transition-transform duration-300">
               <h3 className="text-2xl font-black text-gray-800 text-center uppercase tracking-wider">Premium<br/><span className="text-brand-orange text-lg">Brands</span></h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
