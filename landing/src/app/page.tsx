import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Agents } from "@/components/Agents";
import { BYOK } from "@/components/BYOK";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Agents />
      <BYOK />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
