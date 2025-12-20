import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Products } from "@/components/products";
import { Features } from "@/components/features";
import { TechStack } from "@/components/tech-stack";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { FinalCTA } from "@/components/final-cta";
import { About } from "@/components/about";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <div id="tech-stack">
          <TechStack />
      </div>
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <About />
      <Footer />
    </main>
  );
}
