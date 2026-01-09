import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  try {
    // Test Stripe connection
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    // List a few products to test connection
    const products = await stripe.products.list({ limit: 3 });
    
    return NextResponse.json({
      success: true,
      message: "Stripe connection successful",
      hasKey: !!process.env.STRIPE_SECRET_KEY,
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8),
      productCount: products.data.length
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hasKey: !!process.env.STRIPE_SECRET_KEY,
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8)
    }, { status: 500 });
  }
}