import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ role: "user" }); // Default
  }

  await connectDB();
  const user = await User.findOne({ email });

  return NextResponse.json({ role: user ? user.role : "user" });
}
