import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiCreditCard, FiGrid, FiShield, FiTool, FiTrendingUp } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import SectionReveal from "./SectionReveal";

// Local copy of Pexels photo 6755075, used under https://www.pexels.com/license/.
// Source: https://images.pexels.com/photos/6755075/pexels-photo-6755075.jpeg
const features = [
  { title: "Secure Booking", description: "Your requests, managed in your own account.", icon: FiShield },
  { title: "Clear Repair Progress", description: "Requested to completed, visible in My Bookings.", icon: FiTrendingUp },
  { title: "Secure Stripe Checkout", description: "Review the final amount and pay after completion.", icon: FiCreditCard },
  { title: "Multiple Repair Categories", description: "Seven categories for devices and home appliances.", icon: FiGrid },
];

export default function AboutFixMate() {
  return (
    <section id="about-fixmate" aria-labelledby="about-fixmate-title" className="relative overflow-hidden bg-[#f5f8f8] px-5 py-20 md:px-8 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full border-[40px] border-teal-900/[0.025]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <SectionReveal className="relative pb-6 pl-3 sm:pl-6">
          <div aria-hidden="true" className="absolute inset-x-0 top-8 bottom-0 rounded-[2rem] bg-teal-100/70" />
          <div className={`fixmate-about-photo group relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-teal-950 sm:aspect-[6/5] lg:aspect-[4/5]`}>
            <Image src="/images/about-repair.jpg" alt="Technician carefully repairing the inside of a smartphone with a precision screwdriver" fill sizes="(min-width: 1280px) 540px, (min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#05282c]/90 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-7 text-white sm:inset-x-8 sm:bottom-9">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-orange-300"><FiTool className="size-5" aria-hidden="true" /></span>
              <p className="text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">Everyday essentials.<br />Extra care.</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-teal-50">A simpler way to get back to the things that matter.</p>
            </div>
          </div>
          <span aria-hidden="true" className="absolute top-7 right-4 h-1.5 w-14 rounded-full bg-orange-400" />
        </SectionReveal>

        <SectionReveal>
          <p className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-orange-600 uppercase"><span aria-hidden="true" className="h-px w-8 bg-orange-400" />About FixMate</p>
          <h2 id="about-fixmate-title" className="mt-4 max-w-xl text-3xl leading-[1.15] font-bold tracking-tight text-[#092e33] sm:text-4xl xl:text-5xl">Making Repairs Simple, <span className="text-teal-700">One Device at a Time.</span></h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">FixMate makes it easier to discover repair services, connect with technicians, track repair progress, and pay securely after the job is completed.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map(({ title, description, icon: Icon }) => (
              <Card key={title} className={`fixmate-about-feature rounded-2xl bg-white py-5 shadow-sm ring-slate-200/60`}>
                <CardContent className="px-5">
                  <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Icon aria-hidden="true" className="size-5" /></span>
                  <h3 className="text-sm font-semibold text-[#092e33]">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link href="/about" className={`fixmate-home-cta mt-8 inline-flex items-center gap-2 border-b border-teal-700/30 pb-1.5 text-sm font-semibold text-teal-800 hover:border-orange-500 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700`}>Get to know FixMate<FiArrowUpRight aria-hidden="true" className="size-4" /></Link>
        </SectionReveal>
      </div>
    </section>
  );
}
