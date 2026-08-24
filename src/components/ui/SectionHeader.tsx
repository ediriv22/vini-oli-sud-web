type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  titleId?: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  // Chiavi per l'editor visuale (/admin ?editor=1): se presenti, marcano
  // eyebrow/title/intro come campi cliccabili. Inerti sul sito normale.
  eyebrowKey?: string;
  titleKey?: string;
  introKey?: string;
};

/**
 * Header editoriale standard per le sezioni.
 *
 * Tipografia post-audit:
 *  - Titoli H2 ora in carbone profondo (--color-ink-strong) e non più
 *    in blu profondo (--color-grove era #1b2a3a).
 *  - Display via clamp() per evitare salti bruschi di scala fra
 *    breakpoint (era 2.1 → 2.55 → 2.95 con step rigidi).
 *  - max-width allargato per evitare titoli troppo "spaccati" su desktop.
 */
export default function SectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  align = "left",
  className,
  eyebrowKey,
  titleKey,
  introKey,
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`${isCentered ? "mx-auto max-w-[68rem] text-center" : "max-w-[68rem]"} ${className ?? ""}`}
    >
      {eyebrow ? (
        <p className={isCentered ? "eyebrow text-center" : "eyebrow"} data-content-key={eyebrowKey}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={titleId}
        data-content-key={titleKey}
        className={`display-balance mt-4 font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[0.98] tracking-[0.005em] text-[var(--color-ink-strong)] ${
          isCentered
            ? "mx-auto max-w-[20ch] sm:max-w-[24ch] lg:max-w-[26ch]"
            : "max-w-[20ch] sm:max-w-[24ch] lg:max-w-[26ch]"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className="mt-5 max-w-[64ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)] sm:text-[1.02rem] sm:leading-[1.7]"
          data-content-key={introKey}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
