"use client";
import Image from "next/image";
import { useState } from "react";
import { FiClock, FiMapPin } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { services } from "./data";
import {
  EmptyState,
  FilterSelect,
  PreviewAction,
  PreviewTable,
  StatusBadge,
} from "./DashboardUI";
import ServiceForm from "./ServiceForm";

export default function ServiceList({
  approval = false,
  recent = false,
}: {
  approval?: boolean;
  recent?: boolean;
}) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = services.filter(
    (service) =>
      (status === "all" || service.status === status) &&
      (!recent || service.status === "pending" || !approval) &&
      `${service.title} ${service.technician}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const rows = recent ? filtered.slice(0, 2) : filtered;
  return (
    <div className="space-y-4">
      {!recent && (
        <div className="flex flex-wrap gap-3">
          <Input
            type="search"
            aria-label="Search services"
            placeholder="Search services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 sm:max-w-xs"
          />
          <FilterSelect
            label="Statuses"
            value={status}
            onChange={setStatus}
            options={["all", "approved", "pending", "rejected"]}
          />
        </div>
      )}
      {approval ? (
        <PreviewTable
          headers={[
            "Service",
            "Technician",
            "Category",
            "Price",
            "Approval",
            "Actions",
          ]}
          rows={rows.map((service) => [
            <div key="service" className="flex items-center gap-3">
              <Image
                src="/images/repair-hero.jpg"
                alt="Repair service preview"
                width={44}
                height={44}
                className="size-11 rounded-lg object-cover"
              />
              <span className="font-medium text-[#092e33]">
                {service.title}
              </span>
            </div>,
            service.technician,
            service.category,
            service.price,
            <StatusBadge key="status" status={service.status} />,
            <div key="actions" className="flex gap-2">
              {service.status === "pending" ? (
                <>
                  <PreviewAction label="Approve" />
                  <PreviewAction label="Reject" destructive />
                </>
              ) : (
                <span className="text-xs text-slate-400">Reviewed</span>
              )}
            </div>,
          ])}
        />
      ) : rows.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden rounded-2xl pt-0 shadow-sm"
            >
              <Image
                src="/images/repair-hero.jpg"
                alt={service.title}
                width={600}
                height={280}
                className="h-36 w-full object-cover"
              />
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={service.status} />
                  <StatusBadge
                    status={service.available ? "available" : "unavailable"}
                  />
                </div>
                <div>
                  <p className="text-xs text-orange-600">{service.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#092e33]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {service.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiClock />
                    {service.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin />
                    {service.area}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <span className="text-lg font-semibold text-[#092e33]">
                    {service.price}
                  </span>
                  <div className="flex gap-2">
                    <PreviewAction label="Edit" title="Edit service preview">
                      <ServiceForm service={service} compact />
                    </PreviewAction>
                    <PreviewAction
                      label="Delete"
                      title="Delete service preview"
                      destructive
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
