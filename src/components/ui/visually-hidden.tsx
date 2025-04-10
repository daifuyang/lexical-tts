import { ComponentPropsWithoutRef, forwardRef } from "react";

export const VisuallyHidden = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(({ children, className = "", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`sr-only ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

VisuallyHidden.displayName = "VisuallyHidden";
