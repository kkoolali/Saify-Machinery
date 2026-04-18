import { Phone } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919021313113"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebe57] hover:-translate-y-1 transition-all duration-300 group flex items-center justify-center animate-bounce"
      aria-label="Chat on WhatsApp"
    >
      <Phone size={28} className="fill-current" />
      {/* A small tooltip */}
      <span className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Order on WhatsApp
      </span>
    </a>
  );
}
