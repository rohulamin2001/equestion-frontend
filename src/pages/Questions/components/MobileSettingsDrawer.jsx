import { Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import SettingsSidebar from "./SettingsSidebar.jsx";

export default function MobileSettingsDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  layoutSettings,
  updateSettingField,
  onOpenPageSetup,
  onOpenLogoSettings,
  onOpenHeaderSettings,
  onOpenFooterSettings,
  handlePrint,
  activeFont,
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[160] print:hidden lg:hidden"
            style={{
              background: "rgba(15,10,40,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Right Slide-Over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
              mass: 0.8,
            }}
            className="fixed top-0 right-0 h-full w-full sm:w-[380px] z-[170] print:hidden flex flex-col bg-slate-50 text-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden border-l border-slate-200 lg:hidden"
          >
            {/* Header Bar */}
            <div
              className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-white/10 select-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(109,40,217,0.95) 0%, rgba(79,70,229,0.95) 100%)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="size-5 text-white" />
                <h2 className="text-[16px] font-bold tracking-tight text-white font-bengali">
                  প্রশ্নপত্র সেটিংস
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <SettingsSidebar
                isMobileDrawer={true}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                layoutSettings={layoutSettings}
                updateSettingField={updateSettingField}
                onOpenPageSetup={() => {
                  onClose();
                  onOpenPageSetup();
                }}
                onOpenLogoSettings={() => {
                  onClose();
                  onOpenLogoSettings();
                }}
                onOpenHeaderSettings={() => {
                  onClose();
                  onOpenHeaderSettings();
                }}
                onOpenFooterSettings={() => {
                  onClose();
                  onOpenFooterSettings();
                }}
                handlePrint={() => {
                  onClose();
                  handlePrint();
                }}
                activeFont={activeFont}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
