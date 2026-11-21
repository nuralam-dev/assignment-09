"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { FiArrowRight, FiCalendar, FiCheck, FiCreditCard, FiSearch, FiTool } from "react-icons/fi";
import SectionReveal from "./SectionReveal";

const steps = [
  {
    number: "01",
    title: "Explore Services",
    summary: "Find the right repair",
    description: "Browse approved, available services for your devices and home appliances. Compare starting prices, service areas and home visit or shop drop-off options before choosing.",
    detail: "A little exploring. A clearer starting point.",
    icon: FiSearch,
  },
  {
    number: "02",
    title: "Book a Technician",
    summary: "Tell us what needs fixing",
    description: "Sign in as a customer and send a repair request with your problem, address, phone number and preferred date. Your assigned technician can then accept or reject the request.",
    detail: "Send your request. Wait for technician confirmation.",
    icon: FiCalendar,
  },
  {
    number: "03",
    title: "Track Your Repair",
    summary: "Follow every stage",
    description: "Open My Bookings in your dashboard to follow your request from accepted to in progress and completed. When the repair is finished, your technician sets the final amount.",
    detail: "Requested → Accepted → In progress → Completed",
    icon: FiTool,
  },
  {
    number: "04",
    title: "Secure Payment",
    summary: "Pay after completion",
    description: "Once your repair is completed, review the final amount in My Bookings and continue to secure Stripe Checkout. Payment is available only for completed, unpaid jobs.",
    detail: "Repair first. Review the final amount. Then pay.",
    icon: FiCreditCard,
  },
];

export default function HowFixMateWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % steps.length;
    else if (event.key === "ArrowLeft") next = (index + steps.length - 1) % steps.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = steps.length - 1;
    else return;
    event.preventDefault();
    setActiveStep(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="how-fixmate-works" aria-labelledby="how-fixmate-works-title" className="bg-white px-5 py-20 md:px-8 md:py-24">
      <SectionReveal className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-orange-600 uppercase">From a quick search to a working device</p>
          <h2 id="how-fixmate-works-title" className="mt-4 text-3xl font-bold tracking-tight text-[#092e33] md:text-5xl">How FixMate Works</h2>
          <p className="mt-5 leading-7 text-slate-500">Four simple steps. One less thing to worry about.<br className="hidden sm:block" /> Select a step to see what comes next.</p>
        </header>

        <div className="relative mt-12 md:mt-14">
          <div aria-hidden="true" className="absolute inset-x-[12.5%] top-9 hidden h-px bg-teal-100 lg:block">
            <div className={`fixmate-workflow-connector h-full origin-left bg-teal-700`} style={{ transform: `scaleX(${activeStep / (steps.length - 1)})` }} />
          </div>
          <div role="tablist" aria-label="Repair process steps" className="relative grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {steps.map(({ number, title, summary, icon: Icon }, index) => (
              <button
                key={number}
                ref={(element) => { tabs.current[index] = element; }}
                id={`workflow-step-${number}`}
                type="button"
                role="tab"
                aria-selected={activeStep === index}
                aria-controls={`workflow-panel-${number}`}
                tabIndex={activeStep === index ? 0 : -1}
                onClick={() => setActiveStep(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`fixmate-workflow-step group relative rounded-2xl border p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 sm:p-6 ${activeStep === index ? "border-teal-800 bg-[#092e33] text-white shadow-lg shadow-teal-950/10" : "border-slate-200 bg-[#f8faf9] text-[#092e33] hover:border-teal-400 hover:bg-teal-50"}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`flex size-11 items-center justify-center rounded-xl ${activeStep === index ? "bg-white/10 text-orange-300" : "bg-white text-teal-700 shadow-sm"}`}><Icon className="size-5" aria-hidden="true" /></span>
                  <span aria-hidden="true" className={`text-3xl font-semibold tracking-tight ${activeStep === index ? "text-orange-300" : "text-slate-300"}`}>{number}</span>
                </span>
                <span className="mt-6 block text-sm font-semibold sm:text-base">{title}</span>
                <span className={`mt-2 hidden text-xs sm:block ${activeStep === index ? "text-teal-100" : "text-slate-500"}`}>{summary}</span>
                <span aria-hidden="true" className={`absolute right-5 bottom-5 size-1.5 rounded-full sm:bottom-6 ${activeStep === index ? "bg-orange-400" : "bg-transparent"}`} />
              </button>
            ))}
          </div>
          <div aria-hidden="true" className="mt-5 h-1 overflow-hidden rounded-full bg-teal-100 lg:hidden">
            <div className={`fixmate-workflow-connector h-full origin-left rounded-full bg-teal-700`} style={{ transform: `scaleX(${(activeStep + 1) / steps.length})` }} />
          </div>
        </div>

        {steps.map(({ number }, index) => (
          <div key={number} id={`workflow-panel-${number}`} role="tabpanel" aria-labelledby={`workflow-step-${number}`} tabIndex={0} hidden={activeStep !== index} className="mt-6 rounded-3xl bg-[#f0f7f6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            {activeStep === index && (
              <div key={activeStep} className={`fixmate-workflow-panel grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-10`}>
                <div className="flex items-start gap-4 sm:gap-6">
                  <span aria-hidden="true" className="hidden size-16 shrink-0 items-center justify-center rounded-2xl border border-teal-200 bg-white text-teal-700 sm:flex"><ActiveIcon className="size-7" /></span>
                  <div className="max-w-2xl">
                    <p className="text-xs font-bold tracking-widest text-teal-700 uppercase">Step {active.number} of 04</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#092e33]">{active.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{active.description}</p>
                    <p className="mt-4 flex items-start gap-2 text-xs leading-6 font-medium text-teal-800"><FiCheck aria-hidden="true" className="mt-1 size-4 shrink-0" />{active.detail}</p>
                  </div>
                </div>
                <Link href="/services" className={`fixmate-home-cta inline-flex w-fit items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600`}>Explore Services<FiArrowRight aria-hidden="true" /></Link>
              </div>
            )}
          </div>
        ))}
      </SectionReveal>
    </section>
  );
}
