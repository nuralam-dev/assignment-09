import type { Metadata } from "next";
import { Suspense } from "react";
import { FiAlertCircle, FiTool } from "react-icons/fi";
import ServiceCard, { type Service } from "@/components/services/ServiceCard";
import ServicesLoading from "@/components/services/ServicesLoading";

export const metadata: Metadata = {
  title: "Repair Services | FixMate",
  description: "Browse available device and home appliance repair services from FixMate technicians.",
};

async function ServicesList() {
  let services: Service[];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error("API URL is not configured");

    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/services`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Services request failed");

    const result: { success: boolean; data?: Service[] } = await response.json();
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid services response");
    }

    // The backend enforces visibility too. Never show non-public services here.
    services = result.data.filter(
      (service) => service.approvalStatus === "approved" && service.isAvailable === true,
    );
  } catch {
    return (
      <div role="alert" className="rounded-2xl border border-orange-200 bg-white px-6 py-14 text-center">
        <FiAlertCircle className="mx-auto size-10 text-orange-500" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-[#092e33]">We couldn&apos;t load services</h2>
        <p className="mt-2 text-sm text-slate-500">Please try again in a moment.</p>
        <form action="/services" method="get" className="mt-6">
          <button type="submit" className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            Try Again
          </button>
        </form>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div role="status" className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <FiTool className="mx-auto size-10 text-teal-700" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold text-[#092e33]">No services available yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Approved repair services will appear here when technicians are available. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => <ServiceCard key={service._id} service={service} />)}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-[60vh] bg-[#f5f8f8] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold text-orange-600">Expert care for your everyday essentials</p>
          <h1 className="mt-3 text-3xl font-bold text-[#092e33] md:text-4xl">Find your repair service</h1>
          <p className="mt-4 leading-relaxed text-slate-500">
            Explore available services from trusted technicians for your devices and home appliances.
          </p>
        </header>
        <Suspense fallback={<ServicesLoading />}>
          <ServicesList />
        </Suspense>
      </div>
    </main>
  );
}
