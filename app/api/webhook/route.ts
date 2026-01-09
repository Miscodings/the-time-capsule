import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await connectDB();
      
      // Create order in database
      await Order.create({
        userId: session.metadata?.userId,
        stripeSessionId: session.id,
        customerEmail: session.customer_email,
        shippingAddress: session.metadata?.shippingInfo,
        amountTotal: session.amount_total,
        status: "paid",
      });

      console.log(`Order created for session ${session.id}`);
    } catch (error) {
      console.error("Order creation error:", error);
    }
  }

  return NextResponse.json({ received: true });
}