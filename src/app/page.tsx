import AudienceGateway from "@/components/sections/AudienceGateway";
import ConceptSection from "@/components/sections/ConceptSection";
import CtaBand from "@/components/sections/CtaBand";
import HeroSection from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceGateway />
      <ConceptSection />
      <CtaBand />
    </>
  );
}
