

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../lib/api';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const gradeParam = searchParams.get('grade');
  /* Removed duplicates */
  const originParam = searchParams.get('origin');
  const searchParam = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterGrade, setFilterGrade] = useState<string[]>(gradeParam ? [gradeParam] : []);
  const [filterOrigin, setFilterOrigin] = useState<string[]>(originParam ? [originParam] : []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(categoryParam || undefined);
        // The backend returns image_url, but frontend usage expects 'image'. 
        // We need to map it or update the type. 
        // Looking at types.ts, Product has 'image'. Backend has 'image_url'.
        // I will map image_url to image here for compatibility.
        const mappedData = data.map((p: any) => ({
          ...p,
          image: p.image_url || p.image // Fallback if backend implementation changes
        }));
        setProducts(mappedData);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [categoryParam]);

  const filteredProducts = products.filter(p => {
    const gradeMatch = filterGrade.length === 0 || filterGrade.includes(p.grade);
    const originMatch = filterOrigin.length === 0 || filterOrigin.includes(p.origin);
    const searchMatch = !searchParam ||
      p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      p.description.toLowerCase().includes(searchParam.toLowerCase());

    return gradeMatch && originMatch && searchMatch;
  });

  const toggleFilter = (val: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-primary font-bold tracking-widest uppercase">Loading Registry...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;

  return (

    <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12 min-h-screen">
      {/* Breadcrumbs & Header */}
      <div className="mb-20 animate-fade-in">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 mb-8">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary/80">Collections</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-6xl font-black text-primary mb-6 leading-[0.9]">Curated Collections</h1>
            <p className="text-lg text-primary/60 font-light leading-relaxed max-w-xl">
              Directly sourced from the world's most prestigious orchards. Sustainably harvested, meticulously graded, and packed for peak freshness.
            </p>
          </div>
          <div className="flex items-center gap-4 border-b border-primary/10 pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary/40 whitespace-nowrap">Sort Order</span>
            <select className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 cursor-pointer uppercase tracking-widest text-right">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Harvest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Sidebar Filters - Minimal */}
        <aside className="w-full lg:w-48 flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="sticky top-32 space-y-12">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold text-primary">Grade</h3>
                {(filterGrade.length > 0) && (
                  <button onClick={() => setFilterGrade([])} className="text-[9px] font-bold text-accent-gold uppercase tracking-widest hover:underline">Reset</button>
                )}
              </div>
              <div className="space-y-4">
                {['Premium', 'Standard', 'Reserve'].map(grade => (
                  <label key={grade} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-3 h-3 border border-primary/30 flex items-center justify-center transition-all ${filterGrade.includes(grade) ? 'bg-primary border-primary' : 'bg-transparent group-hover:border-primary'}`}>
                      {filterGrade.includes(grade) && <div className="w-1.5 h-1.5 bg-white"></div>}
                    </div>
                    <span className={`text-sm tracking-wide transition-colors ${filterGrade.includes(grade) ? 'text-primary font-bold' : 'text-primary/60 font-light group-hover:text-primary'}`}>{grade}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-primary/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold text-primary">Origin</h3>
                {(filterOrigin.length > 0) && (
                  <button onClick={() => setFilterOrigin([])} className="text-[9px] font-bold text-accent-gold uppercase tracking-widest hover:underline">Reset</button>
                )}
              </div>
              <div className="space-y-4">
                {['USA (California)', 'Iran (Kerman)', 'Global'].map(origin => (
                  <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-3 h-3 border border-primary/30 flex items-center justify-center transition-all ${filterOrigin.includes(origin) ? 'bg-primary border-primary' : 'bg-transparent group-hover:border-primary'}`}>
                      {filterOrigin.includes(origin) && <div className="w-1.5 h-1.5 bg-white"></div>}
                    </div>
                    <span className={`text-sm tracking-wide transition-colors ${filterOrigin.includes(origin) ? 'text-primary font-bold' : 'text-primary/60 font-light group-hover:text-primary'}`}>{origin}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid - Waterfall */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
              {filteredProducts.map((product, index) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group block animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[3/4] bg-background-paper overflow-hidden mb-8">
                    {/* Image with Blending */}
                    <div
                      className="w-full h-full bg-center bg-contain bg-no-repeat mix-blend-multiply opacity-90 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url("${product.image}")` }}
                    ></div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                  </div>

                  <div className="space-y-3 text-center">
                    <p className="text-[10px] text-accent-gold uppercase tracking-[0.2em] font-bold">{product.origin}</p>
                    <h3 className="font-display text-2xl text-primary group-hover:text-accent-gold transition-colors">{product.name}</h3>
                    <p className="text-primary/50 font-light text-sm tracking-widest">${product.price.toFixed(2)} USD</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <h3 className="text-3xl font-display text-primary/20 italic mb-6">No harvests found.</h3>
              <button onClick={() => { setFilterGrade([]); setFilterOrigin([]); window.history.pushState({}, '', '#/shop'); }} className="text-sm font-bold text-accent-gold uppercase tracking-widest border-b border-accent-gold pb-1 hover:text-primary hover:border-primary transition-colors">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
