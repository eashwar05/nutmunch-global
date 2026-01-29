import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/" />;
    }

    return (
        <main className="min-h-screen bg-background-light flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-background-paper p-12 rounded-sm shadow-2xl animate-fade-in border border-primary/5">
                <div className="text-center mb-12">
                    <div className="size-20 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-gold/20">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h1 className="text-4xl font-display font-medium text-primary mb-4">Order Confirmed</h1>
                    <p className="text-primary/60 font-light text-lg">Thank you for your purchase, {order.customer_name}.</p>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-6 mb-8 border border-stone-100 dark:border-stone-800">
                    <div className="flex justify-between items-center mb-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                        <span className="text-sm font-bold uppercase tracking-widest text-stone-400">Order ID</span>
                        <span className="font-mono font-bold text-primary dark:text-accent-gold">#{order.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-widest text-stone-400">Total Amount</span>
                        <span className="text-2xl font-bold text-primary dark:text-gray-100">${order.total_amount.toFixed(2)}</span>
                    </div>
                    {/* Add shipping details if available in response */}
                </div>

                <div className="space-y-4">
                    <Link to="/shop" className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs">
                        Continue Shopping
                    </Link>
                    <p className="text-center text-xs text-stone-400">
                        A confirmation email has been sent to {order.email || 'your email'}.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmationPage;
