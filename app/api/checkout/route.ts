import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Stripe from "stripe";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems, shippingInfo } = await req.json();
    
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum: number, item: any) => {
        if (!item.productId || !item.productId.price) {
          return sum;
        }
        return sum + item.productId.price * item.quantity;
      },
      0
    );
    
    const shippingCost = 999; // $9.99 in cents
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shippingCost + tax;

    // Create line items for Stripe
    const lineItems = cartItems.map((item: any) => {
      if (!item.productId) {
        return null;
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.productId.name || 'Unnamed Product',
            images: item.productId.imageUrl ? [item.productId.imageUrl] : [],
          },
          unit_amount: item.productId.price,
        },
        quantity: item.quantity,
      };
    }).filter(Boolean);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    // Add shipping and tax as separate line items
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Standard Shipping' },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Sales Tax (8%)' },
          unit_amount: tax,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session FIRST
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/canceled`,
      customer_email: shippingInfo.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
      metadata: {
        userId,
        itemCount: cartItems.length.toString(),
        totalAmount: total.toString(),
      },
    });

    // NOW create order with the stripeSessionId
    await connectDB();
    
    const order = await Order.create({
      userId,
      stripeSessionId: session.id, // Now we have the session ID
      customerEmail: shippingInfo.email,
      shippingAddress: shippingInfo,
      cartItems: cartItems.map((item: any) => ({
        productId: item.productId?._id || 'unknown',
        name: item.productId?.name || 'Unknown Product',
        price: item.productId?.price || 0,
        quantity: item.quantity,
      })),
      subtotal,
      shipping: shippingCost,
      tax,
      total,
      status: 'pending',
    });

    console.log("Order created with ID:", order._id);

    return NextResponse.json({ url: session.url });
    
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}