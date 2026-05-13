type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`${isCentered ? "mx-auto max-w-[58rem] text-center" : "max-w-[58rem]"} ${className ?? ""}`}
    >
      {eyebrow ? (
        <p className={isCentered ? "eyebrow text-center" : "eyebrow"}>{eyebrow}</p>
      ) : null}
      <h2 className="display-balance mt-4 max-w-[22ch] font-display text-[1.65rem] leading-[1.02] text-[var(--color-grove)] sm:max-w-[15ch] sm:text-[2.55rem] sm:leading-[0.98] lg:text-[2.95rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 max-w-[62ch] text-[0.98rem] leading-7 text-[var(--color-muted)] sm:text-[1.02rem] sm:leading-8">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
