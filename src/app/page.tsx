import AlboDoroSection from "@/components/sections/AlboDoroSection";
import EventDetailsSection from "@/components/sections/EventDetailsSection";
import GrandPrixHighlight from "@/components/sections/GrandPrixHighlight";
import HeroSection from "@/components/sections/HeroSection";
import InstitutionalPartnersSection from "@/components/sections/InstitutionalPartnersSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import RegionsSection from "@/components/sections/RegionsSection";
import SponsorSection from "@/components/sections/SponsorSection";
import TerritorySection from "@/components/sections/TerritorySection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PhilosophySection />
      <GrandPrixHighlight />
      <TerritorySection />
      <RegionsSection />
      <SponsorSection />
      <EventDetailsSection />
      <InstitutionalPartnersSection />
      <AlboDoroSection />
    </>
  );
}
