import { forwardTechnicianApi } from "@/lib/technician-services-api";
export async function POST(request: Request) {
  return forwardTechnicianApi(request, "POST", "payments", "/create-checkout-session");
}
