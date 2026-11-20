import { forwardTechnicianApi } from "@/lib/technician-services-api";
export async function GET(request: Request) {
  return forwardTechnicianApi(request, "GET", "payments", "/my");
}
