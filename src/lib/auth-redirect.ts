// Booking login returns only to a public service detail route, never an external URL.
export function serviceCallback(value: string | null) {
  return value && value === value.trim() && /^\/services\/[a-f\d]{24}$/i.test(value) ? value : "/";
}
