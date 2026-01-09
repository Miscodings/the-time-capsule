import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // from Clerk
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
