import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, Info, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import { getTechnicalAdvice, RecommendationResponse } from '../services/geminiService';

interface TechnicalAdvisorProps {
  products: any[];
  onClose?: () => void;
  onSelectProduct?: (product: any) => void;
}

export default function TechnicalAdvisor({ products, onClose, onSelectProduct }: TechnicalAdvisorProps) {
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getTechnicalAdvice(requirements, products);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Something went wrong with the AI Engine. Please try again Bhai!");
    } finally {
      setLoading(false);
    }
  };

  const QuickTags = [
    "Pump for 3-story building",
    "Water tank for family of 5",
    "Irrigation pump for farm",
    "Loft tank for flat",
    "Submersible pump for borewell"
  ];

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black italic text-gray-900 leading-none">Technical AI Advisor</h3>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-black">Saify Intelligent Hub</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {!result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10">
              <p className="text-sm font-medium text-blue-900/70 leading-relaxed italic">
                "Bhai, tell me what you need! For pumps, mention the total height (feet) or your house structure. For tanks, tell me how many people live in your house."
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Describe Requirements</label>
                <div className="relative">
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="E.g., I need a pump for a 2-story house to pull water from a ground tank to the roof..."
                    className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-brand-orange/30 focus:ring-4 focus:ring-brand-orange/5 outline-none transition-all text-sm font-bold min-h-[150px] resize-none"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                    <Info size={12} />
                    Technical Details Preferred
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quick Start Templates</p>
                <div className="flex flex-wrap gap-2">
                  {QuickTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setRequirements(tag)}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-shake">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !requirements.trim()}
                className="w-full py-5 bg-brand-orange text-white rounded-[1.5rem] font-black italic shadow-xl shadow-brand-orange/20 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing Data Sheet...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Get Expert Recommendation
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            {/* AI Advice Card */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <div className="w-6 h-[1px] bg-gray-200"></div> AI Recommendation logic
              </label>
              <div className="bg-brand-blue-dark text-white p-8 rounded-[2rem] relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 text-white/10" size={60} />
                <p className="text-lg font-medium leading-relaxed italic relative z-10 whitespace-pre-wrap">
                  {result.advice}
                </p>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <div className="w-6 h-[1px] bg-gray-200"></div> Best Matches found
              </label>
              <div className="grid grid-cols-1 gap-4">
                {result.recommendations.map((rec, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-brand-orange/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-gray-900">{rec.productTitle}</h4>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full border border-green-100">
                          <CheckCircle2 size={12} />
                          <span className="text-[9px] font-black">{rec.matchScore}% Match</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium italic leading-relaxed pr-4">
                        {rec.reason}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const product = products.find(p => p.id === (rec as any).productId || p.title === rec.productTitle);
                        if (product && onSelectProduct) {
                          onSelectProduct(product);
                        }
                        if (onClose) onClose();
                      }}
                      className="px-6 py-3 bg-gray-50 group-hover:bg-brand-orange group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 flex items-center gap-2"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-brand-orange"
            >
              Start New Analysis
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center gap-2">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300">Powered by Saify Machinery Neural Engine</span>
      </div>
    </div>
  );
}
