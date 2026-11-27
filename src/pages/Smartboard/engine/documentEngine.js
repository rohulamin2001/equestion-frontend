import {
  BACKGROUND_TEMPLATES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../constants/boardDefaults";
import { generateBoardId } from "./objectFactory";

export const DOCUMENT_SCHEMA_VERSION = 1;

export function createEmptySlide({
  backgroundType = "WHITEBOARD",
  title = "",
  order = 0,
  id = null,
} = {}) {
  const tpl =
    BACKGROUND_TEMPLATES[backgroundType] || BACKGROUND_TEMPLATES.WHITEBOARD;
  const now = new Date().toISOString();
  return {
    _id: id || generateBoardId("slide"),
    localId: id || generateBoardId("slide"),
    title,
    order,
    schemaVersion: DOCUMENT_SCHEMA_VERSION,
    revision: 1,
    canvas: {
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      background: {
        type: tpl.id,
        color: tpl.color,
        config: {},
      },
    },
    objects: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createInitialLesson({
  title = "শিরোনামহীন লেসন",
  subjectName = "",
  className = "",
} = {}) {
  const firstSlide = createEmptySlide({ backgroundType: "WHITEBOARD", order: 0 });
  const now = new Date().toISOString();
  return {
    _id: null,
    localId: generateBoardId("lesson"),
    title,
    subjectName,
    className,
    linkedQuestionSetId: null,
    schemaVersion: DOCUMENT_SCHEMA_VERSION,
    documentVersion: 1,
    slides: [firstSlide],
    lastEditedAt: now,
    lastSavedAt: null,
  };
}

export function duplicateSlideRecord(sourceSlide, nextOrder = 0) {
  const clonedObjects = (sourceSlide.objects || []).map((obj) => ({
    ...obj,
    id: generateBoardId(obj.type?.toLowerCase().slice(0, 3) || "obj"),
    payload: obj.payload ? structuredClone(obj.payload) : {},
    style: obj.style ? { ...obj.style } : {},
  }));

  const now = new Date().toISOString();
  const newId = generateBoardId("slide");
  return {
    _id: newId,
    localId: newId,
    title: sourceSlide.title ? `${sourceSlide.title} (কপি)` : "",
    order: nextOrder,
    schemaVersion: DOCUMENT_SCHEMA_VERSION,
    revision: 1,
    canvas: structuredClone(
      sourceSlide.canvas || {
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
        background: { type: "WHITEBOARD", color: "#FFFFFF", config: {} },
      },
    ),
    objects: clonedObjects,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeSlidePayloadForSave(slide) {
  return {
    schemaVersion: slide.schemaVersion || DOCUMENT_SCHEMA_VERSION,
    title: slide.title || "",
    canvas: slide.canvas || {
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      background: { type: "WHITEBOARD", color: "#FFFFFF", config: {} },
    },
    objects: Array.isArray(slide.objects) ? slide.objects : [],
  };
}
