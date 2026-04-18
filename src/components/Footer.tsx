import { Hammer } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          <div>
            <a href="#home" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-brand-orange text-white">
                <Hammer size={24} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl leading-tight text-white">
                  Saify Machinery
                </h2>
              </div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Pulgaon's trusted wholesale and retail hardware, plumbing, and machinery store since 2019. Your one-stop solution for all construction and agricultural needs.
            </p>
            <p className="text-sm font-medium text-white tracking-wider">GST: 27CHCPS0273C1ZK</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-brand-orange transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-brand-orange transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-brand-orange transition-colors">Products & Services</a></li>
              <li><a href="#brands" className="hover:text-brand-orange transition-colors">Brands</a></li>
              <li><a href="#contact" className="hover:text-brand-orange transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Service Area</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Proudly serving Pulgaon, Wardha, and nearby rural areas. We support local farmers, plumbers, contractors, builders, and households.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Saify Machinery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
