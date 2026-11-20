import { forwardTechnicianServices } from "@/lib/technician-services-api";

export async function GET(request: Request) {
  return forwardTechnicianServices(request, "GET", "/my");
}

export async function POST(request: Request) {
  return forwardTechnicianServices(request, "POST");
}
