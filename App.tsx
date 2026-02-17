

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, CartItem, Page } from './types';
import QuickLookDrawer from './components/QuickLookDrawer';
import { PRODUCTS } from './constants';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { getCart, addToCart as apiAddToCart } from './lib/api';
import LuxuryLoader from './components/LuxuryLoader';
import WishlistDrawer from './components/WishlistDrawer';



const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quickLookProduct, setQuickLookProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
    if (e.type === 'submit' || (e as React.KeyboardEvent).key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
      }
    }
  };

  useEffect(() => {
    // Ensure loader stays for at least 2.5 seconds for the "luxury" feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initial Cart Load - Backend will assign session cookie if missing
    getCart().then(items => {
      setCart(items.filter(i => i.quantity > 0));
    }).catch(console.error);
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const items = await getCart();
      setCart(items.filter(i => i.quantity > 0));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const addToCart = async (product: Product, quantity: number = 1) => {
    // Optimistic Update
    const prevCart = [...cart];
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });

    setNotification(`Added ${quantity} x ${product.name} to cart`);
    setTimeout(() => setNotification(null), 3000);

    try {
      await apiAddToCart(product.id, quantity);
      // We can lazily refresh or just trust our optimistic update. 
      // Refreshing in background is safer for consistency.
      refreshCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
      setCart(prevCart); // Revert on failure
      setNotification("Failed to add to cart. Please try again.");
    }
  };

  const removeFromCart = async (id: string) => {
    const prevCart = [...cart];
    const item = cart.find(i => i.id === id);
    if (!item) return;

    // Optimistic Update
    setCart(prev => prev.filter(i => i.id !== id));

    try {
      await apiAddToCart(item.id, -item.quantity);
      // No need to await refresh, let it happen in background
      refreshCart();
    } catch (err) {
      console.error("Failed to remove from cart", err);
      setCart(prevCart); // Revert
    }
  };

  const updateQuantity = async (id: string, q: number) => {
    const prevCart = [...cart];
    const item = cart.find(i => i.id === id);
    if (!item || q < 1) return; // CartPage handles 0 as remove usually, but here guard

    const diff = q - item.quantity;
    if (diff === 0) return;

    // Optimistic Update
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i));

    try {
      await apiAddToCart(item.id, diff);
      // No need to await
      refreshCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
      setCart(prevCart); // Revert
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LuxuryLoader key="loader" />}
      </AnimatePresence>

      <ScrollToTop />

      {/* Top Bar relative to Screenshot 1 */}
      <div className="bg-secondary text-white text-[10px] tracking-widest font-bold py-2 px-8 flex justify-between items-center uppercase">
        <span className="hidden md:inline">Find Your Munch</span>
        <span className="text-center flex-1">Free Shipping on Orders Over $50</span>
        <span className="hidden md:inline">Nutmunch Loves Us ★★★★★</span>
      </div>

      <header className={`sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display text-3xl font-bold text-nuts-red tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined !text-3xl text-accent-terra">eco</span>
              Nutmunch
            </h1>
          </Link>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="flex w-full bg-background-cream rounded-full border border-stone-200 px-4 py-2 items-center gap-2 focus-within:border-accent-terra transition-colors">
              <select className="bg-transparent border-none text-xs font-bold text-primary uppercase focus:ring-0 p-0 cursor-pointer outline-none">
                <option>Categories</option>
                <option>Almonds</option>
                <option>Cashews</option>
              </select>
              <div className="h-4 w-[1px] bg-stone-300 mx-2"></div>
              <input
                type="text"
                placeholder="Search your favourite munchies..."
                className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder:text-stone-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
              <button
                onClick={handleSearch}
                className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white hover:bg-accent-terra transition-colors shadow-md"
              >
                <span className="material-symbols-outlined !text-sm">search</span>
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6 text-primary">
            <button onClick={() => setIsWishlistOpen(true)} className="hover:text-accent-terra transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <Link to="/cart" className="relative hover:text-accent-terra transition-colors group">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-nuts-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold group-hover:scale-110 transition-transform">{cartCount}</span>
            </Link>
            <button className="hover:text-accent-terra transition-colors">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>

        {/* Sub Nav */}
        <div className="border-t border-stone-100 py-3 hidden md:flex justify-center gap-4 text-xs font-bold uppercase tracking-wide text-primary/80 overflow-x-auto">
          {['Cashews', 'Almonds', 'Walnuts'].map(item => (
            <Link key={item} to={`/shop?category=${item}`} className="px-5 py-2 rounded-full border border-stone-200 hover:border-accent-terra hover:text-accent-terra transition-all whitespace-nowrap bg-white">
              {item}
            </Link>
          ))}
          <Link to="/shop?collection=gifts" className="px-6 py-2 rounded-full bg-accent-terra text-white shadow-md hover:bg-secondary transition-all whitespace-nowrap">
            Gifts &amp; Hampers
          </Link>
          {['Mix Special', 'Trail Mixs'].map(item => (
            <Link key={item} to={`/shop?category=${item}`} className="px-5 py-2 rounded-full border border-stone-200 hover:border-accent-terra hover:text-accent-terra transition-all whitespace-nowrap bg-white">
              {item}
            </Link>
          ))}
        </div>
      </header>

      {/* Quick Look & Notifications */}
      <QuickLookDrawer
        isOpen={!!quickLookProduct}
        onClose={() => setQuickLookProduct(null)}
        product={quickLookProduct}
        onAddToCart={addToCart}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onAddToCart={addToCart}
      />
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-[100] bg-primary text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="text-sm font-medium">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<HomePage onQuickLook={setQuickLookProduct} />} />
        <Route path="/shop" element={<ShopPage onQuickLook={setQuickLookProduct} />} />
        <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Routes>

      {/* New Footer based on Screenshot 1/Desktop */}
      <footer className="bg-background-cream pt-20 pb-12 border-t border-stone-200 mt-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-2xl font-bold text-nuts-red flex items-center gap-2">
                <span className="material-symbols-outlined">eco</span> Nutmunch
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
                Pure nature delivered to your doorstep. At Nutmunch, we believe in transparency, sustainability, and the perfect gourmet crunch.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors cursor-pointer text-stone-400">
                    <span className="material-symbols-outlined !text-sm">public</span>
                  </div>
                ))}
              </div>
            </div>

            {/* dynamic columns */}
            {[
              { title: "Company", links: ["Our Story", "Nutmunch Quality", "Sourcing Roots", "Careers"] },
              { title: "Support", links: ["Customer Care", "Track Nutmunch Order", "Terms of Service", "Privacy"] },
              { title: "FAQ", links: ["Subscriptions", "Bulk Orders", "Gift Cards", "Payments"] },
              { title: "Resources", links: ["Nutritional Guide", "Munching Recipes", "Wellness Blog", "Nutmunch TV"] }
            ].map(col => (
              <div key={col.title} className="space-y-6">
                <h4 className="font-bold text-xs uppercase tracking-widest text-primary">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link to="/shop" className="text-stone-500 hover:text-secondary text-sm transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-stone-400">Nutmunch Premium Gourmet © 2000-2024, All Rights Reserved</p>
            <div className="flex items-center gap-4">
              <img alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL85lJSJx-g1ZVaRPzssuD2Eyuu6yY3Onpx9Vt112te_xEmTEWvIRi78uiBgWrFCwDdwMEBVYdcC3jh-i2Q6nkmNqmReJC8_FOa9h2t9FZ1j120w1xDixMoJA-jV6Q-HOl73sMA4FVl4kXy67iyutDHzjNzPTKEva5z1RXlXxLyauJZnyP73g6CWYrPxrHhoOef5-EzACoGiSyVpAX-EvEccvT2E2i8G4XoC2tvIvekeAuYNhkRLmcbKlBtsediP5nZHM1lhYx9TI" />
              <img alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBczLzHzdZdGBJb4z34LZlVuhRI95swMELAScVzE5kyfp7iQs2Tk8nVz78xey2Lo2-gDXZpsDBwTP25O_tnihXHbjpc04nzKZDoEYYCTeVNMz4vjAP2imiOJQx9_fL1ZEyooN4QbSs4lf4MZ271lGpuy2PhM2-PpMGmEP3wveG2xLYH7Ub2Qy6oJQDJ0TgQb7HAnlovcQEx7ktMRW2-Y5VOCEvKGHep86lAbKGXDkY93JqYCiwvXQdokBBFu6UUGCUw1g4pYoxDvok" />
              <img alt="Paypal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA59R8gnxJQvR3Wyl95bktrKPeTq6yKB_UO90jU05KdcoIdPRQKh_RhnNN3X9Rkm3c0YgQH9DDiB_Ywksz3bBgL1noxTXExH6eO61LJWU1k6G8ZJaraerwiQ4qM-kA5RhgvESttfIV83JZZMk6HSDbkuHDJ6WX7m3jae9nOwnOdsNKCzsG8TzrNJv7UPK_fpx8G3dG8r0AVW6QhUZQVPxKEeUw-iR-Un_jEeIox0Y_fjcpLpISIN3Clqc7hmxsppAkyKleZTFwVL48" />
              <img alt="Apple Pay" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkYAK0kiWDVzskrdIRGqIudTLumQK_m5_dbuFOH388i0bqj_ZD35jPhx3QSnFoWcmHypfZKHTfiTPbNJSrWKIecl_kKeM4_-7Gr25z1viLVXmC3SKDuJ-uCrjMmzmbz3pyIOBgqYC1ANa_fZ1YQviiOIl4bZl4auniQ9e9PbBfOg4pDe2nQsxc4eynV9gSPOnWPZ8tysBOKaGL6Mxc3H4i5sOxEBukLyNpl-5CzD0KC0HDZyWb5y8rJDTg2iKLL-8UfXqDMyPrrGY" />
              <img alt="Google Pay" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOACe5Rfo5lC6vMoouKqmRgdTKAaJzBsCWzxytExnAXAOSI9ZgQ_UbCB0JZ06_Pw_rvQsawpchlD_Q5-KolOoGrXY9PaEKeT2yJNQCQaxT0SfvVenC5-Er-ZYSF1feFxtxyjxEKAg2Htaf7Ia_f1if2MOqGPbsbwUoG0v1j_p4rlVpLQb1QdQsDSIVBhU3yhVVyFqtCMH4UX929Jn9mfGE9en4ZZ4Nx5KKT1KcKqEY-tJjDLiDpJg69p-ypZ7p5cwOUQSCmIVU9ZA" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// Helper to scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default App;
