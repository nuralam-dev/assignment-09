"use client";

import { useSyncExternalStore } from "react";

// The year is an external value: reading it through useSyncExternalStore keeps
// `new Date()` out of the render pass, so the static prerender stays stable and
// `next build` no longer fails with an unstable-value error.
const subscribe = () => () => {};
const getSnapshot = () => new Date().getFullYear();
const getServerSnapshot = () => 0;

export default function Copyright({ className = "" }: { className?: string }) {
  const year = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <p className={`text-sm text-gray-400 ${className}`.trim()}>
      © {year ? `${year} ` : ""}FixMate.
      All rights reserved.
    </p>
  );
}
