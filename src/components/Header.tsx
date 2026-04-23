import { useState, useEffect } from 'react';
import { Menu, X, Hammer, Phone, Scale, ShoppingBag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { compareList, setShowCompareModal } = useCompare();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home', type: 'hash' },
    { name: 'About', href: '/#about', type: 'hash' },
    { name: 'Products', href: '/products', type: 'link' },
    { name: 'Brands', href: '/#brands', type: 'hash' },
    { name: 'Reviews', href: '/#testimonials', type: 'hash' },
    { name: 'Contact', href: '/#contact', type: 'hash' },
  ];

  const LogoLink = () => (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.div 
        animate={{ 
          scale: isScrolled ? 0.9 : 1,
          rotate: isScrolled ? [0, -5, 0] : 0
        }}
        transition={{ duration: 0.3 }}
        className={`p-2 rounded-lg transition-colors ${isScrolled ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue'}`}
      >
        <Hammer size={24} className="group-hover:rotate-12 transition-transform" />
      </motion.div>
      <motion.div
        animate={{ x: isScrolled ? -2 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className={`font-heading font-bold text-xl leading-tight transition-colors ${isScrolled ? 'text-brand-blue' : 'text-white'}`}>
          Saify Machinery
        </h1>
        <p className={`text-xs font-medium tracking-wider uppercase transition-colors ${isScrolled ? 'text-gray-500' : 'text-gray-300'}`}>
          Est. 2019
        </p>
      </motion.div>
    </Link>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-brand-blue-dark text-white py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <LogoLink />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.type === 'link' ? (
                  <Link
                    to={link.href}
                    className={`text-sm font-medium hover:text-brand-orange transition-colors ${
                      location.pathname === link.href ? 'text-brand-orange' : (isScrolled ? 'text-gray-700' : 'text-gray-200')
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className={`text-sm font-medium hover:text-brand-orange transition-colors ${
                      isScrolled ? 'text-gray-700' : 'text-gray-200'
                    }`}
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {compareList.length > 0 && (
              <button 
                onClick={() => setShowCompareModal(true)}
                className={`relative p-2.5 rounded-xl transition-all ${isScrolled ? 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title="View Comparison"
              >
                <Scale size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                  {compareList.length}
                </span>
              </button>
            )}

            <Link
              to="/wishlist"
              className={`relative p-2.5 rounded-xl transition-all ${isScrolled ? 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="View Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? (isScrolled ? 'fill-brand-orange text-brand-orange' : 'fill-white text-white') : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/checkout"
              className={`relative p-2.5 rounded-xl transition-all ${isScrolled ? 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title="View Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            <a
              href="tel:9021313113"
              className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm shadow-sm"
            >
              <Phone size={16} />
              9021313113
            </a>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-gray-900' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-gray-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden bg-gradient-to-b from-white/95 via-white/80 to-brand-orange/5 backdrop-blur-xl shadow-2xl overflow-hidden border-t border-gray-100 relative z-50"
            >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.type === 'link' ? (
                      <Link
                        to={link.href}
                        className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-800 font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-800 font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="tel:9021313113"
                  className="flex items-center justify-center gap-2 bg-brand-orange text-white w-full py-3 rounded-lg font-medium"
                >
                  <Phone size={18} />
                  Call Now: 9021313113
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </header>
  );
}
