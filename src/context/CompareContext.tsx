import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    price?: string;
    imageUrl: string;
    images?: string[];
    videoUrl?: string;
    videoTitle?: string;
    featured: boolean;
    enquiryOnly?: boolean;
}

interface CompareContextType {
    compareList: Product[];
    toggleCompare: (product: Product) => void;
    clearCompare: () => void;
    showCompareModal: boolean;
    setShowCompareModal: (show: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareList, setCompareList] = useState<Product[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const toggleCompare = (product: Product) => {
        setCompareList(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            if (prev.length >= 4) {
                alert("You can compare up to 4 products at a time.");
                return prev;
            }
            return [...prev, product];
        });
    };

    const clearCompare = () => setCompareList([]);

    return (
        <CompareContext.Provider value={{ 
            compareList, 
            toggleCompare, 
            clearCompare, 
            showCompareModal, 
            setShowCompareModal 
        }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}
