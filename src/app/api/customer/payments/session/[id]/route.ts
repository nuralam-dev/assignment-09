import { forwardTechnicianApi } from "@/lib/technician-services-api";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^cs_test_[A-Za-z0-9]+$/.test(id) || id.length > 250) {
    return Response.json({ success: false, message: "Invalid Checkout Session ID" }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
  return forwardTechnicianApi(request, "GET", "payments", `/session/${id}`);
}
