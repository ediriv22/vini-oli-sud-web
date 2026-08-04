import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

type PartnerEntry = { name: string; logo: string };

function PartnerLogo({ partner }: { partner: PartnerEntry }) {
  if (!partner.logo) {
    // Nessun logo disponibile per questo ente (es. assessorati citati solo
    // per nome nel materiale ufficiale): mostra solo l'etichetta testuale,
    // allineata visivamente ai riquadri con logo accanto.
    return (
      <div className="flex h-[92px] w-[110px] flex-col items-center justify-center text-center">
        <p className="font-display text-[0.92rem] leading-[1.25] text-[var(--color-ink-strong)]">
          {partner.name}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-[92px] w-[110px] items-center justify-center rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.85)] p-3">
        <Image
          src={partner.logo}
          alt={partner.name}
          width={280}
          height={280}
          unoptimized
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <p className="font-ui max-w-[9rem] text-[0.76rem] leading-[1.35] text-[var(--color-muted)]">
        {partner.name}
      </p>
    </div>
  );
}

function PartnerGroup({
  label,
  entries,
}: {
  label: string;
  entries: readonly PartnerEntry[];
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
        {label}
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {entries.map((partner) => (
          <PartnerLogo key={partner.name} partner={partner} />
        ))}
      </div>
    </div>
  );
}

export default function InstitutionalPartnersSection() {
  const { institutionalPartners } = siteConfig;

  return (
    <section
      id="partner-istituzionali"
      aria-labelledby="partner-istituzionali-title"
      className="section-flow section-space"
    >
      <div className="section-shell">
        <SectionHeader
          eyebrow={institutionalPartners.eyebrow}
          title={institutionalPartners.title}
          titleId="partner-istituzionali-title"
          align="center"
        />

        <div className="mt-12 flex flex-col items-center gap-12">
          <PartnerGroup
            label={institutionalPartners.organizzazioneLabel}
            entries={institutionalPartners.organizzazione}
          />
          <PartnerGroup
            label={institutionalPartners.supervisionLabel}
            entries={institutionalPartners.supervision}
          />
          <PartnerGroup
            label={institutionalPartners.partnerLabel}
            entries={institutionalPartners.partners}
          />
        </div>
      </div>
    </section>
  );
}
