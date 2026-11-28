import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import Konva from "konva";
import {
  BACKGROUND_TEMPLATES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../constants/boardDefaults";
import { buildStrokeOutlinePoints } from "../engine/objectFactory";

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawSlideBackgroundToLayer(layer, background) {
  const type = background?.type || "WHITEBOARD";
  const tpl = BACKGROUND_TEMPLATES[type] || BACKGROUND_TEMPLATES.WHITEBOARD;
  const color = background?.color || tpl.color;

  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      fill: color,
    }),
  );

  if (type === "RULED") {
    for (let y = 96; y < WORLD_HEIGHT - 32; y += 54) {
      layer.add(
        new Konva.Line({
          points: [48, y, WORLD_WIDTH - 48, y],
          stroke: "#CBD5E1",
          strokeWidth: 1.5,
        }),
      );
    }
    layer.add(
      new Konva.Line({
        points: [132, 0, 132, WORLD_HEIGHT],
        stroke: "#FCA5A5",
        strokeWidth: 2,
      }),
    );
  } else if (type === "XY_GRID") {
    for (let x = 0; x <= WORLD_WIDTH; x += 32) {
      layer.add(
        new Konva.Line({
          points: [x, 0, x, WORLD_HEIGHT],
          stroke: x % 160 === 0 ? "#CBD5E1" : "#E2E8F0",
          strokeWidth: x % 160 === 0 ? 1.6 : 1,
        }),
      );
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += 32) {
      layer.add(
        new Konva.Line({
          points: [0, y, WORLD_WIDTH, y],
          stroke: y % 160 === 0 ? "#CBD5E1" : "#E2E8F0",
          strokeWidth: y % 160 === 0 ? 1.6 : 1,
        }),
      );
    }
  } else if (type === "DOT_GRID") {
    for (let x = 40; x < WORLD_WIDTH; x += 40) {
      for (let y = 40; y < WORLD_HEIGHT; y += 40) {
        layer.add(
          new Konva.Rect({
            x: x - 1.5,
            y: y - 1.5,
            width: 3,
            height: 3,
            fill: "#94A3B8",
          }),
        );
      }
    }
  }
}

