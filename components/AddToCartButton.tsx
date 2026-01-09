"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AddToCartProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchCartQuantity();
  }, [productId, isSignedIn]);

  async function fetchCartQuantity() {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      
      const data = await res.json();
      const existingItem = data.items?.find(
        (item: any) => item.productId?._id === productId
      );
      setCartQuantity(existingItem?.quantity || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }

  async function handleAddToCart() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setAdded(true);
        setCartQuantity(prev => prev + 1);
        setTimeout(() => setAdded(false), 2000);
      } else {
        setError(data.error || "Failed to add to cart");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      setError("Network error. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFromCart() {
    if (!isSignedIn || cartQuantity === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setCartQuantity(prev => Math.max(0, prev - 1));
      } else {
        setError(data.error || "Failed to remove from cart");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      setError("Network error. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  if (cartQuantity > 0) {
    return (
      <div className="flex flex-col gap-2">
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded text-center">
            {error}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">In cart:</span>
          <span className="font-bold">{cartQuantity}</span>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleRemoveFromCart}
            disabled={loading}
            className="win95-button text-xs flex-1 py-1 hover:bg-gray-100 active:bg-gray-200"
          >
            Remove One
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={loading || added}
            className={`win95-button text-xs flex-1 py-1 transition-colors ${
              added ? "!bg-green-100 !border-green-300" : ""
            }`}
          >
            {added ? "✓ Added!" : "Add Another"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded text-center">
          {error}
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={loading || added}
        className={`win95-button text-xs w-full transition-colors ${
          added ? "!bg-green-100 !border-green-300" : ""
        }`}
      >
        {added ? "✓ Added!" : loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}