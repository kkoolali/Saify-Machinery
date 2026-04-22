import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { 
  Plus, Edit2, Trash2, Save, X, ImageIcon, Loader2, Upload, 
  Search, Filter, Tag, Package, AlertCircle, Play
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  price?: string;
  imageUrl: string;
  images?: string[];
  videoUrl?: string;
  videoTitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  featured: boolean;
  enquiryOnly?: boolean;
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
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoUploading, setVideoUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    images: [] as string[],
    videoUrl: '',
    videoTitle: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    featured: false,
    enquiryOnly: false
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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoUploading(true);
    try {
      const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, videoUrl: url, videoTitle: formData.videoTitle || file.name.split('.')[0] }));
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    } finally {
      setVideoUploading(false);
    }
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
        title: '', description: '', categoryId: '', price: '', imageUrl: '', images: [], 
        videoUrl: '', videoTitle: '',
        seoTitle: '', seoDescription: '', seoKeywords: '', featured: false, enquiryOnly: false 
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
      videoUrl: prod.videoUrl || '',
      videoTitle: prod.videoTitle || '',
      seoTitle: prod.seoTitle || '',
      seoDescription: prod.seoDescription || '',
      seoKeywords: prod.seoKeywords || '',
      featured: prod.featured || false,
      enquiryOnly: prod.enquiryOnly || false
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
            <h3 className="text-xl font-bold italic text-brand-orange">Manage Catalog Products</h3>
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
                <div className="flex items-end pb-3 gap-6">
                   <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center
                        ${formData.featured ? 'bg-brand-orange border-brand-orange' : 'bg-gray-50 border-gray-200 group-hover:border-brand-orange'}
                     `}>
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="hidden" />
                        {formData.featured && <X size={14} className="text-white rotate-45" />}
                     </div>
                     <span className="text-sm font-bold text-gray-700">Display in Featured Grid</span>
                   </label>

                   <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center
                        ${formData.enquiryOnly ? 'bg-brand-blue border-brand-blue' : 'bg-gray-50 border-gray-200 group-hover:border-brand-blue'}
                     `}>
                        <input type="checkbox" checked={formData.enquiryOnly} onChange={e => setFormData({...formData, enquiryOnly: e.target.checked})} className="hidden" />
                        {formData.enquiryOnly && <X size={14} className="text-white rotate-45" />}
                     </div>
                     <span className="text-sm font-bold text-gray-700">Enquiry Only</span>
                   </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Description / Specifications</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe product features, power, durability, etc." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all resize-none" />
              </div>

              {/* Video Tutorial Section */}
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Play size={18} className="text-brand-orange" />
                    <label className="text-sm font-bold text-brand-orange uppercase tracking-wider">Technical Video Tutorial</label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={videoUploading}
                    className="flex items-center gap-2 px-3 py-1 bg-white border border-orange-200 rounded-lg text-[10px] font-black text-brand-orange uppercase tracking-widest hover:bg-orange-50 transition-all disabled:opacity-50"
                  >
                    {videoUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    Upload MP4
                  </button>
                  <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/mp4" className="hidden" />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <input value={formData.videoTitle} onChange={e => setFormData({...formData, videoTitle: e.target.value})} type="text" placeholder="Video Title (e.g. Installation Guide)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none transition-all text-sm" />
                      <p className="text-[10px] text-gray-400 ml-1">Title for the tutorial section</p>
                    </div>
                    <div className="space-y-1">
                      <input value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} type="text" placeholder="Video URL or Upload Path" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none transition-all text-sm" />
                      <p className="text-[10px] text-gray-400 ml-1">Direct URL or uploaded storage link</p>
                    </div>
                  </div>
                  {formData.videoUrl && (
                    <div className="flex items-center justify-between px-4 py-2 bg-green-50 border border-green-100 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700 text-[10px] font-bold">
                        <Play size={14} className="fill-green-700" />
                        Video Attached Successfully
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, videoUrl: '', videoTitle: ''})}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Meta Fields */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Search size={18} className="text-brand-blue" />
                  <label className="text-sm font-bold text-brand-blue uppercase tracking-wider">SEO Configuration (Search Engines)</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <input value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} type="text" placeholder="Meta Title (Optional)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all text-sm" />
                    <p className="text-[10px] text-gray-400 ml-1">Ideal: 50-60 characters</p>
                  </div>
                  <div className="space-y-1">
                    <input value={formData.seoKeywords} onChange={e => setFormData({...formData, seoKeywords: e.target.value})} type="text" placeholder="Meta Keywords (Comma separated)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all text-sm" />
                    <p className="text-[10px] text-gray-400 ml-1">E.g.: pumps, wardha hardware, motor</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <textarea rows={2} value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} placeholder="Meta Description (Optional)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all resize-none text-sm" />
                  <p className="text-[10px] text-gray-400 ml-1">Ideal: 150-160 characters</p>
                </div>
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
                          <div className="flex items-center gap-2">
                             <h5 className="text-sm font-bold text-gray-900 group-hover:text-brand-orange transition-colors">{prod.title}</h5>
                             {prod.videoUrl && <Play size={12} className="text-brand-orange fill-brand-orange/20" />}
                          </div>
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
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(prod)} 
                          className="p-2 text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-all active:scale-95 shadow-sm"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(prod.id)} 
                          className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all active:scale-95 shadow-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
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
