import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Plus, Trash2, Save, X, ImageIcon, Loader2, Upload, ExternalLink } from 'lucide-react';

interface Brand {
  docId: string;
  name: string;
  logo: string;
  website?: string;
}

const ManageBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as Brand[];
      setBrands(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `brands/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, logo: url }));
    } catch (error) {
      console.error("Error uploading brand logo:", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Saving brand with data:", formData);
      await addDoc(collection(db, 'brands'), formData);
      setIsAdding(false);
      setFormData({ name: '', logo: '', website: '' });
    } catch (error) {
      console.error("Error saving brand:", error);
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this brand partner?")) {
      await deleteDoc(doc(db, 'brands', id));
    }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Loading brands...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold italic">Manage Brand Partners</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add Brand Logo
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-orange/20">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold">New Brand Partner</h4>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Brand Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder="e.g., TEXMO" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Website URL (Optional)</label>
                <input value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} type="text" placeholder="https://..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Brand Logo</label>
              <div className="relative h-32 w-full rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-200 group flex items-center justify-center p-4">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo preview" className="h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={32} className="mb-1 opacity-20" />
                    <p className="text-xs">No logo uploaded</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                    {isUploading ? 'Uploading...' : 'Upload Logo'}
                  </button>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <p className="text-[10px] text-gray-400">Transparent PNG recommended. Aspect ratio: 2:1 or Square.</p>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={!formData.logo || isUploading}
                className="px-10 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                Save Brand Partner
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <div key={brand.docId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group relative flex flex-col items-center justify-center hover:border-brand-blue/30 transition-all">
            <img src={brand.logo} alt={brand.name} className="h-12 w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
            <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{brand.name}</p>
            
            <button 
              onClick={() => handleDelete(brand.docId)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              title="Remove Brand"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {brands.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl italic">
            No brand logos added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBrands;
