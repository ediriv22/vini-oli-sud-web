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
      className={`${isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className ?? ""}`}
    >
      {eyebrow ? (
        <p className={isCentered ? "eyebrow text-center" : "eyebrow"}>{eyebrow}</p>
      ) : null}
      <h2 className="display-balance mt-4 font-display text-4xl leading-none text-[var(--color-sea)] sm:text-[3.45rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
