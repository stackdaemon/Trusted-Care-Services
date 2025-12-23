import Link from "next/link";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/db";
import Service from "@/models/Service";

export const dynamic = 'force-dynamic';

async function getServices() {
  try {
     await connectDB();
     return await Service.find({}).lean();
  } catch (e) {
     console.error("DB connection error:", e);
     return [];
  }
}

export default async function Home() {
  const services = await getServices();

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary-900">
                Care that you can <span className="text-primary">Trust</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Reliable care services for your loved ones. From babysitting to elderly care, we are here to help.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/#services">
                <Button size="lg" className="rounded-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose from our wide range of professional care services designed for your family's needs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
             {services.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500">
                  <p>No services available at the moment. Please run the seed script.</p>
                  <em className="text-xs">GET /api/seed</em>
                </div>
             ) : (
                services.slice(0, 3).map((service) => (
                  <div key={service._id} className="flex flex-col items-center p-6 space-y-4 text-center bg-gray-50 rounded-xl hover:shadow-lg transition-shadow border">
                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                      {/* Placeholder Image if none */}
                      <img
                        src={service.image || "https://via.placeholder.com/400x300"}
                        alt={service.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-gray-500 line-clamp-2">{service.description}</p>
                    <div className="mt-4">
                      <Link href={`/service/${service._id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </div>
                ))
             )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button size="lg" className="px-8">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Making Caregiving Easy, Secure, and Accessible</h2>
               <p className="text-lg text-gray-600">
                 Our mission is to bridge the gap between families and professional caregivers. We believe everyone deserves reliable care for their loved ones, whether it's a child, an elderly parent, or a family member with special needs.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>Verified Professionals</span>
                 </li>
                 <li className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>Secure Booking Process</span>
                 </li>
                 <li className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>24/7 Support</span>
                 </li>
               </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
               <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" alt="Mission" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 sm:text-5xl text-gray-900 dark:text-gray-100">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: "Sarah J.", role: "Working Mom", content: "Care.xyz has been a lifesaver! I found a wonderful babysitter for my twins within hours." },
               { name: "Ahmed K.", role: "Son", content: "The elderly care service for my father is exceptional. The caregiver is professional and kind." },
               { name: "Emily R.", role: "Mother", content: "Highly recommend for special needs care. They really understand the specific requirements." }
             ].map((t, i) => (
               <div key={i} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  <div className="mb-4 text-primary">
                    <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6 text-lg">"{t.content}"</p>
                  <div className="flex items-center space-x-4">
                     <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {t.name[0]}
                     </div>
                     <div>
                        <div className="font-bold text-gray-900 dark:text-white">{t.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>
    </main>
  );
}
