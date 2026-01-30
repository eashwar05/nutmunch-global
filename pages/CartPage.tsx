

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { checkout } from '../lib/api';

interface Props {
  cart: CartItem[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
}

const CartPage: React.FC<Props> = ({ cart, removeFromCart, updateQuantity }) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const freeShippingThreshold = 50;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = async () => {
    if (!customerName.trim() || !email.trim() || !address.trim() || !city.trim()) {
      alert("Please fill in all shipping details");
      return;
    }
    // const sid = localStorage.getItem('session_id'); // Removed for Security

    setIsCheckingOut(true);
    try {
      const order = await checkout(customerName, email, address, city);
      // Navigate to confirmation page
      navigate('/order-confirmation', { state: { order } });
      // Force reload or state update could happen here, but navigation is clean.
      // Ideally, App.tsx should detect cart clear, but since we navigate away, it's fine.
      // Refreshing cart state would be good if user goes back, but backend is cleared.
    } catch (err: any) {
      alert("Checkout failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Column: Cart Content & Checkout Form */}
        <div className="flex-1 space-y-12">

          {/* Free Shipping Progress */}
          <div className="bg-background-paper p-6 rounded-sm border border-primary/5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-gold">local_shipping</span>
                <p className="text-primary dark:text-gray-100 font-medium tracking-tight">
                  {subtotal >= freeShippingThreshold
                    ? "Congratulations! You've unlocked Free Global Shipping"
                    : `You're $${(freeShippingThreshold - subtotal).toFixed(2)} away from Free Global Shipping`}
                </p>
              </div>
              <p className="text-primary font-bold">{Math.round(progress)}%</p>
            </div>
            <div className="relative h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-4 flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
              <span>Cart: ${subtotal.toFixed(2)}</span>
              <span className="text-accent-gold">Goal: ${freeShippingThreshold.toFixed(2)}</span>
            </div>
          </div>

          {/* Selection List */}
          <div>
            <h2 className="font-display text-3xl font-medium mb-8 text-primary">Your Selection</h2>
            <div className="divide-y divide-primary/5 bg-background-paper rounded-sm border border-primary/5 overflow-hidden">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-6 p-6 group">
                  <div className="relative overflow-hidden rounded-lg bg-stone-100 flex-shrink-0">
                    <div className="w-24 h-24 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${item.image}')` }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary dark:text-gray-100">{item.name}</h3>
                    <p className="text-sm text-stone-400 mb-4">{item.category} • {item.weight}</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden h-10">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">-</button>
                        <span className="px-4 text-sm font-bold w-12 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold uppercase tracking-widest text-stone-300 hover:text-red-500 transition-colors">Remove</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-stone-400 mb-6">Your basket is empty.</p>
                  <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded uppercase text-xs font-bold tracking-widest">Back to Collections</Link>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Form */}
          <div className="pt-8 border-t border-stone-100 dark:border-stone-800">
            <h2 className="font-display text-3xl font-medium mb-8 text-primary">Shipping Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={e => e.preventDefault()}>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                <input
                  className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter your full name"
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                <input
                  className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Shipping Address</label>
                <input
                  className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Street name and house number"
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">City</label>
                <input
                  className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Your City"
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Postal Code</label>
                <input className="w-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-lg py-3 px-4 focus:ring-primary focus:border-primary transition-all" placeholder="000 000" type="text" />
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-28 space-y-6">
            <div className="bg-primary text-white p-8 rounded-xl shadow-xl shadow-primary/20">
              <h3 className="font-display text-2xl font-medium mb-6">Order Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400">Shipping</span>
                  <span className="font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400">Estimated Tax (8%)</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-lg font-medium">Grand Total</span>
                  <span className="text-2xl font-bold text-accent-gold">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="w-full bg-accent-gold hover:bg-white hover:text-primary text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                {isCheckingOut ? 'Processing...' : 'Proceed to Secure Payment'}
              </button>
              <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="material-symbols-outlined text-4xl">contactless</span>
                <span className="material-symbols-outlined text-4xl">credit_card</span>
                <span className="material-symbols-outlined text-4xl">account_balance</span>
              </div>
            </div>

            {/* Trust Info */}
            <div className="bg-background-light p-6 rounded-sm border border-primary/5">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary dark:text-accent-gold mt-1">verified_user</span>
                <div>
                  <h4 className="text-sm font-bold mb-1">Authenticity Guaranteed</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">Direct from the orchard to your doorstep. Our almonds are source-verified and export certified.</p>
                </div>
              </div>
            </div>

            {/* Promo */}
            <div className="flex gap-2">
              <input className="flex-1 bg-transparent border-stone-200 dark:border-stone-800 rounded-lg py-2 px-4 focus:ring-primary focus:border-primary transition-all text-sm" placeholder="Promo Code" type="text" />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
