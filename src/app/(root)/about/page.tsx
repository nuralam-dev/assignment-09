import type { Metadata } from "next";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiSearch,
  FiTool,
  FiUserCheck,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "About & How It Works | FixMate",
  description: "Learn how FixMate connects you with trusted technicians for device and appliance repairs.",
};

const steps = [
  {
    icon: FiSearch,
    title: "Find a service",
    text: "Browse approved repair services by category, price and availability.",
  },
  {
    icon: FiUserCheck,
    title: "Send a request",
    text: "Share your problem, preferred date and address with the technician.",
  },
  {
    icon: FiTool,
    title: "Track the repair",
    text: "Follow the job from requested to accepted, in progress and completed.",
  },
  {
    icon: FiCreditCard,
    title: "Pay after completion",
    text: "Review the final amount and pay only once the job is done.",
  },
];

const reasons = [
  "Verified technicians with approved service listings",
  "Clear starting prices before you book",
  "Live status updates for every repair request",
  "Secure account and role-based dashboards",
];

export default function AboutPage() {
  return (
    <main className="min-h-[60vh] bg-[#f5f8f8]">
      <section className="bg-[#092e33] px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
            About FixMate
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Reliable repairs, <span className="text-orange-400">better experience.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-gray-300">
            FixMate connects customers with trusted technicians for smart devices and home
            appliances. Pick a service, send a request and follow every step until the repair
            is done.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Browse services <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-[#092e33]">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <step.icon className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-semibold text-orange-600">Step {index + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-[#092e33]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#092e33]">Why choose FixMate</h2>
            <p className="mt-4 leading-relaxed text-slate-500">
              A simple platform built for everyday repairs, with transparent pricing and
              status you can trust.
            </p>
          </div>
          <ul className="space-y-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-slate-600">
                <FiCheckCircle className="mt-0.5 size-5 shrink-0 text-teal-700" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
