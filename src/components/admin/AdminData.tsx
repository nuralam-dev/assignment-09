"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/dashboard/preview/DashboardUI";

export function adminError(status: number) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403)
    return "You do not have permission to perform this action.";
  if (status === 404) return "This record no longer exists. Refresh the list.";
  if (status === 409) return "This record has changed. Refresh and try again.";
  return "Cannot complete your request right now. Please try again.";
}

export async function adminRequest(
  path: string,
  body?: object,
  signal?: AbortSignal,
) {
  const response = await fetch(`/api/admin/${path}`, {
    method: body ? "PATCH" : "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: signal ?? AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true)
    throw new Error(adminError(response.status));
  return result.data as unknown;
}

// A small shared loading boundary keeps every admin screen's retry/auth handling consistent.
export default function AdminData<T>({
  path,
  validate,
  children,
}: {
  path: string;
  validate: (data: unknown) => data is T;
  children: (data: T, refresh: () => void) => ReactNode;
}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const result = await adminRequest(
          path,
          undefined,
          AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        );
        if (!validate(result))
          throw new Error(
            "FixMate returned an unexpected response. Please try again.",
          );
        if (!controller.signal.aborted) {
          setData(result);
          setError("");
        }
      } catch (err) {
        if (!controller.signal.aborted)
          setError(
            err instanceof Error && err.name === "Error"
              ? err.message
              : "Cannot reach FixMate. Please try again.",
          );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [path, attempt, validate]);
  function refresh() {
    if (loading) return;
    setLoading(true);
    setAttempt((value) => value + 1);
  }
  if (loading) return <PageSkeleton />;
  if (error)
    return (
      <div className="space-y-4">
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={refresh}>Try again</Button>
          <Button variant="outline" render={<Link href="/sign-in" />}>
            Sign in
          </Button>
        </div>
      </div>
    );
  return data === null ? null : (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="outline" onClick={refresh}>
          Refresh
        </Button>
      </div>
      {children(data, refresh)}
    </div>
  );
}
