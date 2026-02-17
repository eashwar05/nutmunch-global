

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, addToWishlist } from '../lib/api';
import { Product } from '../types';

interface Props {
  addToCart: (p: Product, q: number) => void;
}

const ProductDetailPage: React.FC<Props> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await fetchProduct(id);
        const mappedProduct = {
          ...data,
          image: (data as any).image_url || data.image
        };
        setProduct(mappedProduct);
        setSelectedWeight(mappedProduct.weight || '500g'); // Default
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    loadProduct();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!product) return;
    try {
      await addToWishlist(product.id);
      alert("Added to wishlist!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: 'Check out this nut from Nutmunch!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl text-primary">Loading Harvest...</div>;
  if (!product) return <div className="py-24 text-center">Product not found.</div>;

  return (
    <main className="bg-background-cream min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left: Visual Munch */}
        <div className="relative bg-stone-900 h-[50vh] lg:h-auto flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${product.image})` }} />
          <div className="absolute inset-0 bg-black/40" />

          {/* Text Overlay for Visual Munch */}
          <div className="absolute bottom-12 left-12 text-white z-10 max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/50"></div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">The Visual Munch</span>
            </div>
            <p className="font-display text-lg italic text-stone-300 leading-relaxed">
              "Witness the golden caramel glaze meeting our sun-ripened Californian almonds in a slow, sensory dance."
            </p>
            <div className="flex gap-4 mt-8">
              <button onClick={handleAddToWishlist} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><span className="material-symbols-outlined !text-sm">favorite</span></button>
              <button onClick={handleShare} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><span className="material-symbols-outlined !text-sm">share</span></button>
            </div>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="px-8 lg:px-20 py-16 lg:py-24 bg-background-cream overflow-y-auto">

          {/* Breadcrumb / Series */}
          <div className="flex items-center gap-2 text-[10px] text-accent-terra font-bold tracking-widest uppercase mb-12">
            <Link to="/shop" className="hover:underline">Collection</Link>
            <span>/</span>
            <span>{product.category || 'Gourmet Series'}</span>
          </div>

          <span className="block text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-4">Gourmet Series No. 04</span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-6 leading-tight max-w-lg">{product.name}</h1>

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-stone-200">
            <div className="flex text-accent-terra text-xs">★★★★★</div>
            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">12 Reviews</span>
            <div className="h-4 w-[1px] bg-stone-300"></div>
            <span className="font-display text-3xl text-secondary">${product.price.toFixed(2)}</span>
          </div>

          {/* The Munch Profile */}
          <div className="mb-12 space-y-8">
            <h4 className="text-xs font-bold text-primary/40 uppercase tracking-[0.3em] mb-6">The Munch Profile</h4>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">equalizer</span>
              </div>
              <div>
                <h5 className="font-bold text-primary text-sm mb-1">Crunch Level: High Impact</h5>
                <p className="text-xs text-stone-500 leading-relaxed">A sharp, satisfying snap followed by the dense, buttery texture of premium almonds.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h5 className="font-bold text-primary text-sm mb-1">Flavor Profile: Sweet & Sharp</h5>
                <p className="text-xs text-stone-500 leading-relaxed">Deep artisanal caramel notes balanced with the crystalline bite of hand-harvested sea salt.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">volunteer_activism</span>
              </div>
              <div>
                <h5 className="font-bold text-primary text-sm mb-1">Health Benefits</h5>
                <p className="text-xs text-stone-500 leading-relaxed">Rich in Vitamin E, heart-healthy fats, and plant-based protein for a sustained energy boost.</p>
              </div>
            </div>
          </div>

          {/* Selection */}
          <div className="space-y-6 mb-12">
            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] block">Select Weight</span>
            <div className="flex gap-4">
              {['125g', '250g', '500g'].map(w => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-6 py-3 border rounded-lg text-xs font-bold transition-all ${selectedWeight === w ? 'border-secondary text-secondary bg-secondary/5' : 'border-stone-200 text-primary/40 hover:border-secondary'}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-6 -mx-8 lg:-mx-20 border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4 max-w-md mx-auto">
              <div className="flex items-center bg-stone-100 rounded-full px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-primary hover:text-secondary">-</button>
                <span className="w-8 text-center text-sm font-bold text-primary">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-primary hover:text-secondary">+</button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-secondary text-white rounded-full py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-xl shadow-secondary/20"
              >
                <span className="material-symbols-outlined !text-sm">shopping_cart</span>
                Experience The Crunch — Add to Cart
              </button>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-stone-200">
            <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-4">Sensory Details</h4>
            {/* Could add more content here */}
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
