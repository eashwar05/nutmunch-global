import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../lib/api';

interface QuickLookDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: Product, quantity: number) => void;
}

const QuickLookDrawer: React.FC<QuickLookDrawerProps> = ({ isOpen, onClose, product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    // Reset quantity when product changes
    useEffect(() => {
        setQuantity(1);
    }, [product]);

    if (!product) return null;

    // Handle image URL variations (backend vs frontend mocks)
    const imageUrl = (product as any).image_url || product.image;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl z-[101] overflow-y-auto"
                    >
                        <div className="relative h-full flex flex-col">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            >
                                <X size={24} className="text-primary dark:text-white" />
                            </button>

                            {/* Image Section */}
                            <div className="h-[40vh] relative bg-stone-100 dark:bg-stone-800">
                                <img
                                    src={getOptimizedImageUrl(imageUrl, 800) || imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-white/80 text-xs tracking-[0.2em] uppercase font-bold">{product.category}</span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-8">
                                    <h2 className="font-display text-3xl text-primary dark:text-white mb-2">{product.name}</h2>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-xl font-bold text-accent-gold">${product.price.toFixed(2)}</span>
                                        <span className="text-sm text-primary/40 dark:text-white/40">{product.weight}</span>
                                    </div>
                                    <p className="text-primary/70 dark:text-white/70 leading-relaxed font-light">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    {/* Functionality: Quantity & Add to Cart */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-primary/20 rounded-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-3 hover:bg-primary/5 transition-colors text-primary dark:text-white"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium text-primary dark:text-white">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-4 py-3 hover:bg-primary/5 transition-colors text-primary dark:text-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => {
                                                onAddToCart(product, quantity);
                                                onClose();
                                            }}
                                            className="flex-1 bg-primary text-white py-3 px-6 text-xs tracking-widest uppercase font-bold hover:bg-accent-gold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag size={16} />
                                            Add to Cart
                                        </button>
                                    </div>

                                    <Link
                                        to={`/product/${product.id}`}
                                        onClick={onClose}
                                        className="block text-center text-xs tracking-widest uppercase font-bold text-primary/50 hover:text-primary dark:text-white/50 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        View Full Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickLookDrawer;
