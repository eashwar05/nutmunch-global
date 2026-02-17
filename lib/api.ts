import { Product, CartItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchProducts(
    category?: string,
    sortBy?: string,
    minPrice?: number,
    maxPrice?: number
): Promise<Product[]> {
    const url = new URL(`${API_BASE_URL}/products`);
    if (category) url.searchParams.append('category', category);
    if (sortBy) url.searchParams.append('sort_by', sortBy);
    if (minPrice !== undefined) url.searchParams.append('min_price', minPrice.toString());
    if (maxPrice !== undefined) url.searchParams.append('max_price', maxPrice.toString());

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
        id: item.product ? item.product.id.toString() : item.product_id.toString(),
        // Map image_url
        image: item.product?.image_url || item.product?.image,

        quantity: item.quantity,
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
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to checkout');
    }
    return response.json();
}

export async function searchProducts(query: string): Promise<Product[]> {
    if (!query) return [];
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to search products');
    }
    return response.json();
}

export function getOptimizedImageUrl(url: string, width: number = 800): string {
    if (!url) return '';
    return `${API_BASE_URL}/optimize-image?url=${encodeURIComponent(url)}&width=${width}`;
}

export async function subscribeToNewsletter(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to subscribe');
}

export async function getWishlist(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    const data = await response.json();
    return data.map((item: any) => ({
        ...item.product,
        image: item.product?.image_url || item.product?.image,
    }));
}

export async function addToWishlist(productId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId }),
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
}

export async function removeFromWishlist(productId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to remove from wishlist');
}
