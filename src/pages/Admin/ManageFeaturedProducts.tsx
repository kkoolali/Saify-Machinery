import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Save, X, ImageIcon, ShoppingBag, Loader2, Upload } from 'lucide-react';

interface FeaturedProduct {
  docId: string;
  id: string;
  title: string;
  description: string;
  image: string;
  linkText: string;
  categoryHash: string;
}

const ManageFeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    linkText: 'Explore Collection',
    categoryHash: '#products'
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'featured_products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as FeaturedProduct[];
      setProducts(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `featured/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Error uploading product image:", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'featured_products', editingId), formData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'featured_products'), formData);
      }
      setIsAdding(false);
      setFormData({ id: '', title: '', description: '', image: '', linkText: 'Explore Collection', categoryHash: '#products' });
    } catch (error) {
      console.error("Error saving featured product:", error);
      alert("Failed to save.");
    }
  };

  const handleEdit = (prod: FeaturedProduct) => {
    setFormData({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      image: prod.image,
      linkText: prod.linkText,
      categoryHash: prod.categoryHash
    });
    setEditingId(prod.docId);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this featured product?")) {
      await deleteDoc(doc(db, 'featured_products', id));
    }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" /> Loading featured products...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold italic">Manage Featured Products</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add Featured Item
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-orange/20">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold">{editingId ? 'Edit Featured Product' : 'New Featured Product'}</h4>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product ID (Slug)</label>
                <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} type="text" placeholder="premium-pumps" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="Premium Submersible Pumps" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="High efficiency, low power consumption..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange resize-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={32} className="mb-1 opacity-20" />
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </div>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Link Text</label>
                  <input required value={formData.linkText} onChange={e => setFormData({...formData, linkText: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Section Hash</label>
                  <input required value={formData.categoryHash} onChange={e => setFormData({...formData, categoryHash: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={isUploading}
                className="px-10 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Save Featured Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div key={prod.docId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-brand-blue/30 transition-all">
            <div className="aspect-video relative overflow-hidden">
               <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => handleEdit(prod)} className="p-2 bg-white/90 backdrop-blur shadow-md rounded-lg text-blue-600 hover:text-white hover:bg-blue-600 transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(prod.docId)} className="p-2 bg-white/90 backdrop-blur shadow-md rounded-lg text-red-600 hover:text-white hover:bg-red-600 transition-all"><Trash2 size={16} /></button>
               </div>
            </div>
            <div className="p-6">
               <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{prod.title}</h4>
               <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{prod.description}</p>
               <div className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded tracking-tight">{prod.categoryHash}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageFeaturedProducts;
