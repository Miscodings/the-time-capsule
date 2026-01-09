"use client";

import { useRouter } from "next/navigation";
import FooterSection from "@/components/FooterSection";

export default function CheckoutCanceledPage() {
  const router = useRouter();

  return (
    <>
      <main className="p-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="text-yellow-600 text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Order Canceled</h1>
          <p className="text-gray-600 mb-8">
            Your checkout was canceled. Your cart items have been saved.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/cart")}
              className="win95-button px-6 py-3 bg-blue-100 border-blue-300"
            >
              Return to Cart
            </button>
            <button
              onClick={() => router.push("/")}
              className="win95-button px-6 py-3"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}