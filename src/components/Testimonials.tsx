import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const localReviews = [
  // fallback reviews
  {
    id: 1,
    name: "Rahul D.",
    role: "Local Farmer",
    avatar: "https://ui-avatars.com/api/?name=Rahul+D&background=0b3d91&color=fff",
    rating: 5,
    text: "Best hardware store in Pulgaon! Got a Texmo water pump for my farm here. Aliasgar bhai gave a great discount and the after-sales service is excellent."
  },
  {
    id: 2,
    name: "Santosh K.",
    role: "Plumbing Contractor",
    avatar: "https://ui-avatars.com/api/?name=Santosh+K&background=ff7f00&color=fff",
    rating: 5,
    text: "Very genuine products. I am a plumbing contractor and I always buy all my pipes and fittings from Saify Machinery. The quality is always top-notch and they maintain good stock."
  },
  {
    id: 3,
    name: "Priya M.",
    role: "Local Resident",
    avatar: "https://ui-avatars.com/api/?name=Priya+M&background=10b981&color=fff",
    rating: 5,
    text: "One-stop shop for all household hardware needs. Highly recommend! Friendly owner and very reasonable prices compared to other shops nearby. Getting things quickly is a huge plus."
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) {
        setReviews(data);
      } else {
        setReviews(localReviews);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">Customer Feedback</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Google Reviews
          </h3>
          <div className="w-20 h-1 bg-brand-orange mx-auto mb-6 rounded-full"></div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl font-bold text-gray-900">4.8</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="currentColor" />
              ))}
            </div>
          </div>
          <p className="text-gray-600 font-medium tracking-wide">
            Based on 50+ trusted reviews. Here is what our customers have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-8 flex flex-col hover:shadow-lg transition-shadow relative"
            >
              <div className="absolute top-8 right-8 text-rose-200 opacity-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L16.439 14.9726H11.4545V3H21.9364V12.72L18.986 21H14.017ZM3.5625 21L5.96541 14.9726H1V3H11.4545V12.72L8.504 21H3.5625Z" />
                </svg>
              </div>

              <div className="flex text-yellow-400 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed flex-grow relative z-10 mb-8 italic">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-3 h-3 object-contain" />
                    Review
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a
            href="https://google.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-blue font-bold hover:text-brand-orange transition-colors"
          >
            Read all our Google Reviews &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
