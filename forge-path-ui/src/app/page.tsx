"use client";

import HeroSection from "./components/landing/HeroSection";
import ProblemSection from "./components/landing/ProblemSection";
import SolutionSection from "./components/landing/SolutionSection";
import OcrSimulator from "./components/landing/OcrSimulator";
import PipelineFlow from "./components/landing/PipelineFlow";
import InteractiveDashboard from "./components/landing/InteractiveDashboard";
import CopilotSimulator from "./components/landing/CopilotSimulator";
import AutomationTimeline from "./components/landing/AutomationTimeline";
import ComparisonGrid from "./components/landing/ComparisonGrid";
import TechStackGrid from "./components/landing/TechStackGrid";
import ScaleMetrics from "./components/landing/ScaleMetrics";
import GuidedDemoTour from "./components/landing/GuidedDemoTour";
import StatsAndFooter from "./components/landing/StatsAndFooter";

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[#0b0e11] text-white overflow-x-hidden selection:bg-[#fcd535] selection:text-black">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <OcrSimulator />
      <PipelineFlow />
      <InteractiveDashboard />
      <CopilotSimulator />
      <AutomationTimeline />
      <ComparisonGrid />
      <TechStackGrid />
      <ScaleMetrics />
      <GuidedDemoTour />
      <StatsAndFooter />
    </main>
  );
}
