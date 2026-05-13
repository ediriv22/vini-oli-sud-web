import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "ivory";
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
    "border border-transparent bg-[var(--color-wine)] text-white shadow-[0_8px_18px_rgba(122,38,52,0.12)] hover:-translate-y-0.5 hover:bg-[#68212d]",
  secondary:
    "border border-[rgba(51,36,31,0.14)] bg-[rgba(255,251,244,0.8)] text-[var(--color-grove)] hover:-translate-y-0.5 hover:border-[rgba(95,107,51,0.28)] hover:bg-white/92",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-sea)] hover:bg-[rgba(19,41,61,0.045)]",
  ivory:
    "border border-[rgba(248,243,232,0.22)] bg-[var(--color-ivory)] text-[var(--color-grove)] shadow-[0_8px_18px_rgba(19,41,61,0.08)] hover:-translate-y-0.5 hover:bg-white",
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
    "font-ui inline-flex items-center justify-center rounded-[2px] font-semibold uppercase tracking-[0.12em] focus:outline-none focus:ring-2 focus:ring-[rgba(19,41,61,0.4)] focus:ring-offset-2 focus:ring-offset-[var(--color-ivory)]",
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
