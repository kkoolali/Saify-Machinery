import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
    ShoppingBag, Search, Filter, 
    Calendar, User, Phone, MapPin, 
    ChevronDown, Trash2, CheckCircle, Clock, 
    Package, Truck, XCircle, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderItem {
    productId: string;
    productTitle: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
    price: string;
    imageUrl: string;
}

interface Order {
    id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    total: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: number;
}

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status });
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update status.");
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!window.confirm("Bhai, are you sure you want to delete this order record? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, 'orders', orderId));
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order.");
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusUI = (status: string) => {
        switch (status) {
            case 'pending': return { icon: Clock, color: 'bg-yellow-50 text-yellow-600 border-yellow-100', label: 'Pending Assessment' };
            case 'processing': return { icon: Package, color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Processing Technicals' };
            case 'shipped': return { icon: Truck, color: 'bg-purple-50 text-purple-600 border-purple-100', label: 'In Transit' };
            case 'delivered': return { icon: CheckCircle, color: 'bg-green-50 text-green-600 border-green-100', label: 'Delivered' };
            case 'cancelled': return { icon: XCircle, color: 'bg-red-50 text-red-600 border-red-100', label: 'Cancelled' };
            default: return { icon: Clock, color: 'bg-gray-50 text-gray-400 border-gray-100', label: status };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black italic text-gray-900 tracking-tight leading-none mb-2">Order Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Track and process your plumbing and machinery orders from visitors in Pulgaon.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by customer or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all w-full md:w-64 italic font-medium text-sm"
                        />
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-6 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-bold uppercase text-[10px] tracking-widest cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No active orders</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Wait for customers to place orders for plumbing, pump motors, or water tanks via the storefront.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredOrders.map((order) => {
                        const statusUI = getStatusUI(order.status);
                        const StatusIcon = statusUI.icon;
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <motion.div 
                                layout
                                key={order.id}
                                className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden
                                    ${isExpanded ? 'border-brand-blue shadow-2xl shadow-brand-blue/5' : 'border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange/20'}
                                `}
                            >
                                <div className="p-8 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${statusUI.color}`}>
                                            <StatusIcon size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-black text-gray-900 italic tracking-tight">{order.customer.name}</h3>
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium italic">
                                                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-orange" /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="flex items-center gap-1.5"><Package size={12} className="text-brand-blue" /> {order.items.length} Units</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order value</p>
                                            <p className="text-2xl font-black font-mono tracking-tighter text-brand-blue italic">{order.total}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                className={`p-4 rounded-2xl transition-all ${isExpanded ? 'bg-brand-blue text-white' : 'bg-gray-50 text-gray-400 hover:bg-brand-blue/5 hover:text-brand-blue'}`}
                                                title="View Technical Details"
                                            >
                                                {isExpanded ? <XCircle size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-gray-50 bg-gray-50/30"
                                        >
                                            <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                {/* Component Breakdown */}
                                                <div className="space-y-6">
                                                    <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[.3em] flex items-center gap-2">
                                                        <div className="w-8 h-[1px] bg-brand-orange/20"></div> Technical Payload
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm group">
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                                                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <p className="font-bold text-gray-900 text-sm line-clamp-1 italic">{item.productTitle}</p>
                                                                    {item.variantName && (
                                                                        <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest mt-1">{item.variantName}</p>
                                                                    )}
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.quantity} x {item.price}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Logistical Vector */}
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[.3em] flex items-center gap-2">
                                                            <div className="w-8 h-[1px] bg-brand-orange/20"></div> Delivery Vector
                                                        </h4>
                                                        <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
                                                            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><User size={16}/></div>
                                                                {order.customer.name}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={16}/></div>
                                                                {order.customer.phone}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={16}/></div>
                                                                {order.customer.address}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[.3em] flex items-center gap-2">
                                                            <div className="w-8 h-[1px] bg-brand-orange/20"></div> Status Control
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                                                                <button
                                                                    key={st}
                                                                    onClick={() => updateOrderStatus(order.id, st)}
                                                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                                                                        ${order.status === st 
                                                                            ? 'bg-gray-900 border-gray-900 text-white shadow-xl' 
                                                                            : 'bg-white border-gray-100 text-gray-400 hover:border-brand-blue/30 hover:text-brand-blue'}
                                                                    `}
                                                                >
                                                                    {st}
                                                                </button>
                                                            ))}
                                                            <button 
                                                                onClick={() => deleteOrder(order.id)}
                                                                className="ml-auto px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                                            >
                                                                <Trash2 size={12} /> Purge Order
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
