

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../lib/api';
import { Product } from '../types';

interface ShopPageProps {
  onQuickLook?: (product: Product) => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onQuickLook }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');
  const sortByParam = searchParams.get('sort_by');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Constants for Filters
  const CATEGORIES = ['Roasted', 'Raw', 'Confection', 'Reserve'];
  const PRICE_RANGES = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $40', min: 25, max: 40 },
    { label: '$40 & Above', min: 40, max: 1000 }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(
          categoryParam || undefined,
          sortByParam || undefined,
          minPriceParam ? parseFloat(minPriceParam) : undefined,
          maxPriceParam ? parseFloat(maxPriceParam) : undefined
        );
        const mappedData = data.map((p: any) => ({
          ...p,
          image: p.image_url || p.image
        }));
        setProducts(mappedData);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryParam, sortByParam, minPriceParam, maxPriceParam]);

  if (loading) return <div className="flex justify-center items-center h-screen text-primary font-bold tracking-widest uppercase">Loading Collection...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-nuts-red font-bold">{error}</div>;

  return (
    <main className="bg-background-cream min-h-screen pt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Breadcrumbs */}
        <div className="text-[10px] uppercase font-bold tracking-widest text-primary/40 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>•</span>
          <span className="text-primary">Shop All</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-5xl md:text-6xl text-primary font-medium mb-4">Premium Gourmet Collection</h1>
          <p className="text-stone-500 max-w-2xl leading-relaxed font-light">
            Elevate your snacking experience with our hand-picked selection of the world's finest nuts, roasted to perfection and seasoned with artisanal ingredients.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-b border-stone-200 py-4 mb-12 gap-4">
          {/* Left Filters */}
          {/* Left Filters */}
          <div className="flex gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {/* Category Filter */}
            <div className="relative group">
              <button className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-full border transition-all whitespace-nowrap ${categoryParam ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-stone-200 hover:border-accent-terra'}`}>
                {categoryParam || 'Category'} <span className="material-symbols-outlined !text-sm">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20 min-w-[150px]">
                <Link to="/shop" className="block px-4 py-2 hover:bg-stone-50 text-xs uppercase font-bold text-stone-500">All Categories</Link>
                {CATEGORIES.map(cat => (
                  <Link key={cat} to={`/shop?category=${cat}${sortByParam ? `&sort_by=${sortByParam}` : ''}`} className="block px-4 py-2 hover:bg-stone-50 text-primary">{cat}</Link>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="relative group">
              <button className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-full border transition-all whitespace-nowrap ${(minPriceParam || maxPriceParam) ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-stone-200 hover:border-accent-terra'}`}>
                Price <span className="material-symbols-outlined !text-sm">expand_more</span>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20 min-w-[150px]">
                <Link to="/shop" className="block px-4 py-2 hover:bg-stone-50 text-xs uppercase font-bold text-stone-500">All Prices</Link>
                {PRICE_RANGES.map(range => (
                  <Link
                    key={range.label}
                    to={`/shop?${categoryParam ? `category=${categoryParam}&` : ''}min_price=${range.min}&max_price=${range.max}${sortByParam ? `&sort_by=${sortByParam}` : ''}`}
                    className="block px-4 py-2 hover:bg-stone-50 text-primary"
                  >
                    {range.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sort/Count */}
          <div className="flex items-center gap-6 text-xs text-primary/60 font-medium">
            <span className="hidden md:inline">Showing {products.length} products</span>
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary relative group">
              <span>Sort by: {sortByParam ? sortByParam.replace('_', ' ') : 'Featured'}</span>
              <span className="material-symbols-outlined !text-sm">expand_more</span>

              <div className="absolute top-full right-0 mt-2 bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20 min-w-[150px]">
                <Link to={`/shop${categoryParam ? `?category=${categoryParam}&` : '?'}sort_by=price_asc`} className="block px-4 py-2 hover:bg-stone-50">Price: Low to High</Link>
                <Link to={`/shop${categoryParam ? `?category=${categoryParam}&` : '?'}sort_by=price_desc`} className="block px-4 py-2 hover:bg-stone-50">Price: High to Low</Link>
                <Link to={`/shop${categoryParam ? `?category=${categoryParam}&` : '?'}sort_by=newest`} className="block px-4 py-2 hover:bg-stone-50">Newest Arrivals</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group block">
              <div className="bg-stone-100 relative aspect-square overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                />
                {onQuickLook && (
                  <button
                    onClick={(e) => { e.preventDefault(); onQuickLook(product); }}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-accent-terra hover:text-white transform translate-y-4 group-hover:translate-y-0"
                  >
                    <span className="material-symbols-outlined !text-lg">visibility</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex text-accent-terra text-[10px] gap-0.5">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  <span className="text-stone-400 ml-1 font-medium">({Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <h3 className="font-display text-xl text-primary leading-tight group-hover:text-accent-terra transition-colors">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-bold text-sm">Rs. {product.price * 25}</span> {/* Mocking Rs conversion roughly or just changing symbol if user wants Rs */}
                  <span className="text-[10px] text-stone-400 uppercase tracking-wide">MRP: From Rs. {(product.price * 25 * 1.2).toFixed(0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-stone-200 mb-4">search_off</span>
            <h3 className="font-display text-2xl text-primary mb-2">No Harvest Found</h3>
            <p className="text-stone-500 mb-8">Try adjusting your filters or search criteria.</p>
            <Link to="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors">Clear All Filters</Link>
          </div>
        )}

        {/* Pagination */}
        {/* Pagination - Hide if few products */}
        {products.length > 8 && (
          <div className="mt-20 flex justify-center gap-2">
            <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white transition-colors text-primary"><span className="material-symbols-outlined !text-sm">chevron_left</span></button>
            <button className="w-10 h-10 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-lg">1</button>
            <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white transition-colors text-primary text-xs font-bold">2</button>
            <span className="w-10 h-10 flex items-center justify-center text-stone-400">...</span>
            <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white transition-colors text-primary"><span className="material-symbols-outlined !text-sm">chevron_right</span></button>
          </div>
        )}

      </div>
    </main>
  );
};

export default ShopPage;
