import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/auth-middleware";
import CanteenOrder from "@/models/CanteenOrder";

export const GET = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const studentUSN = searchParams.get("usn");
    
    const query: Record<string, string> = {};
    
    if (studentUSN) {
      query.studentUSN = studentUSN;
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    const orders = await CanteenOrder.find(query).sort({ orderedAt: -1 });
    
    return NextResponse.json({ success: true, data: orders });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest, session: unknown) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    if (!body.studentName || !body.studentUSN || !body.roomNumber) {
      return NextResponse.json(
        { success: false, error: "Student information is required" },
        { status: 400 }
      );
    }
    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item" },
        { status: 400 }
      );
    }
    
    const total = body.total || body.items.reduce((sum: number, item: { price: number; quantity: number }) => 
      sum + (item.price * item.quantity), 0
    );
    
    const orderData = {
      studentName: body.studentName,
      studentUSN: body.studentUSN,
      roomNumber: body.roomNumber,
      items: body.items,
      total,
      status: body.status || "Pending"
    };
    
    const order = await CanteenOrder.create(orderData);
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
});
