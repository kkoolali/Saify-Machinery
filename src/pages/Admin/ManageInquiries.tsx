import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MessageSquare, Trash2, Mail, Phone, Calendar, User, Search } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: any;
}

const ManageInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Inquiry[];
      setInquiries(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this inquiry permanentely?")) {
      await deleteDoc(doc(db, 'inquiries', id));
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inq.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold italic">Customer Messages ({inquiries.length})</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="p-6 flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3 space-y-3">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                  <User size={18} className="text-brand-blue" />
                  {inq.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} />
                  <a href={`mailto:${inq.email}`} className="hover:text-brand-orange transition-colors">{inq.email}</a>
                </div>
                {inq.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <a href={`tel:${inq.phone}`} className="hover:text-brand-orange transition-colors">{inq.phone}</a>
                  </div>
                )}
                 <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} />
                  {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString() : 'Recent'}
                </div>
              </div>

              <div className="lg:w-2/3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Sub: {inq.subject || 'General Inquiry'}</h4>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{inq.message}</p>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => handleDelete(inq.id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                    Delete Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">{searchTerm ? 'No messages match your search.' : 'Your inbox is currently empty.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInquiries;
