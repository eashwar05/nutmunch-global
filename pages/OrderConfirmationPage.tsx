import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/" />;
    }

    return (
        <main className="min-h-screen bg-background-cream flex items-center justify-center p-6 py-24">
            <div className="max-w-xl w-full bg-white p-12 rounded-3xl shadow-xl animate-fade-in border border-stone-100/50">
                <div className="text-center mb-12">
                    <div className="size-24 bg-accent-terra/10 text-accent-terra rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-terra/20">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 block mb-4">Payment Successful</span>
                    <h1 className="text-4xl md:text-5xl font-display font-medium text-primary mb-6">Order Confirmed</h1>
                    <p className="text-stone-500 font-light text-lg max-w-sm mx-auto">
                        Thank you, {order.customer_name}. Your harvest is being prepared for dispatch.
                    </p>
                </div>

                <div className="bg-stone-50 rounded-2xl p-8 mb-8 border border-stone-100">
                    <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Order ID</span>
                        <span className="font-mono font-bold text-primary">#{order.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Amount</span>
                        <span className="text-3xl font-display text-primary">${order.total_amount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <Link to="/shop" className="block w-full bg-primary hover:bg-secondary text-white text-center font-bold py-5 rounded-full transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20">
                        Continue Curating
                    </Link>
                    <p className="text-center text-xs text-stone-400 leading-relaxed">
                        A confirmation receipt has been sent to <span className="text-primary font-bold">{order.email || 'your email'}</span>.
                        <br />Please allow 24-48 hours for tracking details.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmationPage;
