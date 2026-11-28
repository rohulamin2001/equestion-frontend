import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Loader2,
  Presentation,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import QuestionCardOverlay, {
  OffscreenQuestionExportHost,
} from "./components/QuestionCardOverlay";
import SmartboardCanvas from "./components/SmartboardCanvas";
import { BACKGROUND_TEMPLATES, BOARD_TOOLS } from "./constants/boardDefaults";
import { computeFitViewport } from "./engine/coordinateSystem";
import { useOffscreenCardExport } from "./hooks/useOffscreenCardExport";
import { smartboardApi } from "./services/smartboardApi";
import { downloadLessonPdf } from "./utils/exportBoard";

export default function SmartboardPublicNote() {
  const { shareToken } = useParams();
  const [slideIdx, setSlideIdx] = useState(0);
  const [exporting, setExporting] = useState(false);

  const [viewport, setViewport] = useState({ x: 20, y: 20, scale: 0.65 });
  const [containerSize, setContainerSize] = useState({ width: 960, height: 600 });

  const {
    exportRenderSlide,
    registerOffscreenCardNode,
    resolveCardNodesForSlide,
    resetExportRender,
  } = useOffscreenCardExport();

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = Math.max(400, window.innerHeight - 72);
      setContainerSize({ width: w, height: h });
      setViewport(computeFitViewport(w, h, 20));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const noteQuery = useQuery({
    queryKey: ["publicBoardNote", shareToken],
    queryFn: () => smartboardApi.getPublicNote(shareToken),
    enabled: Boolean(shareToken),
    retry: false,
  });

  if (noteQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3 font-bengali">
        <Loader2 className="size-8 animate-spin text-purple-600" />
        <p className="text-sm text-slate-600">ক্লাস নোট লোড হচ্ছে...</p>
      </div>
    );
  }

  const data = noteQuery.data;
  if (noteQuery.isError || !data?.lesson) {
    const errMsg =
      noteQuery.error?.response?.data?.message ||
      "শেয়ার লিংকটির মেয়াদ শেষ বা বাতিল করা হয়েছে।";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center gap-3 font-bengali">
        <AlertTriangle className="size-10 text-amber-500" />
        <h1 className="text-lg font-bold text-slate-900">
          নোটটি পাওয়া যায়নি
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">{errMsg}</p>
        <Link
          to="/"
          className="mt-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
        >
          হোম পেজে যান
        </Link>
      </div>
    );
  }

  const slides = data.slides || [];
  const activeSlide = slides[slideIdx] || slides[0];
  const allowDownload = data.permissions?.downloadPdf !== false;
  const activeBgType = activeSlide?.canvas?.background?.type || "WHITEBOARD";
  const isDarkBoard = Boolean(BACKGROUND_TEMPLATES[activeBgType]?.isDark);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-bengali">
      <header className="h-[72px] px-4 sm:px-6 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shrink-0">
            <Presentation className="size-4" />
          </span>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {data.lesson.title}
            </h1>
            <p className="text-[11px] text-slate-500">
              ক্লাস নোট (রিড-অনলি) • পৃষ্ঠা{" "}
              {(slideIdx + 1).toLocaleString("bn-BD")} /{" "}
              {slides.length.toLocaleString("bn-BD")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-1.5 py-1">
            <button
              type="button"
              disabled={slideIdx === 0}
              onClick={() => setSlideIdx((i) => Math.max(0, i - 1))}
              className="p-1 rounded-lg hover:bg-white disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-1.5 text-xs font-semibold">
              {(slideIdx + 1).toLocaleString("bn-BD")}/
              {slides.length.toLocaleString("bn-BD")}
            </span>
            <button
              type="button"
              disabled={slideIdx >= slides.length - 1}
              onClick={() =>
                setSlideIdx((i) => Math.min(slides.length - 1, i + 1))
              }
              className="p-1 rounded-lg hover:bg-white disabled:opacity-35 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {allowDownload && (
            <button
              type="button"
              disabled={exporting}
              onClick={async () => {
                setExporting(true);
                try {
                  await downloadLessonPdf(
                    {
                      title: data.lesson.title,
                      slides,
                    },
                    { resolveCardNodesForSlide },
                  );
                  toast.success("PDF ডাউনলোড হয়েছে!");
                } catch {
                  toast.error("PDF তৈরি করা যায়নি।");
                } finally {
                  resetExportRender();
                  setExporting(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <FileDown className="size-3.5" />
              )}
              <span>PDF ডাউনলোড</span>
            </button>
          )}
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        {activeSlide && (
          <>
            <SmartboardCanvas
              slide={activeSlide}
              activeTool={BOARD_TOOLS.HAND}
              brushColor="#0F172A"
              strokeWidth={4}
              penOnly={false}
              viewport={viewport}
              onChangeViewport={setViewport}
              selectedId={null}
              onSelectObject={() => {}}
              onCommitObjects={() => {}}
              onUpdateObject={() => {}}
              containerWidth={containerSize.width}
              containerHeight={containerSize.height}
            >
              <QuestionCardOverlay
                objects={activeSlide.objects}
                viewport={viewport}
                activeTool={BOARD_TOOLS.HAND}
                isDarkBoard={isDarkBoard}
                onUpdateObject={() => {}}
                onDeleteObject={() => {}}
                registerCardNode={() => {}}
              />
            </SmartboardCanvas>
          </>
        )}
      </main>

      <OffscreenQuestionExportHost
        slide={exportRenderSlide}
        registerNode={registerOffscreenCardNode}
      />
    </div>
  );
}
