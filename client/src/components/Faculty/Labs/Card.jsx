import React from 'react';

// Utility function to combine class names
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

// Base Card component
export const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border border-neutral-700/50 bg-neutral-800/50 backdrop-blur-sm text-white shadow-lg hover:shadow-xl transition-all duration-300",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

// Card Content component
export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Title component
export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-xl font-semibold leading-none tracking-tight text-white",
            className
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";