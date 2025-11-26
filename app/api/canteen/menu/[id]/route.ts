import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import { MenuItemModel as MenuItem } from "@/models/Canteen";
import { MenuItem as MenuItemType, MealType } from "@/types";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const body = (await request.json()) as Partial<MenuItemType> & { category?: string };

    const updateData: Partial<MenuItemType> & { category?: string; mealType?: MealType } = { ...body };
    if (body.category) {
      const normalizedCategory = body.category.toLowerCase();
      if (isMealType(normalizedCategory)) {
        updateData.mealType = normalizedCategory;
      }
      delete updateData.category;
    }
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }
    
    const transformedItem = {
      _id: menuItem._id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      type: menuItem.type,
      category: menuItem.mealType.charAt(0).toUpperCase() + menuItem.mealType.slice(1),
      mealType: menuItem.mealType,
      availableFrom: menuItem.availableFrom,
      availableTo: menuItem.availableTo,
      available: menuItem.available,
      createdAt: menuItem.createdAt,
    };
    
    return NextResponse.json({ success: true, data: transformedItem });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update menu item" },
      { status: 500 }
    );
  }
};

function isMealType(value: string): value is MealType {
  const mealTypes: MealType[] = ["breakfast", "lunch", "snacks", "dinner"];
  return mealTypes.includes(value as MealType);
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    
    const menuItem = await MenuItem.findByIdAndDelete(id);
    
    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "Menu item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: "Menu item deleted successfully" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
};
