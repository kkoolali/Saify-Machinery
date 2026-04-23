import React, { useState } from 'react';
import { motion } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PhoneAuth from '../components/PhoneAuth';
import { 
    ShoppingBag, Trash2, Plus, Minus, ArrowRight,
    User, Mail, Phone, MapPin, CheckCircle, Loader2,
    ChevronLeft, Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const navigate = useNavigate();

    // Initialize with verified phone if user already has one
    useState(() => {
        if (user?.phoneNumber) {
            setIsPhoneVerified(true);
        }
    });

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: user?.phoneNumber || '',
        address: ''
    });

    // Sync phone if verification happens
    const handlePhoneSuccess = (verifiedNumber: string) => {
        setIsPhoneVerified(true);
        setCustomer(prev => ({ ...prev, phone: verifiedNumber }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        
        setLoading(true);
        try {
            const orderData = {
                customer,
                items: cart.map(item => ({
                    productId: item.productId,
                    productTitle: item.productTitle,
                    variantId: item.variantId || null,
                    variantName: item.variantName || null,
                    quantity: item.quantity,
                    price: item.price,
                    imageUrl: item.imageUrl
                })),
                total: cartTotal,
                status: 'pending',
                createdAt: Date.now()
            };

            await addDoc(collection(db, 'orders'), orderData);
            clearCart();
            setSubmitted(true);
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            console.error("Order submission failed:", error);
            alert("Order submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-6 mt-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-brand-blue/10 max-w-2xl w-full text-center border border-gray-100"
                    >
                        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="text-4xl font-heading font-black italic text-gray-900 mb-6 tracking-tighter">Order Received!</h2>
                        <p className="text-gray-500 text-lg mb-10 font-medium">Bhai, your industrial order has been registered. Our technical team will review the specifications and contact you shortly for fulfillment.</p>
                        <div className="space-y-4">
                            <Link 
                                to="/" 
                                className="inline-flex items-center gap-2 bg-brand-blue text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:scale-105 transition-all w-full justify-center"
                            >
                                Return to Home
                            </Link>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Redirecting in 5 seconds...</p>
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <main className="flex-grow pt-32 pb-20 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center gap-4 mb-10">
                        <Link to="/products" className="p-3 bg-white hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-brand-blue transition-all border border-gray-100 shadow-sm">
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-heading font-black italic text-gray-900 leading-none tracking-tighter">Review Your Order</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{cartCount} Technical Items Selected</p>
                        </div>
                    </div>

                    {cart.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag size={32} className="text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order engine is empty</h2>
                            <p className="text-gray-500 max-w-xs mx-auto mb-10">Go back to the catalog and select the plumbing or machinery components you need.</p>
                            <Link to="/products" className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-orange/20 hover:scale-105 transition-all">
                                Browse Catalog <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Items List */}
                            <div className="lg:col-span-7 space-y-4">
                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                            <ShoppingBag size={16} /> Component List
                                        </h3>
                                        <button onClick={clearCart} className="text-[10px] font-black text-gray-400 hover:text-brand-orange uppercase tracking-widest transition-colors flex items-center gap-1.5">
                                            <Trash2 size={12} /> Clear Engine
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {cart.map((item) => (
                                            <div key={item.id} className="p-8 flex items-center gap-6 group hover:bg-gray-50/30 transition-colors">
                                                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-inner border border-gray-100">
                                                    <img src={item.imageUrl} alt={item.productTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-grow space-y-1">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-1 italic">{item.productTitle}</h4>
                                                    {item.variantName && (
                                                        <p className="text-[10px] font-black text-brand-orange uppercase tracking-[.15em] flex items-center gap-1.5">
                                                            <CheckCircle size={10} /> {item.variantName}
                                                        </p>
                                                    )}
                                                    <p className="text-brand-blue font-mono font-black tracking-tighter text-lg">{item.price}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-10 text-center font-black font-mono text-sm">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-8 bg-brand-blue-dark text-white flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-[.3em] opacity-60">Estimated Total</span>
                                        <span className="text-3xl font-black font-mono tracking-tighter italic">{cartTotal}</span>
                                    </div>
                                </div>

                                <Link to="/products" className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors group py-4">
                                    <Plus size={12} className="group-hover:rotate-90 transition-transform" /> Add more components to this order
                                </Link>
                            </div>

                            {/* Checkout Form or Phone Auth */}
                            <div className="lg:col-span-5">
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-blue/5 border border-gray-100 overflow-hidden sticky top-32"
                                >
                                    {!isPhoneVerified ? (
                                        <div className="p-10">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl">
                                                    <Lock size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-heading font-black italic text-gray-900 tracking-tight leading-none mb-1">Authorization Center</h3>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verify identity to unlock order engine</p>
                                                </div>
                                            </div>
                                            <PhoneAuth onSuccess={handlePhoneSuccess} />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-10 bg-gray-50/50 border-b border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-2xl font-heading font-black italic text-gray-900 tracking-tighter leading-none">Delivery Details</h3>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100">
                                                        <CheckCircle size={10} /> Verified
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enter valid shipping credentials</p>
                                            </div>
                                            <form onSubmit={handleSubmit} className="p-10 space-y-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <User size={12} className="text-brand-orange" /> Full Name
                                                    </label>
                                                    <input 
                                                        required
                                                        type="text"
                                                        name="name"
                                                        value={customer.name}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter your name"
                                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all outline-none font-medium italic"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Mail size={12} className="text-brand-orange" /> Email Address
                                                        </label>
                                                        <input 
                                                            required
                                                            type="email"
                                                            name="email"
                                                            value={customer.email}
                                                            onChange={handleInputChange}
                                                            placeholder="mail@shope.com"
                                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all outline-none font-medium italic"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Phone size={12} className="text-brand-orange" /> Phone Number
                                                        </label>
                                                        <input 
                                                            disabled
                                                            type="tel"
                                                            name="phone"
                                                            value={customer.phone}
                                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-gray-100 transition-all outline-none font-black italic tracking-widest text-gray-400 opacity-70"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <MapPin size={12} className="text-brand-orange" /> Delivery Address
                                                    </label>
                                                    <textarea 
                                                        required
                                                        name="address"
                                                        value={customer.address}
                                                        onChange={handleInputChange}
                                                        rows={3}
                                                        placeholder="Full site address or warehouse location"
                                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all outline-none font-medium italic resize-none"
                                                    />
                                                </div>

                                                <div className="pt-4">
                                                    <button 
                                                        disabled={loading}
                                                        type="submit"
                                                        className="w-full py-6 bg-brand-orange text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-brand-orange/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <Loader2 size={24} className="animate-spin" />
                                                                Processing Order...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Finalize Order <ArrowRight size={20} />
                                                            </>
                                                        )}
                                                    </button>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase text-center mt-6 tracking-widest leading-relaxed">
                                                        By finalizing, you agree to our <span className="text-brand-blue decoration-dotted underline cursor-help">Technical Fulfillment Policy</span>. <br/>
                                                        Payment will be settled offline post technical verification.
                                                    </p>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
