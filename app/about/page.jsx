import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About Us - Care.xyz",
  description: "Learn more about our mission to provide reliable care services.",
};

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Care.xyz</h1>
          <p className="text-xl text-gray-500">
            Empowering families with trusted care solutions.
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to Care.xyz, your trusted partner in finding professional care for your loved ones. 
            We understand that finding reliable, compassionate, and skilled caregivers is one of the most important decisions a family can make.
          </p>
          <p>
            Whether you need a babysitter for a night out, a full-time elderly care companion, or specialized support for a family member with unique needs, we are here to help.
          </p>
          
          <h3>Our Mission</h3>
          <p>
            To create a safe, accessible, and efficient platform where families can easily connect with verified care professionals. 
            We strive to bring peace of mind to every home we serve.
          </p>

          <h3>Why Choose Us?</h3>
          <ul>
            <li><strong>Trust & Safety:</strong> All our caregivers undergo rigorous background checks.</li>
            <li><strong>Convenience:</strong> Book services in minutes with our easy-to-use platform.</li>
            <li><strong>Quality Care:</strong> We prioritize quality and compassion in every service we provide.</li>
          </ul>
        </div>

        <div className="flex justify-center pt-8">
           <Link href="/#services">
             <Button size="lg">Explore Our Services</Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
