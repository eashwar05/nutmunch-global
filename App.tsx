

import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, CartItem, Page } from './types';
import { PRODUCTS } from './constants';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import { getCart, addToCart as apiAddToCart } from './lib/api';

// Components
const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      {/* Utility Bar */}
      <div className="hidden md:flex justify-between items-center px-12 py-2 border-b border-border-soft dark:border-stone-800 text-[10px] tracking-[0.2em] uppercase font-medium text-stone-500">
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
        <div className="flex-1 hidden lg:flex gap-10 text-[11px] tracking-[0.15em] uppercase font-semibold">
          <Link to="/shop" className="hover:text-primary transition-colors">Collections</Link>
          <Link to="/#legacy" className="hover:text-primary transition-colors">Our Heritage</Link>
          <Link to="/shop?grade=Reserve" className="hover:text-primary transition-colors">Export Services</Link>
        </div>

        <Link to="/" className="flex flex-col items-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-primary dark:text-white uppercase">NUTMUNCH</h1>
          <span className="text-[9px] tracking-[0.4em] uppercase text-accent-gold font-bold">Est. 1984</span>
        </Link>

        <div className="flex-1 flex justify-end items-center gap-6">
          <div className="hidden sm:flex items-center border-b border-stone-300 dark:border-stone-700 pb-1">
            <span className="material-symbols-outlined text-stone-400 !text-xl">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-stone-400 w-32 lg:w-48 py-0" placeholder="Search collection" type="text" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative hover:text-primary transition-colors">
              <span className="material-symbols-outlined !text-2xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined !text-2xl">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-background-light dark:bg-stone-900 z-[60] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-8">
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined !text-3xl">close</span>
          </button>
        </div>
        <div className="flex flex-col items-center gap-8 text-2xl font-display uppercase tracking-widest">
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
          <Link to="/#legacy" onClick={() => setIsMobileMenuOpen(false)}>Heritage</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Cart ({cartCount})</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Account portal coming soon"); setIsMobileMenuOpen(false); }}>Account</a>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-background-light dark:bg-background-dark pt-20 pb-10 border-t border-border-soft dark:border-stone-800">
    <div className="px-6 md:px-12 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
      <div className="lg:col-span-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-primary dark:text-white mb-6 uppercase">NUTMUNCH</h2>
        <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-xs">
          Supplying the world's most discerning palates with the finest almonds and artisanal nut blends since 1984.
        </p>
        <div className="flex gap-4">
          <a className="w-10 h-10 border border-stone-300 dark:border-stone-700 flex items-center justify-center rounded-full hover:border-accent-gold transition-colors" href="#">
            <span className="material-symbols-outlined !text-lg">alternate_email</span>
          </a>
          <a className="w-10 h-10 border border-stone-300 dark:border-stone-700 flex items-center justify-center rounded-full hover:border-accent-gold transition-colors" href="#">
            <span className="material-symbols-outlined !text-lg">public</span>
          </a>
        </div>
      </div>
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">Shop</h4>
        <ul className="flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-400">
          <li><Link className="hover:text-primary transition-colors" to="/shop?category=Raw">Raw Collection</Link></li>
          <li><Link className="hover:text-primary transition-colors" to="/shop?category=Roasted">Gourmet Roasted</Link></li>
          <li><Link className="hover:text-primary transition-colors" to="/shop?category=Confection">Specialty Blends</Link></li>
          <li><Link className="hover:text-primary transition-colors" to="/shop">Gift Sets</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">Company</h4>
        <ul className="flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-400">
          <li><Link className="hover:text-primary transition-colors" to="/#legacy">Our Heritage</Link></li>
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Sustainability report coming soon."); }}>Sustainability</a></li>
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("We are hiring! Check back later."); }}>Careers</a></li>
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Press kit coming soon."); }}>Press</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">Support</h4>
        <ul className="flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-400">
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Shipping info coming soon."); }}>Shipping & Returns</a></li>
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Tracking feature coming soon."); }}>Track Order</a></li>
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Please email wholesale@nutmunch.com"); }}>Wholesale Inquiry</a></li>
          <li><a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy coming soon."); }}>Privacy Policy</a></li>
        </ul>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-6">Contact</h4>
          <p className="text-sm text-stone-600 dark:text-stone-400">Global HQ: Modesto, California</p>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">+1 (800) 555-ALMD</p>
        </div>
      </div>
    </div>
    <div className="px-6 md:px-12 max-w-[1400px] mx-auto pt-10 border-t border-border-soft dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">© 2024 Nutmunch. All Rights Reserved.</p>
      <div className="flex gap-8 items-center opacity-40">
        <span className="material-symbols-outlined !text-3xl">credit_card</span>
        {/* Corrected 'class' to 'className' for account_balance_wallet icon */}
        <span className="material-symbols-outlined !text-3xl">account_balance_wallet</span>
        {/* Corrected 'class' to 'className' for payments icon */}
        <span className="material-symbols-outlined !text-3xl">payments</span>
      </div>
    </div>
    <div className="text-[10px] text-center text-red-500 font-bold opacity-50 pb-4">
      DEBUG: API_URL = {import.meta.env.VITE_API_URL || 'Using Localhost Fallback'}
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
