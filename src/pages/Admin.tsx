import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logout, db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { LayoutDashboard, ShoppingBag, MessageSquare, Star, Settings, LogOut, ChevronRight, Layout, BookOpen, Globe, Award, Menu, X } from 'lucide-react';

// Subcomponents
import Login from './Admin/Login';
import AccessDenied from './Admin/AccessDenied';
import ManageProducts from './Admin/ManageProducts';
import ManageInquiries from './Admin/ManageInquiries';
import ManageTestimonials from './Admin/ManageTestimonials';
import ManageHero from './Admin/ManageHero';
import ManageAbout from './Admin/ManageAbout';
import ManageFeaturedProducts from './Admin/ManageFeaturedProducts';
import ManageBrands from './Admin/ManageBrands';
import ManageGlobalSettings from './Admin/ManageGlobalSettings';
import ManageIndividualProducts from './Admin/ManageIndividualProducts';

const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hero' | 'about' | 'products' | 'catalog' | 'featured' | 'testimonials' | 'brands' | 'inquiries' | 'settings'>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    products: 0,
    catalog: 0,
    inquiries: 0,
    testimonials: 0,
    rating: 4.8
  });

  useEffect(() => {
    if (!isAdmin) return;

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      let totalItems = 0;
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (Array.isArray(data.items)) {
          totalItems += data.items.length;
        }
      });
      setStats(prev => ({ ...prev, products: totalItems }));
    });

    const unsubCatalog = onSnapshot(collection(db, 'products'), (snapshot) => {
      setStats(prev => ({ ...prev, catalog: snapshot.size }));
    });

    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      setStats(prev => ({ ...prev, inquiries: snapshot.size }));
    });

    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      setStats(prev => ({ ...prev, testimonials: snapshot.size }));
    });

    return () => {
      unsubCategories();
      unsubCatalog();
      unsubInquiries();
      unsubTestimonials();
    };
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  // State 1: Not Logged In
  if (!user) {
    return <Login />;
  }

  // State 2: Logged In but Not Admin
  if (!isAdmin) {
    return <AccessDenied email={user.email} />;
  }

  // State 3: Logged In & Admin (Dashboard)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'System' },
    { id: 'hero', label: 'Hero Section', icon: Layout, group: 'Pages' },
    { id: 'about', label: 'About Us', icon: BookOpen, group: 'Pages' },
    { id: 'featured', label: 'Featured Grid', icon: Award, group: 'Pages' },
    { id: 'products', label: 'Catalog Categories', icon: BookOpen, group: 'Inventory' },
    { id: 'catalog', label: 'Catalog Products', icon: ShoppingBag, group: 'Inventory' },
    { id: 'brands', label: 'Brand Logos', icon: Globe, group: 'Inventory' },
    { id: 'inquiries', label: 'Customer Messages', icon: MessageSquare, group: 'CRM' },
    { id: 'testimonials', label: 'Reviews', icon: Star, group: 'CRM' },
    { id: 'settings', label: 'Store Config', icon: Settings, group: 'System' },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-gray-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          ${isSidebarOpen ? 'md:w-64 w-64' : 'md:w-20 w-64'}
        `}
      >
        <div className="p-6 flex items-center justify-between gap-3 md:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-brand-orange p-2 rounded-lg shrink-0">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <span className={`font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis italic ${!isSidebarOpen ? 'md:hidden' : ''}`}>
              Saify Admin
            </span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow pt-4 overflow-y-auto no-scrollbar">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-6">
              <p className={`px-6 mb-2 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ${!isSidebarOpen ? 'md:hidden' : ''}`}>
                {group}
              </p>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileOpen(false);
                    }}
                    title={item.label}
                    className={`w-full flex items-center gap-4 px-6 py-3 transition-all relative group ${
                      activeTab === item.id 
                        ? 'text-white' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    {activeTab === item.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>
                    )}
                    <Icon size={20} className={`shrink-0 ${activeTab === item.id ? 'text-brand-orange' : ''} ${!isSidebarOpen ? 'md:mx-auto' : ''}`} />
                    <span className={`font-medium text-sm whitespace-nowrap ${activeTab === item.id ? 'font-bold' : ''} ${!isSidebarOpen ? 'md:hidden' : ''}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen ? 'md:justify-center' : ''}`}>
            {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border border-gray-700 shrink-0" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center font-bold text-white italic shrink-0">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
            )}
            <div className={`overflow-hidden ${!isSidebarOpen ? 'md:hidden' : ''}`}>
              <p className="text-sm font-bold truncate text-white">{user.displayName || 'Bhai'}</p>
              <p className="text-[10px] text-gray-500 truncate lowercase">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-2 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${!isSidebarOpen ? 'md:justify-center' : ''}`}
            title="Logout"
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`font-bold text-sm ${!isSidebarOpen ? 'md:hidden' : ''}`}>Logout</span>
          </button>
        </div>
        
        {/* Toggle Sidebar Button (Desktop Only) */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-brand-orange p-1.5 rounded-full text-white shadow-lg hidden md:block hover:scale-110 transition-transform"
        >
          {isSidebarOpen ? <ChevronRight className="rotate-180 transform" size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} min-h-screen flex flex-col`}>
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-4">
            <button className="md:hidden p-2 -ml-2 text-gray-600 hover:text-brand-orange transition-colors" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest hidden sm:block">Panel /</span>
            <h2 className="text-lg md:text-xl font-black text-gray-900 capitalize italic tracking-tight truncate">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <a href="/" target="_blank" className="flex items-center gap-2 px-3 md:px-4 py-2 bg-brand-blue/5 text-brand-blue rounded-full text-xs font-bold hover:bg-brand-blue hover:text-white transition-all">
               <span className="hidden sm:inline">Live Site</span> <ChevronRight size={14} />
             </a>
          </div>
        </header>

        <div className="p-4 md:p-8 pb-24 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 md:opacity-10 group-hover:scale-110 transition-transform hidden sm:block">
                   <LayoutDashboard size={120} />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-2 italic">Welcome back, Aliasgar Bhai!</h3>
                <p className="text-gray-500 max-w-lg leading-relaxed text-sm md:text-base">
                  Your digital storefront is live and growing. Use the links below or the sidebar to keep your details updated for your customers in Pulgaon.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
                    <button onClick={() => setActiveTab('catalog')} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-brand-orange text-white rounded-2xl font-black italic shadow-lg shadow-brand-orange/20 hover:translate-y-[-2px] transition-all text-sm md:text-base">
                      Update Catalog
                    </button>
                    <button onClick={() => setActiveTab('products')} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-brand-blue text-white rounded-2xl font-black italic shadow-lg shadow-brand-blue/20 hover:translate-y-[-2px] transition-all text-sm md:text-base">
                      Manage Categories
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-brand-orange/30 transition-colors group flex items-center md:items-start md:flex-col gap-4 md:gap-0">
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Catalog Items</p>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">{stats.catalog}</p>
                  </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-brand-blue/30 transition-colors group flex items-center md:items-start md:flex-col gap-4 md:gap-0">
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category Products</p>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">{stats.products}</p>
                  </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-yellow-500/30 transition-colors group flex items-center md:items-start md:flex-col gap-4 md:gap-0">
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <Star size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reviews</p>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">{stats.testimonials}</p>
                  </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-green-500/30 transition-colors group flex items-center md:items-start md:flex-col gap-4 md:gap-0">
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center md:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Inquiries</p>
                    <p className="text-2xl md:text-3xl font-black text-gray-900 leading-none">{stats.inquiries}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && <ManageHero />}
          {activeTab === 'about' && <ManageAbout />}
          {activeTab === 'featured' && <ManageFeaturedProducts />}
          {activeTab === 'products' && <ManageProducts />}
          {activeTab === 'catalog' && <ManageIndividualProducts />}
          {activeTab === 'brands' && <ManageBrands />}
          {activeTab === 'inquiries' && <ManageInquiries />}
          {activeTab === 'testimonials' && <ManageTestimonials />}
          {activeTab === 'settings' && <ManageGlobalSettings />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
