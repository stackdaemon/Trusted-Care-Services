import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import User from "@/models/User";

export async function POST(req) {
  try {
    const data = await req.json();
    const { email, ...serviceData } = data; // Expect user email to verify admin

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Verify Admin
    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins Only" }, { status: 403 });
    }

    const newService = await Service.create(serviceData);

    return NextResponse.json(
      { message: "Service created successfully", service: newService },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ message: "Error creating service" }, { status: 500 });
  }
}
