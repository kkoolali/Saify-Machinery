import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CreditCard, Loader2, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [config, setConfig] = useState({
    phone: '+91 9370162544',
    email: 'aliasgar.saify@gmail.com',
    address: 'Royal Complex, Near Railway Station, Nachangaon Road, Sawant Wada, Pulgaon, Maharashtra – 442302'
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    message: false
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_config', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return unsub;
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[0-9+\s-]{10,}$/;
        if (!phoneRegex.test(value.trim())) return 'Please enter a valid phone number (min 10 digits)';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name as keyof typeof formData]) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      message: validateField('message', formData.message)
    };
    
    setErrors(newErrors);
    setTouched({ name: true, phone: true, message: true });

    if (newErrors.name || newErrors.phone || newErrors.message) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
      setTouched({ name: false, phone: false, message: false });
      setErrors({ name: '', phone: '', message: '' });
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to send inquiry. Please try again or contact us via phone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !validateField('name', formData.name) && 
                      !validateField('phone', formData.phone) && 
                      !validateField('message', formData.message);

  return (
    <section id="contact" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-black text-brand-orange uppercase tracking-[0.3em] mb-4">Get In Touch</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 mb-8 italic tracking-tight">
            Contact Us
          </h3>
          <div className="w-24 h-1.5 bg-brand-orange mx-auto mb-10 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 h-full">
              <h4 className="text-2xl font-black italic text-gray-900 mb-10 tracking-tight">Store Information</h4>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin size={28} className="text-brand-orange" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 italic text-lg">Store Address</h5>
                    <p className="text-gray-600 mt-2 font-medium leading-relaxed">
                      {config.address}
                    </p>
                    <p className="text-xs text-brand-blue font-black uppercase tracking-widest mt-2">Landmark: OLD BUS STAND REGION</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm group-hover:scale-110 transition-transform">
                    <Phone size={28} className="text-brand-blue" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 italic text-lg">Phone / WhatsApp</h5>
                    <a href={`tel:${config.phone}`} className="text-gray-600 mt-2 block font-black text-xl hover:text-brand-orange transition-colors">
                      {config.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100 shadow-sm group-hover:scale-110 transition-transform">
                    <Clock size={28} className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 italic text-lg">Business Hours</h5>
                    <p className="text-gray-600 mt-2 font-medium">Monday – Sunday: 9:00 AM – 9:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100 shadow-sm group-hover:scale-110 transition-transform">
                    <CreditCard size={28} className="text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 italic text-lg">Payment Methods</h5>
                    <p className="text-gray-600 mt-2 font-medium">
                      Cash • UPI • Cards • Net Banking • All Digital Wallets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 h-full flex flex-col">
              <h4 className="text-2xl font-black italic text-gray-900 mb-2 tracking-tight">Send an Inquiry</h4>
              <p className="text-gray-500 font-medium mb-10">Need a quote for bulk orders? Send us a message.</p>
              
              {isSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-3xl border border-green-100">
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <CheckCircle size={40} />
                  </div>
                  <h5 className="text-2xl font-black italic text-gray-900 mb-3">Message Sent!</h5>
                  <p className="text-gray-600 font-medium">Thank you for reaching out. Bashir or Aliasgar will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Your Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-4 rounded-2xl border-2 outline-none font-bold transition-all ${
                        touched.name && errors.name 
                          ? 'border-red-500 bg-red-50 focus:ring-0' 
                          : 'border-gray-50 bg-gray-50 focus:border-brand-blue focus:bg-white'
                      }`}
                      placeholder="e.g. Rahul Sharma"
                      disabled={isSubmitting}
                    />
                    {touched.name && errors.name && (
                      <p className="mt-2 text-xs text-red-500 font-bold italic">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-4 rounded-2xl border-2 outline-none font-bold transition-all ${
                        touched.phone && errors.phone 
                          ? 'border-red-500 bg-red-50 focus:ring-0' 
                          : 'border-gray-50 bg-gray-50 focus:border-brand-blue focus:bg-white'
                      }`}
                      placeholder="+91 9876543210"
                      disabled={isSubmitting}
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-2 text-xs text-red-500 font-bold italic">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <label htmlFor="message" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Your Requirements / Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-4 rounded-2xl border-2 outline-none font-bold transition-all h-full resize-none ${
                        touched.message && errors.message 
                          ? 'border-red-500 bg-red-50 focus:ring-0' 
                          : 'border-gray-50 bg-gray-50 focus:border-brand-blue focus:bg-white'
                      }`}
                      placeholder="Tell us what machinery or tools you need..."
                      disabled={isSubmitting}
                    ></textarea>
                    {touched.message && errors.message && (
                      <p className="mt-2 text-xs text-red-500 font-bold italic">{errors.message}</p>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting || (Object.values(touched).some(t => t) && !isFormValid)}
                    className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black italic py-5 px-8 rounded-2xl shadow-xl shadow-brand-orange/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
