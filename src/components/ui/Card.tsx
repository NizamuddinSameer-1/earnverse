import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  emphasis?: "lime" | "gold" | "crimson" | "none";
  interactive?: boolean;
}

export function Card({
  children,
  className = "",
  emphasis = "none",
  interactive = false,
  ...props
}: CardProps) {
  const emphasisStyles = {
    lime: "border-lime-neon/40",
    gold: "border-gold-accent/40",
    crimson: "border-crimson-accent/40",
    none: "border-border-dark hover:border-border-hover",
  }[emphasis];

  return (
    <div
      className={`relative overflow-hidden rounded bg-gradient-to-b from-surface-card to-surface border ${emphasisStyles} transition-all duration-200 ${
        interactive ? "hover:translate-y-[-1px] cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-5 py-4 border-b border-border-subtle flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  as: Tag = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  /* h1 is allowed for standalone pages (login/register) that have no other
     page-level heading; on dashboards prefer a dedicated sr-only <h1>. */
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <Tag
      className={`font-grotesk font-bold text-base tracking-tight text-text-primary uppercase ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`font-mono text-xs text-text-muted ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-5 py-3.5 bg-surface-lowest/60 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
