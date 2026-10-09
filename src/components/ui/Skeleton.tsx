"use client";

import React from "react";

/**
 * Arcade Terminal skeleton primitive.
 *
 * RULES.md §6 + DESIGN.md async-state contract: loading states must be
 * LAYOUT-MATCHED (same box model as the real content) — never a full-screen
 * spinner, never a centred "Loading..." string. A skeleton that has the same
 * dimensions as the content it replaces is what keeps CLS at zero.
 *
 * Design constraints honoured:
 *  - Tokens only (`surface-*`, `border-*`, `text-dim`). No new colours.
 *  - No blur, no glassmorphism, no gradient text, no purple.
 *  - The shimmer is a low-contrast `scan-sheen` sweep across a flat fill,
 *    not a blurred glow.
 *  - `prefers-reduced-motion` disables the sweep entirely (globals.css
 *    `.scan-sheen` is already gated behind the media query).
 *  - Decorative: `aria-hidden`, so screen readers announce the status text
 *    instead of a pile of meaningless placeholder nodes.
 */
export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`scan-sheen relative overflow-hidden rounded bg-surface-elevated ${className}`}
      {...props}
    />
  );
}

/**
 * A single skeleton row shaped like a card: content column + trailing value
 * column. Used for feeds (earn feed, task list, community posts) so the
 * placeholder mirrors the real row's geometry exactly.
 */
export function SkeletonRow({
  className = "",
  lines = 2,
  trailing = true,
}: {
  className?: string;
  lines?: number;
  trailing?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-4 p-4 rounded bg-surface-card border border-border-subtle ${className}`}
    >
      <Skeleton className="h-9 w-9 shrink-0" />
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <Skeleton className="h-3 w-[42%]" />
        {Array.from({ length: Math.max(0, lines - 1) }).map((_, i) => (
          <Skeleton key={i} className={`h-2.5 ${i % 2 === 0 ? "w-[70%]" : "w-[55%]"}`} />
        ))}
      </div>
      {trailing && <Skeleton className="h-6 w-16 shrink-0" />}
    </div>
  );
}

/**
 * Stat-tile skeleton — mirrors the `grid-cols-3` sub-metric strips that appear
 * on /home and /earn. Matching the grid columns means the page height does not
 * jump when data lands (no CLS).
 */
// Tailwind's scanner only sees LITERAL class strings, so these must be
// written out in full. Building them by interpolation (`grid-cols-${n}`)
// silently produces NO CSS — a classic Tailwind v3/v4 trap.
const STAT_GRID: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export function SkeletonStat({
  className = "",
  cols = 3,
  rows = 1,
}: {
  className?: string;
  cols?: number;
  rows?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`grid gap-3 ${STAT_GRID[cols] ?? STAT_GRID[3]} ${className}`}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-3 rounded bg-surface-card border border-border-subtle"
        >
          <Skeleton className="h-2 w-[50%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      ))}
    </div>
  );
}

/**
 * Table skeleton rows. Returns bare `<tr>` elements so it can be dropped
 * INSIDE an existing `<tbody>` — never wrap these in a div/table, since
 * browsers hoist stray markup out of tbody and the rows silently vanish.
 */
export function SkeletonRows({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border-subtle last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="p-3.5">
              <Skeleton
                className={`h-3 ${c === cols - 1 ? "w-14 ml-auto" : c === 0 ? "w-[38%]" : "w-[70%]"}`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Standalone table skeleton, for views that own their whole table
 * (no surrounding <tbody> to slot into).
 */
export function SkeletonTable({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div aria-hidden="true" className="overflow-x-auto">
      <table className="w-full text-left">
        <tbody>
          <SkeletonRows rows={rows} cols={cols} />
        </tbody>
      </table>
    </div>
  );
}

/**
 * The accessible name for a loading region. Pair with `Skeleton*` above:
 *
 *   <div role="status" aria-live="polite" aria-busy="true">
 *     <span className="sr-only">Loading your ledger…</span>
 *     <SkeletonTable />
 *   </div>
 *
 * `aria-busy` tells AT the region is still settling; the sr-only span carries
 * the human-readable message. The skeletons themselves stay `aria-hidden` so
 * they are never announced as content.
 */
export function SkeletonRegion({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}