import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "ivory" | "soft" | "gatewayPrimary";
type ButtonSize = "sm" | "md" | "lg";

type BaseButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

type ButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "onClick"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "onClick">;

/* Variant system — palette rivista:
 *  - primary:        Rosso Aglianico, CTA principali (Brochure, Pass Buyer, ecc.)
 *  - gatewayPrimary: Variante "alta intensità" (uguale alla primaria, usata
 *                    storicamente nella gateway; manteniamo il nome per
 *                    backward-compatibility).
 *  - secondary:      Avorio scuro con bordo carbone, neutra
 *  - soft:           Avorio chiaro con bordo oro, eleganza editoriale
 *  - ivory:          Avorio puro (su fondi scuri / hero)
 *  - ghost:          Solo testo, hover marrone tenue (era blu)
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-[var(--color-wine)] text-[var(--color-ivory)] shadow-[0_10px_24px_rgba(107,30,30,0.18)] motion-safe:hover:-translate-y-px motion-reduce:hover:translate-y-0 hover:bg-[var(--color-wine-strong)] hover:shadow-[0_14px_30px_rgba(107,30,30,0.24)]",
  gatewayPrimary:
    "border border-[var(--color-wine)] bg-[var(--color-wine)] text-[var(--color-ivory)] shadow-[0_12px_28px_rgba(107,30,30,0.22)] motion-safe:hover:-translate-y-px motion-reduce:hover:translate-y-0 hover:border-[var(--color-wine-strong)] hover:bg-[var(--color-wine-strong)]",
  secondary:
    "border border-[rgba(42,32,23,0.18)] bg-[rgba(255,251,244,0.86)] text-[var(--color-ink-strong)] motion-safe:hover:-translate-y-px motion-reduce:hover:translate-y-0 hover:border-[rgba(176,141,87,0.5)] hover:bg-white",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-ink-strong)] transition-colors duration-300 ease-out hover:bg-[rgba(176,141,87,0.10)] hover:text-[var(--color-wine)]",
  ivory:
    "border border-[rgba(176,141,87,0.35)] bg-[var(--color-ivory)] text-[var(--color-ink-strong)] shadow-[0_10px_22px_rgba(42,32,23,0.10)] motion-safe:hover:-translate-y-px motion-reduce:hover:translate-y-0 hover:bg-white",
  soft:
    "border border-[rgba(176,141,87,0.55)] bg-[rgba(255,252,246,1)] text-[var(--color-ink-strong)] shadow-[0_6px_18px_rgba(42,32,23,0.08)] motion-safe:hover:-translate-y-px motion-reduce:hover:translate-y-0 hover:border-[rgba(176,141,87,0.85)] hover:bg-[rgba(249,243,232,1)]",
};

/* Size system — brief:
 *  - mobile: 48–56px altezza
 *  - desktop: 52–64px altezza
 *  - testo: 14–16px (~0.88–1rem), niente uppercase enorme
 *  - tracking 0.08em (era 0.12em — sembrava da fiera generica)
 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-11 min-h-11 px-5 text-[0.82rem] sm:h-12 sm:min-h-12",
  md: "h-12 min-h-12 px-6 text-[0.88rem] sm:px-7 sm:text-[0.92rem] md:h-[3.25rem] md:min-h-[3.25rem]",
  lg: "h-[3.25rem] min-h-[3.25rem] px-6 text-[0.92rem] sm:px-8 sm:text-[0.98rem] md:h-14 md:min-h-14",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    /* Base CTA: padding stabile, font UI semibold, tracking misurato
     * (era 0.12em → ora 0.08em, meno "fiera generica"), focus anello
     * caldo non blu. Touch target garantito da altezza ≥ 44px. */
    "font-ui inline-flex items-center justify-center gap-2 rounded-[2px] font-semibold uppercase tracking-[0.08em] leading-tight transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-out motion-reduce:duration-150 motion-reduce:transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#6b1e1e] disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      {...props}
    >
      {children}
    </button>
  );
}
