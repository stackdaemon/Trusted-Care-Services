"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerHour: z.coerce.number().min(1, "Price must be at least 1"),
  category: z.enum(["Baby Care", "Elderly Care", "Special Care", "Pet Care", "Household", "Education"]),
  image: z.string().url("Invalid Image URL").optional().or(z.literal("")),
  features: z.string().optional(),
});

export default function AddServicePage() {
  // Client-side code is the same, just resolving potential build issues.
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    if (!loading && !user) {
        router.push("/login");
    }
  }, [user, loading, router]);
  
  const onSubmit = async (data) => {
    setSubmitting(true);
    setError("");

    try {
      const formattedData = {
          ...data,
          features: data.features ? data.features.split(",").map(f => f.trim()) : [],
          email: user.email 
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to add service");
      }

      router.push("/services");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container max-w-2xl px-4 py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Service (Admin)</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input placeholder="Service Title" {...register("title")} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Detailed description..." {...register("description")} />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price Per Hour ($)</Label>
              <Input type="number" step="0.01" {...register("pricePerHour")} />
              {errors.pricePerHour && <p className="text-sm text-red-500">{errors.pricePerHour.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("category")}
              >
                <option value="">Select Category</option>
                <option value="Baby Care">Baby Care</option>
                <option value="Elderly Care">Elderly Care</option>
                <option value="Special Care">Special Care</option>
                <option value="Pet Care">Pet Care</option>
                <option value="Household">Household</option>
                <option value="Education">Education</option>
              </select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input placeholder="https://..." {...register("image")} />
          {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Features (comma separated)</Label>
          <Input placeholder="Certified, 24/7 Support, etc." {...register("features")} />
        </div>

        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{error}</div>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Adding Service..." : "Add Service"}
        </Button>
      </form>
    </div>
  );
}
