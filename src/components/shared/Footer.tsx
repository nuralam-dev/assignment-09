
import Link from "next/link";
import Copyright from "./Copyright";

import {
  FiTool,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

import { FaXTwitter } from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "How It Works", href: "/about" },
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
];

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function Footer() {
  return (
    <footer className="bg-[#092e33] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand Section */}
          <div>
            <Link
              href="/"
              className="mb-6 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
                <FiTool className="text-2xl text-white" />
              </div>

              <h2 className="text-3xl font-bold">
                Fix<span className="text-orange-400">Mate</span>
              </h2>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-gray-300">
              Your trusted partner for smart device and
              home appliance repairs. Find reliable
              technicians, book services easily, and
              pay only after the job is completed.
            </p>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-orange-500"
              >
                <FiFacebook />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-orange-500"
              >
                <FaXTwitter />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-orange-500"
              >
                <FiInstagram />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition hover:bg-orange-500"
              >
                <FiLinkedin />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-300 transition hover:text-orange-400"
                  >
                    <FiArrowRight className="text-orange-400 transition group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Repair Services
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-sm text-gray-300 transition hover:text-orange-400"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">
              Get In Touch
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 shrink-0 text-xl text-orange-400" />
                <p className="text-sm leading-6 text-gray-300">
                  Dhaka, Bangladesh
                </p>
              </div>

              <a
                href="mailto:support@fixmate.com"
                className="flex items-center gap-3 text-sm text-gray-300 transition hover:text-orange-400"
              >
                <FiMail className="shrink-0 text-xl text-orange-400" />
                support@fixmate.com
              </a>

              <div className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-xl text-orange-400" />
                <p className="text-sm text-gray-300">
                  Contact number coming soon
                </p>
              </div>

            </div>

            {/* CTA Button */}
            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Explore Services
              <FiArrowRight />
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center md:flex-row md:px-8">

          <Copyright />

          <p className="text-sm text-gray-400">
            Built with care for better repair services.
          </p>

        </div>
      </div>

    </footer>
  );
}
