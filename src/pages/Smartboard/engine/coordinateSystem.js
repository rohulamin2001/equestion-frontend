import { MAX_ZOOM, MIN_ZOOM, WORLD_HEIGHT, WORLD_WIDTH } from "../constants/boardDefaults";

/**
 * Clamps viewport zoom within supported bounds (25% - 400%).
 */
export function clampZoom(scale) {
  if (!Number.isFinite(scale)) return 1;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

/**
 * Converts a screen-space coordinate (relative to Stage container) to World coordinates.
 */
export function screenToWorld(screenPoint, viewport) {
  const scale = viewport?.scale || 1;
  const x = ((screenPoint?.x || 0) - (viewport?.x || 0)) / scale;
  const y = ((screenPoint?.y || 0) - (viewport?.y || 0)) / scale;
  return { x, y };
}

/**
 * Converts a World coordinate to screen-space pixels inside the container.
 */
export function worldToScreen(worldPoint, viewport) {
  const scale = viewport?.scale || 1;
  return {
    x: (worldPoint?.x || 0) * scale + (viewport?.x || 0),
    y: (worldPoint?.y || 0) * scale + (viewport?.y || 0),
  };
}

/**
 * Computes a new viewport anchored at a screen-space pointer location when zooming.
 */
export function zoomAroundPoint(viewport, nextScaleRaw, anchorScreenPoint) {
  const oldScale = viewport?.scale || 1;
  const nextScale = clampZoom(nextScaleRaw);
  const worldAnchor = screenToWorld(anchorScreenPoint, viewport);

  return {
    scale: nextScale,
    x: anchorScreenPoint.x - worldAnchor.x * nextScale,
    y: anchorScreenPoint.y - worldAnchor.y * nextScale,
    previousScale: oldScale,
  };
}

/**
 * Fits the 1920x1080 world slide centered inside the given container dimensions.
 */
export function computeFitViewport(containerWidth, containerHeight, padding = 24) {
  const safeW = Math.max(200, containerWidth || 800);
  const safeH = Math.max(200, containerHeight || 600);
  const availW = Math.max(100, safeW - padding * 2);
  const availH = Math.max(100, safeH - padding * 2);

  const scale = clampZoom(Math.min(availW / WORLD_WIDTH, availH / WORLD_HEIGHT));
  const x = (safeW - WORLD_WIDTH * scale) / 2;
  const y = (safeH - WORLD_HEIGHT * scale) / 2;
  return { x, y, scale };
}

/**
 * Projects a world point onto a rotated ruler segment if within zoom-independent world snap distance.
 */
export function snapPointToRuler(worldPoint, ruler, viewportScale = 1) {
  if (!ruler || !ruler.visible || !ruler.snapEnabled) {
    return worldPoint;
  }

  const rad = ((ruler.rotation || 0) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Ruler top edge runs from (ruler.x, ruler.y) along angle `rad` for `ruler.length`
  const dx = worldPoint.x - ruler.x;
  const dy = worldPoint.y - ruler.y;

  // Local coordinates along ruler axis (u) and perpendicular (v)
  const u = dx * cos + dy * sin;
  const v = -dx * sin + dy * cos;

  const snapToleranceWorld = 24 / Math.max(0.25, viewportScale);
  const length = ruler.length || 560;

  // Snap to top edge (v = 0) or bottom edge (v = height) when cursor is along ruler span
  if (u >= -20 && u <= length + 20) {
    if (Math.abs(v) <= snapToleranceWorld) {
      return {
        x: ruler.x + u * cos,
        y: ruler.y + u * sin,
      };
    }
    const bottomV = ruler.height || 86;
    if (Math.abs(v - bottomV) <= snapToleranceWorld) {
      return {
        x: ruler.x + u * cos - bottomV * sin,
        y: ruler.y + u * sin + bottomV * cos,
      };
    }
  }

  return worldPoint;
}
