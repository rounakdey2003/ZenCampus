import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { MenuItemModel as MenuItem } from "@/models/Canteen";

export async function GET(request: NextRequest) {
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
    
    // Transform mealType to category for frontend compatibility
    const transformedItems = menuItems.map(item => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      type: item.type,
      category: item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1), // Convert to capitalized
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
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, description, price, category" },
        { status: 400 }
      );
    }
    
    // Transform frontend data to match schema
    const menuItemData = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price), // Ensure price is a number
      type: body.type || "veg", // Default to veg if not specified
      mealType: body.category.toLowerCase(), // Convert category to mealType (Breakfast -> breakfast)
      availableFrom: body.availableFrom || "06:00",
      availableTo: body.availableTo || "22:00",
      available: body.available !== undefined ? body.available : true,
    };
    
    const menuItem = await MenuItem.create(menuItemData);
    
    // Transform mealType back to category for frontend compatibility
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
}
