

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../lib/api';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterGrade, setFilterGrade] = useState<string[]>([]);
  const [filterOrigin, setFilterOrigin] = useState<string[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
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
  }, []);

  const filteredProducts = products.filter(p => {
    const gradeMatch = filterGrade.length === 0 || filterGrade.includes(p.grade);
    const originMatch = filterOrigin.length === 0 || filterOrigin.includes(p.origin);
    return gradeMatch && originMatch;
  });

  const toggleFilter = (val: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-primary font-bold tracking-widest uppercase">Loading Registry...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;

  return (
    <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8 min-h-screen">
      {/* Breadcrumbs */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/40 mb-4">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-primary/80">Collections</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 leading-tight">Curated Almond Collections</h1>
            <p className="text-lg text-primary/60 font-light">Directly sourced from the world's most prestigious orchards. Sustainably harvested, meticulously graded, and packed for freshness.</p>
          </div>
          <div className="flex items-center gap-4 border-b border-primary/10 pb-2">
            <span className="text-sm font-medium text-primary/50 whitespace-nowrap">Sort by:</span>
            <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
              <option>Featured Selection</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Harvest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Grade</h3>
                <button onClick={() => setFilterGrade([])} className="text-[10px] font-bold text-accent-gold uppercase hover:underline">Clear</button>
              </div>
              <div className="space-y-3">
                {['Premium', 'Standard', 'Reserve'].map(grade => (
                  <label key={grade} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filterGrade.includes(grade)}
                      onChange={() => toggleFilter(grade, filterGrade, setFilterGrade)}
                      className="size-5 rounded border-2 border-primary/20 text-primary focus:ring-0 focus:ring-offset-0 transition-all checked:bg-primary"
                    />
                    <span className="text-sm font-medium text-primary/80 group-hover:text-primary">{grade}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-primary/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Origin</h3>
              </div>
              <div className="space-y-3">
                {['USA (California)', 'Iran (Kerman)', 'Global'].map(origin => (
                  <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filterOrigin.includes(origin)}
                      onChange={() => toggleFilter(origin, filterOrigin, setFilterOrigin)}
                      className="size-5 rounded border-2 border-primary/20 text-primary focus:ring-0 focus:ring-offset-0 transition-all checked:bg-primary"
                    />
                    <span className="text-sm font-medium text-primary/80 group-hover:text-primary">{origin}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-xs font-bold text-primary uppercase mb-2">Heritage Guarantee</p>
              <p className="text-[11px] leading-relaxed text-primary/60">Every batch is verified for purity and origin-specific nutritional profiles by our internal lab.</p>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group relative bg-white dark:bg-stone-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f4f4f3] dark:bg-white/5">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={product.image} alt={product.name} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-accent-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{product.grade} Grade</span>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-extrabold text-accent-gold uppercase tracking-widest">Origin: {product.origin}</p>
                    <p className="text-[10px] font-bold text-primary/40 uppercase">{product.weight}</p>
                  </div>
                  <h3 className="text-lg font-bold text-primary group-hover:text-accent-gold transition-colors mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-black text-primary">${product.price.toFixed(2)}</span>
                    <Link to={`/product/${product.id}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-primary-dark transition-colors">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <h3 className="text-2xl font-display text-primary/40">No matching harvests found.</h3>
              <button onClick={() => { setFilterGrade([]); setFilterOrigin([]); }} className="mt-4 text-accent-gold uppercase font-bold tracking-widest text-xs">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
