import {
  BookOpen,
  Check,
  Cloud,
  CloudOff,
  Compass,
  Download,
  FileDown,
  FolderOpen,
  ImagePlus,
  Loader2,
  Maximize2,
  Minimize2,
  Palette,
  Presentation,
  QrCode,
  Ruler,
  Save,
  Sigma,
  Spotlight,
  Timer,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import { BACKGROUND_TEMPLATES } from "../constants/boardDefaults";

export default function TopControlBar({
  lessonTitle,
  onChangeTitle,
  saveStatus,
  activeBackgroundType,
  onChangeBackground,
  viewportScale,
  onZoomIn,
  onZoomOut,
  onFitView,
  isFullscreen,
  onToggleFullscreen,
  onOpenQuestionDrawer,
  onOpenLibrary,
  onManualSave,
  onExportPng,
  onExportPdf,
  exporting,
  onOpenShare,
  onUploadImageClick,
  onUploadPdfClick,
  onOpenEquationModal,
  stemState,
  onToggleStemTool,
  presentationState,
  onTogglePresentationTool,
}) {
  const [showBgMenu, setShowBgMenu] = useState(false);

  const renderSaveBadge = () => {
    if (saveStatus === "saving") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px]">
          <Loader2 className="size-3 animate-spin" /> সেভ হচ্ছে...
        </span>
      );
    }
    if (saveStatus === "saved") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px]">
          <Check className="size-3" /> সেভ হয়েছে
        </span>
      );
    }
    if (saveStatus === "offline") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px]">
          <CloudOff className="size-3" /> অফলাইন ড্রাফট
        </span>
      );
    }
    if (saveStatus === "failed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 text-[11px]">
          <Cloud className="size-3" /> সেভ ব্যর্থ
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px]">
        অসংরক্ষিত পরিবর্তন
      </span>
    );
  };

  return (
    <header className="relative z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-3 py-2 flex flex-wrap items-center justify-between gap-2 font-bengali">
      {/* Left: Title & Save Status */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenLibrary}
          title="সেভ করা লেসন লাইব্রেরি"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 cursor-pointer shrink-0"
        >
          <FolderOpen className="size-3.5 text-purple-600" />
          <span className="hidden md:inline">লেসনসমূহ</span>
        </button>

        <input
          type="text"
          value={lessonTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder="লেসনের নাম লিখুন..."
          className="w-40 sm:w-56 px-2.5 py-1 rounded-lg border border-transparent hover:border-slate-200 focus:border-purple-400 focus:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 outline-none"
        />

        <div className="hidden lg:block">{renderSaveBadge()}</div>
      </div>

      {/* Center: Question Load, Media, STEM & Presentation Tools */}
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={onOpenQuestionDrawer}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
        >
          <BookOpen className="size-3.5" />
          <span>প্রশ্ন আনুন</span>
        </button>

        {/* Background Switcher */}
        <div className="relative">
          <button
            type="button"
            title="বোর্ড ব্যাকগ্রাউন্ড"
            onClick={() => setShowBgMenu((v) => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 cursor-pointer"
          >
            <Palette className="size-3.5 text-indigo-600" />
            <span className="hidden xl:inline">বোর্ড</span>
          </button>
          {showBgMenu && (
            <div className="absolute left-0 top-10 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 space-y-0.5">
              {Object.values(BACKGROUND_TEMPLATES).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    onChangeBackground(tpl.id);
                    setShowBgMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer ${
                    activeBackgroundType === tpl.id
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    style={{ backgroundColor: tpl.color }}
                    className="size-3.5 rounded border border-slate-300 shrink-0"
                  />
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Media & Math */}
        <button
          type="button"
          title="ছবি যোগ করুন"
          onClick={onUploadImageClick}
          className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          <ImagePlus className="size-3.5" />
        </button>
        <button
          type="button"
          title="PDF পেজ আমদানি করুন"
          onClick={onUploadPdfClick}
          className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          <Upload className="size-3.5" />
        </button>
        <button
          type="button"
          title="গণিত সমীকরণ (fx)"
          onClick={onOpenEquationModal}
          className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          <Sigma className="size-3.5" />
        </button>

        <span className="hidden sm:block h-5 w-px bg-slate-200 mx-0.5" />

        {/* STEM Geometry Tools */}
        <button
          type="button"
          title="স্কেল / রুলার"
          onClick={() => onToggleStemTool("ruler")}
          className={`inline-flex size-8 items-center justify-center rounded-xl border cursor-pointer ${
            stemState.ruler
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Ruler className="size-3.5" />
        </button>
        <button
          type="button"
          title="চাঁদা ও কম্পাস"
          onClick={() => onToggleStemTool("protractor")}
          className={`inline-flex size-8 items-center justify-center rounded-xl border cursor-pointer ${
            stemState.protractor
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Compass className="size-3.5" />
        </button>

        {/* Presentation Tools */}
        <button
          type="button"
          title="স্ক্রিন কার্টেইন (পর্দা)"
          onClick={() => onTogglePresentationTool("curtain")}
          className={`inline-flex size-8 items-center justify-center rounded-xl border cursor-pointer ${
            presentationState.curtain
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Presentation className="size-3.5" />
        </button>
        <button
          type="button"
          title="স্পটলাইট"
          onClick={() => onTogglePresentationTool("spotlight")}
          className={`inline-flex size-8 items-center justify-center rounded-xl border cursor-pointer ${
            presentationState.spotlight
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Spotlight className="size-3.5" />
        </button>
        <button
          type="button"
          title="ক্লাসরুম টাইমার"
          onClick={() => onTogglePresentationTool("timer")}
          className={`inline-flex size-8 items-center justify-center rounded-xl border cursor-pointer ${
            presentationState.timer
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Timer className="size-3.5" />
        </button>
      </div>

      {/* Right: Zoom, Save, Export, Share & Fullscreen */}
      <div className="flex items-center gap-1">
        <div className="hidden xl:flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 px-1 py-0.5">
          <button
            type="button"
            title="Zoom Out"
            onClick={onZoomOut}
            className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onFitView}
            title="Fit to screen"
            className="px-1.5 text-[11px] font-sans font-semibold text-slate-700 cursor-pointer"
          >
            {Math.round(viewportScale * 100)}%
          </button>
          <button
            type="button"
            title="Zoom In"
            onClick={onZoomIn}
            className="p-1 rounded-lg hover:bg-white text-slate-600 cursor-pointer"
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onManualSave}
          title="ক্লাউডে সেভ করুন"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 cursor-pointer"
        >
          <Save className="size-3.5 text-emerald-600" />
          <span className="hidden sm:inline">সেভ</span>
        </button>

        <button
          type="button"
          disabled={exporting}
          onClick={onExportPng}
          title="PNG ডাউনলোড"
          className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer disabled:opacity-50"
        >
          <Download className="size-3.5" />
        </button>

        <button
          type="button"
          disabled={exporting}
          onClick={onExportPdf}
          title="মাল্টি-পেজ PDF ডাউনলোড"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <FileDown className="size-3.5" />
          )}
          <span className="hidden sm:inline">PDF</span>
        </button>

        <button
          type="button"
          onClick={onOpenShare}
          title="QR কোড ও পাবলিক শেয়ার"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs cursor-pointer"
        >
          <QrCode className="size-3.5" />
          <span className="hidden md:inline">শেয়ার</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "ফুলস্ক্রিন বন্ধ করুন" : "ফুলস্ক্রিন মোড"}
          className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5" />
          ) : (
            <Maximize2 className="size-3.5" />
          )}
        </button>
      </div>
    </header>
  );
}
