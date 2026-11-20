import { FiMessageSquare, FiStar } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";

// Layout placeholders only. Replace with verified API data when reviews exist.
const previewServices = [
  "Smartphone repair",
  "AC repair",
  "Laptop & PC repair",
];

export default function CustomerReviews() {
  return (
    <section
      id="customer-reviews"
      aria-labelledby="customer-reviews-title"
      className="bg-[#f5f8f8] px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#092e33] text-orange-300">
            <FiMessageSquare className="size-6" aria-hidden="true" />
          </span>
          <h2
            id="customer-reviews-title"
            className="mt-5 text-3xl font-bold text-[#092e33] md:text-4xl"
          >
            What Our Customers Say
          </h2>
          <p className="mt-4 leading-relaxed text-slate-500">
            Discover what customers think about their repair service experience.
          </p>
        </header>
        <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-dashed border-teal-200 bg-white px-5 py-3 text-center text-sm leading-6 text-slate-600">
          <strong className="font-semibold text-[#092e33]">
            Development preview only.
          </strong>{" "}
          These are layout placeholders, not customer testimonials. Real
          reviews, ratings and dates are not available yet.
        </p>
        <div className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
          {previewServices.map((service, index) => (
            <Card
              key={service}
              className="h-full rounded-2xl py-6 shadow-sm ring-slate-200/70"
            >
              <CardContent className="flex h-full flex-col gap-5 px-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800">
                    <span aria-hidden="true" className="text-sm font-semibold">
                      SC
                    </span>
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#092e33]">
                      Sample customer {index + 1}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-orange-600">
                      Preview placeholder
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="flex gap-1 text-slate-300"
                    aria-hidden="true"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className="size-4" />
                    ))}
                  </span>
                  <span className="text-xs text-slate-500">Not rated</span>
                </div>
                <p className="flex-1 text-sm leading-7 text-slate-500">
                  A customer&apos;s feedback about their repair experience will
                  appear here when customer reviews are available.
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400">
                    Example repair service
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#092e33]">
                    {service}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
