import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow pt-32 pb-20 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-heading font-black italic text-gray-900 tracking-tighter">Your Wishlist</h1>
                            <p className="text-gray-500 font-medium mt-2">Saved technical components and machinery for future reference.</p>
                        </div>
                        {wishlist.length > 0 && (
                            <button 
                                onClick={clearWishlist}
                                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange flex items-center gap-2 transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
                            >
                                <Trash2 size={16} /> Clear List
                            </button>
                        )}
                    </div>

                    {wishlist.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Heart size={40} className="text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 max-w-sm mx-auto mb-10">You haven't saved any pumps, motors, or fittings yet. Browse our catalog to find what you need.</p>
                            <Link to="/products" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Go to Catalog <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlist.map((item, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={item.id}
                                    className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group relative"
                                >
                                    <Link to={`/products?item=${item.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>
                                    <button 
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-xl text-brand-orange shadow-lg hover:bg-brand-orange hover:text-white transition-all z-10"
                                        title="Remove from Wishlist"
                                    >
                                        <Heart size={16} className="fill-current" />
                                    </button>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-brand-blue transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-brand-blue font-mono font-black italic tracking-tighter text-lg mt-auto">
                                            {item.price || 'Enquire'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
