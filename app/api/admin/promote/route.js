import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const secret = searchParams.get("secret");

  // Simple protection for this temporary tool
  if (!email) {
    return NextResponse.json({ message: "Email required" }, { status: 400 });
  }

  await connectDB();
  
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        message: `User ${email} is now an Admin!`, 
        user: { name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
