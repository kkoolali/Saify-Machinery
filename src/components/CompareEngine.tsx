import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCompare } from '../context/CompareContext';
import { Scale, ArrowRight, X } from 'lucide-react';

export default function CompareEngine() {
    const { 
        compareList, 
        toggleCompare, 
        clearCompare, 
        showCompareModal, 
        setShowCompareModal 
    } = useCompare();
    
    const [categories, setCategories] = useState<any[]>([]);
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        // Fetch Global Config
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
                    title: doc.data().title 
                })));
            }
        );

        return () => unsubCats();
    }, []);

    if (compareList.length === 0 && !showCompareModal) return null;

    return (
        <>
            {/* Comparison Floating Bar */}
            <AnimatePresence>
                {compareList.length > 0 && !showCompareModal && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl"
                    >
                        <div className="bg-brand-blue-dark text-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6 border border-white/10 backdrop-blur-xl">
                            <div className="flex items-center gap-4 pl-4">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <Scale size={20} className="text-brand-orange" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Product Engine Comparison</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{compareList.length} Models Selected for evaluation</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={clearCompare}
                                    className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                >
                                    Clear All
                                </button>
                                <button 
                                    onClick={() => setShowCompareModal(true)}
                                    className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 shadow-xl shadow-brand-orange/20 transition-all flex items-center gap-3"
                                >
                                    Compare Now <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Modal */}
            <AnimatePresence>
                {showCompareModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCompareModal(false)}
                            className="absolute inset-0 bg-brand-blue-dark/95 backdrop-blur-xl"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-7xl h-full max-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl"
                        >
                            <div className="p-6 md:p-10 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl">
                                        <Scale size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-heading font-black italic tracking-tight">Side-by-Side Comparison</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Evaluating technical performance and value</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowCompareModal(false)}
                                    className="p-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-x-auto p-6 md:p-10">
                                <div className="min-w-[800px] h-full">
                                    <div className="grid grid-cols-5 gap-8 h-full">
                                        {/* Row Headers */}
                                        <div className="col-span-1 space-y-20 pt-60">
                                            <div className="border-l-4 border-brand-orange pl-6 py-2">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Specification</p>
                                                <p className="text-lg font-black italic">Category</p>
                                            </div>
                                            <div className="border-l-4 border-brand-orange pl-6 py-2">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Specification</p>
                                                <p className="text-lg font-black italic">Price Guide</p>
                                            </div>
                                            <div className="border-l-4 border-brand-orange pl-6 py-2">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Specification</p>
                                                <p className="text-lg font-black italic">Data Sheet</p>
                                            </div>
                                        </div>

                                        {/* Products */}
                                        {compareList.map((prod) => (
                                            <div key={prod.id} className="col-span-1 flex flex-col items-center text-center p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 group relative">
                                                <button 
                                                    onClick={() => toggleCompare(prod)}
                                                    className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-gray-100"
                                                >
                                                    <X size={14} />
                                                </button>

                                                <div className="w-full aspect-square rounded-3xl overflow-hidden mb-8 border-4 border-white shadow-xl">
                                                    <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                                                </div>
                                                
                                                <h3 className="text-xl font-black italic tracking-tight mb-4 min-h-[3rem] leading-none">
                                                    {prod.title}
                                                </h3>

                                                <div className="w-full h-[1px] bg-gray-200 mb-10"></div>

                                                <div className="space-y-20 w-full">
                                                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                                        <span className="text-[10px] font-black uppercase text-brand-orange tracking-widest px-3 py-1 bg-brand-orange/5 rounded-full border border-brand-orange/10">
                                                            {categories.find(c => c.id === prod.categoryId)?.title || 'Featured'}
                                                        </span>
                                                    </div>

                                                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                                        <p className="text-xl font-black font-mono tracking-tighter text-brand-blue">
                                                            {prod.enquiryOnly ? 'Enquiry Only' : (prod.price || 'Ask Quote')}
                                                        </p>
                                                    </div>

                                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 text-left">
                                                        <p className="text-xs text-gray-500 font-medium leading-relaxed italic line-clamp-6">
                                                            {prod.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-12 w-full">
                                                    <a 
                                                        href={`https://wa.me/${config?.whatsapp || '919021313113'}?text=Bhai, I want to discuss the ${prod.title} comparison.`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full py-4 bg-brand-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 shadow-lg shadow-brand-orange/10 transition-all"
                                                    >
                                                        Request Detailed Quote
                                                    </a>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Placeholder slots to maintain grid structure */}
                                        {compareList.length < 4 && Array.from({ length: 4 - compareList.length }).map((_, i) => (
                                            <div key={`empty-${i}`} className="col-span-1 flex flex-col items-center justify-center p-10 bg-gray-50/20 rounded-[2.5rem] border border-dashed border-gray-200 opacity-50">
                                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300 mb-4">
                                                    <Scale size={32} />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Add Model to Compare</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
