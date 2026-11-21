"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  FiArrowRight,
  FiMonitor,
  FiSearch,
  FiSmartphone,
  FiTool,
  FiTv,
  FiZap,
} from "react-icons/fi";

import { MdAcUnit, MdKitchen, MdLocalLaundryService } from "react-icons/md";

// Category photos are free Pexels License images (https://www.pexels.com).
const pexels = (id: number, width: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const categories = [
  { name: "Smartphone", icon: FiSmartphone, image: pexels(6755075, 600) },
  { name: "Laptop & PC", icon: FiMonitor, image: pexels(7639370, 600) },
  { name: "AC", icon: MdAcUnit, image: pexels(5463587, 600) },
  { name: "Refrigerator", icon: MdKitchen, image: pexels(4099089, 600) },
  { name: "TV", icon: FiTv, image: pexels(37492292, 600) },
  { name: "Washing Machine", icon: MdLocalLaundryService, image: pexels(9515294, 600) },
  { name: "Electrical", icon: FiZap, image: pexels(257736, 600) },
];

export default function Banner() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = search.trim();

    if (text) {
      router.push(`/services?search=${encodeURIComponent(text)}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <section className="bg-[#f5f8f8]  pb-20 ">
      {/* Hero Area */}
      <div className="relative flex min-h-145 items-center overflow-hidden bg-[#05282c]">
        
        <Image
          src="/images/repair-hero.jpg"
          alt="Technician repairing a laptop in a bright, modern workspace"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5, 40, 44, 0.95), rgba(5, 40, 44, 0.60))",
          }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-20 md:px-8">
          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
            <FiTool className="text-orange-400" />
            Your Trusted Repair Partner
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Expert Repairs.
            <br />
            <span className="text-orange-400">Zero Hassle.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-8 text-gray-200 md:text-lg">
            Find trusted technicians for your everyday devices and home
            appliances. Book a repair, track the progress, and pay after
            completion.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-2xl items-center rounded-xl bg-white p-2 shadow-xl"
          >
            <FiSearch className="ml-3 text-xl text-gray-400" />

            <input
              type="text"
              placeholder="Search AC, Laptop, TV repair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 px-3 py-3 text-sm text-gray-800 outline-none md:text-base"
            />

            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Search
            </button>
          </form>

          {/* Explore Button */}
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 font-medium text-white transition hover:text-orange-400"
          >
            Explore All Services
            <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Category Section */}
      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 md:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xl md:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
              Explore Repair Categories
            </h2>

            <Link
              href="/services"
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-teal-700 hover:text-orange-500"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 px-3 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:shadow-md"
                >
                  {/* Category photo sits under a soft white layer so labels stay readable. */}
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 14vw, (min-width: 640px) 30vw, 45vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-white/75 transition-colors group-hover:bg-white/60"
                  />

                  <div className="relative flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-3xl text-teal-700 transition group-hover:bg-orange-100 group-hover:text-orange-500">
                      <Icon />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-700 group-hover:text-orange-600">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
