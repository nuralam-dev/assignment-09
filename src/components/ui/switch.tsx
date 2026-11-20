"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

export function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn("inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-300 p-0.5 outline-none transition-colors data-checked:bg-teal-700 focus-visible:ring-2 focus-visible:ring-orange-300 data-disabled:cursor-not-allowed data-disabled:opacity-50", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className="size-5 rounded-full bg-white shadow-sm transition-transform data-checked:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}
