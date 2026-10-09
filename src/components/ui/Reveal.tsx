"use client";

import React from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger index — each step delays by --stagger-unit (60ms). */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}

/**
 * Arcade Terminal reveal: content fades + rises on mount.
 *
 * SSR-safe by design: the element renders fully visible on the server, and only
 * starts hidden once the `js` class is present on <html> (set by MotionRoot).
 * That avoids a flash-of-invisible-content if hydration is slow or JS fails.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      data-reveal=""
      style={{ "--reveal-delay": `${delay * 60}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Enables the `.js` hook that gates reveal animations, then reveals on mount.
 * Mount once, high in the tree (e.g. inside the layout).
 */
export function MotionRoot() {
  React.useEffect(() => {
    document.documentElement.classList.add("js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce) {
      items.forEach((el) => el.setAttribute("data-reveal", "in"));
      return;
    }

    // Next paint, then flip the attribute so the transition actually runs.
    const raf = requestAnimationFrame(() => {
      items.forEach((el) => el.setAttribute("data-reveal", "in"));
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}