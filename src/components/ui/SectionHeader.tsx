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
      className={`${isCentered ? "mx-auto max-w-[64rem] text-center" : "max-w-[64rem]"} ${className ?? ""}`}
    >
      {eyebrow ? (
        <p className={isCentered ? "eyebrow text-center" : "eyebrow"}>{eyebrow}</p>
      ) : null}
      <h2
        className={`display-balance mt-4 font-display text-[2.1rem] leading-[0.98] text-[var(--color-grove)] sm:text-[2.55rem] lg:text-[2.95rem] ${
          isCentered
            ? "mx-auto max-w-[18ch] sm:max-w-[22ch] lg:max-w-[24ch]"
            : "max-w-[18ch] sm:max-w-[22ch] lg:max-w-[24ch]"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 max-w-[64ch] text-[0.98rem] leading-7 text-[var(--color-muted)] sm:text-[1.02rem] sm:leading-8">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
