import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const featuredProducts = [
  {
    id: 1,
    title: "Texmo Submersible Pumps",
    description: "High-efficiency agricultural and domestic water pumps built for reliable performance and extreme durability.",
    image: "https://picsum.photos/seed/waterpump5/800/600",
    linkText: "View Water Solutions",
    categoryHash: "#products"
  },
  {
    id: 2,
    title: "Premium CPVC & UPVC Pipes",
    description: "Leak-proof, temperature-resistant, and corrosion-free piping solutions for residential and commercial plumbing.",
    image: "https://picsum.photos/seed/plumbingpipes/800/600",
    linkText: "View Plumbing Options",
    categoryHash: "#products"
  },
  {
    id: 3,
    title: "Viking 1.0 HP V-Type Pump",
    description: "High-performance regenerative pump delivering strong water pressure. Expertly manufactured for maximum reliability and efficient water lifting.",
    image: "/viking-pump.jpg",
    fallbackUrl: "https://images.unsplash.com/photo-1585093774020-f1315b67ecbe?q=80&w=2000&auto=format&fit=crop",
    linkText: "View Official Specs",
    categoryHash: "https://vikingpumps.in/product/1-0-hp-v-type/"
  }
];

export default function FeaturedProducts() {
  return (
    <section id="featured" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">Top Selling Items</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Featured Products
          </h3>
          <div className="w-20 h-1 bg-brand-orange mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600">
            Discover our most popular hardware, plumbing, and machinery solutions trusted by professionals in Pulgaon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (product.fallbackUrl && target.src !== product.fallbackUrl) {
                      target.src = product.fallbackUrl;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-white"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-2xl font-bold font-heading text-gray-900 mb-3">{product.title}</h4>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  {product.description}
                </p>
                <a
                  href={product.categoryHash}
                  target={product.categoryHash.startsWith('http') ? '_blank' : undefined}
                  rel={product.categoryHash.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-brand-blue font-bold hover:text-brand-orange transition-colors mt-auto group/btn"
                >
                  {product.linkText}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
