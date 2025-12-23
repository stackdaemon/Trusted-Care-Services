"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user, logout } = useAuth();
  const [role, setRole] = useState("user");
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/users/role?email=${user.email}`)
        .then(res => res.json())
        .then(data => setRole(data.role))
        .catch(() => setRole("user"));
    } else {
        setRole("user");
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Trusted Care Services</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors hover:text-foreground/80 ${isActive("/") ? "text-primary font-bold" : "text-foreground/60"}`}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className={`transition-colors hover:text-foreground/80 ${isActive("/services") ? "text-primary font-bold" : "text-foreground/60"}`}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors hover:text-foreground/80 ${isActive("/about") ? "text-primary font-bold" : "text-foreground/60"}`}
            >
              About
            </Link>
             {role === "admin" && (
                <Link 
                  href="/admin/add-service" 
                  className={`transition-colors hover:text-foreground/80 ${isActive("/admin/add-service") ? "text-primary font-bold" : "text-foreground/60"}`}
                >
                  Add Service
                </Link>
             )}
          </nav>
        </div>
        
        {/* Mobile Logo centered or left if needed, keeping simple for now */}
        <Link href="/" className="md:hidden font-bold">Trusted Care Services</Link>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link href="/my-bookings">
                <Button variant="ghost" size="sm">My Bookings</Button>
              </Link>
              
              <div className="relative group flex items-center justify-center">
                 <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 cursor-pointer">
                    <img 
                      src={user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                 </div>
                 {/* Tooltip */}
                 <div className="absolute top-full mt-2 right-0 hidden group-hover:flex flex-col items-end bg-black text-white text-xs px-2 py-1 rounded w-max z-50">
                    <span className="font-semibold">{user.displayName || "User"}</span>
                    <span className="text-gray-300 text-[10px]">{user.email}</span>
                 </div>
              </div>

              <Button onClick={() => logout()} size="sm" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