async function renderSlideObjectsToLayer(layer, objects = []) {
  for (const obj of objects) {
    if (!obj || obj.visible === false) continue;

    if (obj.type === "STROKE") {
      const pts = obj.payload?.points || [];
      if (obj.style?.dashed) {
        const flat = pts.flatMap((p) => [p[0], p[1]]);
        layer.add(
          new Konva.Line({
            points: flat,
            stroke: obj.style.color || "#0F172A",
            strokeWidth: obj.style.strokeWidth || 4,
            dash: [14, 10],
            lineCap: "round",
            lineJoin: "round",
            opacity: obj.opacity ?? 1,
          }),
        );
      } else {
        const outline = buildStrokeOutlinePoints(pts, obj.style);
        layer.add(
          new Konva.Line({
            points: outline,
            fill: obj.style?.color || "#0F172A",
            closed: true,
            opacity: obj.opacity ?? 1,
          }),
        );
      }
    } else if (obj.type === "SHAPE") {
      const sub = obj.payload?.shapeType;
      const stroke = obj.style?.color || "#0F172A";
      const fill = obj.style?.fill || "transparent";
      const sw = obj.style?.strokeWidth || 3;
      const dash = obj.style?.dashed ? [12, 8] : undefined;

      if (sub === "rect") {
        layer.add(
          new Konva.Rect({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            rotation: obj.rotation || 0,
            stroke,
            fill,
            strokeWidth: sw,
            dash,
          }),
        );
      } else if (sub === "ellipse") {
        layer.add(
          new Konva.Ellipse({
            x: obj.x + obj.width / 2,
            y: obj.y + obj.height / 2,
            radiusX: Math.abs(obj.width) / 2,
            radiusY: Math.abs(obj.height) / 2,
            rotation: obj.rotation || 0,
            stroke,
            fill,
            strokeWidth: sw,
            dash,
          }),
        );
      } else if (sub === "line") {
        layer.add(
          new Konva.Line({
            x: obj.x,
            y: obj.y,
            points: [0, 0, obj.width, obj.height],
            rotation: obj.rotation || 0,
            stroke,
            strokeWidth: sw,
            dash,
            lineCap: "round",
          }),
        );
      } else if (sub === "arrow") {
        layer.add(
          new Konva.Arrow({
            x: obj.x,
            y: obj.y,
            points: [0, 0, obj.width, obj.height],
            rotation: obj.rotation || 0,
            stroke,
            fill: stroke,
            strokeWidth: sw,
            pointerLength: 16,
            pointerWidth: 14,
          }),
        );
      } else if (sub === "right_triangle") {
        layer.add(
          new Konva.Line({
            x: obj.x,
            y: obj.y,
            points: [0, 0, 0, obj.height, obj.width, obj.height],
            closed: true,
            rotation: obj.rotation || 0,
            stroke,
            fill,
            strokeWidth: sw,
          }),
        );
      } else if (sub === "equilateral_triangle") {
        layer.add(
          new Konva.Line({
            x: obj.x,
            y: obj.y,
            points: [obj.width / 2, 0, 0, obj.height, obj.width, obj.height],
            closed: true,
            rotation: obj.rotation || 0,
            stroke,
            fill,
            strokeWidth: sw,
          }),
        );
      } else if (sub === "xy_axis") {
        const cx = obj.width / 2;
        const cy = obj.height / 2;
        layer.add(
          new Konva.Arrow({
            x: obj.x,
            y: obj.y,
            points: [0, cy, obj.width, cy],
            stroke,
            fill: stroke,
            strokeWidth: sw,
            pointerLength: 12,
            pointerWidth: 10,
          }),
        );
        layer.add(
          new Konva.Arrow({
            x: obj.x,
            y: obj.y,
            points: [cx, obj.height, cx, 0],
            stroke,
            fill: stroke,
            strokeWidth: sw,
            pointerLength: 12,
            pointerWidth: 10,
          }),
        );
      }
    } else if (obj.type === "TEXT") {
      layer.add(
        new Konva.Text({
          x: obj.x,
          y: obj.y,
          width: obj.width,
          rotation: obj.rotation || 0,
          text: obj.payload?.text || "",
          fontSize: obj.style?.fontSize || 28,
          fontFamily: obj.style?.fontFamily || "Hind Siliguri, sans-serif",
          fill: obj.style?.color || "#0F172A",
          align: obj.style?.align || "left",
        }),
      );
    } else if (
      (obj.type === "IMAGE" || obj.type === "PDF_PAGE" || obj.type === "EQUATION") &&
      obj.payload?.src
    ) {
      try {
        const img = await loadImageElement(obj.payload.src);
        layer.add(
          new Konva.Image({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            rotation: obj.rotation || 0,
            opacity: obj.opacity ?? 1,
            image: img,
          }),
        );
      } catch {
        // Fallback placeholder rectangle if CORS or asset load fails
        layer.add(
          new Konva.Rect({
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            stroke: "#94A3B8",
            dash: [6, 6],
            fill: "rgba(241,245,249,0.7)",
          }),
        );
      }
    }
  }
}

/**
 * Deterministic single-slide composite PNG generator:
 * 1. Waits for web fonts (`document.fonts.ready`).
 * 2. Renders Konva background + objects on an off-screen 1920x1080 Stage.
 * 3. Composites any visible Question Card DOM nodes captured via html-to-image.
 * 4. Cleans up off-screen stage memory immediately.
 */
