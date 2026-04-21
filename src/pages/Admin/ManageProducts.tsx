import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Save, X, ImageIcon, CheckCircle2, ChevronRight, ChevronDown, ShoppingBag } from 'lucide-react';

interface Category {
  id: string;
  docId: string;
  title: string;
  icon: string;
  color: string;
  items: string[];
  images: string[];
}

const ManageProducts: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    icon: 'Wrench',
    color: 'bg-blue-50 text-brand-blue',
    items: '',
    images: ''
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      items: formData.items.split('\n').filter(i => i.trim()),
      images: formData.images.split('\n').filter(i => i.trim()),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'categories'), payload);
        setIsAdding(false);
      }
      setFormData({ id: '', title: '', icon: 'Wrench', color: 'bg-blue-50 text-brand-blue', items: '', images: '' });
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
      images: cat.images.join('\n')
    });
    setEditingId(cat.docId);
    setIsAdding(true);
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, 'categories', docId));
    }
  };

  if (loading) return <div>Loading products...</div>;

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
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID (Slug)</label>
                <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} type="text" placeholder="plumbing" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" placeholder="Hardware & Plumbing" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide)</label>
                <input required value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} type="text" placeholder="Droplet" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Class</label>
                <input required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} type="text" placeholder="bg-blue-50 text-brand-blue" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items (One per line)</label>
                <textarea required rows={4} value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} placeholder="Pipes&#10;Fittings&#10;Valves" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Image URLs (One per line)</label>
                <textarea required rows={4} value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none" />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2 text-gray-500 font-bold">Cancel</button>
              <button type="submit" className="px-10 py-2 bg-brand-orange text-white rounded-lg font-bold shadow-md hover:bg-orange-600 transition-all flex items-center gap-2">
                <Save size={20} />
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <div key={cat.docId} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-blue/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                <span className="text-sm font-bold">{cat.icon.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{cat.title} <span className="text-xs font-normal text-gray-400 ml-2">({cat.id})</span></h4>
                <p className="text-xs text-gray-500">{cat.items.length} items • {cat.images.length} images</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleEdit(cat)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(cat.docId)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && !isAdding && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">Your product catalog is empty. Start by adding your first category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
