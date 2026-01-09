import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }, // cents
  imageUrl: String,
  stock: { type: Number, default: 0 },
  releaseYear: Number,
  era: {
    type: String,
    enum: ["1970s", "1980s", "1990s", "2000s", "Modern"],
  },
  condition: {
    type: String,
    enum: ["New", "Like New", "Used", "Heavily Used", "For Parts"],
    default: "Used",
  },
  createdAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ["Video", "Audio", "Recording", "Accessories", "Miscellaneous"],
  },
  subcategory: { type: String } // No enum needed since subcategories vary by category
});

ProductSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
