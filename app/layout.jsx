import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Footer from "@/components/Footer";

import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trusted Care Services - Trusted Care Services",
  description: "Reliable and trusted care services for children, elderly, and family members.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
             <Header />
             <main className="flex-grow">
                {children}
             </main>
             <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
