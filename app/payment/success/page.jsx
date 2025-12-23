"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    if (sessionId) {
      fetch("/api/payment/success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
        setStatus("error");
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === "loading" && (
        <div className="animate-pulse">
            <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
            <p>Please wait while we confirm your booking.</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Your booking has been confirmed. You will receive an email shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/my-bookings">
              <Button>View My Bookings</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-700">Payment Verification Failed</h1>
          <p className="text-gray-600">
            There was an issue verifying your payment. Please contact support.
          </p>
          <Link href="/my-bookings">
              <Button variant="secondary">Go to My Bookings</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
