import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save, Loader2, Globe, MapPin, Phone, Hash, Facebook, Instagram, Youtube } from 'lucide-react';

const ManageGlobalSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: 'Saify Machinery',
    gstNumber: '27CHCPS0273C1ZK',
    phone: '9021313113',
    whatsapp: '919021313113',
    email: 'aliasgar.saify@gmail.com',
    address: 'Near Old Bus Stand, Pulgaon, Maharashtra - 442302',
    footerDescription: "Pulgaon's trusted wholesale and retail hardware, plumbing, and machinery store since 2019.",
    socials: {
      facebook: '',
      instagram: '',
      youtube: ''
    }
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'global'), formData);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving global settings:", error);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
           <Globe size={24} />
        </div>
        <h3 className="text-xl font-bold italic">Global Store Configuration</h3>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-orange pl-3">Basic Information</h4>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Store Name</label>
              <input required value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">GST Number</label>
              <input required value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3">Contact Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">WhatsApp (Digits Only)</label>
                <input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} type="text" className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
              <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 text-sm flex items-center gap-2"><MapPin size={14} /> Full Store Address</label>
              <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-orange pl-3">Footer Content</h4>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Short Description</label>
              <textarea required rows={3} value={formData.footerDescription} onChange={e => setFormData({...formData, footerDescription: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="text-sm font-bold text-gray-900 border-l-4 border-brand-blue pl-3">Social Media Links</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Facebook size={18} /></div>
                  <input value={formData.socials.facebook} onChange={e => setFormData({...formData, socials: {...formData.socials, facebook: e.target.value}})} type="text" placeholder="Facebook URL" className="flex-grow text-sm outline-none" />
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100">
                  <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Instagram size={18} /></div>
                  <input value={formData.socials.instagram} onChange={e => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})} type="text" placeholder="Instagram URL" className="flex-grow text-sm outline-none" />
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Youtube size={18} /></div>
                  <input value={formData.socials.youtube} onChange={e => setFormData({...formData, socials: {...formData.socials, youtube: e.target.value}})} type="text" placeholder="YouTube URL" className="flex-grow text-sm outline-none" />
                </div>
             </div>
          </div>

           <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full px-10 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Update Global Store Info
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default ManageGlobalSettings;
