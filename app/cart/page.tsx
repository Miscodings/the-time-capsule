"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FooterSection from "@/components/FooterSection";

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  } | null;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(productId: string, change: number) {
    if (!productId) return;

    setUpdating(productId);
    
    try {
      const method = change > 0 ? "POST" : "DELETE";
      const quantity = Math.abs(change);
      
      const res = await fetch("/api/cart", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        await fetchCart(); // Refresh cart data
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(productId: string) {
    if (!productId) return;

    setUpdating(productId);
    
    try {
      // First get current quantity to remove all
      const item = items.find(i => i.productId?._id === productId);
      if (!item) return;

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: item.quantity }),
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdating(null);
    }
  }

  // Filter out items with null productId
  const validItems = items.filter(item => item.productId !== null);
  
  // Calculate totals
  const subtotal = validItems.reduce(
    (sum, item) => sum + item.productId!.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 999 : 0; // $9.99 shipping if items exist
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <>
        <main className="p-8 min-h-screen">
          <button 
            onClick={() => router.push("/")}
            className="win95-button mb-6 inline-flex items-center gap-2"
          >
            ← Back to Store
          </button>
          <p className="text-center">Loading cart...</p>
        </main>
        <FooterSection />
      </>
    );
  }

  if (validItems.length === 0) {
    return (
      <>
        <main className="p-8 min-h-screen">
          <button 
            onClick={() => router.push("/")}
            className="win95-button mb-6 inline-flex items-center gap-2"
          >
            ← Back to Store
          </button>
          
          <div className="max-w-md mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-300 mb-8">Add some retro tech to get started!</p>
            <button
              onClick={() => router.push("/search")}
              className="win95-button px-8 py-3 text-lg"
            >
              Browse Products
            </button>
          </div>
        </main>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <main className="p-8 min-h-screen">
        <button 
          onClick={() => router.push("/")}
          className="win95-button mb-6 inline-flex items-center gap-2"
        >
          ← Back to Store
        </button>

        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {validItems.map((item) => {
              const itemTotal = item.productId!.price * item.quantity;
              const isUpdating = updating === item.productId!._id;
              
              return (
                <div
                  key={item.productId!._id}
                  className="win95-button p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* Product Image */}
                  {item.productId!.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.productId!.imageUrl}
                        alt={item.productId!.name}
                        className="w-24 h-24 object-cover border border-border-dark"
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold text-lg">{item.productId!.name}</h2>
                        <p className="text-gray-600 text-sm mt-1">
                          ${(item.productId!.price / 100).toFixed(2)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId!._id)}
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {isUpdating ? "Removing..." : "Remove"}
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId!._id, -1)}
                          disabled={isUpdating}
                          className="win95-button w-8 h-8 flex items-center justify-center"
                        >
                          −
                        </button>
                        
                        <span className="w-12 text-center font-bold">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.productId!._id, 1)}
                          disabled={isUpdating}
                          className="win95-button w-8 h-8 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${(itemTotal / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${(item.productId!.price / 100).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="win95-button p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold">${(subtotal / 100).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">${(shipping / 100).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="font-bold">${(tax / 100).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-border-dark pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => router.push("/orders")}
                  className="win95-button px-6 py-3"
                >
                  View Orders
                </button>
                <button
                  onClick={() => router.push("/checkout")}
                  className="win95-button px-6 py-3 bg-green-100 border-green-300"
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <div className="text-center mt-4 text-sm text-gray-600">
                <p>Free returns • 30-day warranty • Secure checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="win95-button px-8 py-3 text-lg inline-flex items-center gap-2"
          >
            ← Continue Shopping
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <FooterSection />
    </>
  );
}