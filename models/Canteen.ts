import mongoose, { Schema, Model } from "mongoose";
import { MenuItem, CanteenOrder } from "@/types";

export interface IMenuItemDocument extends Omit<MenuItem, "_id">, mongoose.Document {}
export interface ICanteenOrderDocument extends Omit<CanteenOrder, "_id">, mongoose.Document {}

const menuItemSchema = new Schema<IMenuItemDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "snacks", "dinner", "beverages"],
      required: true,
    },
    availableFrom: {
      type: String,
      required: true,
    },
    availableTo: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const MenuItemModel: Model<IMenuItemDocument> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItemDocument>("MenuItem", menuItemSchema);
