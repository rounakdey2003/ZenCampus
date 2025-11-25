import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  hostelName: { type: String, default: "ZenCampus Hostel" },
  adminEmail: { type: String, default: "admin@zencampus.edu" },
  adminPhone: { type: String, default: "+91 98765 43210" },
  address: { type: String, default: "Campus Road, University Area" },
  maxComplaintsPerDay: { type: Number, default: 3 },
  autoArchiveNotices: { type: Number, default: 30 },
  maintenanceResponseTime: { type: Number, default: 24 },
  washingMachines: { type: Number, default: 5 },
  dryers: { type: Number, default: 3 },
  slotDuration: { type: Number, default: 60 },
  maxBookingsPerStudent: { type: Number, default: 2 },
  laundryNotice: { type: String, default: "" },
  canteenOpenTime: { type: String, default: "07:00" },
  canteenCloseTime: { type: String, default: "22:00" },
  minOrderAmount: { type: Number, default: 20 },
  deliveryCharges: { type: Number, default: 0 },
  passwordExpiry: { type: Number, default: 90 },
  maxLoginAttempts: { type: Number, default: 3 },
  sessionTimeout: { type: Number, default: 30 },
  twoFactorAuth: { type: Boolean, default: false },
}, { timestamps: true });

const SystemSettings = mongoose.models.SystemSettings || mongoose.model("SystemSettings", settingsSchema);

export async function GET() {
  try {
    await connectDB();
    let settings = await SystemSettings.findOne();
    
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const settings = await SystemSettings.create(data);
    return NextResponse.json(settings, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create(data);
    } else {
      settings = await SystemSettings.findByIdAndUpdate(settings._id, data, { new: true });
    }

    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
