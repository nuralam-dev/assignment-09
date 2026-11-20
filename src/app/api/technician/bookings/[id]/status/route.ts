import { forwardTechnicianApi } from "@/lib/technician-services-api";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return Response.json({ success: false, message: "Invalid booking ID" }, {
      status: 400, headers: { "Cache-Control": "private, no-store" },
    });
  }
  return forwardTechnicianApi(request, "PATCH", "bookings", `/${id}/status`);
}
