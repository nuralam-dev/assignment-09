"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop className="fixed inset-0 z-[70] bg-[#092e33]/55 backdrop-blur-sm" />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn("fixed left-1/2 top-1/2 z-[71] max-h-[90svh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-xl outline-none", className)}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return <AlertDialogPrimitive.Title className={cn("text-xl font-semibold text-[#092e33]", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return <AlertDialogPrimitive.Description className={cn("text-sm leading-relaxed text-slate-500", className)} {...props} />;
}

function AlertDialogCancel(props: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close render={<Button variant="outline" />} {...props} />;
}

export { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel };
