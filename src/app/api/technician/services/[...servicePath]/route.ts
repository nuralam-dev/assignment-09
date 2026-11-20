import { forwardTechnicianServices } from "@/lib/technician-services-api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ servicePath: string[] }> },
) {
  const { servicePath } = await params;
  const [id, action] = servicePath;
  if (!/^[a-f\d]{24}$/i.test(id) || servicePath.length > 2 || (action && action !== "availability")) {
    return Response.json({ success: false, message: "Invalid service path" }, { status: 400 });
  }
  return forwardTechnicianServices(request, "PATCH", `/${id}${action ? "/availability" : ""}`);
}
