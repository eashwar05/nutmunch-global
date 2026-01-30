import { Product, CartItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchProducts(category?: string): Promise<Product[]> {
    const url = new URL(`${API_BASE_URL}/products`);
    if (category) {
        url.searchParams.append('category', category);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function fetchProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

export async function addToCart(productId: string, quantity: number): Promise<CartItem> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            product_id: parseInt(productId),
            quantity: quantity,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to add to cart');
    }
    return response.json();
}


export async function getCart(): Promise<CartItem[]> {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }
    const data = await response.json();
    // Map backend structure to frontend structure
    return data.map((item: any) => ({
        ...item.product, // Spread product details
        id: item.product ? item.product.id.toString() : item.product_id.toString(), // Use product ID as the main ID for frontend logic usually expects product ID, OR we need to be careful.
        // Wait, App.tsx uses item.id for finding. If I use product ID, it works with addToCart logic which looks for product.id.
        // Frontend types.ts: CartItem extends Product. So CartItem.id IS Product.id.
        // Backend CartItem.id is the row ID of cart item.
        // If I map item.product.id to id, I lose the unique cart item row ID, but unique product ID per session is fine.
        // Actually, App.tsx: 
        // const existing = prev.find(item => item.id === product.id);
        // So distinct items are identified by product ID.
        // So mapping product.id to id is correct for frontend expectations.

        // Map image_url
        image: item.product?.image_url || item.product?.image,

        quantity: item.quantity,
        // Keep internal cart_item_id if needed, but for now flat is fine.
    }));
}

export async function checkout(customerName: string, email: string, address: string, city: string) {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            customer_name: customerName,
            email: email,
            address: address,
            city: city
            // total_amount is calculated by backend now
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to checkout');
    }
    return response.json();
}
