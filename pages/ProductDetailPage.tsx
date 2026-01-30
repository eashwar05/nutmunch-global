

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
  const [isFavorite, setIsFavorite] = useState(false);

  // State for weight selection
  const [selectedWeight, setSelectedWeight] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedWeight(product.weight);
    }
  }, [product]);

  // Derived price based on weight (Mock logic: Bulk is 3x weight for 2.5x price)
  const isBulk = selectedWeight && selectedWeight.includes('Bulk');
  // Use 1 as fallback price to prevent NaN if product is null initially
  const currentPrice = (product && isBulk) ? product.price * 2.5 : (product ? product.price : 0);

  useEffect(() => {
    // Check favorites
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (id) setIsFavorite(favs.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    if (!id) return;
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavs;
    if (favs.includes(id)) {
      newFavs = favs.filter((fid: string) => fid !== id);
      setIsFavorite(false);
    } else {
      newFavs = [...favs, id];
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

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

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-2xl font-display text-primary uppercase tracking-widest">Loading Harvest...</div>
    </div>
  );
  if (!product) return <div className="py-24 text-center">Product not found.</div>;

  // Parse nutritional info safely
  const nutritionalData = product.nutritional_info ? JSON.parse(product.nutritional_info) : {};

  return (

    <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16 min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 mb-12 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <Link className="hover:text-primary transition-colors" to="/shop">Collections</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-primary font-black">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-20 mb-32">
        {/* Left Column: Image Gallery */}
        <div className="flex-1 space-y-6">
          <div className="relative group aspect-square lg:aspect-[4/5] bg-background-paper rounded-sm overflow-hidden animate-fade-in">
            <div className="w-full h-full bg-center bg-no-repeat bg-contain mix-blend-multiply opacity-90 transform transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105" style={{ backgroundImage: `url("${product.image}")` }}></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* Thumbnail placeholders - naturally would iterate over images if we had multiple */}
            <div className="aspect-square bg-background-paper bg-center bg-contain bg-no-repeat mix-blend-multiply cursor-pointer border border-primary/20 hover:border-accent-gold transition-colors" style={{ backgroundImage: `url("${product.image}")` }}></div>
            <div className="aspect-square bg-background-paper rounded-sm flex items-center justify-center cursor-pointer border border-transparent hover:border-primary/10 transition-colors group">
              <span className="material-symbols-outlined text-4xl text-primary/20 group-hover:text-accent-gold transition-colors">play_circle</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="flex-1 flex flex-col pt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent-gold/30 text-accent-gold rounded-full text-[9px] font-extrabold tracking-widest uppercase mb-6">
              <span className="material-symbols-outlined text-sm">verified</span>
              {product.grade} Grade Export Quality
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-black leading-[0.9] mb-4 tracking-tight text-primary">{product.name}</h1>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-accent-gold">
                {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined fill-1 !text-lg">star</span>)}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/40">(128 reviews)</span>
            </div>
            <p className="font-sans text-primary/60 text-lg leading-loose font-light max-w-lg">
              {product.description} Sourced directly from our heritage orchards. Hand-sorted and processed in climate-controlled facilities to preserve essential oils, crunch, and the distinct flavor profile of the {product.origin} terroir.
            </p>
          </div>

          <div className="space-y-10">


            {/* Weight Selector */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Select Weight</p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => setSelectedWeight(product.weight)}
                  className={`px-8 py-4 border text-xs font-bold uppercase tracking-widest transition-all ${!isBulk
                    ? 'border-primary bg-primary text-white shadow-xl shadow-primary/10'
                    : 'border-primary/10 text-primary/40 hover:border-primary/40 hover:text-primary'
                    }`}
                >
                  {product.weight}
                </button>
                <button
                  onClick={() => setSelectedWeight('1.5kg Bulk')}
                  className={`px-8 py-4 border text-xs font-bold uppercase tracking-widest transition-all ${isBulk
                    ? 'border-primary bg-primary text-white shadow-xl shadow-primary/10'
                    : 'border-primary/10 text-primary/40 hover:border-primary/40 hover:text-primary'
                    }`}
                >
                  1.5kg Bulk
                </button>
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="flex items-end justify-between border-t border-b border-primary/5 py-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Quantity</p>
                <div className="flex items-center border border-primary/10 rounded-full w-fit px-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="size-10 flex items-center justify-center text-primary/40 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined !text-lg">remove</span>
                  </button>
                  <span className="w-10 text-center font-display font-bold text-xl text-primary">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="size-10 flex items-center justify-center text-primary/40 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined !text-lg">add</span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-2">Total</p>
                <p className="font-display text-4xl font-black text-primary">${(currentPrice * quantity).toFixed(2)}</p>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex gap-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-primary hover:bg-black text-white py-5 px-8 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-1"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Add to Cart</span>
              </button>
              <button onClick={toggleFavorite} className={`px-6 border hover:border-accent-gold hover:text-accent-gold flex items-center justify-center transition-all group ${isFavorite ? 'border-accent-gold text-accent-gold bg-accent-gold/5' : 'border-primary/10 text-primary/30'}`}>
                <span className={`material-symbols-outlined group-hover:scale-110 transition-transform ${isFavorite ? 'fill-1' : ''}`}>favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="border-t border-primary/5 pt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex justify-center gap-16 mb-16 overflow-x-auto scrollbar-hide">
          {['origin', 'nutritional', 'sustainability'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-xs font-bold uppercase tracking-[0.2em] border-b-[3px] transition-all whitespace-nowrap ${activeTab === tab ? 'border-accent-gold text-primary' : 'border-transparent text-primary/30 hover:text-primary'}`}
            >
              {tab === 'origin' ? 'Origin Story' : tab === 'nutritional' ? 'Nutrition' : 'Sustainability'}
            </button>
          ))}
        </div>

        {activeTab === 'origin' && (
          <div className="grid lg:grid-cols-2 gap-20 items-center animate-fade-in">
            <div className="space-y-8 order-2 lg:order-1">
              <h3 className="text-4xl font-display font-bold text-primary">A Legacy of Export Excellence</h3>
              <p className="text-primary/60 leading-loose text-lg font-light">
                {product.sustainability_info || `Sourced from the heart of the ${product.origin} region. Our orchards have been cultivated for generations, ensuring the perfect balance of soil nutrients and climate for this specific variety.`}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-primary/5">
                <div>
                  <p className="text-4xl font-display font-bold text-accent-gold">40+</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold mt-1">Years of Heritage</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-accent-gold">100%</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold mt-1">Ethically Sourced</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-sm overflow-hidden aspect-[4/3] order-1 lg:order-2">
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
              <div className="w-full h-full bg-center bg-cover grayscale hover:grayscale-0 transition-all duration-[1.5s]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBe9XQoCjsQeaVATd0FcCpMc_UxBf6G8dwAmdU1VLDfxEXcqdKgzCx-S9xAyxqJGX4UqqjSUNpyGwvE33HOhD0G9efdTVVTbcrXAkh77XH7Dz3cRmd28vN_T40lNrGog_MszAMlx85PVDc43A1ZPXozv61w3zJHXn0LIBLFk8U_ZoRhRC1EfyQpLohJJc6yZP4fOs70eJX9TxWJqf_FR6Gw1CXf90bVv3t6CNq6gWMeQzD8mAG3k-scuGO3jBqRr8qO4hjFHHdUXVU")' }}></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">Harvest Region</p>
                <p className="font-display text-3xl font-medium">{product.origin}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutritional' && (
          <div className="max-w-4xl mx-auto p-12 bg-background-paper border border-primary/5 animate-fade-in">
            <h3 className="text-2xl font-display font-bold mb-12 text-center text-primary">
              Nutritional Profile <span className="text-lg font-sans font-normal text-primary/40 block mt-2 text-sm tracking-widest uppercase">(Per 100g Serving)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {Object.entries(nutritionalData).length > 0 ? (
                Object.entries(nutritionalData).map(([key, value]) => (
                  <div key={key} className="space-y-4 group">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 group-hover:text-accent-gold transition-colors">{key}</p>
                    <p className="text-4xl font-display font-bold text-primary">{String(value)}</p>
                    <div className="w-8 h-[1px] bg-primary/10 mx-auto group-hover:w-16 transition-all duration-500"></div>
                  </div>
                ))
              ) : (
                <p className="col-span-4 text-center text-primary/40 italic">No nutritional data available.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sustainability' && (
          <div className="max-w-3xl mx-auto text-center animate-fade-in space-y-8">
            <span className="material-symbols-outlined !text-6xl text-accent-gold">eco</span>
            <h3 className="font-display text-3xl font-bold text-primary">Committed to the Earth</h3>
            <p className="leading-loose text-primary/60 font-light text-lg">
              Our farming partners utilize advanced drip irrigation techniques to minimize water usage by up to 30%. Every shell is repurposed for livestock bedding or renewable energy, ensuring a zero-waste harvest cycle.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
