

import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Product, CartItem, Page } from './types';
import { PRODUCTS } from './constants';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import { getCart, addToCart as apiAddToCart } from './lib/api';

// Components
const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-background-light/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      {/* Utility Bar - Minimal */}
      <div className="hidden md:flex justify-between items-center px-12 py-3 text-[10px] tracking-[0.2em] uppercase font-bold text-primary/40">
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-accent-gold transition-colors">Global Shipping</span>
          <span className="cursor-pointer hover:text-accent-gold transition-colors">Wholesale Portal</span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined !text-sm">language</span>
            <span>EN / USD</span>
          </div>
          <a className="hover:text-accent-gold transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Account portal coming soon."); }}>My Account</a>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex-1 hidden lg:flex gap-12 text-[11px] tracking-[0.15em] uppercase font-semibold text-primary/80">
          <Link to="/shop" className="hover:text-primary transition-colors hover:line-through decoration-accent-gold">Collections</Link>
          <Link to="/#legacy" className="hover:text-primary transition-colors hover:line-through decoration-accent-gold">Our Heritage</Link>
          <Link to="/shop?grade=Reserve" className="hover:text-primary transition-colors hover:line-through decoration-accent-gold">Export Services</Link>
        </div>

        <Link to="/" className="flex flex-col items-center">
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-primary uppercase">NUTMUNCH</h1>
          <span className="text-[9px] tracking-[0.4em] uppercase text-accent-gold font-bold mt-1">Est. 1984</span>
        </Link>

        <div className="flex-1 flex justify-end items-center gap-8">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center border-b border-primary/20 pb-1 hover:border-accent-gold transition-colors group">
            <span className="material-symbols-outlined text-primary/40 !text-lg group-hover:text-accent-gold transition-colors">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-primary/30 text-primary w-24 lg:w-32 py-0 font-light"
              placeholder="Search..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-6">
            <button className="relative hover:text-accent-gold transition-colors text-primary">
              <span className="material-symbols-outlined !text-xl">favorite</span>
            </button>
            <Link to="/cart" className="relative hover:text-accent-gold transition-colors text-primary">
              <span className="material-symbols-outlined !text-xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined !text-2xl text-primary">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-background-light z-[60] transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-8 border-b border-primary/10">
          <span className="font-display text-xl font-bold text-primary">NUTMUNCH</span>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined !text-3xl text-primary">close</span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full gap-10 text-3xl font-display text-primary">
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:italic transition-all">Collections</Link>
          <Link to="/#legacy" onClick={() => setIsMobileMenuOpen(false)} className="hover:italic transition-all">Heritage</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="hover:italic transition-all">Cart ({cartCount})</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Account portal coming soon"); setIsMobileMenuOpen(false); }} className="hover:italic transition-all">Account</a>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-background-paper pt-24 pb-12 border-t border-primary/5">
    <div className="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-24">
      <div className="md:col-span-2 space-y-8">
        <h2 className="font-display text-4xl text-primary font-bold tracking-tight">NUTMUNCH</h2>
        <p className="text-primary/60 max-w-sm text-lg leading-relaxed font-light">
          Purveyors of the world's most discerning palates with the finest almonds and artisanal nut blends. Cultivating heritage since 1984.
        </p>
        <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all"><span className="text-[10px] font-bold">IG</span></div>
          <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all"><span className="text-[10px] font-bold">FB</span></div>
          <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all"><span className="text-[10px] font-bold">LI</span></div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-display text-xl text-primary">Collection</h4>
        <ul className="space-y-4 text-primary/60 font-light">
          <li><Link to="/shop" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">All Products</Link></li>
          <li><Link to="/shop?category=Raw" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Raw Kernels</Link></li>
          <li><Link to="/shop?category=Roasted" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Roasted & Salted</Link></li>
          <li><Link to="/shop?grade=Premium" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Premium Grade</Link></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="font-display text-xl text-primary">Company</h4>
        <ul className="space-y-4 text-primary/60 font-light">
          <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Our Heritage</a></li>
          <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Sustainability</a></li>
          <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Contact</a></li>
          <li><a href="#" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Wholesale</a></li>
        </ul>
      </div>
    </div>

    <div className="max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-primary/5 text-xs text-primary/30 uppercase tracking-widest">
      <p>&copy; 2024 Nutmunch Global. All rights reserved.</p>
      <div className="flex gap-8 mt-4 md:mt-0">
        <a href="#" className="hover:text-primary">Privacy Policy</a>
        <a href="#" className="hover:text-primary">Terms of Service</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let sid = localStorage.getItem('session_id');
    if (!sid) {
      sid = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('session_id', sid);
    }
    setSessionId(sid);

    // Fetch initial cart
    getCart(sid).then(items => {
      // Filter out items with 0 quantity (workaround since we don't delete them on backend)
      setCart(items.filter(i => i.quantity > 0));
    }).catch(console.error);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    try {
      const items = await getCart(sessionId);
      setCart(items.filter(i => i.quantity > 0));
    } catch (err) {
      console.error(err);
    }
  }, [sessionId]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!sessionId) return;
    try {
      await apiAddToCart(sessionId, product.id, quantity);
      await refreshCart();
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const removeFromCart = async (id: string) => {
    // Note: id passed here is the product ID (as per CartPage usage)
    const item = cart.find(i => i.id === id);
    if (item && sessionId) {
      try {
        await apiAddToCart(sessionId, item.id, -item.quantity);
        await refreshCart();
      } catch (err) {
        console.error("Failed to remove from cart", err);
      }
    }
  };

  const updateQuantity = async (id: string, q: number) => {
    const item = cart.find(i => i.id === id);
    if (item && sessionId) {
      const diff = q - item.quantity;
      if (diff !== 0) {
        try {
          await apiAddToCart(sessionId, item.id, diff);
          await refreshCart();
        } catch (err) {
          console.error("Failed to update quantity", err);
        }
      }
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <ScrollToTop />
      <Header cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
      </Routes>
      <Footer />
      {/* Concierge Button */}
      <button onClick={() => alert("Concierge is currently offline. Please call +1 (800) 555-ALMD")} className="fixed bottom-8 right-8 z-50 group flex items-center gap-4">
        <span className="bg-white dark:bg-stone-800 text-stone-800 dark:text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-2xl transition-opacity border border-stone-200 dark:border-stone-700 opacity-0 group-hover:opacity-100">Concierge Help</span>
        <div className="w-14 h-14 bg-accent-gold text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(199,161,94,0.4)] hover:scale-110 transition-transform">
          <span className="material-symbols-outlined !text-2xl">support_agent</span>
        </div>
      </button>
    </Router>
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
