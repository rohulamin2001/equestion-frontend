import { Navigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import CTASection from "./components/CTASection";
import FAQSection from "./components/FAQSection";
import FeatureGrid from "./components/FeatureGrid";
import HeroSection from "./components/HeroSection";
import LandingFooter from "./components/LandingFooter";
import LandingNavbar from "./components/LandingNavbar";
import OMRSection from "./components/OMRSection";
import OnlineExamSection from "./components/OnlineExamSection";
import PlatformSection from "./components/PlatformSection";
import PricingSection from "./components/PricingSection";
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
    document.querySelector("#features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onSubscribe = () => openAuthDrawer("register");
  const onLogin = () => openAuthDrawer("login");
  const onContact = () => {
    window.location.href = "mailto:support@smartproshnobank.com";
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNavbar
        onDemo={scrollToFeatures}
        onSubscribe={onSubscribe}
        onLogin={onLogin}
      />
      <main className="overflow-x-hidden">
        <HeroSection onDemo={scrollToFeatures} onSubscribe={onSubscribe} />
        <FeatureGrid />
        <PlatformSection onStart={onSubscribe} />
        <QuestionGeneratorSection onStart={onSubscribe} />
        <OMRSection />
        <OnlineExamSection />
        <WorkflowSection />
        <TargetUsers />
        <TrustSection />
        <PricingSection onRegister={onSubscribe} onContact={onContact} />
        <CTASection onDemo={scrollToFeatures} onSubscribe={onSubscribe} />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
