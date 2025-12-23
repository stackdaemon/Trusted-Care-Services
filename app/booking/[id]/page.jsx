"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  // Fetch service client-side to avoid build issues with server components + weird imports
  useEffect(() => {
     if (params?.id) {
         fetch(`/api/services/${params.id}`)
            .then(res => res.json())
            .then(data => setService(data))
            .catch(err => console.error(err));
     }
  }, [params?.id]);

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
    if (service && durationHours) {
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
      setLoading(false);
    }
  };
  
  if (!service) return <div className="p-12 text-center">Loading Service...</div>;

  return (
    <div className="container px-4 py-12 mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Booking: {service.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <div className="space-y-4">
          <Label>Duration (Hours)</Label>
          <Input type="number" min="1" {...register("durationHours")} />
          
          <Label>Start Time</Label>
          <Input type="datetime-local" {...register("startTime")} />
          
          <Label>Address</Label>
          <Input placeholder="Full Address" {...register("address")} />
          
           <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Division" {...register("division")} />
              <Input placeholder="District" {...register("district")} />
              <Input placeholder="City" {...register("city")} />
              <Input placeholder="Area" {...register("area")} />
           </div>
       </div>
       
       <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Redirecting to Payment..." : `Confirm & Pay with Stripe ($${totalCost})`}
       </Button>
    </form>
    </div>
  );
}
