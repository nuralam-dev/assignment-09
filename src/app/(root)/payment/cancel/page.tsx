import RolePage from "@/components/dashboard/RolePage";
import { DashboardLink } from "@/components/dashboard/preview/DashboardUI";
export default function PaymentCancelPage() {
  return <main className="bg-[#f5f8f8] px-5 py-12"><RolePage role="customer"><section className="mx-auto max-w-xl space-y-5 rounded-2xl border bg-white p-6"><h1 className="text-2xl font-semibold text-[#092e33]">Checkout cancelled</h1><p>No payment is confirmed by this page. Check My Bookings for the current status and resume Checkout when ready.</p><DashboardLink href="/dashboard/customer/bookings">My Bookings</DashboardLink></section></RolePage></main>;
}
