import { useUserContext } from "@/context/UserContext";
import { AlertTriangle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ClassroomPresentationTools from "./components/ClassroomPresentationTools";
import EquationModal from "./components/EquationModal";
import FloatingToolbar from "./components/FloatingToolbar";
import PdfImportModal from "./components/PdfImportModal";
import QuestionCardOverlay from "./components/QuestionCardOverlay";
import QuestionImportDrawer from "./components/QuestionImportDrawer";
import ShareLessonModal from "./components/ShareLessonModal";
import SlideDeckPanel from "./components/SlideDeckPanel";
import SmartboardCanvas from "./components/SmartboardCanvas";
import SmartboardLibraryModal from "./components/SmartboardLibraryModal";
import StemToolsOverlay from "./components/StemToolsOverlay";
import TopControlBar from "./components/TopControlBar";
import {
  BACKGROUND_TEMPLATES,
  BOARD_TOOLS,
  ZOOM_STEP,
} from "./constants/boardDefaults";
import { computeFitViewport } from "./engine/coordinateSystem";
import {
  createEmptySlide,
  createInitialLesson,
  duplicateSlideRecord,
  normalizeSlidePayloadForSave,
} from "./engine/documentEngine";
import {
  pushSlideHistory,
  stepRedoSlideHistory,
  stepUndoSlideHistory,
} from "./engine/historyManager";
import {
  createImageObject,
  createQuestionCardObject,
} from "./engine/objectFactory";
import { smartboardApi } from "./services/smartboardApi";
import { downloadLessonPdf, downloadSlidePng } from "./utils/exportBoard";
import {
  deleteOfflineDraft,
  getOfflineDraft,
  saveOfflineDraft,
} from "./utils/offlineDraft";

export default function Smartboard() {
  const { userProfile } = useUserContext();
  const { lessonId: routeLessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(() => createInitialLesson());
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [historyMap, setHistoryMap] = useState({});

  // Tooling & Viewport State
  const [activeTool, setActiveTool] = useState(BOARD_TOOLS.PEN);
  const [brushColor, setBrushColor] = useState("#0F172A");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [penOnly, setPenOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewport, setViewport] = useState({ x: 40, y: 20, scale: 0.65 });

  // Drawers, Modals & Overlays
  const [slidePanelOpen, setSlidePanelOpen] = useState(true);
  const [questionDrawerOpen, setQuestionDrawerOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [equationOpen, setEquationOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // STEM & Presentation Tools
  const [rulerTool, setRulerTool] = useState({
    visible: false,
    x: 320,
    y: 420,
    length: 560,
    height: 86,
    rotation: 0,
    snapEnabled: true,
  });
  const [protractorTool, setProtractorTool] = useState({
    visible: false,
    x: 680,
    y: 280,
    rotation: 0,
    locked: false,
  });
  const [presentationState, setPresentationState] = useState({
    curtain: false,
    spotlight: false,
    timer: false,
  });

  // Save & Recovery State
  const [saveStatus, setSaveStatus] = useState("saved");
  const [recoveryDraft, setRecoveryDraft] = useState(null);
  const [conflictBanner, setConflictBanner] = useState(false);

  const workspaceContainerRef = useRef(null);
  const rootWrapperRef = useRef(null);
  const imageInputRef = useRef(null);
  const questionCardNodesRef = useRef(new Map());
  const dirtySlideIdsRef = useRef(new Set());
  const savingInFlightRef = useRef(false);
  const pendingSaveRequestedRef = useRef(false);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 640 });

  const registerCardNode = useCallback((id, el) => {
    if (el) {
      questionCardNodesRef.current.set(id, el);
    } else {
      questionCardNodesRef.current.delete(id);
    }
  }, []);

  const slides = lesson.slides || [];
  const safeSlideIndex = Math.min(activeSlideIndex, Math.max(0, slides.length - 1));
  const activeSlide = slides[safeSlideIndex] || createEmptySlide();
  const activeSlideId = activeSlide._id || activeSlide.localId;
  const activeBgType = activeSlide.canvas?.background?.type || "WHITEBOARD";
  const isDarkBoard = Boolean(BACKGROUND_TEMPLATES[activeBgType]?.isDark);

  // Measure workspace container and auto-fit initial viewport
  useEffect(() => {
    const el = workspaceContainerRef.current;
    if (!el) return undefined;
    let didInitialFit = false;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 100 && height > 100) {
          setContainerSize({ width, height });
          if (!didInitialFit) {
            didInitialFit = true;
            setViewport(computeFitViewport(width, height));
          }
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load lesson when route parameter changes
  useEffect(() => {
    if (!routeLessonId) return;
    let cancelled = false;
    smartboardApi
      .getLesson(routeLessonId)
      .then((res) => {
        if (cancelled || !res?.lesson) return;
        const loadedSlides =
          Array.isArray(res.slides) && res.slides.length > 0
            ? res.slides
            : [createEmptySlide()];
        setLesson({ ...res.lesson, slides: loadedSlides });
        setActiveSlideIndex(0);
        setHistoryMap({});
        dirtySlideIdsRef.current.clear();
        setSaveStatus("saved");
        setConflictBanner(false);
      })
      .catch(() => {
        if (!cancelled) toast.error("লেসন লোড করা যায়নি।");
      });
    return () => {
      cancelled = true;
    };
  }, [routeLessonId]);

  const userId = userProfile?._id;

  // Check IndexedDB for unsaved offline recovery draft on mount
  useEffect(() => {
    let cancelled = false;
    if (!userId) return undefined;
    getOfflineDraft(userId, routeLessonId || "local_active").then((draft) => {
      if (!cancelled && draft?.lessonSnapshot) {
        setRecoveryDraft(draft);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [userId, routeLessonId]);

  const markDirtyAndPersistDraft = useCallback(
    (nextLesson, changedSlideId = null) => {
      if (changedSlideId) {
        dirtySlideIdsRef.current.add(changedSlideId);
      }
      setSaveStatus(navigator.onLine ? "unsaved" : "offline");
      saveOfflineDraft({
        userId,
        lessonId: nextLesson._id || "local_active",
        lessonSnapshot: nextLesson,
        dirtySlideIds: Array.from(dirtySlideIdsRef.current),
      });
    },
    [userId],
  );

  // Serialized cloud save helper (no parallel full-document overwrites)
  const saveToCloud = useCallback(
    async (lessonOverride = null) => {
      const targetLesson = lessonOverride || lesson;
      if (!navigator.onLine) {
        setSaveStatus("offline");
        return targetLesson._id || null;
      }

      if (savingInFlightRef.current) {
        pendingSaveRequestedRef.current = true;
        return targetLesson._id || null;
      }

      savingInFlightRef.current = true;
      setSaveStatus("saving");
      try {
        let currentLessonId = targetLesson._id;
        let updatedSlides = [...(targetLesson.slides || [])];

        if (!currentLessonId) {
          const created = await smartboardApi.createLesson({
            title: targetLesson.title || "শিরোনামহীন লেসন",
            subjectName: targetLesson.subjectName || "",
            className: targetLesson.className || "",
            slides: updatedSlides.map(normalizeSlidePayloadForSave),
          });
          currentLessonId = created.lesson._id;
          updatedSlides = created.slides || updatedSlides;
          dirtySlideIdsRef.current.clear();

          setLesson((prev) => ({
            ...prev,
            _id: currentLessonId,
            documentVersion: created.lesson.documentVersion,
            slides: updatedSlides,
            lastSavedAt: new Date().toISOString(),
          }));
          await deleteOfflineDraft(userId, "local_active");
          setSaveStatus("saved");
          navigate(`/dashboard/smartboard/${currentLessonId}`, { replace: true });
          return currentLessonId;
        }

        // Update lesson metadata
        await smartboardApi.updateLesson(currentLessonId, {
          title: targetLesson.title,
          slideOrder: updatedSlides.map((s) => s._id).filter(Boolean),
        });

        // Save only dirty slides with optimistic expectedRevision check
        const dirtyIds = Array.from(dirtySlideIdsRef.current);
        for (let i = 0; i < updatedSlides.length; i += 1) {
          const s = updatedSlides[i];
          const sid = s._id || s.localId;
          if (dirtyIds.length > 0 && !dirtyIds.includes(sid)) continue;

          if (!s._id || String(s._id).startsWith("slide_")) {
            const createdSlide = await smartboardApi.createSlide(
              currentLessonId,
              {
                ...normalizeSlidePayloadForSave(s),
                order: i,
              },
            );
            updatedSlides[i] = createdSlide.slide;
            dirtySlideIdsRef.current.delete(sid);
          } else {
            const res = await smartboardApi.saveSlide(currentLessonId, s._id, {
              expectedRevision: s.revision || 1,
              clientMutationId: `${Date.now()}-${i}`,
              ...normalizeSlidePayloadForSave(s),
            });
            updatedSlides[i] = res.slide;
            dirtySlideIdsRef.current.delete(s._id);
          }
        }

        setLesson((prev) => ({
          ...prev,
          slides: updatedSlides,
          lastSavedAt: new Date().toISOString(),
        }));
        await deleteOfflineDraft(userId, currentLessonId);
        setConflictBanner(false);
        setSaveStatus("saved");
        return currentLessonId;
      } catch (err) {
        if (err?.response?.status === 409) {
          setConflictBanner(true);
          setSaveStatus("failed");
          toast.error("অন্য ট্যাব/ডিভাইসে আপডেট হয়েছে — কনফ্লিক্ট কপি সেভ করুন।");
        } else {
          setSaveStatus(navigator.onLine ? "failed" : "offline");
        }
        return null;
      } finally {
        savingInFlightRef.current = false;
        if (pendingSaveRequestedRef.current) {
          pendingSaveRequestedRef.current = false;
        }
      }
    },
    [lesson, navigate, userId],
  );

  // 2.5s debounced auto-save when lesson has cloud ID or explicit edits
  useEffect(() => {
    if (saveStatus !== "unsaved") return undefined;
    const timer = window.setTimeout(() => {
      if (lesson._id) {
        saveToCloud();
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [saveStatus, lesson, saveToCloud]);

  // Commit objects mutation to active slide with Undo history
  const commitObjects = useCallback(
    (nextObjects) => {
      setHistoryMap((h) =>
        pushSlideHistory(h, activeSlideId, activeSlide.objects || []),
      );
      setLesson((prev) => {
        const nextSlides = prev.slides.map((s, idx) =>
          idx === safeSlideIndex
            ? { ...s, objects: nextObjects, updatedAt: new Date().toISOString() }
            : s,
        );
        const updated = { ...prev, slides: nextSlides };
        markDirtyAndPersistDraft(updated, activeSlideId);
        return updated;
      });
    },
    [activeSlideId, activeSlide.objects, safeSlideIndex, markDirtyAndPersistDraft],
  );

  const handleUpdateObject = useCallback(
    (objId, patch) => {
      const currentObjects = activeSlide.objects || [];
      const nextObjects = currentObjects.map((o) =>
        o.id === objId
          ? {
              ...o,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : o,
      );
      commitObjects(nextObjects);
    },
    [activeSlide.objects, commitObjects],
  );

  const handleDeleteObject = useCallback(
    (objId) => {
      const nextObjects = (activeSlide.objects || []).filter((o) => o.id !== objId);
      if (selectedId === objId) setSelectedId(null);
      commitObjects(nextObjects);
    },
    [activeSlide.objects, selectedId, commitObjects],
  );

  const handleUndo = useCallback(() => {
    const res = stepUndoSlideHistory(
      historyMap,
      activeSlideId,
      activeSlide.objects || [],
    );
    if (!res) return;
    setHistoryMap(res.nextHistoryMap);
    setSelectedId(null);
    setLesson((prev) => {
      const nextSlides = prev.slides.map((s, idx) =>
        idx === safeSlideIndex ? { ...s, objects: res.objects } : s,
      );
      const updated = { ...prev, slides: nextSlides };
      markDirtyAndPersistDraft(updated, activeSlideId);
      return updated;
    });
  }, [historyMap, activeSlideId, activeSlide.objects, safeSlideIndex, markDirtyAndPersistDraft]);

  const handleRedo = useCallback(() => {
    const res = stepRedoSlideHistory(
      historyMap,
      activeSlideId,
      activeSlide.objects || [],
    );
    if (!res) return;
    setHistoryMap(res.nextHistoryMap);
    setSelectedId(null);
    setLesson((prev) => {
      const nextSlides = prev.slides.map((s, idx) =>
        idx === safeSlideIndex ? { ...s, objects: res.objects } : s,
      );
      const updated = { ...prev, slides: nextSlides };
      markDirtyAndPersistDraft(updated, activeSlideId);
      return updated;
    });
  }, [historyMap, activeSlideId, activeSlide.objects, safeSlideIndex, markDirtyAndPersistDraft]);

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete, PageUp/PageDown)
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        handleDeleteObject(selectedId);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        setActiveSlideIndex((i) => Math.min(slides.length - 1, i + 1));
      } else if (e.key === "PageUp") {
        e.preventDefault();
        setActiveSlideIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo, handleRedo, selectedId, handleDeleteObject, slides.length]);

  // Clipboard Image Paste (Ctrl+V)
  useEffect(() => {
    const onPaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (!file) continue;
          try {
            let src = URL.createObjectURL(file);
            let assetId = null;
            try {
              const res = await smartboardApi.uploadImageFile(file, lesson._id);
              if (res?.asset?.url) {
                src = res.asset.url;
                assetId = res.asset._id;
              }
            } catch {
              // Keeps local object URL fallback when offline
            }
            const imgObj = createImageObject({ src, assetId });
            commitObjects([...(activeSlide.objects || []), imgObj]);
            toast.success("ছবি বোর্ডে পেস্ট হয়েছে!");
          } catch {
            toast.error("ছবি পেস্ট করা যায়নি।");
          }
          break;
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [lesson._id, activeSlide.objects, commitObjects]);

  // Fullscreen toggle (with fallback notification)
  const handleToggleFullscreen = async () => {
    const el = rootWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        setIsFullscreen((v) => !v);
      }
    } else {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Import Single Question onto active slide
  const handleImportSingleQuestion = (question, setId) => {
    const qObj = createQuestionCardObject({
      question,
      questionSetId: setId,
    });
    commitObjects([...(activeSlide.objects || []), qObj]);
    toast.success("প্রশ্ন স্লাইডে যোগ হয়েছে!");
  };

  // Import Whole QuestionSet as 1 Question per Slide
  const handleImportWholeSet = (set) => {
    const questions = Array.isArray(set?.questions) ? set.questions : [];
    if (questions.length === 0) return;

    const generatedSlides = questions.map((q, idx) => {
      const slide = createEmptySlide({
        backgroundType: activeBgType,
        title: `${set.examName} — প্রশ্ন ${idx + 1}`,
        order: slides.length + idx,
      });
      slide.objects = [
        createQuestionCardObject({
          question: q,
          questionSetId: set._id,
          x: 80,
          y: 44,
          width: 1200,
        }),
      ];
      return slide;
    });

    setLesson((prev) => {
      const nextSlides = [...prev.slides, ...generatedSlides];
      const updated = {
        ...prev,
        title: prev.title === "শিরোনামহীন লেসন" ? set.examName : prev.title,
        linkedQuestionSetId: set._id,
        slides: nextSlides,
      };
      generatedSlides.forEach((s) =>
        dirtySlideIdsRef.current.add(s._id || s.localId),
      );
      markDirtyAndPersistDraft(updated);
      return updated;
    });
    setActiveSlideIndex(slides.length);
    toast.success(`${questions.length}টি প্রশ্ন আলাদা স্লাইডে যুক্ত হয়েছে!`);
  };

  const handleImageFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    let src = URL.createObjectURL(file);
    let assetId = null;
    try {
      const res = await smartboardApi.uploadImageFile(file, lesson._id);
      if (res?.asset?.url) {
        src = res.asset.url;
        assetId = res.asset._id;
      }
    } catch {
      // fallback to local URL
    }
    const imgObj = createImageObject({ src, assetId });
    commitObjects([...(activeSlide.objects || []), imgObj]);
  };

  const handleImportPdfPages = async (renderedPages, fileName) => {
    const newSlides = [];
    for (let i = 0; i < renderedPages.length; i += 1) {
      const p = renderedPages[i];
      const file = new File([p.blob], `${fileName}-p${p.pageNumber}.png`, {
        type: "image/png",
      });
      let src = URL.createObjectURL(p.blob);
      let assetId = null;
      try {
        const uploaded = await smartboardApi.uploadImageFile(file, lesson._id);
        if (uploaded?.asset?.url) {
          src = uploaded.asset.url;
          assetId = uploaded.asset._id;
        }
      } catch {
        // local fallback
      }
      const s = createEmptySlide({
        backgroundType: "WHITEBOARD",
        title: `PDF পৃষ্ঠা ${p.pageNumber}`,
        order: slides.length + i,
      });
      // Fit PDF image centered on 1920x1080 world slide
      const ratio = Math.min(1800 / p.width, 1000 / p.height, 1.5);
      const w = Math.round(p.width * ratio);
      const h = Math.round(p.height * ratio);
      s.objects = [
        createImageObject({
          src,
          assetId,
          x: Math.round((1920 - w) / 2),
          y: Math.round((1080 - h) / 2),
          width: w,
          height: h,
          kind: "PDF_PAGE",
          meta: { pageNumber: p.pageNumber },
        }),
      ];
      newSlides.push(s);
    }

    setLesson((prev) => {
      const updated = { ...prev, slides: [...prev.slides, ...newSlides] };
      newSlides.forEach((s) => dirtySlideIdsRef.current.add(s._id || s.localId));
      markDirtyAndPersistDraft(updated);
      return updated;
    });
    setActiveSlideIndex(slides.length);
    toast.success(`${newSlides.length}টি PDF পৃষ্ঠা স্লাইডে যুক্ত হয়েছে!`);
  };

  const handleBackgroundChange = (bgType) => {
    const tpl = BACKGROUND_TEMPLATES[bgType] || BACKGROUND_TEMPLATES.WHITEBOARD;
    setLesson((prev) => {
      const nextSlides = prev.slides.map((s, idx) =>
        idx === safeSlideIndex
          ? {
              ...s,
              canvas: {
                ...(s.canvas || {}),
                background: { type: tpl.id, color: tpl.color, config: {} },
              },
            }
          : s,
      );
      const updated = { ...prev, slides: nextSlides };
      markDirtyAndPersistDraft(updated, activeSlideId);
      return updated;
    });
    // Auto switch pen color for dark/light readability
    if (tpl.isDark && brushColor === "#0F172A") {
      setBrushColor("#F8FAFC");
    } else if (!tpl.isDark && brushColor === "#F8FAFC") {
      setBrushColor("#0F172A");
    }
  };

  const currentHistory = historyMap[activeSlideId];
  const canUndo = Boolean(currentHistory?.past?.length);
  const canRedo = Boolean(currentHistory?.future?.length);

  return (
    <div
      ref={rootWrapperRef}
      className="relative flex flex-col w-full h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden select-none"
    >
      {/* Hidden image upload input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFilePicked}
      />

      {/* Top Control Bar */}
      <TopControlBar
        lessonTitle={lesson.title}
        onChangeTitle={(val) => {
          setLesson((p) => {
            const updated = { ...p, title: val };
            markDirtyAndPersistDraft(updated);
            return updated;
          });
        }}
        saveStatus={saveStatus}
        activeBackgroundType={activeBgType}
        onChangeBackground={handleBackgroundChange}
        viewportScale={viewport.scale}
        onZoomIn={() =>
          setViewport((v) => ({
            ...v,
            scale: Math.min(4, v.scale * (1 + ZOOM_STEP)),
          }))
        }
        onZoomOut={() =>
          setViewport((v) => ({
            ...v,
            scale: Math.max(0.25, v.scale * (1 - ZOOM_STEP)),
          }))
        }
        onFitView={() =>
          setViewport(
            computeFitViewport(containerSize.width, containerSize.height),
          )
        }
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenQuestionDrawer={() => setQuestionDrawerOpen(true)}
        onOpenLibrary={() => setLibraryOpen(true)}
        onManualSave={() => saveToCloud()}
        onExportPng={async () => {
          setExporting(true);
          try {
            await downloadSlidePng(activeSlide, {
              questionCardNodesMap: questionCardNodesRef.current,
            });
            toast.success("PNG ডাউনলোড হয়েছে!");
          } catch {
            toast.error("PNG এক্সপোর্ট করা যায়নি।");
          } finally {
            setExporting(false);
          }
        }}
        onExportPdf={async () => {
          setExporting(true);
          try {
            await downloadLessonPdf(lesson, {
              questionCardNodesMap: questionCardNodesRef.current,
            });
            toast.success("মাল্টি-পেজ PDF ডাউনলোড হয়েছে!");
          } catch {
            toast.error("PDF এক্সপোর্ট ব্যর্থ হয়েছে।");
          } finally {
            setExporting(false);
          }
        }}
        exporting={exporting}
        onOpenShare={() => setShareOpen(true)}
        onUploadImageClick={() => imageInputRef.current?.click()}
        onUploadPdfClick={() => setPdfModalOpen(true)}
        onOpenEquationModal={() => setEquationOpen(true)}
        stemState={{
          ruler: rulerTool.visible,
          protractor: protractorTool.visible,
        }}
        onToggleStemTool={(tool) => {
          if (tool === "ruler") {
            setRulerTool((p) => ({ ...p, visible: !p.visible }));
          } else if (tool === "protractor") {
            setProtractorTool((p) => ({ ...p, visible: !p.visible }));
          }
        }}
        presentationState={presentationState}
        onTogglePresentationTool={(tool) => {
          setPresentationState((p) => ({ ...p, [tool]: !p[tool] }));
        }}
      />

      {/* Offline Draft Recovery or Version Conflict Banner */}
      {(recoveryDraft || conflictBanner) && (
        <div className="z-30 bg-amber-50 border-b border-amber-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 font-bengali">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600 shrink-0" />
            <span>
              {conflictBanner
                ? "এই লেসনটি অন্য ডিভাইসে পরিবর্তিত হয়েছে। বর্তমান কাজ সংরক্ষণ করতে কপি হিসেবে সেভ করুন।"
                : "আপনার ব্রাউজারে একটি অসংরক্ষিত অফলাইন ড্রাফট পাওয়া গেছে।"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {recoveryDraft && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setLesson(recoveryDraft.lessonSnapshot);
                    setRecoveryDraft(null);
                    setSaveStatus("unsaved");
                    toast.success("অফলাইন ড্রাফট রিকভার হয়েছে!");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold cursor-pointer"
                >
                  <RotateCcw className="size-3" /> পুনরুদ্ধার করুন
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteOfflineDraft(
                      userProfile?._id,
                      routeLessonId || "local_active",
                    );
                    setRecoveryDraft(null);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-amber-300 bg-white text-amber-900 cursor-pointer"
                >
                  বাতিল
                </button>
              </>
            )}
            {conflictBanner && (
              <button
                type="button"
                onClick={() => {
                  const copyLesson = {
                    ...lesson,
                    _id: null,
                    title: `${lesson.title} (রিকভার্ড কপি)`,
                  };
                  setConflictBanner(false);
                  saveToCloud(copyLesson);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-700 text-white font-semibold cursor-pointer"
              >
                কপি হিসেবে সেভ করুন
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Canvas Stage Container */}
      <div ref={workspaceContainerRef} className="relative flex-1 min-h-0">
        <SmartboardCanvas
          slide={activeSlide}
          activeTool={activeTool}
          brushColor={brushColor}
          strokeWidth={strokeWidth}
          penOnly={penOnly}
          viewport={viewport}
          onChangeViewport={setViewport}
          selectedId={selectedId}
          onSelectObject={setSelectedId}
          onCommitObjects={commitObjects}
          onUpdateObject={handleUpdateObject}
          rulerTool={rulerTool}
          containerWidth={containerSize.width}
          containerHeight={containerSize.height}
        />

        {/* Synchronized HTML/KaTeX Question Cards */}
        <QuestionCardOverlay
          objects={activeSlide.objects}
          viewport={viewport}
          activeTool={activeTool}
          onUpdateObject={handleUpdateObject}
          onDeleteObject={handleDeleteObject}
          registerCardNode={registerCardNode}
        />

        {/* Virtual Ruler & Protractor */}
        <StemToolsOverlay
          viewport={viewport}
          rulerTool={rulerTool}
          onChangeRuler={setRulerTool}
          protractorTool={protractorTool}
          onChangeProtractor={setProtractorTool}
        />

        {/* Classroom Presentation Overlays (Laser/Curtain/Spotlight/Timer) */}
        <ClassroomPresentationTools
          presentationState={presentationState}
          onCloseTool={(tool) =>
            setPresentationState((p) => ({ ...p, [tool]: false }))
          }
        />

        {/* Quick Page Navigation Pill (Bottom Right) */}
        <div className="pointer-events-auto absolute bottom-3 right-3 z-20 hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 px-2 py-1 shadow-md text-xs font-bengali">
          <button
            type="button"
            disabled={safeSlideIndex === 0}
            onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="px-1.5 font-semibold text-slate-700">
            {(safeSlideIndex + 1).toLocaleString("bn-BD")} /{" "}
            {slides.length.toLocaleString("bn-BD")}
          </span>
          <button
            type="button"
            disabled={safeSlideIndex >= slides.length - 1}
            onClick={() =>
              setActiveSlideIndex((i) => Math.min(slides.length - 1, i + 1))
            }
            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-35 cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Left Collapsible Multi-Page Slide Deck */}
      <SlideDeckPanel
        open={slidePanelOpen}
        onToggleOpen={() => setSlidePanelOpen((v) => !v)}
        slides={slides}
        activeSlideIndex={safeSlideIndex}
        onSelectSlide={(idx) => {
          setSelectedId(null);
          setActiveSlideIndex(idx);
        }}
        onAddSlide={() => {
          const newSlide = createEmptySlide({
            backgroundType: activeBgType,
            order: slides.length,
          });
          setLesson((prev) => {
            const updated = { ...prev, slides: [...prev.slides, newSlide] };
            markDirtyAndPersistDraft(updated, newSlide._id);
            return updated;
          });
          setActiveSlideIndex(slides.length);
        }}
        onDuplicateSlide={(idx) => {
          const copy = duplicateSlideRecord(slides[idx], slides.length);
          setLesson((prev) => {
            const next = [...prev.slides];
            next.splice(idx + 1, 0, copy);
            const updated = { ...prev, slides: next };
            markDirtyAndPersistDraft(updated, copy._id);
            return updated;
          });
          setActiveSlideIndex(idx + 1);
        }}
        onDeleteSlide={(idx) => {
          if (slides.length <= 1) return;
          const targetSlide = slides[idx];
          setLesson((prev) => {
            const next = prev.slides.filter((_, i) => i !== idx);
            const updated = { ...prev, slides: next };
            markDirtyAndPersistDraft(updated);
            return updated;
          });
          if (lesson._id && targetSlide?._id && !String(targetSlide._id).startsWith("slide_")) {
            smartboardApi.deleteSlide(lesson._id, targetSlide._id).catch(() => {});
          }
          setActiveSlideIndex((i) => Math.max(0, Math.min(i, slides.length - 2)));
        }}
      />

      {/* Bottom Floating Drawing Toolbar */}
      <FloatingToolbar
        activeTool={activeTool}
        onSelectTool={(t) => {
          setActiveTool(t);
          if (t !== BOARD_TOOLS.SELECT) setSelectedId(null);
        }}
        brushColor={brushColor}
        onChangeColor={setBrushColor}
        strokeWidth={strokeWidth}
        onChangeWidth={setStrokeWidth}
        penOnly={penOnly}
        onTogglePenOnly={() => setPenOnly((v) => !v)}
        isDarkBoard={isDarkBoard}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearStrokes={() => {
          const remaining = (activeSlide.objects || []).filter(
            (o) => o.type !== "STROKE",
          );
          commitObjects(remaining);
        }}
        onClearPage={() => {
          commitObjects([]);
          setSelectedId(null);
        }}
      />

      {/* Modals & Drawers */}
      <QuestionImportDrawer
        open={questionDrawerOpen}
        onClose={() => setQuestionDrawerOpen(false)}
        onImportSingleQuestion={handleImportSingleQuestion}
        onImportWholeSet={handleImportWholeSet}
      />

      <EquationModal
        open={equationOpen}
        onClose={() => setEquationOpen(false)}
        onInsertEquation={({ latex, src, width, height }) => {
          const eqObj = createImageObject({
            src,
            width,
            height,
            kind: "EQUATION",
            meta: { latex },
          });
          commitObjects([...(activeSlide.objects || []), eqObj]);
        }}
      />

      <PdfImportModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        onImportPages={handleImportPdfPages}
      />

      <ShareLessonModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        lessonId={lesson._id}
        lessonTitle={lesson.title}
        onEnsureSaved={() => saveToCloud()}
      />

      <SmartboardLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onNewLesson={() => {
          setLesson(createInitialLesson());
          setActiveSlideIndex(0);
          setHistoryMap({});
          dirtySlideIdsRef.current.clear();
          navigate("/dashboard/smartboard", { replace: true });
        }}
        onOpenLesson={(id) => navigate(`/dashboard/smartboard/${id}`)}
        onDuplicateLesson={async (id) => {
          try {
            const res = await smartboardApi.duplicateLesson(id);
            toast.success("লেসন ডুপ্লিকেট হয়েছে!");
            if (res?.lesson?._id) {
              navigate(`/dashboard/smartboard/${res.lesson._id}`);
              setLibraryOpen(false);
            }
          } catch {
            toast.error("ডুপ্লিকেট করা যায়নি।");
          }
        }}
        onDeleteLesson={async (id) => {
          try {
            await smartboardApi.deleteLesson(id);
            toast.success("লেসন ডিলিট হয়েছে।");
            setLibraryOpen(false);
            if (lesson._id === id) {
              setLesson(createInitialLesson());
              navigate("/dashboard/smartboard", { replace: true });
            }
          } catch {
            toast.error("ডিলিট করা যায়নি।");
          }
        }}
      />
    </div>
  );
}
