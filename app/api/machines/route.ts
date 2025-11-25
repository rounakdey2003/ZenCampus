import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { WashingMachine, DryerMachine } from "@/models/Machine";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // "washing" or "dryer"
    
    if (type === "washing") {
      const machines = await WashingMachine.find().sort({ machineNumber: 1 });
      return NextResponse.json(machines);
    } else if (type === "dryer") {
      const machines = await DryerMachine.find().sort({ machineNumber: 1 });
      return NextResponse.json(machines);
    } else {
      // Return both types
      const washingMachines = await WashingMachine.find().sort({ machineNumber: 1 });
      const dryers = await DryerMachine.find().sort({ machineNumber: 1 });
      return NextResponse.json({
        success: true,
        data: {
          washing: washingMachines,
          dryer: dryers
        }
      });
    }
  } catch (error) {
    console.error("Error fetching machines:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch machines" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { type, machineNumber, status } = body;
    
    if (!type || !machineNumber) {
      return NextResponse.json(
        { success: false, error: "Type and machine number are required" },
        { status: 400 }
      );
    }
    
    const Model = type === "washing" ? WashingMachine : DryerMachine;
    
    const machine = await Model.create({
      machineNumber,
      status: status || "Available",
      lastUpdated: new Date()
    });
    
    return NextResponse.json({ success: true, data: machine }, { status: 201 });
  } catch (error) {
    console.error("Error creating machine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create machine" },
      { status: 500 }
    );
  }
}

// Bulk initialize machines
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { washingCount, dryerCount } = body;
    
    if (washingCount !== undefined) {
      // Get existing washing machines
      const existingWashing = await WashingMachine.find();
      const existingNumbers = existingWashing.map(m => m.machineNumber);
      
      // Add new machines if needed
      for (let i = 1; i <= washingCount; i++) {
        if (!existingNumbers.includes(i)) {
          await WashingMachine.create({
            machineNumber: i,
            status: "Available",
            lastUpdated: new Date()
          });
        }
      }
      
      // Remove machines beyond the count
      await WashingMachine.deleteMany({ machineNumber: { $gt: washingCount } });
    }
    
    if (dryerCount !== undefined) {
      // Get existing dryers
      const existingDryers = await DryerMachine.find();
      const existingNumbers = existingDryers.map(m => m.machineNumber);
      
      // Add new machines if needed
      for (let i = 1; i <= dryerCount; i++) {
        if (!existingNumbers.includes(i)) {
          await DryerMachine.create({
            machineNumber: i,
            status: "Available",
            lastUpdated: new Date()
          });
        }
      }
      
      // Remove machines beyond the count
      await DryerMachine.deleteMany({ machineNumber: { $gt: dryerCount } });
    }
    
    const washingMachines = await WashingMachine.find().sort({ machineNumber: 1 });
    const dryers = await DryerMachine.find().sort({ machineNumber: 1 });
    
    return NextResponse.json({
      success: true,
      data: {
        washing: washingMachines,
        dryer: dryers
      }
    });
  } catch (error) {
    console.error("Error updating machine counts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update machine counts" },
      { status: 500 }
    );
  }
}
