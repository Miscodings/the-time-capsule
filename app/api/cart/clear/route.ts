import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}