"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
       fetchBookings();
    } else if (user === null) {
       // Not logged in or loading done and no user
       setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?email=${user.email}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    // Implement delete API or patch status
    // For now, let's assume we create a DELETE endpoint or PATCH
    // I'll leave this placeholder or implement a PATCH
    try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: 'DELETE',
        });
        if (res.ok) {
            fetchBookings(); // Reload
        } else {
            alert("Failed to cancel");
        }
    } catch(err) {
        alert("Error");
    }
  };

  if (loading) {
    return <div className="p-12 text-center">Loading bookings...</div>;
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl">
          <p className="text-lg text-gray-500 mb-4">You have no bookings yet.</p>
          <Link href="/#services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {booking.status}
                    </span>
                    <h3 className="text-xl font-bold">{booking.service?.title || "Unknown Service"}</h3>
                </div>
                <p className="text-gray-500 text-sm">
                   Duration: {booking.durationHours} hours | Cost: ${booking.totalCost}
                </p>
                <p className="text-gray-500 text-sm">
                   Date: {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <div className="text-sm">
                    <strong>Location:</strong> {booking.location?.address}, {booking.location?.area}, {booking.location?.city}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                 {(booking.status === 'Pending' || booking.paymentStatus === 'pending') && booking.status !== 'Cancelled' && (
                     <Button size="sm" onClick={async () => {
                         try {
                             const res = await fetch("/api/checkout", {
                                 method: "POST",
                                 headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({ bookingId: booking._id }),
                             });
                             const data = await res.json();
                             if (data.url) window.location.href = data.url;
                         } catch (e) {
                             alert("Payment error");
                         }
                     }}>
                         Pay Now
                     </Button>
                 )}
                 <Button variant="outline" size="sm" onClick={() => cancelBooking(booking._id)}>Cancel</Button>
                 {/* <Button size="sm">View Details</Button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
