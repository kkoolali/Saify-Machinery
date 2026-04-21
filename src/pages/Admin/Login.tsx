import React from 'react';
import { LogIn, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { login } from '../../lib/firebase';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-3xl flex items-center justify-center mx-auto mb-8 transform -rotate-12">
          <LayoutDashboard size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2 font-heading italic">Saify Admin</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Access your hardware store control center. Please sign in with your authorized Google account.
        </p>
        
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 group"
        >
          <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="" className="w-5 h-5" />
          Log In with Google
        </button>

        <div className="mt-12 pt-8 border-t border-gray-50">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-orange transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Website
          </a>
        </div>
      </div>
      
      <p className="mt-8 text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
        Proprietor: Aliasgar Saify
      </p>
    </div>
  );
};

export default Login;
