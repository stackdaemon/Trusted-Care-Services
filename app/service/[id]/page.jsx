import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/db";
import Service from "@/models/Service";
import ServiceBookingModal from "@/components/ServiceBookingModal";

export const dynamic = 'force-dynamic';

async function getService(id) {
  try {
    await connectDB();
    const service = await Service.findById(id).lean();
    if (!service) return null;
    service._id = service._id.toString();
    return service;
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

export default async function ServiceDetailsPage(props) {
  const params = await props.params;
  const service = await getService(params.id);

  if (!service) {
    notFound();
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="md:w-1/2">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border">
                <img 
                    src={service.image || "https://via.placeholder.com/600x400"} 
                    alt={service.title} 
                    className="object-cover w-full h-full"
                />
            </div>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{service.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {service.category}
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${service.pricePerHour}<span className="text-base text-gray-500 font-normal">/hr</span>
                    </span>
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {service.description}
            </p>

            {service.features && service.features.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg">What's Included:</h3>
                    <ul className="grid grid-cols-1 gap-2">
                        {service.features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="pt-6">
                <ServiceBookingModal service={service} />
            </div>
        </div>
      </div>
    </div>
  );
}
