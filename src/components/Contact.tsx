import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CreditCard, Loader2, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    
    // Only show validation error if the field was already touched
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check
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
      
      // Reset success message after 5 seconds
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
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">Get In Touch</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Contact Us
          </h3>
          <div className="w-20 h-1 bg-brand-orange mx-auto mb-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 h-full">
              <h4 className="text-2xl font-bold text-gray-900 mb-8">Store Information</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-brand-orange" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Store Address</h5>
                    <p className="text-gray-600 mt-1">
                      Royal Complex, Near Railway Station, <br/>
                      Nachangaon Road, Sawant Wada, <br/>
                      Pulgaon, Maharashtra – 442302
                    </p>
                    <p className="text-sm text-brand-blue font-medium mt-1">Landmark: Near Pulgaon Railway Station</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-brand-blue" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Phone / WhatsApp</h5>
                    <a href="tel:9021313113" className="text-gray-600 mt-1 block hover:text-brand-orange transition-colors">
                      +91 90213 13113
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Clock size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Business Hours</h5>
                    <p className="text-gray-600 mt-1">Everyday: 9:00 AM – 9:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    <CreditCard size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Payment Modes Accepted</h5>
                    <p className="text-gray-600 mt-1">
                      Cash • UPI • Debit/Credit Card • Net Banking • Wallets
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
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Send an Inquiry</h4>
              <p className="text-gray-600 mb-8">Need a quote for bulk orders? Send us a message.</p>
              
              {isSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <h5 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h5>
                  <p className="text-gray-600">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        touched.name && errors.name 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue'
                      }`}
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all ${
                        touched.phone && errors.phone 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue'
                      }`}
                      placeholder="+91 ...."
                      disabled={isSubmitting}
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message / Requirements</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 rounded-lg border outline-none transition-all resize-none ${
                        touched.message && errors.message 
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue'
                      }`}
                      placeholder="Tell us what you need..."
                      disabled={isSubmitting}
                    ></textarea>
                    {touched.message && errors.message && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>
                    )}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting || (Object.values(touched).some(t => t) && !isFormValid)}
                    className="mt-auto w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-medium py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Inquiry
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
