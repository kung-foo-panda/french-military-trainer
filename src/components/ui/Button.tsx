import type { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost"
type Size = "md" | "sm"

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const sizes: Record<Size, string> = {
    md: "px-4 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-sm",
  }
  const variants: Record<Variant, string> = {
    primary: "bg-accent text-white hover:bg-accent-strong",
    secondary: "border border-border bg-surface text-ink hover:bg-surface-2",
    ghost: "text-ink-soft hover:bg-surface-2 hover:text-ink",
  }
  return `${base} ${sizes[size]} ${variants[variant]}`
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}) {
  return <button className={`${buttonClass(variant, size)} ${className}`} {...rest} />
}
