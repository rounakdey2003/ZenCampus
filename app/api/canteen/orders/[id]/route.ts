import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CanteenOrder from "@/models/CanteenOrder";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    
    const order = await CanteenOrder.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
