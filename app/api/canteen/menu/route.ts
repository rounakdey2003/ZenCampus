import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import { MenuItemModel as MenuItem } from "@/models/Canteen";

export const GET = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const available = searchParams.get("available");
    
    const query: Record<string, unknown> = {};
    
    if (category && category !== "all" && category !== "All") {
      query.mealType = category.toLowerCase();
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    if (available === "true") {
      query.available = true;
    }
    
    const menuItems = await MenuItem.find(query).sort({ mealType: 1, name: 1 });
    
    const transformedItems = menuItems.map(item => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      type: item.type,
      category: item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1),
      mealType: item.mealType,
      availableFrom: item.availableFrom,
      availableTo: item.availableTo,
      available: item.available,
      createdAt: item.createdAt,
    }));
    
    return NextResponse.json({ success: true, data: transformedItems });
  } catch (error) {
    console.error("Menu fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch menu items: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    if (!body.name || !body.description || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, description, price, category" },
        { status: 400 }
      );
    }
    
    const menuItemData = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      type: body.type || "veg",
      mealType: body.category.toLowerCase(),
      availableFrom: body.availableFrom || "06:00",
      availableTo: body.availableTo || "22:00",
      available: body.available !== undefined ? body.available : true,
    };
    
    const menuItem = await MenuItem.create(menuItemData);
    
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
    
    return NextResponse.json({ success: true, data: transformedItem }, { status: 201 });
  } catch (error) {
    console.error("Menu creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create menu item: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
});
