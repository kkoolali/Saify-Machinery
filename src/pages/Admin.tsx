import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, logout } from '../lib/firebase';
import { motion } from 'motion/react';
import { LayoutDashboard, ShoppingBag, MessageSquare, Star, Settings, LogOut, LogIn, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';

// Subcomponents for different sections
import ManageProducts from './Admin/ManageProducts';
import ManageInquiries from './Admin/ManageInquiries';
import ManageTestimonials from './Admin/ManageTestimonials';

const Admin: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'inquiries' | 'testimonials' | 'settings'>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Saify Machinery Admin</h1>
          <p className="text-gray-600 mb-8">Please sign in with your authorized Google account to manage your store.</p>
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <LogIn size={20} />
            Sign In with Google
          </button>
          <a href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors mt-6 font-medium text-sm">
            <ArrowLeft size={16} />
            Back to Public Website
          </a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-8">Your account ({user.email}) is not authorized for administrative access. Contact the administrator if this is an error.</p>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-bold transition-all shadow-sm"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed inset-y-0 z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-brand-orange p-2 rounded-lg shrink-0">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">Saify Admin</span>
          )}
        </div>

        <nav className="flex-grow pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${
                  activeTab === item.id ? 'bg-brand-orange text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={22} className="shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? 'px-2' : 'justify-center'} mb-4`}>
            {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border border-gray-700" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">{user.email?.charAt(0).toUpperCase()}</div>
            )}
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.displayName || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-2 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors ${isSidebarOpen ? '' : 'justify-center'}`}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-brand-orange p-1.5 rounded-full text-white shadow-lg hidden md:block"
        >
          {isSidebarOpen ? <ChevronRight className="rotate-180 transform" size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} min-h-screen overflow-y-auto`}>
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-gray-900 capitalize italic">{activeTab}</h2>
          <div className="flex items-center gap-4">
             <a href="/" target="_blank" className="text-sm font-medium text-brand-blue hover:text-brand-orange transition-colors">View Live Website &rarr;</a>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Categories</p>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">New Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">Verified Testimonials</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1">GMB Rating</p>
                  <p className="text-3xl font-bold text-gray-900">4.8/5</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6">Welcome back, Aliasgar Bhai!</h3>
                <p className="text-gray-600 mb-4">Manage your digital storefront from this dashboard. Use the sidebar to update your catalog, check messages, or manage gallery images.</p>
                <div className="flex flex-wrap gap-4 mt-8">
                    <button onClick={() => setActiveTab('products')} className="px-6 py-3 bg-brand-orange text-white rounded-lg font-bold hover:shadow-lg transition-all">Update Catalog</button>
                    <button onClick={() => setActiveTab('inquiries')} className="px-6 py-3 bg-brand-blue text-white rounded-lg font-bold hover:shadow-lg transition-all">Check Messages</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <ManageProducts />}
          {activeTab === 'inquiries' && <ManageInquiries />}
          {activeTab === 'testimonials' && <ManageTestimonials />}
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
               <h3 className="text-lg font-bold mb-6">General Store Settings</h3>
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                   <input type="text" value="27CHCPS0273C1ZK" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                    <input type="text" value="aliasgar.saify@gmail.com" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
                 </div>
                 <p className="text-xs text-gray-400">Settings here are pulled from system configuration. To update them, please modify project constants.</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
