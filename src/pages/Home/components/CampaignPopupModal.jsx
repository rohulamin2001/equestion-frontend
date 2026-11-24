import { ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function CampaignPopupModal({
  modal,
  isOpen: controlledIsOpen,
  onClose,
}) {
  const [dismissed, setDismissed] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  // If controlled (e.g. test preview), use controlledIsOpen.
  // If uncontrolled (live website), show if active, has image, and not dismissed yet.
  const isOpen = isControlled
    ? Boolean(controlledIsOpen)
    : Boolean(modal?.isActive && modal?.imageUrl && !dismissed);

  const handleClose = () => {
    if (!isControlled) {
      setDismissed(true);
    }
    onClose?.();
  };

  // Sync external DOM and listeners only when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (typeof document === "undefined" || !modal || !modal.imageUrl || !isOpen) {
    return null;
  }

  const hasLink = Boolean(modal.linkUrl);
  const isInternalLink = hasLink && modal.linkUrl.startsWith("/");

  const ImageWrapper = (
    <div className="relative group flex items-center justify-center bg-transparent">
      <img
        src={modal.imageUrl}
        alt="ক্যাম্পেইন অফার"
        className="w-auto max-w-full max-h-[82vh] object-contain block mx-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
      />
      {hasLink && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <span className="pointer-events-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-purple-600/90 hover:bg-purple-600 px-4 py-1.5 rounded-full shadow-lg transition font-bengali cursor-pointer">
            <span>বিস্তারিত দেখুন</span>
            <ExternalLink className="size-3.5" />
          </span>
        </div>
      )}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative inline-flex flex-col items-center max-w-[92vw] sm:max-w-xl mx-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-3.5 -right-2.5 sm:-top-4 sm:-right-4 size-8 sm:size-9 rounded-full bg-white text-slate-900 shadow-xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:scale-105 transition cursor-pointer z-30"
          aria-label="মডাল বন্ধ করুন"
        >
          <X className="size-4 sm:size-5" />
        </button>

        {/* Modal Content */}
        {hasLink ? (
          isInternalLink ? (
            <Link
              to={modal.linkUrl}
              onClick={handleClose}
              className="block cursor-pointer"
            >
              {ImageWrapper}
            </Link>
          ) : (
            <a
              href={modal.linkUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleClose}
              className="block cursor-pointer"
            >
              {ImageWrapper}
            </a>
          )
        ) : (
          ImageWrapper
        )}
      </div>
    </div>,
    document.body,
  );
}
