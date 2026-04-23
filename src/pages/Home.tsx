import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import AIAdvisorCTA from '../components/AIAdvisorCTA';
import Products from '../components/Products';
import FeaturedProducts from '../components/FeaturedProducts';
import Brands from '../components/Brands';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function Home() {
    useEffect(() => {
        document.title = "Saify Machinery - Hardware & Plumbing in Pulgaon";
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', "Saify Machinery - Pulgaon's Trusted Hardware Partner. Complete Plumbing & Machinery Solutions Under One Roof.");
        }

        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta) {
            keywordsMeta.setAttribute('content', "Hardware shop in Pulgaon, Plumbing materials Pulgaon, Water tank dealer Pulgaon, Texmo dealer Pulgaon, Motor pump shop near me");
        }
    }, []);

    return (
        <div className="font-sans text-gray-900 w-full overflow-x-hidden">
            <Header />
            <main>
                <Hero />
                <About />
                <AIAdvisorCTA />
                <Products />
                <FeaturedProducts />
                <Brands />
                <Testimonials />
                <Contact />
            </main>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
