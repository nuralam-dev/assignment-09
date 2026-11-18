"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCheck,
  ClipboardList,
  Clock3,
  Search,
  Star,
  TrendingUp,
  Wallet,
  Wrench,
} from "lucide-react";
import { useState } from "react";

const requests = [
  {
    id: "FM-1048",
    service: "AC repair & servicing",
    category: "Appliance care",
    customer: "Arif Rahman",
    initials: "AR",
    date: "Nov 20, 2026",
    amount: 1800,
    status: "Pending",
  },
  {
    id: "FM-1047",
    service: "Kitchen plumbing",
    category: "Plumbing",
    customer: "Sara Ahmed",
    initials: "SA",
    date: "Nov 19, 2026",
    amount: 1200,
    status: "Scheduled",
  },
  {
    id: "FM-1046",
    service: "Electrical inspection",
    category: "Electrical",
    customer: "Tanvir Hasan",
    initials: "TH",
    date: "Nov 18, 2026",
    amount: 950,
    status: "Completed",
  },
  {
    id: "FM-1045",
    service: "Washing machine repair",
    category: "Appliance care",
    customer: "Nadia Islam",
    initials: "NI",
    date: "Nov 18, 2026",
    amount: 2200,
    status: "Completed",
  },
  {
    id: "FM-1044",
    service: "Bathroom tap replacement",
    category: "Plumbing",
    customer: "Imran Khan",
    initials: "IK",
    date: "Nov 17, 2026",
    amount: 750,
    status: "Pending",
  },
];

