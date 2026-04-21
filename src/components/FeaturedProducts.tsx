import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

const localFeaturedProducts = [
  {
    id: '1',
    title: "Texmo Submersible Pumps",
    description: "High-efficiency agricultural and domestic water pumps built for reliable performance and extreme durability.",
    image: "https://picsum.photos/seed/waterpump5/800/600",
    linkText: "View Water Solutions",
    categoryHash: "#products"
  },
  {
    id: '2',
    title: "Premium CPVC & UPVC Pipes",
    description: "Leak-proof, temperature-resistant, and corrosion-free piping solutions for residential and commercial plumbing.",
    image: "https://picsum.photos/seed/plumbingpipes/800/600",
    linkText: "View Plumbing Options",
    categoryHash: "#products"
  }
];

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'featured_products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) {
        setFeaturedProducts(data);
      } else {
        setFeaturedProducts(localFeaturedProducts);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <section id="featured" className="py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-black text-brand-orange uppercase tracking-[0.3em] mb-4">Top Selling Items</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-black text-gray-900 mb-8 italic tracking-tight">
            Featured Products
          </h3>
          <div className="w-24 h-1.5 bg-brand-orange mx-auto mb-10 rounded-full"></div>
          <p className="text-xl text-gray-600 font-medium italic">
            Discover our most popular hardware, plumbing, and machinery solutions trusted by professionals in Pulgaon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-100 border border-gray-100 flex flex-col group hover:border-brand-orange/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-72 overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg -translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                  Featured
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-black italic text-gray-900 mb-4 tracking-tight group-hover:text-brand-orange transition-colors">{product.title}</h4>
                <p className="text-gray-500 font-medium mb-8 flex-grow leading-relaxed line-clamp-3">
                  {product.description}
                </p>
                <a
                  href={product.categoryHash}
                  target={product.categoryHash?.startsWith('http') ? '_blank' : undefined}
                  rel={product.categoryHash?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-between w-full p-4 bg-brand-blue/5 text-brand-blue rounded-2xl font-black italic hover:bg-brand-orange hover:text-white transition-all group/btn"
                >
                  <span className="flex items-center gap-2">
                     <ShoppingCart size={18} />
                     {product.linkText || 'Explore Now'}
                  </span>
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
