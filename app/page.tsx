import Hero from "@/components/Hero/Hero";
import Ecosystem from "@/components/Ecosystem/Ecosystem";
import OurStory from "@/components/OurStory/OurStory";
import VeyoraEngine from "@/components/VeyoraEngine/VeyoraEngine";
import SelectedWork from "@/components/SelectedWork/SelectedWork";
import ServicesPreview from "@/components/ServicesPreview/ServicesPreview";
import VeyoraAcademyPreview from "@/components/VeyoraAcademyPreview/VeyoraAcademyPreview";
import Team from "@/components/Team/Team";
import FinalCTA from "@/components/FinalCTA/FinalCTA";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main id="top">
      {/* 01 — HERO */}
      <Hero />

      {/* 02 — VEYORA ECOSYSTEM */}
      <Ecosystem />

      {/* 03 — OUR STORY */}
      <OurStory />

      {/* 04 — VEYORA ENGINE */}
      <VeyoraEngine />

      {/* 05 — SELECTED WORK */}
      <SelectedWork />

      {/* 06 — SERVICES */}
      <ServicesPreview />

      {/* 07 — VEYORA ACADEMY */}
      <VeyoraAcademyPreview />

      {/* 08 — PEOPLE BEHIND VEYORA */}
      <Team />

      {/* 09 — FINAL CTA */}
      <FinalCTA />

      {/* 10 — FOOTER */}
      <Footer />
    </main>
  );
}