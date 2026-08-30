---
name: marketing-site-theme-styling
description: Tailwind CSS v4 CSS-first theming, semantic variables, dark mode styling, and shopkeeper receipt aesthetic tokens
---

# Theme Styling & Shopkeeper Ledger Aesthetics

Architectural guide to Tailwind CSS v4 CSS-first theming and thermal receipt visual primitives.

## When to Use

- Styling new UI components, cards, forms, or marketing sections.
- Implementing dark-mode compatible surfaces and borders.
- Creating shopkeeper receipt visuals, tear lines, or stamp badges.

## Core Rules & Invariants

- **CSS-First Theme Variables**: Defined in `src/app/globals.css`. Never use raw hex values in components.
- **Surface Palette**:
  - Light mode: Warm vintage paper (`--background: #faf9f7`, `--card: #f2efe9`, `--border: #e2ddd5`).
  - Dark mode: Emerald-tinted dark (`--background: #0a1410`, `--card: #111d17`, `--border: #24352c`).
- **Brand Primary**: `#059669` (light) / `#10b981` (dark).
- **Receipt Primitives**:
  - `.receipt-edge`: Scalloped bottom edge.
  - `.receipt-edge-top`: Scalloped top edge.
  - `.tear-line`: Perforated dashed divider line.
  - `.stamp-badge`: Rotated dashed rubber stamp.
  - `.mono-label`: Small uppercase tracking-widest monospaced label.

## Step-by-Step Implementation Flow

### Step 1: Using Semantic Theme Tokens in Components

```tsx
import { cn } from '@/lib/utils';

export function LedgerCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl p-6 transition-colors">
      <div className="mono-label text-muted-foreground mb-2">NO. 01 · SUMMARY</div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
```

### Step 2: Thermal Receipt Styling

```tsx
export function ThermalSlip({ storeName, total }: { storeName: string; total: string }) {
  return (
    <div className="receipt-paper relative bg-white dark:bg-zinc-900 border border-border p-6 shadow-sm">
      <div className="text-center font-mono text-sm font-bold uppercase">{storeName}</div>
      <div className="tear-line my-4" />
      <div className="flex justify-between font-mono text-sm">
        <span>TOTAL</span>
        <span className="font-bold">{total}</span>
      </div>
      <div className="receipt-edge absolute -bottom-2 left-0 right-0 h-2" />
    </div>
  );
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Hardcoded slate/gray hex colors
<div className="bg-[#ffffff] text-[#1e293b] border-[#cbd5e1] dark:bg-[#0f172a]">
  Custom Box
</div>

// ✅ REQUIRED — Semantic theme classes adapting to light and dark modes
<div className="bg-surface text-foreground border-border">
  Custom Box
</div>
```