export async function renderSlideToDataUrl(
  slide,
  { pixelRatio = 1.5, questionCardNodesMap = null } = {},
) {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-99999px";
  host.style.top = "-99999px";
  host.style.width = `${WORLD_WIDTH}px`;
  host.style.height = `${WORLD_HEIGHT}px`;
  document.body.appendChild(host);

  const stage = new Konva.Stage({
    container: host,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
  });

  try {
    const bgLayer = new Konva.Layer();
    drawSlideBackgroundToLayer(bgLayer, slide.canvas?.background);
    stage.add(bgLayer);

    // Composite Question Card DOM snapshots underneath strokes (or in object order)
    const contentLayer = new Konva.Layer();
    const questionCards = (slide.objects || []).filter(
      (o) => o.type === "QUESTION_CARD" && o.visible !== false,
    );

    if (questionCardNodesMap && questionCards.length > 0) {
      for (const qObj of questionCards) {
        const domEl = questionCardNodesMap.get(qObj.id);
        if (!domEl) continue;
        try {
          const cardPng = await toPng(domEl, {
            pixelRatio: 2,
            cacheBust: true,
          });
          const cardImg = await loadImageElement(cardPng);
          contentLayer.add(
            new Konva.Image({
              x: qObj.x,
              y: qObj.y,
              width: qObj.width,
              height: domEl.offsetHeight || qObj.height,
              image: cardImg,
            }),
          );
        } catch {
          // Graceful fallback text box if DOM snapshot hits tainted/foreignObject edge case
          contentLayer.add(
            new Konva.Rect({
              x: qObj.x,
              y: qObj.y,
              width: qObj.width,
              height: qObj.height,
              fill: "#FFFFFF",
              stroke: "#CBD5E1",
              cornerRadius: 12,
            }),
          );
        }
      }
    }

    await renderSlideObjectsToLayer(
      contentLayer,
      (slide.objects || []).filter((o) => o.type !== "QUESTION_CARD"),
    );
    stage.add(contentLayer);
    stage.draw();

    return stage.toDataURL({
      mimeType: "image/png",
      pixelRatio,
    });
  } finally {
    stage.destroy();
    if (host.parentNode) {
      host.parentNode.removeChild(host);
    }
  }
}

export async function downloadSlidePng(slide, options = {}) {
  const dataUrl = await renderSlideToDataUrl(slide, {
    pixelRatio: 2,
    ...options,
  });
  const link = document.createElement("a");
  link.download = `${(slide.title || "smartboard-slide").replace(/[^a-zA-Z0-9\u0980-\u09FF_-]/g, "_")}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Exports all slides sequentially (one slide rendered & freed at a time)
 * into a 16:9 multi-page landscape PDF without memory spikes.
 * Uses `resolveCardNodesForSlide` when provided so inactive slides render their
 * Question Cards offscreen before capture.
 */
export async function downloadLessonPdf(
  lesson,
  {
    questionCardNodesMap = null,
    resolveCardNodesForSlide = null,
    onProgress = null,
  } = {},
) {
  const slides = Array.isArray(lesson?.slides) ? lesson.slides : [];
  if (slides.length === 0) {
    throw new Error("এক্সপোর্ট করার জন্য কোনো স্লাইড নেই।");
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [WORLD_WIDTH, WORLD_HEIGHT],
    compress: true,
  });

  for (let i = 0; i < slides.length; i += 1) {
    if (onProgress) {
      onProgress(i + 1, slides.length);
    }
    const slideCardsMap = resolveCardNodesForSlide
      ? await resolveCardNodesForSlide(slides[i])
      : questionCardNodesMap;

    const dataUrl = await renderSlideToDataUrl(slides[i], {
      pixelRatio: 1.5,
      questionCardNodesMap: slideCardsMap,
    });
    if (i > 0) {
      pdf.addPage([WORLD_WIDTH, WORLD_HEIGHT], "landscape");
    }
    pdf.addImage(dataUrl, "PNG", 0, 0, WORLD_WIDTH, WORLD_HEIGHT, undefined, "FAST");
  }

  const safeName = (lesson.title || "smartboard-lesson")
    .trim()
    .replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, "_");
  pdf.save(`${safeName || "smartboard-lesson"}.pdf`);
}
