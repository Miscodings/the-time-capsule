import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Stripe from "stripe";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    await connectDB();

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Find order by stripeSessionId
      const order = await Order.findOne({ stripeSessionId: sessionId, userId });
      
      if (order) {
        // Update order status
        order.status = 'paid';
        await order.save();

        // Clear user's cart (you can implement this if needed)
        
        return NextResponse.json({ 
          success: true, 
          message: 'Payment verified and order confirmed',
          orderId: order._id
        });
      } else {
        return NextResponse.json(
          { error: 'Order not found' }, 
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Payment not completed' }, 
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}