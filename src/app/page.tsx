import AudienceGateway from "@/components/sections/AudienceGateway";
import ConceptSection from "@/components/sections/ConceptSection";
import CtaBand from "@/components/sections/CtaBand";
import EditionStrip from "@/components/sections/EditionStrip";
import GrandPrixHighlight from "@/components/sections/GrandPrixHighlight";
import HeroSection from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <EditionStrip />
      <AudienceGateway />
      <ConceptSection />
      <GrandPrixHighlight />
      <CtaBand />
    </>
  );
}
