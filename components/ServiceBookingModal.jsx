"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const bookingSchema = z.object({
  durationHours: z.coerce.number().min(1, "Minimum 1 hour"),
  startTime: z.string().min(1, "Start time is required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  address: z.string().min(1, "Full address is required"),
});

export default function ServiceBookingModal({ service }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(service.pricePerHour);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      durationHours: 1,
    },
  });

  const durationHours = watch("durationHours");

  useEffect(() => {
    if (durationHours) {
      setTotalCost(service.pricePerHour * durationHours);
    }
  }, [service, durationHours]);

  const onSubmit = async (data) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      const startDate = new Date(data.startTime);
      const endDate = new Date(startDate.getTime() + data.durationHours * 60 * 60 * 1000);

      const bookingData = {
        service: service._id,
        email: user.email,
        userName: user.displayName,
        startTime: startDate,
        endTime: endDate,
        durationHours: data.durationHours,
        totalCost: totalCost,
        location: {
          division: data.division,
          district: data.district,
          city: data.city,
          area: data.area,
          address: data.address,
        },
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const booking = await res.json();

      if (res.ok) {
        // Proceed to Payment
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking._id }),
        });

        const checkoutData = await checkoutRes.json();

        if (checkoutData.url) {
          window.location.href = checkoutData.url;
        } else {
          console.error("Payment initiation failed");
          router.push("/my-bookings");
        }
      } else {
        alert("Failed to book service");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
        // Keep loading state if redirecting, or reset if error
       if(loading) setLoading(false);
    }
  };

  if (!isOpen) {
      return (
        <Button size="lg" className="w-full md:w-auto px-8 text-lg py-6" onClick={() => setIsOpen(true)}>
            Book This Service
        </Button>
      )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh] p-6 relative">
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <h2 className="text-2xl font-bold mb-4">Book {service.title}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
           <div className="space-y-2">
              <Label>Duration (Hours)</Label>
              <Input type="number" min="1" {...register("durationHours")} />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="datetime-local" {...register("startTime")} />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Full Address" {...register("address")} />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Division" {...register("division")} />
                <Input placeholder="District" {...register("district")} />
                <Input placeholder="City" {...register("city")} />
                <Input placeholder="Area" {...register("area")} />
            </div>
           
           <div className="pt-4">
                <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                {loading ? "Redirecting to Stripe..." : `Pay Now ($${totalCost})`}
                </Button>
           </div>
        </form>
      </div>
    </div>
  );
}
