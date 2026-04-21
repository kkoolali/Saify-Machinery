import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Save, Upload, Loader2, Image as ImageIcon, Layout } from 'lucide-react';

const ManageHero: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    backgroundImage: '',
    ctaText: '',
    badgeText: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `site/hero_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, backgroundImage: url }));
    } catch (error) {
      console.error("Error uploading hero image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'hero'), formData);
      alert("Hero section updated successfully!");
    } catch (error) {
      console.error("Error saving hero config:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Loading Hero settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
           <Layout size={24} />
        </div>
        <h3 className="text-xl font-bold italic">Manage Hero Section</h3>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Badge Text</label>
              <input required value={formData.badgeText} onChange={e => setFormData({...formData, badgeText: e.target.value})} type="text" placeholder="Pulgaon's Trusted Hardware Partner" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Main Heading</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="Complete Plumbing & Machinery Solutions" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Quality Products. Best Prices..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CTA Button Text</label>
              <input required value={formData.ctaText} onChange={e => setFormData({...formData, ctaText: e.target.value})} type="text" placeholder="Explore Products" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <label className="block text-sm font-bold text-gray-700 mb-1">Hero Background Image</label>
           <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 group">
              {formData.backgroundImage ? (
                <img src={formData.backgroundImage} alt="Hero background" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-2 opacity-20" />
                  <p className="text-sm">No background image set</p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  Change Image
                </button>
              </div>
           </div>
           <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
           <p className="text-xs text-gray-500">Recommended: 1920x1080px (Landscape). High quality image will be optimized by browser.</p>

           <div className="pt-8 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving || isUploading}
                className="w-full md:w-auto px-10 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Save Hero Changes
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default ManageHero;