const metrics = [
  {
    title: "Total requests",
    value: "32",
    change: "+8 this month",
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Completed jobs",
    value: "24",
    change: "75% completion rate",
    icon: CheckCheck,
    color: "bg-teal-50 text-teal-700",
  },
  {
    title: "Total earnings",
    value: "৳28,450",
    change: "+12.8% this month",
    icon: Wallet,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Average rating",
    value: "4.9",
    change: "From 18 reviews",
    icon: Star,
    color: "bg-violet-50 text-violet-600",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Scheduled: "border-blue-200 bg-blue-50 text-blue-700",
  Completed: "border-teal-200 bg-teal-50 text-teal-700",
};

export default function DashboardOverview() {
  const [query, setQuery] = useState("");
  const filteredRequests = requests.filter((request) =>
    `${request.id} ${request.service} ${request.customer}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <section className="mx-auto max-w-7xl space-y-7 pb-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase">
            Your workspace, at a glance
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A little clarity for a productive day. Here’s how things are going.
          </p>
        </div>
        <Badge
          variant="outline"
          className="h-9 gap-2 rounded-lg bg-white px-3 text-slate-600"
        >
          <CalendarDays aria-hidden="true" /> November 2026
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Badge variant="secondary" className="bg-teal-50 text-teal-700">
          Demo workspace
        </Badge>
        <span>Sample data for preview.</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ title, value, change, icon: Icon, color }) => (
          <Card
            key={title}
            className="gap-5 rounded-2xl py-5 shadow-none ring-slate-200/80"
          >
            <CardHeader className="px-5">
              <CardDescription className="font-medium text-slate-500">
                {title}
              </CardDescription>
              <CardAction>
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </CardAction>
              <CardTitle className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                {value}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-1.5 px-5 text-xs text-slate-500">
              <TrendingUp
                className="size-3.5 text-teal-600"
                aria-hidden="true"
              />
              {change}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="min-w-0 gap-0 rounded-2xl py-0 shadow-none ring-slate-200/80">
          <CardHeader className="gap-1 px-6 pt-6 pb-5">
            <CardTitle>
              <h2 className="text-lg font-semibold tracking-tight">
                Recent requests
              </h2>
            </CardTitle>
            <CardDescription>
              Keep track of your latest service requests.
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="all" className="gap-0">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 pb-4 sm:flex-row sm:items-center">
              <TabsList
                aria-label="Filter requests by status"
                className="h-9 bg-slate-100/80"
              >
                <TabsTrigger value="all" className="px-3">
                  All requests
                </TabsTrigger>
                <TabsTrigger value="pending" className="px-3">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="completed" className="px-3">
                  Completed
                </TabsTrigger>
              </TabsList>
              <div className="relative sm:w-48">
                <Search
                  className="pointer-events-none absolute top-2.5 left-3 size-4 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  aria-label="Search requests"
                  placeholder="Search requests..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-9 rounded-lg border-slate-200 pl-9 shadow-none"
                />
              </div>
            </div>
            {["all", "pending", "completed"].map((status) => {
              const rows = filteredRequests.filter(
                (request) =>
                  status === "all" || request.status.toLowerCase() === status,
              );
              return (
                <TabsContent key={status} value={status}>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
                        <TableHead className="h-11 pl-6 text-xs text-slate-500">
                          Service / Customer
                        </TableHead>
                        <TableHead className="text-xs text-slate-500">
                          Date
                        </TableHead>
                        <TableHead className="text-xs text-slate-500">
                          Status
                        </TableHead>
                        <TableHead className="pr-6 text-right text-xs text-slate-500">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((request) => (
                        <TableRow key={request.id} className="border-slate-100">
                          <TableCell className="py-5 pl-6">
                            <div className="flex items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600">
                                {request.initials}
                              </span>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {request.service}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {request.customer} · #{request.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {request.date}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`gap-1.5 ${statusStyles[request.status]}`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right font-medium text-slate-700">
                            ৳{request.amount.toLocaleString("en-US")}
                          </TableCell>
                        </TableRow>
                      ))}
                      {rows.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="h-40 text-center text-slate-500"
                          >
                            No requests match your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <p
                    className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400"
                    aria-live="polite"
                  >
                    Showing {rows.length} of {requests.length} sample requests
                  </p>
                </TabsContent>
              );
            })}
          </Tabs>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <Card className="rounded-2xl bg-[#103d3d] py-6 text-white ring-0">
            <CardHeader className="px-6">
              <CardDescription className="text-teal-100/70">
                Monthly performance
              </CardDescription>
              <CardTitle>
                <h2 className="mt-1 text-xl font-semibold">
                  Great work adds up.
                </h2>
              </CardTitle>
              <CardAction>
                <ArrowUpRight
                  className="size-5 text-teal-200"
                  aria-hidden="true"
                />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-5 px-6">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">
                  75<span className="text-2xl text-teal-200">%</span>
                </span>
                <span className="pb-1 text-xs text-teal-100/70">
                  completion rate
                </span>
              </div>
              <div
                role="meter"
                aria-label="Sample job completion rate"
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 overflow-hidden rounded-full bg-white/10"
              >
                <div className="h-full w-3/4 rounded-full bg-orange-400" />
              </div>
              <p className="text-xs leading-6 text-teal-100/80">
                24 of 32 requests completed this month. Every job is another
                home taken care of.
              </p>
              <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-teal-100">
                <Star
                  className="size-4 fill-orange-300 text-orange-300"
                  aria-hidden="true"
                />
                4.9 average customer rating
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl py-5 shadow-none ring-slate-200/80">
            <CardHeader className="px-5">
              <CardTitle>
                <h2 className="font-semibold">Recent activity</h2>
              </CardTitle>
              <CardDescription>
                The latest around your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-5">
              {[
                {
                  icon: ClipboardList,
                  title: "New request received",
                  detail: "AC repair & servicing",
                  time: "10 min ago",
                  color: "bg-orange-50 text-orange-600",
                },
                {
                  icon: CheckCheck,
                  title: "Job completed",
                  detail: "Electrical inspection",
                  time: "1 hour ago",
                  color: "bg-teal-50 text-teal-700",
                },
                {
                  icon: Wrench,
                  title: "Service scheduled",
                  detail: "Kitchen plumbing",
                  time: "2 hours ago",
                  color: "bg-blue-50 text-blue-600",
                },
              ].map(({ icon: Icon, title, detail, time, color }) => (
                <div key={title} className="flex gap-3">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-800">
                      {title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock3 className="size-3" aria-hidden="true" />
                      {time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
