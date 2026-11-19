import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiClock, FiMapPin, FiTool, FiUser } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";

export type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  approvalStatus: string;
  isAvailable: boolean;
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="h-full overflow-hidden rounded-2xl pt-0 shadow-sm">
      <Image
        src={service.image}
        alt={service.title}
        width={600}
        height={320}
        unoptimized
        className="h-48 w-full object-cover"
      />
      <CardContent className="flex flex-1 flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-orange-600">{service.category}</p>
          <h2 className="mt-2 text-xl font-semibold text-[#092e33]">{service.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {service.description}
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-500">
          <span className="flex items-center gap-2"><FiUser aria-hidden="true" />{service.technicianName}</span>
          <span className="flex items-center gap-2"><FiTool aria-hidden="true" />{service.serviceMode}</span>
          <span className="flex items-center gap-2"><FiMapPin aria-hidden="true" />{service.serviceArea}</span>
          <span className="flex items-center gap-2"><FiClock aria-hidden="true" />{service.estimatedDuration}</span>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="mt-1 text-lg font-semibold text-[#092e33]">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(service.basePrice)}
            </p>
          </div>
          <Link
            href={`/services/${encodeURIComponent(service._id)}`}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            View Details <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
