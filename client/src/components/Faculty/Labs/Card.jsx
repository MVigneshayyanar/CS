import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-extrabold text-slate-900 leading-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";
