import "server-only";

// Same-origin bridge keeps HttpOnly BetterAuth cookies working across API hosts.
// Express still verifies every session and enforces the technician role.
export async function forwardTechnicianServices(request: Request, method: "GET" | "POST" | "PATCH" | "DELETE", suffix = "") {
  return forwardTechnicianApi(request, method, "services", suffix);
}

export async function forwardTechnicianApi(request: Request, method: "GET" | "POST" | "PATCH" | "DELETE", resource: "services" | "bookings" | "technician", suffix: string) {
  const headers = { "Cache-Control": "private, no-store" };
  // Next can construct request.url with its internal hostname; the browser uses Host.
  const requestOrigin = new URL(request.url);
  requestOrigin.host = request.headers.get("host") || requestOrigin.host;
  if (method !== "GET" && request.headers.get("origin") !== requestOrigin.origin) {
    return Response.json({ success: false, message: "Invalid request origin" }, { status: 403, headers });
  }
  const cookie = request.headers.get("cookie");
  if (!cookie) {
    return Response.json({ success: false, message: "Authentication required" }, { status: 401, headers });
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return Response.json({ success: false, message: "FixMate API is not configured yet" }, { status: 503, headers });
  }
  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/${resource}${suffix}`, {
      method,
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      body: method === "POST" || method === "PATCH" ? await request.text() : undefined,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json();
    // Forward only the business response, never auth or Set-Cookie headers.
    return Response.json(result, { status: response.status, headers });
  } catch {
    return Response.json({ success: false, message: "Cannot reach FixMate right now. Please try again." }, { status: 503, headers });
  }
}
