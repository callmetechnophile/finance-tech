import Hero from "@/components/marketing/Hero/Hero";
import Problem from "@/components/marketing/Problem/Problem";
import Journey from "@/components/marketing/Journey/Journey";
import Features from "@/components/marketing/Features/Features";
import Architecture from "@/components/marketing/Architecture/Architecture";
import Technology from "@/components/marketing/Technology/Technology";
import Documentation from "@/components/marketing/Documentation/Documentation";
import Demo from "@/components/marketing/Demo/Demo";
import CTA from "@/components/marketing/Footer/CTA";
import Developers from "@/components/marketing/Developers/Developers";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <Problem />
      <Journey />
      <Features />
      <Architecture />
      <Technology />
      <Documentation />
      <Demo />
      <CTA />
      <Developers />
    </>
  );
}
