import { Loader2 } from "lucide-react";
import { useState } from "react";
import FloatingFormatToolbar from "../../components/FloatingFormatToolbar.jsx";
import FooterSettingsDrawer from "./components/FooterSettingsDrawer.jsx";
import HeaderSettingsDrawer from "./components/HeaderSettingsDrawer.jsx";
import LogoSettingsDrawer from "./components/LogoSettingsDrawer.jsx";
import MobileSettingsDrawer from "./components/MobileSettingsDrawer.jsx";
import PageSetupDrawer from "./components/PageSetupDrawer.jsx";
import QuestionPaperPreview from "./components/QuestionPaperPreview.jsx";
import SettingsSidebar from "./components/SettingsSidebar.jsx";
import { FONT_OPTIONS } from "./constants/paperSettings.js";
import { useQuestionPreview } from "./hook/useQuestionPreview";

export default function QuestionPreview() {
  const [customGroupLabels, setCustomGroupLabels] = useState({});
  const [customGroupMarks, setCustomGroupMarks] = useState({});
  const [customSubMarks, setCustomSubMarks] = useState({});
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [isLogoSettingsOpen, setIsLogoSettingsOpen] = useState(false);
  const [isHeaderSettingsOpen, setIsHeaderSettingsOpen] = useState(false);
  const [isFooterSettingsOpen, setIsFooterSettingsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const {
    loadingSets,
    activeSet,
    layoutSettings,
    activeTab,
    setActiveTab,
    toolbarVisible,
    toolbarPos,
    groupedQuestions,
    handleEditorActivate,
    handleEditorDeactivate,
    handleSaveSetField,
    handleSaveQuestionEdit,
    updateSettingField,
    handlePrint,
    handleGoBackToSelect,
    userProfile,
    syllabusList,
  } = useQuestionPreview();

  const handleDragStart = (e) => {
    setIsDraggingLogo(true);
    updateDragPosition(e);
  };

  const handleDragEnd = () => {
    setIsDraggingLogo(false);
  };

  const updateDragPosition = (e) => {
    const container = document.getElementById("logo-drag-container");
    if (!container) return;
    const rect = container.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(
      0,
      Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)),
    );
    const y = Math.max(
      0,
      Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)),
    );

    updateSettingField("logoSettings", "x", x);
    updateSettingField("logoSettings", "y", y);
  };

  const handleDragMove = (e) => {
    if (!isDraggingLogo) return;
    updateDragPosition(e);
  };

  const handleDragTouchMove = (e) => {
    if (!isDraggingLogo) return;
    if (e.cancelable) e.preventDefault();
    updateDragPosition(e);
  };

  if (loadingSets || !activeSet || !layoutSettings) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500 font-semibold">
          প্রশ্নপত্র লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const handleSaveSubjectCodeDigit = (index, char) => {
    if (!activeSet) return;
    const cleanedChar = char ? String(char).trim().charAt(0) : "";
    let codeStr = String(activeSet?.subjectCode || "১০১");
    while (codeStr.length < 3) codeStr += " ";
    const codeArr = codeStr.split("");
    codeArr[index] = cleanedChar || " ";
    const newCode = codeArr.join("");
    handleSaveSetField("subjectCode", newCode);
  };

  const activeFont = FONT_OPTIONS.some(
    (f) => f.value === layoutSettings?.fontFamily,
  )
    ? layoutSettings.fontFamily
    : "SolaimanLipi";

  return (
    <div className="space-y-6 pb-12 font-bengali text-left">
      {/* Main Preview Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center max-w-[1220px] mx-auto w-full print:block print:w-full print:m-0 print:p-0">
        {/* Left Pane (A4 Printable paper preview) */}
        <QuestionPaperPreview
          layoutSettings={layoutSettings}
          activeFont={activeFont}
          activeSet={activeSet}
          userProfile={userProfile}
          syllabusList={syllabusList}
          groupedQuestions={groupedQuestions}
          customGroupLabels={customGroupLabels}
          setCustomGroupLabels={setCustomGroupLabels}
          customGroupMarks={customGroupMarks}
          setCustomGroupMarks={setCustomGroupMarks}
          customSubMarks={customSubMarks}
          setCustomSubMarks={setCustomSubMarks}
          handleSaveSetField={handleSaveSetField}
          handleSaveSubjectCodeDigit={handleSaveSubjectCodeDigit}
          handleSaveQuestionEdit={handleSaveQuestionEdit}
          handleEditorActivate={handleEditorActivate}
          handleEditorDeactivate={handleEditorDeactivate}
          handleGoBackToSelect={handleGoBackToSelect}
          updateSettingField={updateSettingField}
          onOpenMobileSettings={() => setIsMobileSettingsOpen(true)}
        />

        {/* Right Pane: Layout Settings Sidebar */}
        <SettingsSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          layoutSettings={layoutSettings}
          updateSettingField={updateSettingField}
          onOpenPageSetup={() => setIsPageSetupOpen(true)}
          onOpenLogoSettings={() => setIsLogoSettingsOpen(true)}
          onOpenHeaderSettings={() => setIsHeaderSettingsOpen(true)}
          onOpenFooterSettings={() => setIsFooterSettingsOpen(true)}
          handlePrint={handlePrint}
          activeFont={activeFont}
        />
      </div>

      {/* Mobile Settings Drawer */}
      <MobileSettingsDrawer
        isOpen={isMobileSettingsOpen}
        onClose={() => setIsMobileSettingsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        layoutSettings={layoutSettings}
        updateSettingField={updateSettingField}
        onOpenPageSetup={() => setIsPageSetupOpen(true)}
        onOpenLogoSettings={() => setIsLogoSettingsOpen(true)}
        onOpenHeaderSettings={() => setIsHeaderSettingsOpen(true)}
        onOpenFooterSettings={() => setIsFooterSettingsOpen(true)}
        handlePrint={handlePrint}
        activeFont={activeFont}
      />

      {/* Floating Toolbar for Inline Rich-Text Editing */}
      <FloatingFormatToolbar visible={toolbarVisible} position={toolbarPos} />

      {/* Page Setup Drawer */}
      <PageSetupDrawer
        isOpen={isPageSetupOpen}
        onClose={() => setIsPageSetupOpen(false)}
        layoutSettings={layoutSettings}
        updateSettingField={updateSettingField}
      />

      {/* Logo Settings Drawer */}
      <LogoSettingsDrawer
        isOpen={isLogoSettingsOpen}
        onClose={() => setIsLogoSettingsOpen(false)}
        layoutSettings={layoutSettings}
        updateSettingField={updateSettingField}
        handleDragStart={handleDragStart}
        handleDragMove={handleDragMove}
        handleDragTouchMove={handleDragTouchMove}
        handleDragEnd={handleDragEnd}
      />

      {/* Header Settings Drawer */}
      <HeaderSettingsDrawer
        isOpen={isHeaderSettingsOpen}
        onClose={() => setIsHeaderSettingsOpen(false)}
        layoutSettings={layoutSettings}
        updateSettingField={updateSettingField}
        activeFont={activeFont}
      />

      {/* Footer Settings Drawer */}
      <FooterSettingsDrawer
        isOpen={isFooterSettingsOpen}
        onClose={() => setIsFooterSettingsOpen(false)}
        layoutSettings={layoutSettings}
        updateSettingField={updateSettingField}
        activeFont={activeFont}
      />
    </div>
  );
}
