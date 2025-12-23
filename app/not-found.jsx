import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-gray-600">Page Not Found</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
