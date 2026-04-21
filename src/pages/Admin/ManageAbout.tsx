import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Save, Upload, Loader2, Image as ImageIcon, BookOpen } from 'lucide-react';

const ManageAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    badge: 'About Us',
    title: 'Building Trust Since 2019',
    description: '',
    experienceTitle: 'Your One-Stop Solution',
    experienceDescription: '',
    image: '',
    ownerName: 'Aliasgar Hakimuddin Saify'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'about'), (docSnap) => {
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
      const storageRef = ref(storage, `site/about_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Error uploading about image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'site_config', 'about'), formData);
      alert("About section updated successfully!");
    } catch (error) {
      console.error("Error saving about config:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Loading About settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
           <BookOpen size={24} />
        </div>
        <h3 className="text-xl font-bold italic">Manage About Section</h3>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Main Description</label>
            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Owner Name</label>
            <input required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
          </div>
        </div>

        <div className="space-y-6">
           <label className="block text-sm font-bold text-gray-900 mb-1">About Us Image</label>
           <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 group">
              {formData.image ? (
                <img src={formData.image} alt="About" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-2 opacity-20" />
                  <p className="text-sm">No image set</p>
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

           <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving || isUploading}
                className="w-full px-10 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                Update About Content
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default ManageAbout;
