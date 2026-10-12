import { Header } from "@/components/Header";
import { ScrollCanvasSequence } from "@/components/ScrollCanvasSequence";
import { HeroOverlay } from "@/components/HeroOverlay";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <ScrollCanvasSequence>
          <HeroOverlay />
        </ScrollCanvasSequence>
        <About />
        <Projects />
        <Experience />
        <Footer />
      </main>
    </>
  );
}
