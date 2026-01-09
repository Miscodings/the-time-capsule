"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FooterSection from "@/components/FooterSection";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Clear cart after successful purchase
      fetch("/api/cart/clear", { method: "POST" })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <>
        <main className="p-8 min-h-screen">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Processing your order...</h1>
          </div>
        </main>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <main className="p-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="text-green-600 text-6xl mb-6">✓</div>
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-300 mb-8">
            Your payment was successful. A confirmation email has been sent to you.
          </p>
          
          <div className="win95-button p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">What's Next?</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Order confirmation email sent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">1.</span>
                <span>Your order will be processed within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">2.</span>
                <span>Shipping notification with tracking number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">3.</span>
                <span>Delivery in 3-5 business days</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="win95-button px-6 py-3"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="win95-button px-6 py-3 bg-blue-100 border-blue-300"
            >
              View Orders
            </button>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}