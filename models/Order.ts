import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stripeSessionId: { type: String, required: true, unique: true },
  customerEmail: { type: String, required: true },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  cartItems: [{
    productId: { type: String, required: true },
    name: { type: String, required: true }, // Keep as required
    price: { type: Number, required: true }, // Keep as required
    quantity: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);