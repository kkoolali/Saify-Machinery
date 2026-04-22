import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { 
  Plus, Edit2, Trash2, Save, X, ImageIcon, Loader2, Upload, 
  Search, Filter, Tag, Package, AlertCircle
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  price?: string;
  imageUrl: string;
  images?: string[];
  featured: boolean;
  createdAt: any;
}

interface Category {
  id: string;
  docId: string;
  title: string;
}

const ManageIndividualProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    images: [] as string[],
    featured: false
  });

  useEffect(() => {
    // Fetch Categories for dropdown
    const unsubCats = onSnapshot(query(collection(db, 'categories'), orderBy('title')), (snapshot) => {
        setCategories(snapshot.docs.map(doc => ({ 
            id: doc.data().id, 
            docId: doc.id,
            title: doc.data().title 
        })));
    });

    // Fetch Products
    const unsubProds = onSnapshot(query(collection(db, 'products'), orderBy('updatedAt', 'desc')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Product[]);
      setLoading(false);
    });

    return () => {
        unsubCats();
        unsubProds();
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtraUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const storageRef = ref(storage, `products/gallery/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      alert("Failed to upload gallery image.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeExtraImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert("Please upload a product image.");
        return;
    }

    const payload = {
      ...formData,
      createdAt: editingId ? undefined : Date.now(),
      updatedAt: Date.now()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'products'), payload);
        setIsAdding(false);
      }
      setFormData({ 
        title: '', description: '', categoryId: '', price: '', imageUrl: '', images: [], featured: false 
      });
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save. Check console.");
    }
  };

  const handleEdit = (prod: Product) => {
    setFormData({
      title: prod.title,
      description: prod.description,
      categoryId: prod.categoryId,
      price: prod.price || '',
      imageUrl: prod.imageUrl,
      images: prod.images || [],
      featured: prod.featured || false
    });
    setEditingId(prod.id);
    setIsAdding(true);
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, 'products', docId));
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categories.find(c => c.id === p.categoryId)?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={40} className="text-brand-orange animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Loading products...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h3 className="text-xl font-bold">Unlimited Product Manager</h3>
            <p className="text-sm text-gray-500">Upload individual items to your main product page.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
          >
            <Plus size={20} />
            Add New Product
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold flex items-center gap-2">
                {editingId ? <Edit2 size={18} className="text-brand-blue" /> : <Package size={18} className="text-brand-orange" />}
                {editingId ? 'Edit Product Details' : 'Upload New Product'}
            </h4>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 p-2"><X size={24} /></button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group
                        ${formData.imageUrl ? 'border-brand-blue' : 'border-gray-200 hover:border-brand-orange bg-gray-50'}
                    `}
                >
                    {formData.imageUrl ? (
                        <>
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">
                                Change Main Image
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            {isUploading ? (
                                <Loader2 size={32} className="animate-spin text-brand-orange mx-auto mb-2" />
                            ) : (
                                <Upload size={32} className="text-gray-300 mx-auto mb-2" />
                            )}
                            <p className="text-sm font-medium text-gray-500">Main Product Photo</p>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

                {/* Additional Images */}
                <div className="mt-6 space-y-3">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Gallery Images</label>
                    <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="aspect-square relative rounded-lg overflow-hidden group border border-gray-100">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => removeExtraImage(idx)}
                                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-inner"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button"
                            onClick={() => extraFileInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-brand-orange hover:text-brand-orange transition-all"
                        >
                            {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        </button>
                    </div>
                    <input type="file" ref={extraFileInputRef} onChange={handleExtraUpload} accept="image/*" className="hidden" />
                </div>
            </div>

            {/* Fields Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Product Name</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="e.g. Havells Monoblock Pump" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Category</label>
                    <select 
                        required 
                        value={formData.categoryId} 
                        onChange={e => setFormData({...formData, categoryId: e.target.value})} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all cursor-pointer"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Price (Optional)</label>
                    <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="text" placeholder="e.g. ₹4,500" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all" />
                </div>
                <div className="flex items-end pb-3">
                   <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center
                        ${formData.featured ? 'bg-brand-orange border-brand-orange' : 'bg-gray-50 border-gray-200 group-hover:border-brand-orange'}
                     `}>
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="hidden" />
                        {formData.featured && <X size={14} className="text-white rotate-45" />}
                     </div>
                     <span className="text-sm font-bold text-gray-700">Display in Featured Grid</span>
                   </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Description / Specifications</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe product features, power, durability, etc." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-10 py-3 bg-brand-orange text-white rounded-xl font-black italic shadow-lg shadow-brand-orange/20 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingId ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Filter size={14} />
                <span>Showing {filteredProducts.length} items</span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((prod) => {
                const cat = categories.find(c => c.id === prod.categoryId);
                return (
                  <tr key={prod.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-900 group-hover:text-brand-orange transition-colors">{prod.title}</h5>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{prod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue rounded-full text-[10px] font-bold">
                        <Tag size={10} />
                        {cat?.title || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{prod.price || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {prod.featured ? (
                         <span className="text-[10px] font-black text-brand-orange uppercase">Featured</span>
                      ) : (
                         <span className="text-[10px] font-bold text-gray-300 uppercase">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(prod)} className="p-2 text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                        <Package size={48} className="mb-2" />
                        <p className="text-sm font-bold">No products found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tip Box */}
      <div className="bg-orange-50 p-4 rounded-2xl flex gap-3 items-start border border-orange-100">
        <AlertCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
        <div className="text-xs text-orange-800 leading-relaxed">
            <p className="font-bold mb-1 italic">Pro Tip for Bhai!</p>
            You can upload as many products as you want here. These will appear in a grid on your new dedicated <b>Products Page</b>. For high-priority items, check "Featured Grid" to show them on the home page as well.
        </div>
      </div>
    </div>
  );
};

export default ManageIndividualProducts;
