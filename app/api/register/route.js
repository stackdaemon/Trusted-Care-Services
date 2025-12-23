import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password, nid, contact } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and Email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        // If user exists (maybe from Google Login sync), just update NID/Contact if missing
        existingUser.nid = nid || existingUser.nid;
        existingUser.contact = contact || existingUser.contact;
        existingUser.name = name || existingUser.name; // Update name preference
        await existingUser.save();
        
        return NextResponse.json(
          { message: "User synced successfully" },
          { status: 200 }
        );
    }

    // Create new user
    // We don't strictly need password since Firebase handles auth, 
    // but if passed we can store it (hashed) or ignore it.
    // Let's ignore storing password to avoid confusion vs Firebase.
    
    const newUser = await User.create({
      name,
      email,
      // password: hashedPassword, // Skip password
      nid,
      contact,
      role: "user"
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
