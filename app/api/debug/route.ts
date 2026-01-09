import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const allProducts = await Product.find({}).lean();
  return NextResponse.json({ count: allProducts.length, products: allProducts });
}