import React from "react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

const Card = React.forwardRef(({ className, animate = false, ...props }, ref) => {
  const Comp = animate ? motion.div : "div";
  return (
    <Comp
      ref={ref}
      className={cn("bg-white rounded-xl p-6 shadow-sm border border-slate-100", className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between mb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-bold text-slate-900 leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
