import About from "@/components/About";
import Catalog from "@/components/Catalog";
import Footer from "@/components/Footer";
import HeroScroll from "@/components/HeroScroll";
import LedTicker from "@/components/LedTicker";
import Preloader from "@/components/Preloader";
import PresentationVideo from "@/components/PresentationVideo";
import Press from "@/components/Press";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import Visit from "@/components/Visit";

export default function Home() {
  return (
    <>
      <a href="#catalogo" className="sr-only z-[200] rounded bg-brand px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al catálogo
      </a>
      <Preloader />
      <SiteHeader />
      <main>
        <HeroScroll />
        <LedTicker />
        <About />
        <Catalog />
        <Press />
        <PresentationVideo />
        <Visit />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
