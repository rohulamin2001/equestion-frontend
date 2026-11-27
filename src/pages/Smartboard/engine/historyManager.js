import { MAX_HISTORY_PER_SLIDE } from "../constants/boardDefaults";

/**
 * Bounded per-slide Undo/Redo snapshot stack for logical object mutations.
 * Since heavy binary assets live in R2 (referenced by assetId/url strings),
 * storing object arrays per logical commit stays fast and bounded.
 */
export function createEmptyHistoryEntry() {
  return {
    past: [],
    future: [],
  };
}

export function pushSlideHistory(historyMap, slideId, previousObjects) {
  const current = historyMap[slideId] || createEmptyHistoryEntry();
  const nextPast = [...current.past, previousObjects].slice(-MAX_HISTORY_PER_SLIDE);
  return {
    ...historyMap,
    [slideId]: {
      past: nextPast,
      future: [],
    },
  };
}

export function stepUndoSlideHistory(historyMap, slideId, currentObjects) {
  const current = historyMap[slideId];
  if (!current || current.past.length === 0) {
    return null;
  }
  const previousObjects = current.past[current.past.length - 1];
  const nextPast = current.past.slice(0, -1);
  const nextFuture = [currentObjects, ...current.future].slice(0, MAX_HISTORY_PER_SLIDE);

  return {
    objects: previousObjects,
    nextHistoryMap: {
      ...historyMap,
      [slideId]: {
        past: nextPast,
        future: nextFuture,
      },
    },
  };
}

export function stepRedoSlideHistory(historyMap, slideId, currentObjects) {
  const current = historyMap[slideId];
  if (!current || current.future.length === 0) {
    return null;
  }
  const nextObjects = current.future[0];
  const nextFuture = current.future.slice(1);
  const nextPast = [...current.past, currentObjects].slice(-MAX_HISTORY_PER_SLIDE);

  return {
    objects: nextObjects,
    nextHistoryMap: {
      ...historyMap,
      [slideId]: {
        past: nextPast,
        future: nextFuture,
      },
    },
  };
}
