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

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <main className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
         <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">All Services</h1>
         <p className="max-w-[700px] text-gray-500 md:text-xl">
            Browse our full catalog of professional care services.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
           <div key={service._id} className="flex flex-col p-6 bg-card text-card-foreground border rounded-xl shadow-sm hover:shadow-md transition-all">
             <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
               <img
                 src={service.image || "https://via.placeholder.com/400x300"}
                 alt={service.title}
                 className="object-cover w-full h-full"
               />
               <div className="absolute top-2 right-2 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                 ${service.pricePerHour}/hr
               </div>
             </div>
             
             <div className="flex-1 space-y-4">
               <div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm text-primary font-medium">{service.category}</p>
               </div>
               <p className="text-gray-500 line-clamp-3">{service.description}</p>
               
               {service.features && (
                 <div className="flex flex-wrap gap-2 pt-2">
                   {service.features.slice(0,3).map((f, i) => (
                     <span key={i} className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-600">
                       {f}
                     </span>
                   ))}
                   {service.features.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-600">+{service.features.length - 3}</span>
                   )}
                 </div>
               )}
             </div>

             <div className="mt-6 pt-6 border-t">
               <Link href={`/service/${service._id}`} className="w-full">
                 <Button className="w-full">View Details</Button>
               </Link>
             </div>
           </div>
        ))}
      </div>
    </main>
  );
}
