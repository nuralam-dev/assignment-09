import { Suspense } from "react";
import RolePage from "@/components/dashboard/RolePage";
import PaymentResult from "@/components/payments/PaymentResult";
export default function PaymentSuccessPage() {
  return <main className="bg-[#f5f8f8] px-5 py-12"><RolePage role="customer"><Suspense fallback={<p role="status">Checking payment...</p>}><PaymentResult /></Suspense></RolePage></main>;
}
