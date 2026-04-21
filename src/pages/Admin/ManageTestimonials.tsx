import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Star, Plus, Edit2, Trash2, Save, X, User } from 'lucide-react';

interface Testimonial {
  id: string;
  docId: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

const ManageTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
    avatar: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as Testimonial[];
      setTestimonials(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), formData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'testimonials'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
        setIsAdding(false);
      }
      setFormData({ name: '', role: '', rating: 5, text: '', avatar: '' });
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  const handleEdit = (test: Testimonial) => {
    setFormData({
      name: test.name,
      role: test.role,
      rating: test.rating,
      text: test.text,
      avatar: test.avatar || ''
    });
    setEditingId(test.docId);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this testimonial?")) {
      await deleteDoc(doc(db, 'testimonials', id));
    }
  };

  if (loading) return <div>Loading testimonials...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Manage Customer Feedback</h3>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors">
            <Plus size={20} />
            Add Manual Review
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-orange/20">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold">{editingId ? 'Edit Review' : 'New Manual Review'}</h4>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Location</label>
                <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} type="text" placeholder="Farmer, Contractor, etc." className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input required min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} type="number" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (Optional)</label>
                <input value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} type="text" placeholder="https://..." className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
              <textarea required rows={4} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="flex justify-end gap-4">
              <button type="submit" className="px-10 py-2 bg-brand-orange text-white rounded-lg font-bold">Save Feedback</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test) => (
          <div key={test.docId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:border-brand-blue/30 transition-colors group">
            <div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(test.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 italic mb-6 text-sm">"{test.text}"</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <User size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-gray-900">{test.name}</h5>
                  <p className="text-xs text-gray-500">{test.role}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => handleEdit(test)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(test.docId)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTestimonials;
