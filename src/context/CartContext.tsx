import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    productId: string;
    productTitle: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
    price: string;
    imageUrl: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'id'>) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: string;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('saify_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('saify_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: Omit<CartItem, 'id'>) => {
        setCart(prev => {
            // Check if item with same productId and variantId already exists
            const existingItemIndex = prev.findIndex(item => 
                item.productId === newItem.productId && item.variantId === newItem.variantId
            );

            if (existingItemIndex !== -1) {
                const updatedCart = [...prev];
                updatedCart[existingItemIndex].quantity += newItem.quantity;
                return updatedCart;
            }

            return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => 
            item.id === itemId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const parsePrice = (priceStr: string) => {
        const cleaned = priceStr.replace(/[^0-9.]/g, '');
        return parseFloat(cleaned) || 0;
    };

    const cartTotal = cart.reduce((total, item) => {
        return total + (parsePrice(item.price) * item.quantity);
    }, 0).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
