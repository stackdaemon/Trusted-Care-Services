import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Service from "@/models/Service"; // Populate reference

// Helper to get session user email since I didn't export authOptions
// I will inspect the request headers or token if needed, or hope getServerSession works default.
// Actually, standard way is to move authOptions to `lib/auth.js` or `app/api/auth/[...nextauth]/options.js`.

// for now, use token workaround... removed

export async function POST(req) {
  // const token = await getToken({ req });
  // if (!token) { return NextResponse.json ... }
  
  // Note: For real security with Firebase + Backend, we should send the ID Token and verify it with Admin SDK.
  // For this assignment, we will trust the client sending the email (assuming client is secured).

  try {
    const data = await req.json();
    const { email } = data; // Expect email in body

    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    
    // Find MongoDB User ID
    let user = await User.findOne({ email });
    
    // If user doesn't exist in MongoDB (e.g. Google Login only on Firebase but not synced yet), create one?
    // Or fail. Let's create one on the fly if missing (simple sync).
    if (!user) {
        user = await User.create({ 
            name: data.userName || "Unknown", 
            email, 
            role: "user" 
        });
    }

    const newBooking = await Booking.create({
       ...data, // This contains service, duration, cost, location
       user: user._id,
    });

    // --- MOCK EMAIL INVOICE SENDING ---
    console.log(`
      [EMAIL SENT TO ${email}]
      Subject: Booking Confirmation - ${newBooking._id}
      ----------------------------------------------------
      Thank you for booking with Care.xyz!
      
      Service ID: ${data.service}
      Duration: ${data.durationHours} hours
      Total Cost: $${data.totalCost}
      Location: ${data.location.address}, ${data.location.area}
      
      Status: Pending
      ----------------------------------------------------
    `);
    // ----------------------------------

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating booking" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email required" }, { status: 400 });
  }

  await connectDB();

  // We need to find the user by email first to get the ID, or store bookings by Email.
  // The current schema uses `user: mongoose.Schema.Types.ObjectId`.
  // If we switched to Firebase, we might not have a MongoDB User ID unless we synced them.
  // In `RegisterPage`, we synced the user. So we find User by email first.
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
         return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const bookings = await Booking.find({ user: user._id })
      .populate("service", "title image") // Populate service details
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching bookings" }, { status: 500 });
  }
}
