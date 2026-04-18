import { motion } from 'motion/react';
import { Target, Lightbulb, Users, ThumbsUp } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">About Us</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Building Trust Since 2019
          </h3>
          <div className="w-20 h-1 bg-brand-orange mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Saify Machinery is a trusted hardware and machinery store based in Pulgaon, Maharashtra, serving farmers, plumbers, contractors, and households with high-quality products and reliable service. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=2062&auto=format&fit=crop"
              alt="Hardware Store Experience"
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-8">
              <p className="text-white text-xl font-medium mb-2">Owner: Aliasgar Hakimuddin Saify</p>
              <div className="flex gap-4 text-gray-300 text-sm font-medium">
                <span className="flex items-center gap-1"><ThumbsUp size={16}/> 4.8 Rating (50+ reviews)</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Your One-Stop Solution</h4>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We specialize in providing a complete range of plumbing materials, motor pumps, pipes, fittings, and hardware tools under one roof, making us a one-stop solution for all construction and agricultural needs.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h5>
                  <p className="text-gray-600">To become the most trusted hardware and machinery supplier in rural Maharashtra.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange shrink-0">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h5>
                  <ul className="text-gray-600 space-y-1 list-disc list-inside">
                    <li>Provide quality products at affordable prices</li>
                    <li>Support farmers and local businesses</li>
                    <li>Deliver excellent customer service</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">Our Customers</h5>
                  <p className="text-gray-600">Farmers, Plumbers, Contractors, Builders, and Retail customers.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
