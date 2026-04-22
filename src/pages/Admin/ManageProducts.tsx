import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { 
  Plus, Edit2, Trash2, Save, X, ImageIcon, ShoppingBag, Loader2, Upload, 
  Droplet, Wrench, Sprout, Zap, Lightbulb, Hammer, Settings, Home, 
  Cog, Construction, Search
} from 'lucide-react';

interface Category {
  id: string;
  docId: string;
  title: string;
  icon: string;
  color: string;
  items: string[];
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

const AVAILABLE_ICONS = [
  { name: 'Droplet', icon: Droplet },
  { name: 'Wrench', icon: Wrench },
  { name: 'Sprout', icon: Sprout },
  { name: 'Zap', icon: Zap },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Hammer', icon: Hammer },
  { name: 'Settings', icon: Settings },
  { name: 'Home', icon: Home },
  { name: 'Cog', icon: Cog },
  { name: 'Construction', icon: Construction },
];

const ManageProducts: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    icon: 'Wrench',
    color: 'bg-blue-50 text-brand-blue',
    items: '',
    images: [] as string[],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('id'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as Category[];
      setCategories(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newImageUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: formData.id,
      title: formData.title,
      icon: formData.icon,
      color: formData.color,
      items: formData.items.split('\n').filter(i => i.trim()),
      images: formData.images,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'categories'), payload);
        setIsAdding(false);
      }
      setFormData({ 
        id: '', title: '', icon: 'Wrench', color: 'bg-blue-50 text-brand-blue', 
        items: '', images: [], seoTitle: '', seoDescription: '', seoKeywords: '' 
      });
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({
      id: cat.id,
      title: cat.title,
      icon: cat.icon,
      color: cat.color,
      items: cat.items.join('\n'),
      images: cat.images || [],
      seoTitle: cat.seoTitle || '',
      seoDescription: cat.seoDescription || '',
      seoKeywords: cat.seoKeywords || ''
    });
    setEditingId(cat.docId);
    setIsAdding(true);
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, 'categories', docId));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={40} className="text-brand-orange animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Loading catalog data...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Manage Product Catalog</h3>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add New Category
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-orange/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold">{editingId ? 'Edit Category' : 'New Category'}</h4>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Basic Information</label>
                <div className="space-y-4">
                  <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} type="text" placeholder="ID (e.g., plumbing)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all" />
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="Category Title" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Display Style & Icon</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {AVAILABLE_ICONS.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: item.name })}
                          className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                            formData.icon === item.name 
                              ? 'bg-brand-orange text-white shadow-md scale-110' 
                              : 'bg-white text-gray-400 hover:text-brand-orange hover:bg-orange-50'
                          }`}
                          title={item.name}
                        >
                          <IconComponent size={20} />
                        </button>
                      );
                    })}
                  </div>
                  <input required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} type="text" placeholder="Tailwind Color Class (e.g. bg-blue-50 text-blue-600)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Product List (One per line)</label>
                <textarea required rows={5} value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} placeholder="PVC Pipes&#10;Water Tanks&#10;Valves" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition-all resize-none" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-900">Image Gallery</label>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:text-brand-orange transition-colors"
                  >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Upload New
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 min-h-[120px] p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 bg-white">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {!isUploading && formData.images.length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center text-gray-400 py-8">
                      <ImageIcon size={32} className="mb-2 opacity-20" />
                      <p className="text-xs font-medium">No images uploaded yet</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="aspect-square rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                      <Loader2 size={24} className="text-brand-orange animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Recommended: 1200x800px. First image will be the primary one.</p>
              </div>

              {/* SEO Meta Fields */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <Search size={16} className="text-brand-blue" />
                  <label className="block text-sm font-bold text-brand-blue">SEO Configuration</label>
                </div>
                <div className="space-y-4">
                  <div>
                    <input value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} type="text" placeholder="Meta Title (Optional)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all text-sm" />
                    <p className="text-[10px] text-gray-500 mt-1 ml-1">Ideal length: 50-60 characters</p>
                  </div>
                  <div>
                    <input value={formData.seoKeywords} onChange={e => setFormData({...formData, seoKeywords: e.target.value})} type="text" placeholder="Meta Keywords (Comma separated)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all text-sm" />
                    <p className="text-[10px] text-gray-500 mt-1 ml-1">E.g.: pipes, plumbing, wardha hardware</p>
                  </div>
                  <div>
                    <textarea rows={3} value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} placeholder="Meta Description (Optional)" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all resize-none text-sm" />
                    <p className="text-[10px] text-gray-500 mt-1 ml-1">Ideal length: 150-160 characters</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setEditingId(null); }} 
                className="px-6 py-2 text-gray-500 font-bold hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isUploading}
                className="px-10 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => {
          const IconComponent = AVAILABLE_ICONS.find(i => i.name === cat.icon)?.icon || Wrench;
          return (
            <div key={cat.docId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-blue/30 transition-all group">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${cat.color}`}>
                  <IconComponent size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    {cat.title} 
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-mono">{cat.id}</span>
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><ShoppingBag size={14} /> {cat.items.length} Products</span>
                    <span className="flex items-center gap-1"><ImageIcon size={14} /> {cat.images?.length || 0} Images</span>
                    {(cat.seoTitle || cat.seoDescription) && (
                      <span className="flex items-center gap-1 text-brand-blue"><Search size={14} /> SEO Ready</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  title="Edit Category"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.docId)}
                  className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && !isAdding && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-300" size={40} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-1">No Categories Yet</h4>
            <p className="text-gray-500 max-w-xs mx-auto">Your product catalog is empty. Start by adding your first category like Plumbing or Agri-Tools.</p>
            <button onClick={() => setIsAdding(true)} className="mt-8 text-brand-orange font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
              <Plus size={20} />
              Create First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
