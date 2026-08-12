import { Navigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import CTASection from "./components/CTASection";
import FAQSection from "./components/FAQSection";
import HeroHighlights from "./components/HeroHighlights";
import HeroSection from "./components/HeroSection";
import LandingFooter from "./components/LandingFooter";
import LandingNavbar from "./components/LandingNavbar";
import OMRSection from "./components/OMRSection";
import OnlineExamSection from "./components/OnlineExamSection";
import PlatformSection from "./components/PlatformSection";
import QuestionGeneratorSection from "./components/QuestionGeneratorSection";
import TargetUsers from "./components/TargetUsers";
import TrustSection from "./components/TrustSection";
import WorkflowSection from "./components/WorkflowSection";

export default function Home() {
  const { userProfile, openAuthDrawer } = useUserContext();

  if (userProfile) {
    return <Navigate to="/dashboard" replace />;
  }

  const scrollToFeatures = () => {
    document.querySelector("#platform")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onSubscribe = () => openAuthDrawer("register");
  const onLogin = () => openAuthDrawer("login");

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-32 left-1/2 size-[min(90vw,640px)] -translate-x-1/2 rounded-full blur-3xl opacity-80"
          style={{ background: "var(--landing-glow)" }}
        />
        <div
          className="absolute top-[28%] -left-24 size-[min(70vw,420px)] rounded-full blur-3xl opacity-70"
          style={{ background: "var(--landing-glow-soft)" }}
        />
        <div
          className="absolute top-[55%] -right-20 size-[min(75vw,480px)] rounded-full blur-3xl opacity-60"
          style={{ background: "var(--landing-glow)" }}
        />
        <div
          className="absolute bottom-[12%] left-1/3 size-[min(60vw,380px)] rounded-full blur-3xl opacity-50"
          style={{ background: "var(--landing-glow-soft)" }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(var(--landing-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--landing-grid-color) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 78%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <LandingNavbar
          onDemo={scrollToFeatures}
          onSubscribe={onSubscribe}
          onLogin={onLogin}
        />
        <main className="overflow-x-hidden">
          <HeroSection onDemo={scrollToFeatures} onSubscribe={onSubscribe} />
          <HeroHighlights />
          <PlatformSection onStart={onSubscribe} />
          <QuestionGeneratorSection onStart={onSubscribe} />
          <OMRSection />
          <OnlineExamSection />
          <WorkflowSection />
          <TargetUsers />
          <TrustSection />
          <CTASection onDemo={scrollToFeatures} onSubscribe={onSubscribe} />
          <FAQSection />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
