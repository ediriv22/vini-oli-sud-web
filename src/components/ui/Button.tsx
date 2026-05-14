import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "ivory" | "soft" | "gatewayPrimary";
type ButtonSize = "md" | "lg";

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

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-[var(--color-wine)] text-white shadow-[0_8px_18px_rgba(122,38,52,0.12)] motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:bg-[#68212d]",
  gatewayPrimary:
    "border border-[var(--color-wine)] bg-[var(--color-wine)] text-[var(--color-ivory)] shadow-[0_10px_26px_rgba(122,38,52,0.22)] motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-[#4a1622] hover:bg-[#4a1622] hover:text-[var(--color-ivory)]",
  secondary:
    "border border-[rgba(51,36,31,0.14)] bg-[rgba(255,251,244,0.8)] text-[var(--color-grove)] motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-[rgba(95,107,51,0.28)] hover:bg-white/92",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-sea)] transition-colors duration-300 ease-out hover:bg-[rgba(19,41,61,0.045)]",
  ivory:
    "border border-[rgba(248,243,232,0.22)] bg-[var(--color-ivory)] text-[var(--color-grove)] shadow-[0_8px_18px_rgba(19,41,61,0.08)] motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:bg-white",
  soft:
    "border border-[rgba(200,167,111,0.55)] bg-[rgba(255,252,246,1)] text-[var(--color-grove)] shadow-[0_6px_20px_rgba(38,25,17,0.09)] motion-safe:hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 hover:border-[rgba(200,167,111,0.88)] hover:bg-[rgba(248,242,232,1)] hover:text-[var(--color-grove)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 py-3 text-[0.82rem]",
  lg: "min-h-11 px-6 py-3 text-[0.82rem] sm:min-h-11 sm:px-[1.875rem] sm:text-[0.88rem]",
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
    "font-ui inline-flex items-center justify-center rounded-[2px] font-semibold uppercase tracking-[0.12em] transition-[transform,background-color,border-color,box-shadow,color] duration-300 ease-out motion-reduce:duration-150 motion-reduce:transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(19,41,61,0.4)] focus:ring-offset-2 focus:ring-offset-[var(--color-ivory)]",
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
