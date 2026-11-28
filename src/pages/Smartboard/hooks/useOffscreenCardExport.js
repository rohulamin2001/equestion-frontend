import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Coordinates offscreen DOM mounting of QUESTION_CARD objects for inactive slides
 * during sequential multi-slide PDF export.
 */
export function useOffscreenCardExport({
  activeSlideId = null,
  activeCardNodesRef = null,
} = {}) {
  const [exportRenderSlide, setExportRenderSlide] = useState(null);
  const offscreenCardNodesRef = useRef(new Map());
  const exportResolveRef = useRef(null);

  const registerOffscreenCardNode = useCallback((id, el) => {
    if (el) {
      offscreenCardNodesRef.current.set(id, el);
    } else {
      offscreenCardNodesRef.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (!exportRenderSlide) return undefined;
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (exportResolveRef.current) {
          const resolve = exportResolveRef.current;
          exportResolveRef.current = null;
          resolve(new Map(offscreenCardNodesRef.current));
        }
      });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [exportRenderSlide]);

  const resolveCardNodesForSlide = useCallback(
    async (targetSlide) => {
      const targetId = targetSlide?._id || targetSlide?.localId;
      if (activeSlideId && targetId === activeSlideId && activeCardNodesRef) {
        return activeCardNodesRef.current;
      }

      const hasCards = (targetSlide?.objects || []).some(
        (o) => o.type === "QUESTION_CARD" && o.visible !== false,
      );
      if (!hasCards) return null;

      return new Promise((resolve) => {
        exportResolveRef.current = resolve;
        setExportRenderSlide(targetSlide);
      });
    },
    [activeSlideId, activeCardNodesRef],
  );

  const resetExportRender = useCallback(() => {
    setExportRenderSlide(null);
  }, []);

  return {
    exportRenderSlide,
    registerOffscreenCardNode,
    resolveCardNodesForSlide,
    resetExportRender,
  };
}
