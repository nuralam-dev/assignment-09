export type AdminUser = {
  _id: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: string;
  createdAt?: string;
};
export type AdminBooking = {
  _id: string;
  serviceId?: string;
  serviceTitle?: string;
  category?: string;
  basePrice?: number;
  finalAmount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  problemDescription?: string;
  technicianName?: string;
  technicianEmail?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
};
export type AdminPayment = {
  _id: string;
  customerName?: string;
  serviceTitle?: string;
  technicianName?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  paymentStatus?: string;
  paidAt?: string;
};
export type PaymentReport = {
  records: AdminPayment[];
  verificationAvailable: false;
  revenue: [];
  dependency: string;
};
export type Overview = {
  counts: Record<string, number>;
  latestServices: {
    _id: string;
    title?: string;
    category?: string;
    technicianName?: string;
    approvalStatus?: string;
    createdAt?: string;
  }[];
  latestBookings: AdminBooking[];
  paymentRecordCount: number;
  payments: Omit<PaymentReport, "records">;
};

export function isRecords(value: unknown): value is { _id: string }[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item && typeof item === "object" && typeof item._id === "string",
    )
  );
}
export function isUsers(value: unknown): value is AdminUser[] {
  return isRecords(value);
}
export function isBookings(value: unknown): value is AdminBooking[] {
  return isRecords(value);
}
export function isPaymentReport(value: unknown): value is PaymentReport {
  if (!value || typeof value !== "object") return false;
  const report = value as PaymentReport;
  return (
    isRecords(report.records) &&
    report.verificationAvailable === false &&
    Array.isArray(report.revenue) &&
    report.revenue.length === 0 &&
    typeof report.dependency === "string"
  );
}
const countKeys = [
  "totalUsers",
  "totalCustomers",
  "totalTechnicians",
  "totalServices",
  "pendingServiceApprovals",
  "totalBookings",
  "activeBookings",
  "completedBookings",
];
export function isOverview(value: unknown): value is Overview {
  if (!value || typeof value !== "object") return false;
  const report = value as Overview;
  return (
    !!report.counts &&
    countKeys.every(
      (key) =>
        Number.isSafeInteger(report.counts[key]) && report.counts[key] >= 0,
    ) &&
    isRecords(report.latestServices) &&
    isBookings(report.latestBookings) &&
    Number.isSafeInteger(report.paymentRecordCount) &&
    report.paymentRecordCount >= 0 &&
    isPaymentReport({ ...report.payments, records: [] })
  );
}
export function date(value?: string) {
  return value && Number.isFinite(Date.parse(value))
    ? new Date(value).toLocaleDateString("en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
      })
    : "Not provided";
}
export function money(value?: number, currency = "USD") {
  if (typeof value !== "number" || !Number.isFinite(value))
    return "Not provided";
  if (!/^[A-Za-z]{3}$/.test(currency))
    return `${value} (currency not provided)`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}
