import type { ComponentType } from "react";
import AlboDoroSection from "@/components/sections/AlboDoroSection";
import EventDetailsSection from "@/components/sections/EventDetailsSection";
import GrandPrixHighlight from "@/components/sections/GrandPrixHighlight";
import HeroSection from "@/components/sections/HeroSection";
import InstitutionalPartnersSection from "@/components/sections/InstitutionalPartnersSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import RegionsSection from "@/components/sections/RegionsSection";
import SponsorSection from "@/components/sections/SponsorSection";
import TerritorySection from "@/components/sections/TerritorySection";
import { resolveHomeLayout, type SectionKey } from "@/data/homeLayout";

// Registry chiave → componente. Tipizzata come Record<SectionKey, ...>: se una
// delle chiavi canoniche manca, il build fallisce. L'ordine di rendering NON è
// qui ma in content/settings/home-layout.json (modificabile dalla segretaria
// via /admin), letto tramite resolveHomeLayout().
const SECTION_REGISTRY: Record<SectionKey, ComponentType> = {
  hero: HeroSection,
  philosophy: PhilosophySection,
  grandPrixHighlight: GrandPrixHighlight,
  territory: TerritorySection,
  regions: RegionsSection,
  sponsor: SponsorSection,
  eventDetails: EventDetailsSection,
  institutionalPartners: InstitutionalPartnersSection,
  alboDoro: AlboDoroSection,
};

export default function HomePage() {
  return (
    <>
      {resolveHomeLayout()
        .filter((section) => section.enabled)
        .map((section) => {
          const Section = SECTION_REGISTRY[section.key];
          return <Section key={section.key} />;
        })}
    </>
  );
}
