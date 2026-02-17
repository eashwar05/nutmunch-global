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

    setIsCheckingOut(true);
    try {
      const order = await checkout(customerName, email, address, city);
      navigate('/order-confirmation', { state: { order } });
    } catch (err: any) {
      alert("Checkout failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="bg-background-cream min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h1 className="font-display text-4xl md:text-5xl text-primary mb-12">Your Selection</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Cart & Shipping */}
          <div className="flex-1 space-y-12">

            {/* Free Shipping Progress */}
            {cart.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-terra">local_shipping</span>
                    <p className="text-primary font-medium">
                      {subtotal >= freeShippingThreshold
                        ? "Complimentary Global Shipping Unlocked"
                        : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} for Complimentary Shipping`}
                    </p>
                  </div>
                  <span className="font-bold text-accent-terra">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-terra transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
              <div className="divide-y divide-stone-100">
                {cart.map(item => (
                  <div key={item.id} className="p-8 flex flex-col sm:flex-row items-center gap-8 group hover:bg-stone-50 transition-colors">
                    <div className="w-24 h-24 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="font-display text-xl text-primary">{item.name}</h3>
                      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">{item.category} — {item.weight}</p>
                    </div>
                    <div className="flex items-center bg-white border border-stone-200 rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-primary">-</button>
                      <span className="w-8 text-center text-sm font-bold text-primary">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-primary">+</button>
                    </div>
                    <div className="text-right w-24">
                      <p className="font-display text-xl text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase font-bold text-red-400 hover:text-red-600 mt-1 tracking-widest">Remove</button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="p-16 text-center">
                    <span className="material-symbols-outlined text-4xl text-stone-300 mb-4 block">shopping_basket</span>
                    <p className="text-stone-500 mb-8">Your collection is empty.</p>
                    <Link to="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors">Start Curating</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Form */}
            {cart.length > 0 && (
              <form className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm space-y-8">
                <h3 className="font-display text-2xl text-primary">Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-50 border-none rounded-lg custom-input px-4 py-3 text-primary text-sm focus:ring-1 focus:ring-accent-terra placeholder:text-stone-300"
                      placeholder="e.g. Jonathan Apple"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border-none rounded-lg custom-input px-4 py-3 text-primary text-sm focus:ring-1 focus:ring-accent-terra placeholder:text-stone-300"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Address Line</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-stone-50 border-none rounded-lg custom-input px-4 py-3 text-primary text-sm focus:ring-1 focus:ring-accent-terra placeholder:text-stone-300"
                      placeholder="Street, Apartment, Suite"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-50 border-none rounded-lg custom-input px-4 py-3 text-primary text-sm focus:ring-1 focus:ring-accent-terra placeholder:text-stone-300"
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Postal Code</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border-none rounded-lg custom-input px-4 py-3 text-primary text-sm focus:ring-1 focus:ring-accent-terra placeholder:text-stone-300"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Checkout */}
          {cart.length > 0 && (
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="sticky top-28 space-y-6">
                <div className="bg-primary text-white p-8 rounded-2xl shadow-2xl">
                  <h3 className="font-display text-2xl mb-8">Order Summary</h3>
                  <div className="space-y-4 mb-8 text-sm">
                    <div className="flex justify-between items-center text-white/60">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span>Est. Taxes</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="font-display text-lg">Total</span>
                      <span className="font-display text-2xl text-accent-terra">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-white text-primary rounded-full py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-accent-terra hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isCheckingOut ? 'Processing...' : 'Secure Checkout'}
                  </button>
                  <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-wider">Encrypted SSL Transaction</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-stone-100 flex items-start gap-4">
                  <span className="material-symbols-outlined text-accent-terra text-3xl">verified_user</span>
                  <div>
                    <h4 className="font-bold text-sm text-primary mb-1">Authenticity Guaranteed</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">Direct from the orchard to your doorstep. Our almonds are source-verified and export certified.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CartPage;
