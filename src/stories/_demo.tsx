import * as React from "react";

/** Flex-wrap container for showcasing many components side by side. */
export function Grid({ children, gap = 24 }: { children: React.ReactNode; gap?: number }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap, alignItems: "flex-start" }}>{children}</div>;
}

/** A labeled cell wrapping one component demo. */
export function Cell({
  title,
  children,
  minWidth = 180,
}: {
  title: string;
  children: React.ReactNode;
  minWidth?: number | string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--msr-color-fg-subtle)" }}>{title}</span>
      <div>{children}</div>
    </div>
  );
}

/** A vertical stack with a section heading. */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
      <h3 style={{ margin: 0, fontSize: 14, color: "var(--msr-color-fg-muted)" }}>{title}</h3>
      {children}
    </section>
  );
}
