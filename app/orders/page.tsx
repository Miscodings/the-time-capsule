"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FooterSection from "@/components/FooterSection";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  stripeSessionId: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cartItems: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/orders");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError(error instanceof Error ? error.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusColor(status: Order["status"]) {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  }

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
          <div className="text-center py-16">
            <p>Loading your orders...</p>
          </div>
        </main>
        <FooterSection />
      </>
    );
  }

  if (error) {
    return (
      <>
        <main className="p-8 min-h-screen">
          <button 
            onClick={() => router.push("/")}
            className="win95-button mb-6 inline-flex items-center gap-2"
          >
            ← Back to Store
          </button>
          <div className="text-center py-16">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <button
              onClick={fetchOrders}
              className="win95-button px-6 py-3"
            >
              Try Again
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

        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => router.push("/")}
              className="win95-button px-8 py-3 text-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="win95-button p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="font-bold text-xl">Order #{order.stripeSessionId.slice(-8).toUpperCase()}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Shipping to: {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-2xl font-bold">${(order.total / 100).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {order.cartItems.length} item{order.cartItems.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-border-dark pt-4">
                  <h3 className="font-semibold mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 font-bold">{item.quantity}</span>
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-600 text-sm">${(item.price / 100).toFixed(2)} each</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-border-dark">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.fullName}<br />
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${(order.subtotal / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>${(order.shipping / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${(order.tax / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-gray-200 pt-1 mt-1">
                            <span>Total:</span>
                            <span>${(order.total / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-border-dark flex flex-wrap gap-3">
                    <button
                      onClick={() => router.push(`/orders/${order._id}`)}
                      className="win95-button px-4 py-2 text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => alert("Order tracking coming soon!")}
                      className="win95-button px-4 py-2 text-sm bg-blue-100 border-blue-300"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => alert("Contact support at help@retrotech.com")}
                      className="win95-button px-4 py-2 text-sm"
                    >
                      Get Help
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Stats */}
        {orders.length > 0 && (
          <div className="mt-12 win95-button p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-gray-600">Total Orders</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-green-600">
                  ${(orders.reduce((sum, order) => sum + order.total, 0) / 100).toFixed(2)}
                </p>
                <p className="text-gray-600">Total Spent</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-purple-600">
                  {orders.filter(o => o.status === "delivered").length}
                </p>
                <p className="text-gray-600">Delivered</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterSection />
    </>
  );
}