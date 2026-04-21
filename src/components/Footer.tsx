import { useState, useEffect } from 'react';
import { Hammer, Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Footer() {
  const [config, setConfig] = useState({
    storeName: 'Saify Machinery',
    gstNumber: '27CHCPS0273C1ZK',
    footerDescription: "Pulgaon's trusted wholesale and retail hardware, plumbing, and machinery store since 2019. Your one-stop solution for all construction and agricultural needs.",
    socials: {
      facebook: '',
      instagram: '',
      youtube: ''
    }
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return unsub;
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-20 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div className="space-y-6">
            <a href="#home" className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20">
                <Hammer size={26} />
              </div>
              <h2 className="font-heading font-black text-2xl leading-tight text-white tracking-tight italic">
                {config.storeName}
              </h2>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              {config.footerDescription}
            </p>
            <div className="pt-2">
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Business Registration</p>
               <p className="text-sm font-black text-brand-orange tracking-wider italic">GST: {config.gstNumber}</p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              {config.socials.facebook && (
                <a href={config.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all text-gray-400 border border-gray-700/50" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {config.socials.instagram && (
                <a href={config.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-gray-400 border border-gray-700/50" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {config.socials.youtube && (
                <a href={config.socials.youtube} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-gray-400 border border-gray-700/50" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-black italic uppercase tracking-widest text-xs border-l-4 border-brand-orange pl-3">Quick Navigation</h3>
            <ul className="space-y-4">
              <li><a href="#home" className="text-gray-400 hover:text-brand-orange font-bold italic transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-700 group-hover:bg-brand-orange rounded-full transition-all"></span> Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-brand-orange font-bold italic transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-700 group-hover:bg-brand-orange rounded-full transition-all"></span> About Us</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-brand-orange font-bold italic transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-700 group-hover:bg-brand-orange rounded-full transition-all"></span> Our Catalog</a></li>
              <li><a href="#brands" className="text-gray-400 hover:text-brand-orange font-bold italic transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-700 group-hover:bg-brand-orange rounded-full transition-all"></span> Top Brands</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-brand-orange font-bold italic transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-700 group-hover:bg-brand-orange rounded-full transition-all"></span> Contact Support</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-black italic uppercase tracking-widest text-xs border-l-4 border-brand-blue pl-3">Service Reach</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium capitalize">
              Proudly serving Pulgaon, Wardha, and nearby rural areas. We support local farmers, plumbers, contractors, builders, and households with authentic industrial solutions.
            </p>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 animate-pulse-slow">
               <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">Operational Since</p>
               <p className="text-2xl font-black text-white italic">2019-Present</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 font-bold tracking-wider uppercase">&copy; {new Date().getFullYear()} {config.storeName}. Pulgaon Hardware Hub.</p>
        </div>
      </div>
    </footer>
  );
}

