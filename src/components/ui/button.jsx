import { Slot } from "radix-ui";
import * as React from "react";
import { buttonVariants } from "./button-variants";

import { cn } from "@/lib/utils";

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

import { RippleButton, RippleButtonRipples } from "./ripple-button";

const ModalCancelButton = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RippleButton
      ref={ref}
      variant="outline"
      className={cn(
        "px-5 rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold text-sm h-10 flex items-center justify-center gap-1.5",
        className,
      )}
      {...props}
    >
      {children}
      <RippleButtonRipples color="rgba(0, 0, 0, 0.06)" />
    </RippleButton>
  ),
);
ModalCancelButton.displayName = "ModalCancelButton";

const ModalSubmitButton = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <RippleButton
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-1.5 px-6 rounded-xl bg-transparent bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-md hover:shadow-indigo-500/15 active:scale-95 text-white font-semibold text-sm h-10 transition-all border-0 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
      <RippleButtonRipples color="rgba(255, 255, 255, 0.2)" />
    </RippleButton>
  ),
);
ModalSubmitButton.displayName = "ModalSubmitButton";

export { Button, ModalCancelButton, ModalSubmitButton };
