import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product"; // Add this import

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId, quantity } = await req.json();

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Product exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product doesn't exist, push new item
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: Product, // Explicitly specify the model
    });

    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId, quantity = 1 } = await req.json();

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not in cart" }, { status: 404 });
    }

    if (cart.items[itemIndex].quantity <= quantity) {
      // Remove item entirely if quantity to remove >= current quantity
      cart.items.splice(itemIndex, 1);
    } else {
      // Decrease quantity
      cart.items[itemIndex].quantity -= quantity;
    }

    await cart.save();

    // Populate before returning
    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: Product,
    });
    
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("DELETE CART ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}