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
    "bg-[var(--color-wine)] text-white shadow-[0_14px_30px_rgba(122,38,52,0.22)] hover:-translate-y-0.5 hover:bg-[#68212d]",
  secondary:
    "border border-[rgba(19,41,61,0.16)] bg-white/80 text-[var(--color-sea)] hover:-translate-y-0.5 hover:border-[var(--color-sea)] hover:bg-white",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-sea)] hover:bg-[rgba(19,41,61,0.06)]",
  ivory:
    "bg-[var(--color-ivory)] text-[var(--color-sea)] shadow-[0_14px_30px_rgba(19,41,61,0.12)] hover:-translate-y-0.5 hover:bg-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 py-3 text-sm",
  lg: "min-h-[52px] px-7 py-3.5 text-sm sm:min-h-[56px] sm:px-8 sm:text-[0.95rem]",
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
    "font-ui inline-flex items-center justify-center rounded-full font-semibold tracking-[0.01em] focus:outline-none focus:ring-2 focus:ring-[rgba(19,41,61,0.4)] focus:ring-offset-2 focus:ring-offset-[var(--color-ivory)]",
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
