import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FiArrowLeft, FiClock, FiMapPin, FiTool, FiUser } from "react-icons/fi";
import { type Service } from "@/components/services/ServiceCard";
import ServicesLoading from "@/components/services/ServicesLoading";
import BookingRequest from "@/components/bookings/BookingRequest";

export const metadata: Metadata = {
  title: "Service Details | FixMate",
  description: "View repair service details, pricing and technician information on FixMate.",
};

// Service IDs come from MongoDB, so this route renders on demand instead of
// building a static shell for every possible id.
export const instant = false;

const API_TIMEOUT = 10000;

async function getService(id: string): Promise<Service | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("API URL is not configured");

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/services/${encodeURIComponent(id)}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(API_TIMEOUT),
  });
  // The backend already restricts public detail reads to approved services.
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Service request failed");

  const result: { success: boolean; data?: Service } = await response.json();
  if (!result.success || !result.data) throw new Error("Invalid service response");

  return result.data;
}

async function ServiceDetail({ id }: { id: string }) {
  let service: Service | null;
  try {
    service = await getService(id);
  } catch {
    return (
      <div role="alert" className="mx-auto max-w-2xl rounded-2xl border border-orange-200 bg-white px-6 py-14 text-center">
        <h1 className="text-2xl font-bold text-[#092e33]">We couldn&apos;t load this service</h1>
        <p className="mt-2 text-sm text-slate-500">Please check your connection and try again.</p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <FiArrowLeft aria-hidden="true" /> Back to services
        </Link>
      </div>
    );
  }

  if (!service) notFound();

  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    service.basePrice,
  );

  return (
    <div className="space-y-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#092e33]"
      >
        <FiArrowLeft aria-hidden="true" /> All services
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <Image
          src={service.image}
          alt={service.title}
          width={1200}
          height={560}
          unoptimized
          className="h-64 w-full object-cover md:h-80"
        />

        <div className="grid gap-8 p-6 md:grid-cols-3 md:p-8">
          <div className="space-y-5 md:col-span-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                {service.category}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#092e33]">{service.title}</h1>
              <p className="mt-4 leading-relaxed text-slate-600">{service.description}</p>
            </div>

            <dl className="grid gap-3 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-slate-600">
                <FiUser aria-hidden="true" className="text-teal-700" />
                <dt className="sr-only">Technician</dt>
                <dd>{service.technicianName}</dd>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FiTool aria-hidden="true" className="text-teal-700" />
                <dt className="sr-only">Service mode</dt>
                <dd>{service.serviceMode}</dd>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FiMapPin aria-hidden="true" className="text-teal-700" />
                <dt className="sr-only">Service area</dt>
                <dd>{service.serviceArea}</dd>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FiClock aria-hidden="true" className="text-teal-700" />
                <dt className="sr-only">Estimated duration</dt>
                <dd>{service.estimatedDuration}</dd>
              </div>
            </dl>
          </div>

          <aside className="space-y-4 rounded-2xl border border-slate-100 bg-[#f5f8f8] p-5">
            <div>
              <p className="text-xs text-slate-500">Starting from</p>
              <p className="mt-1 text-3xl font-bold text-[#092e33]">{price}</p>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Final cost is confirmed by your technician after the job is assessed.
            </p>
            <BookingRequest serviceId={service._id} serviceTitle={service.title} />
            <Link
              href="/services"
              className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-[#092e33] hover:bg-slate-50"
            >
              Browse other services
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const valid = /^[a-f\d]{24}$/i.test(id);

  return (
    <main className="min-h-[60vh] bg-[#f5f8f8] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        {valid ? (
          <Suspense fallback={<ServicesLoading />}>
            <ServiceDetail id={id} />
          </Suspense>
        ) : (
          notFound()
        )}
      </div>
    </main>
  );
}
