import React from 'react';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { logout } from '../../lib/firebase';

interface AccessDeniedProps {
  email?: string | null;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ email }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <ShieldAlert size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The account <span className="font-bold text-red-600">{email}</span> is not authorized for administrative access.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
          
          <a 
            href="/" 
            className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-4 rounded-xl font-bold transition-all hover:bg-black"
          >
            <ArrowLeft size={20} />
            Return to Home
          </a>
        </div>

        <p className="mt-8 text-xs text-gray-400 italic">
          If this is a mistake, please contact the site owner to whitelist your email address.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
