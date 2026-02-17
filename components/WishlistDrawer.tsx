import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { getWishlist, removeFromWishlist, addToCart } from '../lib/api';

interface WishlistDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, onAddToCart }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const loadWishlist = async () => {
        setLoading(true);
        try {
            const items = await getWishlist();
            setWishlist(items);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadWishlist();
        }
    }, [isOpen]);

    const handleRemove = async (id: number) => {
        try {
            await removeFromWishlist(id);
            setWishlist(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] overflow-y-auto flex flex-col"
                    >
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                            <h2 className="font-display text-2xl text-primary">Your Wishlist</h2>
                            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                                <X size={24} className="text-primary" />
                            </button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {loading ? (
                                <div className="text-center py-12 text-stone-400">Loading...</div>
                            ) : wishlist.length === 0 ? (
                                <div className="text-center py-12 space-y-4">
                                    <span className="material-symbols-outlined text-4xl text-stone-300">favorite_border</span>
                                    <p className="text-stone-500">Your wishlist is empty.</p>
                                    <Link to="/shop" onClick={onClose} className="inline-block text-accent-terra font-bold uppercase tracking-widest text-xs border-b border-accent-terra">
                                        Start Curating
                                    </Link>
                                </div>
                            ) : (
                                wishlist.map(product => (
                                    <div key={product.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                                            <img src={(product as any).image_url || (product as any).image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1">
                                            <Link to={`/product/${product.id}`} onClick={onClose} className="font-display text-lg text-primary hover:text-accent-terra transition-colors block">
                                                {product.name}
                                            </Link>
                                            <p className="text-xs text-stone-500 mb-2">${product.price.toFixed(2)}</p>
                                            <button
                                                onClick={() => onAddToCart(product, 1)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors mr-4"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleRemove(product.id)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WishlistDrawer;
