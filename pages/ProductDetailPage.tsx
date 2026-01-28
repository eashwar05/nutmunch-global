

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../lib/api';
import { Product } from '../types';

interface Props {
  addToCart: (p: Product, q: number) => void;
}

const ProductDetailPage: React.FC<Props> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('origin');

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await fetchProduct(id);
        // Map image_url to image
        const mappedProduct = {
          ...data,
          image: (data as any).image_url || data.image
        };
        setProduct(mappedProduct);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="py-24 text-center">Loading...</div>;
  if (!product) return <div className="py-24 text-center">Product not found.</div>;

  return (
    <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-stone-500 dark:text-stone-400">
        <Link className="hover:text-primary" to="/">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary" to="/shop">Collections</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-stone-800 dark:text-white font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16 mb-20">
        {/* Left Column: Image Gallery */}
        <div className="flex-1 space-y-4">
          <div className="relative group aspect-[4/5] bg-stone-200 dark:bg-white/5 rounded-xl overflow-hidden shadow-sm">
            <div className="w-full h-full bg-center bg-no-repeat bg-cover transform transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${product.image}")` }}></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square bg-center bg-cover rounded-lg cursor-pointer border-2 border-primary" style={{ backgroundImage: `url("${product.image}")` }}></div>
            <div className="aspect-square bg-[#f2f3f2] dark:bg-white/5 rounded-lg flex items-center justify-center cursor-pointer border-2 border-transparent">
              <span className="material-symbols-outlined text-3xl opacity-40">play_circle</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="flex-1 flex flex-col pt-4">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              <span className="material-symbols-outlined text-sm">verified</span>
              Export Quality Standard
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-2 tracking-tight text-primary">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined fill-1">star</span>)}
              </div>
              <span className="text-sm text-stone-400">(128 reviews)</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed max-w-lg">
              {product.description} Hand-sorted and processed in our climate-controlled heritage facilities to preserve essential oils and crunch.
            </p>
          </div>

          <div className="space-y-8">
            {/* Weight Selector */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-white mb-4">Select Weight</label>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 border-2 border-primary bg-primary text-white rounded-xl font-medium transition-all">{product.weight}</button>
                <button className="px-6 py-3 border-2 border-stone-200 dark:border-white/10 hover:border-primary/50 rounded-xl font-medium transition-all text-stone-400">1.5kg Bulk</button>
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="flex items-end justify-between border-t border-b border-stone-100 dark:border-white/10 py-8">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-4">Quantity</label>
                <div className="flex items-center bg-[#f2f3f2] dark:bg-white/5 rounded-xl w-fit">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="size-12 flex items-center justify-center hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="size-12 flex items-center justify-center hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-stone-400 uppercase font-bold tracking-widest mb-1">Total Price</p>
                <p className="text-4xl font-bold text-primary">${(product.price * quantity).toFixed(2)}</p>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
              <button className="size-16 border-2 border-stone-100 dark:border-white/10 hover:border-primary hover:text-primary rounded-xl flex items-center justify-center transition-all group">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="border-t border-stone-100 dark:border-white/10 pt-12">
        <div className="flex gap-12 border-b border-stone-100 dark:border-white/10 mb-8 overflow-x-auto scrollbar-hide">
          {['origin', 'nutritional', 'sustainability'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-bold border-b-2 transition-all uppercase tracking-widest text-sm whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-stone-400 hover:text-stone-800'}`}
            >
              {tab === 'origin' ? 'Origin Story' : tab === 'nutritional' ? 'Nutritional Profile' : 'Sustainability'}
            </button>
          ))}
        </div>

        {activeTab === 'origin' && (
          <div className="grid lg:grid-cols-2 gap-16 items-start animate-fade-in">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold italic font-display text-primary">A Legacy of Export Excellence</h3>
              <p className="text-stone-500 leading-relaxed text-lg">
                Sourced from the heart of the {product.origin} region. Our orchards have been cultivated for generations, ensuring the perfect balance of soil nutrients and climate for this specific variety.
              </p>
              <p className="text-stone-500 leading-relaxed text-lg">
                Each nut is sorted by hand, ensuring that only the "{product.grade}" grade—those with perfect shape, size, and skin integrity—make it into our premium packaging.
              </p>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">40+</p>
                  <p className="text-sm text-stone-400 font-medium">Years of Heritage</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-stone-400 font-medium">Quality Checks</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBe9XQoCjsQeaVATd0FcCpMc_UxBf6G8dwAmdU1VLDfxEXcqdKgzCx-S9xAyxqJGX4UqqjSUNpyGwvE33HOhD0G9efdTVVTbcrXAkh77XH7Dz3cRmd28vN_T40lNrGog_MszAMlx85PVDc43A1ZPXozv61w3zJHXn0LIBLFk8U_ZoRhRC1EfyQpLohJJc6yZP4fOs70eJX9TxWJqf_FR6Gw1CXf90bVv3t6CNq6gWMeQzD8mAG3k-scuGO3jBqRr8qO4hjFHHdUXVU")' }}></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-bold uppercase tracking-widest mb-1">Harvest Location</p>
                <p className="text-xl font-medium">{product.origin}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutritional' && (
          <div className="p-10 bg-accent-gold/5 rounded-3xl border border-accent-gold/20 animate-fade-in">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">nutrition</span>
              Nutritional Profile <span className="text-sm font-normal text-stone-400">(per 100g serving)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Calories', val: '579 kcal', pct: '70%' },
                { label: 'Protein', val: '21.2 g', pct: '40%' },
                { label: 'Healthy Fats', val: '49.9 g', pct: '85%' },
                { label: 'Vitamin E', val: '26.2 mg', pct: '95%' }
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <p className="text-xs font-bold uppercase text-stone-400">{item.label}</p>
                  <p className="text-2xl font-bold text-stone-800">{item.val}</p>
                  <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: item.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
