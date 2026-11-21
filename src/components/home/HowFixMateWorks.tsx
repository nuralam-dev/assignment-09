import Link from "next/link";
import {
  FiArrowRight,
  FiCalendar,
  FiCreditCard,
  FiSearch,
  FiTool,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description: "Browse available device and home appliance repair services.",
    icon: FiSearch,
  },
  {
    number: "02",
    title: "Book a Repair",
    description:
      "Select your preferred service and submit a repair request.",
    icon: FiCalendar,
  },
  {
    number: "03",
    title: "Get It Fixed",
    description:
      "Your technician accepts the request, repairs the device, and updates the job status.",
    icon: FiTool,
  },
  {
    number: "04",
    title: "Pay Securely",
    description: "Pay through Stripe after the repair is completed.",
    icon: FiCreditCard,
  },
];

export default function HowFixMateWorks() {
  return (
    <section
      id="how-fixmate-works"
      aria-labelledby="how-fixmate-works-title"
      className="bg-white px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-orange-600">
            Simple, transparent, reliable
          </p>
          <h2
            id="how-fixmate-works-title"
            className="mt-3 text-3xl font-bold text-[#092e33] md:text-4xl"
          >
            How FixMate Works
          </h2>
          <p className="mt-4 leading-relaxed text-slate-500">
            Get your devices repaired in four simple steps.
          </p>
        </header>

        <div className="relative mt-12">
          {/* Dashed connector shows the four steps as one continuous flow.
              It sits behind the opaque cards, so it only appears in the gaps. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-[52px] hidden border-t-2 border-dashed border-teal-200 xl:block"
          />
          <ol className="relative grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <li key={number} className="h-full">
                <Card className="h-full rounded-2xl bg-[#f8faf9] py-7 shadow-sm ring-slate-200/70 transition-colors hover:bg-orange-50/50 hover:ring-orange-200 motion-reduce:transition-none">
                  <CardContent className="space-y-4 px-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#092e33] text-orange-300">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-4xl leading-none font-bold text-[#092e33] md:text-5xl"
                      >
                        {number}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
                        Step {number}
                      </p>
                      <h3 className="mt-1.5 text-lg font-semibold text-[#092e33]">
                        {title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-slate-500">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Explore Services
            <FiArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
