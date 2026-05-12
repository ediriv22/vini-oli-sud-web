import AudienceGateway from "@/components/sections/AudienceGateway";
import ConceptSection from "@/components/sections/ConceptSection";
import CtaBand from "@/components/sections/CtaBand";
import EditorialPreview from "@/components/sections/EditorialPreview";
import HeroSection from "@/components/sections/HeroSection";
import RegionsSection from "@/components/sections/RegionsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AudienceGateway />
      <ConceptSection />
      <RegionsSection />
      <EditorialPreview />
      <CtaBand />
    </>
  );
}
