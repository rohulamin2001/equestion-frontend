import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NotFoundFooter from "./NotFoundFooter";
import NotFoundNav from "./NotFoundNav";
import "./not-found.css";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4";

export default function NotFound() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMotionPreference = () => {
      if (motionQuery.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    applyMotionPreference();
    motionQuery.addEventListener("change", applyMotionPreference);

    return () => {
      motionQuery.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <NotFoundNav />

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 md:py-0">
          <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-1 sm:mb-2">
            This page seems to have
          </h1>
          <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-8 sm:mb-12">
            slipped beyond our reach :/
          </h1>

          <div className="relative mb-8 sm:mb-12 w-full flex justify-center overflow-visible">
            <span className="four-oh-four text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px] lg:text-[260px] font-black text-white leading-none tracking-tighter select-none">
              404
            </span>
          </div>

          <Link
            to="/"
            className="liquid-glass inline-block text-white text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase hover:bg-white/5 transition-colors"
          >
            Return to Main Page
          </Link>
        </main>

        <NotFoundFooter />
      </div>
    </div>
  );
}
