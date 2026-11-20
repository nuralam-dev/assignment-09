import { forwardTechnicianApi } from "@/lib/technician-services-api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return Response.json(
      { success: false, message: "Invalid user ID" },
      { status: 400, headers: { "Cache-Control": "private, no-store" } },
    );
  }
  return forwardTechnicianApi(request, "PATCH", "admin", `/users/${id}/role`);
}
