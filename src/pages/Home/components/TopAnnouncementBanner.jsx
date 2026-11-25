import { ExternalLink, Megaphone, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function TopAnnouncementBanner({ banner }) {
  const [dismissed, setDismissed] = useState(false);

  if (!banner || !banner.isActive || dismissed) {
    return null;
  }

  const hasImage = Boolean(banner.imageUrl);
  const hasText = Boolean(banner.text);
  const hasLink = Boolean(banner.linkUrl);
  const isInternalLink = hasLink && banner.linkUrl.startsWith("/");

  if (!hasImage && !hasText) {
    return null;
  }

  // If banner has an uploaded image
  if (hasImage) {
    const ImageContent = (
      <div className="relative w-full flex items-center justify-center bg-transparent">
        <img
          src={banner.imageUrl}
          alt={banner.text || "ক্যাম্পেইন ব্যানার"}
          className="w-full h-auto block select-none"
        />
        {hasText && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 text-center">
            <span className="text-white text-xs sm:text-sm font-bold font-bengali drop-shadow-md">
              {banner.text}
            </span>
          </div>
        )}
      </div>
    );

    return (
      <div className="relative w-full z-50 bg-transparent">
        {hasLink ? (
          isInternalLink ? (
            <Link
              to={banner.linkUrl}
              className="block w-full cursor-pointer hover:opacity-95 transition"
            >
              {ImageContent}
            </Link>
          ) : (
            <a
              href={banner.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full cursor-pointer hover:opacity-95 transition"
            >
              {ImageContent}
            </a>
          )
        ) : (
          ImageContent
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 rounded-full bg-black/60 text-white hover:bg-black/85 backdrop-blur-sm transition cursor-pointer z-10 shadow-md"
          aria-label="ব্যানার বন্ধ করুন"
        >
          <X className="size-3 sm:size-3.5" />
        </button>
      </div>
    );
  }

  // If text-only banner
  const TextBanner = (
    <div
      className="relative w-full py-2 xs:py-2.5 px-4 text-white text-xs xs:text-sm font-bengali flex items-center justify-center gap-2 sm:gap-3 transition shadow-md z-50"
      style={{
        background:
          "linear-gradient(90deg, #58085f 0%, #900eb0 50%, #720a7b 100%)",
      }}
    >
      <div className="flex items-center gap-2 max-w-5xl truncate">
        <Megaphone className="size-4 shrink-0 text-amber-300 animate-pulse" />
        <span className="font-semibold truncate">{banner.text}</span>
      </div>

      {hasLink && (
        <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-white/20 hover:bg-white/30 px-2.5 py-0.5 text-[11px] xs:text-xs font-bold text-white transition">
          <span>দেখুন</span>
          <ExternalLink className="size-3" />
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer"
        aria-label="ব্যানার বন্ধ করুন"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );

  if (hasLink) {
    return isInternalLink ? (
      <Link to={banner.linkUrl} className="block cursor-pointer">
        {TextBanner}
      </Link>
    ) : (
      <a
        href={banner.linkUrl}
        target="_blank"
        rel="noreferrer"
        className="block cursor-pointer"
      >
        {TextBanner}
      </a>
    );
  }

  return TextBanner;
}
