import { getStroke } from "perfect-freehand";
import { BOARD_TOOLS } from "../constants/boardDefaults";

export function generateBoardId(prefix = "obj") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Generates flattened [x1, y1, x2, y2, ...] outline polygon coordinates from stroke points
 * using perfect-freehand for smooth pressure-aware rendering on Konva.
 */
export function buildStrokeOutlinePoints(points, style = {}) {
  if (!Array.isArray(points) || points.length === 0) return [];

  const isFountain = style.brushType === BOARD_TOOLS.FOUNTAIN;
  const isHighlighter = style.brushType === BOARD_TOOLS.HIGHLIGHTER;
  const baseSize = Number(style.strokeWidth) || 4;

  const outline = getStroke(points, {
    size: isHighlighter ? baseSize * 3.5 : baseSize * 1.4,
    thinning: isHighlighter ? 0 : isFountain ? 0.68 : 0.35,
    smoothing: 0.55,
    streamline: 0.45,
    simulatePressure: points.every((p) => p.length < 3 || p[2] === 0.5),
    start: { taper: isFountain ? baseSize * 0.5 : 0, cap: !isHighlighter },
    end: { taper: isFountain ? baseSize * 0.8 : 0, cap: !isHighlighter },
  });

  const flat = [];
  for (let i = 0; i < outline.length; i += 1) {
    flat.push(outline[i][0], outline[i][1]);
  }
  return flat;
}

/**
 * Computes axis-aligned world bounding box for a stroke's points array.
 */
export function computePointsBounds(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const pt of points) {
    const px = pt[0];
    const py = pt[1];
    if (px < minX) minX = px;
    if (py < minY) minY = py;
    if (px > maxX) maxX = px;
    if (py > maxY) maxY = py;
  }
  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

export function createStrokeObject({ points, style }) {
  const now = new Date().toISOString();
  const bounds = computePointsBounds(points);
  return {
    id: generateBoardId("stk"),
    type: "STROKE",
    x: 0,
    y: 0,
    width: bounds.width,
    height: bounds.height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: style.brushType === BOARD_TOOLS.HIGHLIGHTER ? style.opacity ?? 0.35 : 1,
    visible: true,
    locked: false,
    style: {
      brushType: style.brushType || BOARD_TOOLS.PEN,
      color: style.color || "#0F172A",
      strokeWidth: Number(style.strokeWidth) || 4,
      dashed: style.brushType === BOARD_TOOLS.DASHED_PEN,
    },
    payload: {
      points,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function createShapeObject({ shapeType, x, y, width, height, style }) {
  const now = new Date().toISOString();
  return {
    id: generateBoardId("shp"),
    type: "SHAPE",
    x,
    y,
    width,
    height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    style: {
      color: style.color || "#0F172A",
      fill: style.fill || "transparent",
      strokeWidth: Number(style.strokeWidth) || 3,
      dashed: Boolean(style.dashed),
    },
    payload: {
      shapeType,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function createTextObject({ x, y, text = "", style = {} }) {
  const now = new Date().toISOString();
  return {
    id: generateBoardId("txt"),
    type: "TEXT",
    x,
    y,
    width: style.width || 360,
    height: style.height || 64,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    style: {
      color: style.color || "#0F172A",
      fontSize: Number(style.fontSize) || 28,
      fontFamily: "Hind Siliguri, Noto Sans Bengali, sans-serif",
      align: style.align || "left",
      fontStyle: style.fontStyle || "normal",
    },
    payload: {
      text,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function createImageObject({
  assetId = null,
  src,
  x = 160,
  y = 120,
  width = 480,
  height = 360,
  kind = "IMAGE",
  meta = {},
}) {
  const now = new Date().toISOString();
  return {
    id: generateBoardId(kind === "EQUATION" ? "eqn" : "img"),
    type: kind,
    x,
    y,
    width,
    height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    style: {},
    payload: {
      assetId,
      src,
      ...meta,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function createQuestionCardObject({
  question,
  questionSetId = null,
  x = 80,
  y = 48,
  width = 1120,
  height = 280,
}) {
  const now = new Date().toISOString();
  // Normalize immutable snapshot from backend Question / QuestionSet entry
  const snapshot = {
    questionText: question.questionText || question.stem || question.question || "",
    stimulus: question.passageStem || question.stimulus || "",
    options: Array.isArray(question.options) ? [...question.options] : [],
    correctAnswer:
      question.correctAnswer ??
      question.answer ??
      (typeof question.correctOptionIndex === "number"
        ? question.options?.[question.correctOptionIndex]
        : ""),
    explanation: question.explanation || question.solution || "",
    questionType: question.category || question.questionType || "MCQ",
    subQuestions: Array.isArray(question.subQuestions)
      ? question.subQuestions.map((sq) => ({ ...sq }))
      : [],
    imageUrl: question.imageUrl || question.questionImage || "",
  };

  return {
    id: generateBoardId("qcard"),
    type: "QUESTION_CARD",
    x,
    y,
    width,
    height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    visible: true,
    locked: false,
    style: {
      fontScale: 1,
      cardOpacity: 0.96,
    },
    payload: {
      sourceQuestionId: question._id || question.id || null,
      sourceQuestionSetId: questionSetId,
      snapshot,
      reveal: {
        answerVisible: false,
        explanationVisible: false,
      },
    },
    createdAt: now,
    updatedAt: now,
  };
}
