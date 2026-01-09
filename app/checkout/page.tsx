"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import FooterSection from "@/components/FooterSection";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  } | null;
  quantity: number;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter out items with null productId
  const validItems = cartItems.filter(item => item.productId !== null);

  const subtotal = validItems.reduce(
    (sum, item) => sum + item.productId!.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 999 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  async function handleCheckout() {
    if (!validateForm()) return;

    setProcessing(true);

    try {
        // Create checkout session
        const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cartItems: validItems,
            shippingInfo,
        }),
        });

        const data = await res.json();
        
        if (!res.ok) {
        console.error("Checkout API error:", data);
        alert(`Checkout failed: ${data.error || "Unknown error"}`);
        return;
        }

        const { url } = data; // API should return a URL

        if (url) {
        // Redirect to Stripe Checkout URL
        window.location.href = url;
        } else {
        throw new Error("No checkout URL returned");
        }
    } catch (error) {
        console.error("Checkout error:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        setProcessing(false);
    }
  }

  function validateForm(): boolean {
    const requiredFields: (keyof ShippingInfo)[] = [
      "fullName",
      "email",
      "address",
      "city",
      "state",
      "zipCode",
    ];

    for (const field of requiredFields) {
      if (!shippingInfo[field].trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    return true;
  }

  if (loading) {
    return (
      <>
        <main className="p-8 min-h-screen">
          <button 
            onClick={() => router.push("/cart")}
            className="win95-button mb-6 inline-flex items-center gap-2"
          >
            ← Back to Cart
          </button>
          <p className="text-center">Loading checkout...</p>
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
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add items to your cart to checkout</p>
            <button
              onClick={() => router.push("/")}
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
          onClick={() => router.push("/cart")}
          className="win95-button mb-6 inline-flex items-center gap-2"
        >
          ← Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-2">
            <div className="win95-button p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                    className="win95-input w-full"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="win95-input w-full"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="win95-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="win95-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    className="win95-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    className="win95-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="win95-input w-full"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="win95-button p-6">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <p className="text-gray-600 mb-4">
                You'll be redirected to Stripe to securely complete your payment.
                We accept all major credit cards.
              </p>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>💳 American Express</span>
                <span>💳 Discover</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="win95-button p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="mb-6 space-y-3 max-h-64 overflow-y-auto">
                {validItems.map((item) => (
                  <div key={item.productId!._id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.productId!.name}</span>
                      <span className="text-gray-600 ml-2">×{item.quantity}</span>
                    </div>
                    <span>${((item.productId!.price * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 border-t border-border-dark pt-4">
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
                
                <div className="border-t border-border-dark pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className={`win95-button w-full py-3 text-lg font-bold ${
                  processing ? "opacity-50 cursor-not-allowed" : "bg-green-100 border-green-300 hover:bg-green-200"
                }`}
              >
                {processing ? "Processing..." : `Pay $${(total / 100).toFixed(2)}`}
              </button>
              
              <div className="text-center mt-4 text-xs text-gray-600">
                <p>🔒 Secure checkout powered by Stripe</p>
                <p>Your payment information is encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </>
  );
}