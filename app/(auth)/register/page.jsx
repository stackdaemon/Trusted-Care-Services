"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider"; // Updated import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  nid: z.string().min(1, "NID is required"),
  contact: z.string().min(1, "Contact number is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, updateUserProfile } = useAuth(); // Use Firebase functions
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const userCredential = await registerUser(data.email, data.password);
      await updateUserProfile({ displayName: data.name });

      // Optional: Store additional user data (NID, Contact) in MongoDB or Firebase Firestore
      // For this assignment, we'll assume auth is enough, or send data to API to store in MongoDB
      
      const res = await fetch("/api/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });
      
      // Even if sync fails, we redirect because the user is created in Firebase
      router.push("/");
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
          setError("Email already in use");
      } else {
          setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="text-2xl font-bold text-primary">
            Care.xyz
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-center">
            Create an account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your details to register
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nid">NID Number</Label>
            <Input id="nid" placeholder="1234567890" {...register("nid")} />
            {errors.nid && (
              <p className="text-sm text-red-500">{errors.nid.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" placeholder="+88017..." {...register("contact")} />
            {errors.contact && (
              <p className="text-sm text-red-500">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && <div className="text-sm text-red-500 text-center">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
