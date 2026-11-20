import {
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiMapPin,
  FiTool,
  FiTrendingUp,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Skilled Technicians",
    description: "Experienced professionals for device and appliance repairs.",
    icon: FiTool,
  },
  {
    title: "Reliable Service",
    description: "Quality repair solutions you can depend on.",
    icon: FiCheckCircle,
  },
  {
    title: "Transparent Pricing",
    description: "Clear service pricing with no unnecessary surprises.",
    icon: FiDollarSign,
  },
  {
    title: "Easy Booking",
    description: "Request repair services in just a few simple steps.",
    icon: FiCalendar,
  },
  {
    title: "Convenient Service",
    description: "Choose from available home visits and workshop services.",
    icon: FiMapPin,
  },
  {
    title: "Simple Service Tracking",
    description: "Follow your repair request status from your dashboard.",
    icon: FiTrendingUp,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-title"
      className="bg-white px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-orange-600">
            The FixMate difference
          </p>
          <h2
            id="why-choose-us-title"
            className="mt-3 text-3xl font-bold text-[#092e33] md:text-4xl"
          >
            Why Choose FixMate?
          </h2>
          <p className="mt-4 leading-relaxed text-slate-500">
            Trusted repair services that make everyday life easier.
          </p>
        </header>
        <div className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="h-full rounded-2xl bg-[#f8faf9] py-7 shadow-sm ring-slate-200/70 transition-colors hover:bg-orange-50/50 hover:ring-orange-200 motion-reduce:transition-none"
            >
              <CardContent className="space-y-4 px-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-[#f97316]">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-[#092e33]">
                  {title}
                </h3>
                <p className="max-w-sm text-sm leading-7 text-slate-500">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
