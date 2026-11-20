import { forwardTechnicianApi } from "@/lib/technician-services-api";

export async function GET(request: Request) {
  return forwardTechnicianApi(request, "GET", "bookings", "/my");
}

export async function POST(request: Request) {
  return forwardTechnicianApi(request, "POST", "bookings", "");
}
