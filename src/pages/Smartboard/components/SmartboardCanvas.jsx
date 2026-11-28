import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Arrow,
  Ellipse,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import { BOARD_TOOLS, ZOOM_STEP } from "../constants/boardDefaults";
import {
  screenToWorld,
  snapPointToRuler,
  worldToScreen,
  zoomAroundPoint,
} from "../engine/coordinateSystem";
import {
  buildStrokeOutlinePoints,
  createShapeObject,
  createStrokeObject,
  createTextObject,
} from "../engine/objectFactory";
import BoardBackgroundLayer from "./BoardBackgroundLayer";

function BoardImageNode({
  obj,
  isSelectable,
  listening = true,
  overrideOpacity,
  onSelect,
  onDragMove,
  onTransform,
  onTransformEnd,
}) {
  const [imgEl, setImgEl] = useState(null);
  const src = obj.payload?.src || "";

  useEffect(() => {
    if (!src) return undefined;
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cancelled) setImgEl(img);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!imgEl) {
    return (
      <Rect
        id={listening ? obj.id : undefined}
        x={obj.x}
        y={obj.y}
        width={obj.width}
        height={obj.height}
        opacity={overrideOpacity ?? 1}
        listening={listening}
        stroke="#94A3B8"
        dash={[6, 6]}
        fill="rgba(241,245,249,0.5)"
      />
    );
  }

  return (
    <KonvaImage
      id={listening ? obj.id : undefined}
      image={imgEl}
      x={obj.x}
      y={obj.y}
      width={obj.width}
      height={obj.height}
      rotation={obj.rotation || 0}
      opacity={overrideOpacity ?? obj.opacity ?? 1}
      listening={listening}
      draggable={listening && isSelectable && !obj.locked}
      onClick={
        listening
          ? (e) => {
              if (!isSelectable) return;
              e.cancelBubble = true;
              onSelect(obj.id);
            }
          : undefined
      }
      onTap={
        listening
          ? (e) => {
              if (!isSelectable) return;
              e.cancelBubble = true;
              onSelect(obj.id);
            }
          : undefined
      }
      onDragMove={
        listening && onDragMove
          ? (e) => {
              onDragMove(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }
          : undefined
      }
      onDragEnd={
        listening
          ? (e) => {
              onTransformEnd(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }
          : undefined
      }
      onTransform={
        listening && onTransform
          ? (e) => {
              const node = e.target;
              onTransform(obj.id, {
                x: node.x(),
                y: node.y(),
                width: Math.max(24, node.width() * node.scaleX()),
                height: Math.max(24, node.height() * node.scaleY()),
                rotation: node.rotation(),
              });
            }
          : undefined
      }
      onTransformEnd={
        listening
          ? (e) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();
              node.scaleX(1);
              node.scaleY(1);
              onTransformEnd(obj.id, {
                x: node.x(),
                y: node.y(),
                width: Math.max(24, node.width() * scaleX),
                height: Math.max(24, node.height() * scaleY),
                rotation: node.rotation(),
              });
            }
          : undefined
      }
    />
  );
}

function renderShapeNode(obj, commonProps) {
  const sub = obj.payload?.shapeType;
  const stroke = obj.style?.color || "#0F172A";
  const fill = obj.style?.fill || "transparent";
  const sw = obj.style?.strokeWidth || 3;
  const dash = obj.style?.dashed ? [12, 8] : undefined;

  if (sub === "rect") {
    return (
      <Rect
        {...commonProps}
        width={Math.abs(obj.width)}
        height={Math.abs(obj.height)}
        x={obj.width < 0 ? obj.x + obj.width : obj.x}
        y={obj.height < 0 ? obj.y + obj.height : obj.y}
        stroke={stroke}
        fill={fill}
        strokeWidth={sw}
        dash={dash}
      />
    );
  }

  if (sub === "ellipse") {
    const absW = Math.max(2, Math.abs(obj.width));
    const absH = Math.max(2, Math.abs(obj.height));
    const bx = obj.width < 0 ? obj.x + obj.width : obj.x;
    const by = obj.height < 0 ? obj.y + obj.height : obj.y;
    return (
      <Ellipse
        {...commonProps}
        x={bx + absW / 2}
        y={by + absH / 2}
        radiusX={absW / 2}
        radiusY={absH / 2}
        stroke={stroke}
        fill={fill}
        strokeWidth={sw}
        dash={dash}
      />
    );
  }

  if (sub === "line") {
    return (
      <Line
        {...commonProps}
        points={[0, 0, obj.width, obj.height]}
        stroke={stroke}
        strokeWidth={sw}
        dash={dash}
        lineCap="round"
        hitStrokeWidth={20}
      />
    );
  }

  if (sub === "arrow") {
    return (
      <Arrow
        {...commonProps}
        points={[0, 0, obj.width, obj.height]}
        stroke={stroke}
        fill={stroke}
        strokeWidth={sw}
        pointerLength={16}
        pointerWidth={14}
        hitStrokeWidth={20}
      />
    );
  }

  if (sub === "right_triangle") {
    return (
      <Line
        {...commonProps}
        points={[0, 0, 0, obj.height, obj.width, obj.height]}
        closed
        stroke={stroke}
        fill={fill}
        strokeWidth={sw}
      />
    );
  }

  if (sub === "equilateral_triangle") {
    return (
      <Line
        {...commonProps}
        points={[obj.width / 2, 0, 0, obj.height, obj.width, obj.height]}
        closed
        stroke={stroke}
        fill={fill}
        strokeWidth={sw}
      />
    );
  }

  if (sub === "xy_axis") {
    const cx = obj.width / 2;
    const cy = obj.height / 2;
    return (
      <Group {...commonProps}>
        <Arrow
          points={[0, cy, obj.width, cy]}
          stroke={stroke}
          fill={stroke}
          strokeWidth={sw}
          pointerLength={12}
          pointerWidth={10}
        />
        <Arrow
          points={[cx, obj.height, cx, 0]}
          stroke={stroke}
          fill={stroke}
          strokeWidth={sw}
          pointerLength={12}
          pointerWidth={10}
        />
      </Group>
    );
  }

  return null;
}

function isPointNearStroke(worldPt, strokeObj, radius) {
  const pts = strokeObj.payload?.points;
  if (!Array.isArray(pts) || pts.length === 0) return false;
  const r2 = radius * radius;
  for (let i = 0; i < pts.length; i += 1) {
    const dx = worldPt.x - pts[i][0];
    const dy = worldPt.y - pts[i][1];
    if (dx * dx + dy * dy <= r2) {
      return true;
    }
  }
  return false;
}

function extractShapePatch(obj, node, includeDimensions) {
  const sub = obj.payload?.shapeType;
  const sx = includeDimensions ? node.scaleX() : 1;
  const sy = includeDimensions ? node.scaleY() : 1;
  const nextWidth = includeDimensions ? obj.width * sx : obj.width;
  const nextHeight = includeDimensions ? obj.height * sy : obj.height;

  let nextX = node.x();
  let nextY = node.y();
  if (sub === "ellipse") {
    nextX = node.x() - nextWidth / 2;
    nextY = node.y() - nextHeight / 2;
  } else if (sub === "rect") {
    if (nextWidth < 0) nextX -= nextWidth;
    if (nextHeight < 0) nextY -= nextHeight;
  }

  const patch = { x: nextX, y: nextY };
  if (includeDimensions) {
    patch.width = nextWidth;
    patch.height = nextHeight;
    patch.rotation = node.rotation();
  }
  return patch;
}

function getSelectionBounds(obj) {
  if (!obj) return null;
  if (obj.type === "TEXT") {
    const textStr = obj.payload?.text || "";
    const lines = textStr.split("\n");
    const fontSize = obj.style?.fontSize || 28;
    const maxCols = lines.reduce((max, line) => Math.max(max, line.length), 1);
    const estWidth = obj.width || Math.max(80, maxCols * fontSize * 0.58);
    const estHeight = Math.max(fontSize * 1.4, lines.length * fontSize * 1.35);
    return {
      x: obj.x,
      y: obj.y,
      width: estWidth,
      height: estHeight,
      rotation: obj.rotation || 0,
    };
  }

  const rawW = obj.width || 120;
  const rawH = obj.height || 40;
  return {
    x: rawW < 0 ? obj.x + rawW : obj.x,
    y: rawH < 0 ? obj.y + rawH : obj.y,
    width: Math.max(16, Math.abs(rawW)),
    height: Math.max(16, Math.abs(rawH)),
    rotation: obj.rotation || 0,
  };
}

export default function SmartboardCanvas({
  slide,
  activeTool,
  brushColor,
  strokeWidth,
  penOnly,
  viewport,
  onChangeViewport,
  selectedId,
  onSelectObject,
  onCommitObjects,
  onUpdateObject,
  rulerTool,
  containerWidth,
  containerHeight,
  children,
}) {
  const stageRef = useRef(null);
  const contentLayerRef = useRef(null);
  const liveLayerRef = useRef(null);
  const liveStrokeRef = useRef(null);
  const liveDashedRef = useRef(null);
  const transformerRef = useRef(null);

  const isDrawingRef = useRef(false);
  const activePointsRef = useRef([]);
  const shapeStartRef = useRef(null);
  const isPanningRef = useRef(false);
  const panOriginRef = useRef(null);
  const erasedIdsRef = useRef(new Set());
  const spacePressedRef = useRef(false);

  // Laser trail points stored out of React state for zero-overhead 60fps animation
  const laserPointsRef = useRef([]);
  const laserLineRef = useRef(null);
  const laserRafRef = useRef(null);

  const [liveShapePreview, setLiveShapePreview] = useState(null);
  const [transientEdit, setTransientEdit] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const isComposingRef = useRef(false);

  const isSelectMode = activeTool === BOARD_TOOLS.SELECT;
  const isHandMode = activeTool === BOARD_TOOLS.HAND;

  // Track Spacebar for temporary Hand pan
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && !editingText) {
        const tag = document.activeElement?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          spacePressedRef.current = true;
        }
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") {
        spacePressedRef.current = false;
        isPanningRef.current = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [editingText]);

  // Attach Konva Transformer to selected non-stroke node
  useEffect(() => {
    const tr = transformerRef.current;
    const layer = contentLayerRef.current;
    if (!tr || !layer) return;

    if (!selectedId || !isSelectMode) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const node = layer.findOne(`#${selectedId}`);
    if (node) {
      tr.nodes([node]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, isSelectMode, slide.objects]);

  // Laser animation loop (fades out within 1.2 seconds)
  const startLaserLoop = useCallback(() => {
    if (laserRafRef.current) return;
    const tick = () => {
      const now = Date.now();
      laserPointsRef.current = laserPointsRef.current.filter(
        (p) => now - p.t < 1100,
      );
      const line = laserLineRef.current;
      if (line) {
        const flat = [];
        for (const p of laserPointsRef.current) {
          flat.push(p.x, p.y);
        }
        line.points(flat);
        line.visible(flat.length >= 4);
        liveLayerRef.current?.batchDraw();
      }
      if (laserPointsRef.current.length > 0) {
        laserRafRef.current = window.requestAnimationFrame(tick);
      } else {
        laserRafRef.current = null;
      }
    };
    laserRafRef.current = window.requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (laserRafRef.current) {
        window.cancelAnimationFrame(laserRafRef.current);
      }
    };
  }, []);

  const strokeObjects = useMemo(
    () => (slide.objects || []).filter((o) => o.type === "STROKE" && o.visible !== false),
    [slide.objects],
  );

  const baseMediaObjects = useMemo(
    () =>
      (slide.objects || []).filter(
        (o) =>
          (o.type === "IMAGE" || o.type === "PDF_PAGE") &&
          o.visible !== false,
      ),
    [slide.objects],
  );

  const topAnnotationObjects = useMemo(
    () =>
      (slide.objects || []).filter(
        (o) =>
          (o.type === "SHAPE" ||
            o.type === "TEXT" ||
            o.type === "EQUATION") &&
          o.visible !== false,
      ),
    [slide.objects],
  );

  const commitTopObjectUpdate = useCallback(
    (objectId, patch) => {
      setTransientEdit(null);
      onUpdateObject(objectId, patch);
    },
    [onUpdateObject],
  );

  const selectedTopBounds = useMemo(() => {
    if (!isSelectMode || !selectedId) return null;
    const found = topAnnotationObjects.find((o) => o.id === selectedId);
    if (!found) return null;
    const effective =
      transientEdit?.id === found.id ? { ...found, ...transientEdit } : found;
    return getSelectionBounds(effective);
  }, [isSelectMode, selectedId, topAnnotationObjects, transientEdit]);

  const renderAnnotationNode = (obj, { interactive }) => {
    const renderedObj =
      !interactive && transientEdit?.id === obj.id
        ? { ...obj, ...transientEdit }
        : obj;

    if (obj.type === "EQUATION") {
      return (
        <BoardImageNode
          key={obj.id}
          obj={renderedObj}
          isSelectable={interactive && isSelectMode}
          listening={interactive}
          overrideOpacity={interactive ? 0.001 : undefined}
          onSelect={onSelectObject}
          onDragMove={
            interactive
              ? (id, patch) => setTransientEdit({ id, ...patch })
              : undefined
          }
          onTransform={
            interactive
              ? (id, patch) => setTransientEdit({ id, ...patch })
              : undefined
          }
          onTransformEnd={interactive ? commitTopObjectUpdate : undefined}
        />
      );
    }

    if (obj.type === "SHAPE") {
      const proxyProps = interactive
        ? {
            id: obj.id,
            opacity: 0.001,
            draggable: isSelectMode && !obj.locked,
            onClick: (ev) => {
              if (!isSelectMode) return;
              ev.cancelBubble = true;
              onSelectObject(obj.id);
            },
            onTap: (ev) => {
              if (!isSelectMode) return;
              ev.cancelBubble = true;
              onSelectObject(obj.id);
            },
            onDragMove: (ev) => {
              setTransientEdit({
                id: obj.id,
                ...extractShapePatch(obj, ev.target, false),
              });
            },
            onDragEnd: (ev) => {
              commitTopObjectUpdate(
                obj.id,
                extractShapePatch(obj, ev.target, false),
              );
            },
            onTransform: (ev) => {
              setTransientEdit({
                id: obj.id,
                ...extractShapePatch(obj, ev.target, true),
              });
            },
            onTransformEnd: (ev) => {
              const node = ev.target;
              const patch = extractShapePatch(obj, node, true);
              node.scaleX(1);
              node.scaleY(1);
              commitTopObjectUpdate(obj.id, patch);
            },
          }
        : {
            opacity: renderedObj.opacity ?? 1,
            listening: false,
          };

      return renderShapeNode(renderedObj, {
        key: obj.id,
        x: renderedObj.x,
        y: renderedObj.y,
        rotation: renderedObj.rotation || 0,
        ...proxyProps,
      });
    }

    if (obj.type === "TEXT") {
      const extractTextPatch = (node, includeDimensions) => {
        const sx = includeDimensions ? node.scaleX() : 1;
        const sy = includeDimensions ? node.scaleY() : 1;
        return {
          x: node.x(),
          y: node.y(),
          ...(includeDimensions ? { rotation: node.rotation() } : {}),
          ...(includeDimensions && Math.abs(sx - 1) > 0.01
            ? { width: Math.max(40, node.width() * sx) }
            : {}),
          ...(includeDimensions && Math.abs(sy - 1) > 0.01
            ? {
                style: {
                  ...obj.style,
                  fontSize: Math.max(
                    12,
                    Math.round((obj.style?.fontSize || 28) * sy),
                  ),
                },
              }
            : {}),
        };
      };

      return (
        <Text
          key={obj.id}
          id={interactive ? obj.id : undefined}
          x={renderedObj.x}
          y={renderedObj.y}
          width={renderedObj.width}
          rotation={renderedObj.rotation || 0}
          text={renderedObj.payload?.text || ""}
          fontSize={renderedObj.style?.fontSize || 28}
          fontFamily={
            renderedObj.style?.fontFamily || "Hind Siliguri, sans-serif"
          }
          fill={renderedObj.style?.color || "#0F172A"}
          align={renderedObj.style?.align || "left"}
          opacity={interactive ? 0.001 : renderedObj.opacity ?? 1}
          listening={interactive}
          perfectDrawEnabled={false}
          draggable={interactive && isSelectMode && !obj.locked}
          onClick={
            interactive
              ? (ev) => {
                  if (!isSelectMode) return;
                  ev.cancelBubble = true;
                  onSelectObject(obj.id);
                }
              : undefined
          }
          onTap={
            interactive
              ? (ev) => {
                  if (!isSelectMode) return;
                  ev.cancelBubble = true;
                  onSelectObject(obj.id);
                }
              : undefined
          }
          onDblClick={
            interactive
              ? (ev) => {
                  ev.cancelBubble = true;
                  setEditingText({
                    isNew: false,
                    object: obj,
                    value: obj.payload?.text || "",
                  });
                }
              : undefined
          }
          onDragMove={
            interactive
              ? (ev) => {
                  setTransientEdit({
                    id: obj.id,
                    ...extractTextPatch(ev.target, false),
                  });
                }
              : undefined
          }
          onDragEnd={
            interactive
              ? (ev) => {
                  commitTopObjectUpdate(
                    obj.id,
                    extractTextPatch(ev.target, false),
                  );
                }
              : undefined
          }
          onTransform={
            interactive
              ? (ev) => {
                  setTransientEdit({
                    id: obj.id,
                    ...extractTextPatch(ev.target, true),
                  });
                }
              : undefined
          }
          onTransformEnd={
            interactive
              ? (ev) => {
                  const node = ev.target;
                  const patch = extractTextPatch(node, true);
                  node.scaleX(1);
                  node.scaleY(1);
                  commitTopObjectUpdate(obj.id, patch);
                }
              : undefined
          }
        />
      );
    }

    return null;
  };

  const strokeOutlines = useMemo(() => {
    const map = new Map();
    for (const s of strokeObjects) {
      if (!s.style?.dashed) {
        map.set(s.id, buildStrokeOutlinePoints(s.payload?.points || [], s.style));
      }
    }
    return map;
  }, [strokeObjects]);

  const getPointerScreenPos = (evt) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const rect = stage.container().getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    const evt = e.evt;
    // Palm Rejection: when stylus-only mode is enabled, ignore finger touches
    if (penOnly && evt.pointerType === "touch") {
      return;
    }

    const screenPt = getPointerScreenPos(evt);
    const rawWorldPt = screenToWorld(screenPt, viewport);

    // Middle mouse, Hand tool, or Spacebar+Drag starts viewport panning
    if (isHandMode || spacePressedRef.current || evt.button === 1) {
      isPanningRef.current = true;
      panOriginRef.current = {
        screenX: screenPt.x,
        screenY: screenPt.y,
        viewX: viewport.x,
        viewY: viewport.y,
      };
      return;
    }

    if (isSelectMode) {
      // Clicking empty canvas clears selection
      if (e.target === e.target.getStage()) {
        onSelectObject(null);
      }
      return;
    }

    if (activeTool === BOARD_TOOLS.TEXT) {
      const existing = createTextObject({
        x: rawWorldPt.x,
        y: rawWorldPt.y,
        text: "",
        style: { color: brushColor, fontSize: Math.max(20, strokeWidth * 5) },
      });
      setEditingText({
        isNew: true,
        object: existing,
        value: "",
      });
      return;
    }

    if (activeTool === BOARD_TOOLS.LASER) {
      isDrawingRef.current = true;
      laserPointsRef.current.push({ x: rawWorldPt.x, y: rawWorldPt.y, t: Date.now() });
      startLaserLoop();
      return;
    }

    if (activeTool === BOARD_TOOLS.ERASER) {
      isDrawingRef.current = true;
      erasedIdsRef.current = new Set();
      const radius = 20 / Math.max(0.3, viewport.scale);
      for (const s of strokeObjects) {
        if (!s.locked && isPointNearStroke(rawWorldPt, s, radius)) {
          erasedIdsRef.current.add(s.id);
        }
      }
      return;
    }

    const isPenLike =
      activeTool === BOARD_TOOLS.PEN ||
      activeTool === BOARD_TOOLS.FOUNTAIN ||
      activeTool === BOARD_TOOLS.HIGHLIGHTER ||
      activeTool === BOARD_TOOLS.DASHED_PEN;

    if (isPenLike) {
      const snappedPt = snapPointToRuler(rawWorldPt, rulerTool, viewport.scale);
      const pressure = evt.pressure && evt.pressure > 0 ? evt.pressure : 0.5;
      isDrawingRef.current = true;
      activePointsRef.current = [[snappedPt.x, snappedPt.y, pressure]];

      if (activeTool === BOARD_TOOLS.DASHED_PEN && liveDashedRef.current) {
        liveDashedRef.current.points([snappedPt.x, snappedPt.y]);
        liveDashedRef.current.stroke(brushColor);
        liveDashedRef.current.strokeWidth(strokeWidth);
        liveDashedRef.current.visible(true);
      } else if (liveStrokeRef.current) {
        const outline = buildStrokeOutlinePoints(activePointsRef.current, {
          brushType: activeTool,
          strokeWidth,
        });
        liveStrokeRef.current.points(outline);
        liveStrokeRef.current.fill(brushColor);
        liveStrokeRef.current.opacity(
          activeTool === BOARD_TOOLS.HIGHLIGHTER ? 0.35 : 1,
        );
        liveStrokeRef.current.visible(true);
      }
      liveLayerRef.current?.batchDraw();
      return;
    }

    // Shape drawing start
    isDrawingRef.current = true;
    shapeStartRef.current = rawWorldPt;
    setLiveShapePreview(
      createShapeObject({
        shapeType: activeTool,
        x: rawWorldPt.x,
        y: rawWorldPt.y,
        width: 1,
        height: 1,
        style: { color: brushColor, strokeWidth },
      }),
    );
  };

  const handlePointerMove = (e) => {
    const evt = e.evt;
    if (penOnly && evt.pointerType === "touch") return;

    const screenPt = getPointerScreenPos(evt);

    if (isPanningRef.current && panOriginRef.current) {
      const dx = screenPt.x - panOriginRef.current.screenX;
      const dy = screenPt.y - panOriginRef.current.screenY;
      onChangeViewport({
        ...viewport,
        x: panOriginRef.current.viewX + dx,
        y: panOriginRef.current.viewY + dy,
      });
      return;
    }

    if (!isDrawingRef.current) return;

    const rawWorldPt = screenToWorld(screenPt, viewport);

    if (activeTool === BOARD_TOOLS.LASER) {
      laserPointsRef.current.push({ x: rawWorldPt.x, y: rawWorldPt.y, t: Date.now() });
      startLaserLoop();
      return;
    }

    if (activeTool === BOARD_TOOLS.ERASER) {
      const radius = 20 / Math.max(0.3, viewport.scale);
      let changed = false;
      for (const s of strokeObjects) {
        if (!s.locked && !erasedIdsRef.current.has(s.id)) {
          if (isPointNearStroke(rawWorldPt, s, radius)) {
            erasedIdsRef.current.add(s.id);
            changed = true;
          }
        }
      }
      if (changed) {
        // Immediate visual feedback by removing erased strokes at commit
        const ids = erasedIdsRef.current;
        onCommitObjects((slide.objects || []).filter((o) => !ids.has(o.id)));
      }
      return;
    }

    const isPenLike =
      activeTool === BOARD_TOOLS.PEN ||
      activeTool === BOARD_TOOLS.FOUNTAIN ||
      activeTool === BOARD_TOOLS.HIGHLIGHTER ||
      activeTool === BOARD_TOOLS.DASHED_PEN;

    if (isPenLike) {
      const snappedPt = snapPointToRuler(rawWorldPt, rulerTool, viewport.scale);
      const pts = activePointsRef.current;
      const last = pts[pts.length - 1];
      if (last) {
        const dx = snappedPt.x - last[0];
        const dy = snappedPt.y - last[1];
        if (dx * dx + dy * dy < 2.2) return;
      }
      const pressure = evt.pressure && evt.pressure > 0 ? evt.pressure : 0.5;
      pts.push([snappedPt.x, snappedPt.y, pressure]);

      if (activeTool === BOARD_TOOLS.DASHED_PEN && liveDashedRef.current) {
        liveDashedRef.current.points(pts.flatMap((p) => [p[0], p[1]]));
      } else if (liveStrokeRef.current) {
        liveStrokeRef.current.points(
          buildStrokeOutlinePoints(pts, {
            brushType: activeTool,
            strokeWidth,
          }),
        );
      }
      liveLayerRef.current?.batchDraw();
      return;
    }

    if (shapeStartRef.current && liveShapePreview) {
      setLiveShapePreview((prev) =>
        prev
          ? {
              ...prev,
              width: rawWorldPt.x - shapeStartRef.current.x,
              height: rawWorldPt.y - shapeStartRef.current.y,
            }
          : null,
      );
    }
  };

  const handlePointerUp = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      panOriginRef.current = null;
      return;
    }

    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (activeTool === BOARD_TOOLS.LASER || activeTool === BOARD_TOOLS.ERASER) {
      erasedIdsRef.current.clear();
      return;
    }

    const isPenLike =
      activeTool === BOARD_TOOLS.PEN ||
      activeTool === BOARD_TOOLS.FOUNTAIN ||
      activeTool === BOARD_TOOLS.HIGHLIGHTER ||
      activeTool === BOARD_TOOLS.DASHED_PEN;

    if (isPenLike) {
      if (liveStrokeRef.current) {
        liveStrokeRef.current.visible(false);
        liveStrokeRef.current.points([]);
      }
      if (liveDashedRef.current) {
        liveDashedRef.current.visible(false);
        liveDashedRef.current.points([]);
      }
      liveLayerRef.current?.batchDraw();

      const pts = activePointsRef.current;
      activePointsRef.current = [];
      if (pts.length >= 1) {
        const newStroke = createStrokeObject({
          points: pts,
          style: {
            brushType: activeTool,
            color: brushColor,
            strokeWidth,
          },
        });
        onCommitObjects([...(slide.objects || []), newStroke]);
      }
      return;
    }

    if (liveShapePreview) {
      const finalized = { ...liveShapePreview };
      setLiveShapePreview(null);
      shapeStartRef.current = null;
      if (Math.abs(finalized.width) > 4 || Math.abs(finalized.height) > 4) {
        onCommitObjects([...(slide.objects || []), finalized]);
      }
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const screenPt = getPointerScreenPos(e.evt);
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const nextScale = viewport.scale * (1 + direction * ZOOM_STEP);
    const updated = zoomAroundPoint(viewport, nextScale, screenPt);
    onChangeViewport({
      x: updated.x,
      y: updated.y,
      scale: updated.scale,
    });
  };

  const commitInlineText = () => {
    if (!editingText) return;
    const trimmed = editingText.value.trim();
    if (trimmed) {
      if (editingText.isNew) {
        const newTextObj = {
          ...editingText.object,
          payload: { ...editingText.object.payload, text: trimmed },
        };
        onCommitObjects([...(slide.objects || []), newTextObj]);
      } else {
        onUpdateObject(editingText.object.id, {
          payload: { ...editingText.object.payload, text: trimmed },
        });
      }
    }
    setEditingText(null);
  };

  const editScreenPos = editingText
    ? worldToScreen(
        { x: editingText.object.x, y: editingText.object.y },
        viewport,
      )
    : null;

  const cursorClass = isHandMode
    ? "cursor-grab active:cursor-grabbing"
    : isSelectMode
      ? "cursor-default"
      : activeTool === BOARD_TOOLS.TEXT
        ? "cursor-text"
        : "cursor-crosshair";

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${cursorClass}`}
      style={{ touchAction: "none" }}
    >
      <div className="relative z-0 w-full h-full">
        <Stage
          ref={stageRef}
          width={containerWidth}
          height={containerHeight}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <BoardBackgroundLayer background={slide.canvas?.background} />

          {/* Base Stage Layer: Background Media & Hit Proxies for Top-Tier Annotations */}
          <Layer ref={contentLayerRef}>
            {baseMediaObjects.map((obj) => (
              <BoardImageNode
                key={obj.id}
                obj={obj}
                isSelectable={isSelectMode}
                onSelect={onSelectObject}
                onTransformEnd={onUpdateObject}
              />
            ))}

            {topAnnotationObjects.map((obj) =>
              renderAnnotationNode(obj, { interactive: true }),
            )}

            <Transformer
              ref={transformerRef}
              rotateEnabled
              keepRatio={false}
              borderStroke="#6366F1"
              anchorStroke="#4F46E5"
              anchorFill="#FFFFFF"
              anchorSize={9}
            />
          </Layer>
        </Stage>
      </div>

      {/* Middle Layer (z-10): Interactive Question Card DOM Overlay */}
      {children}

      {/* Top Annotation Tier (z-20, non-interactive): Ink, Highlights, Shapes, Text, Equations & Live Previews */}
      <div
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <Stage
          width={containerWidth}
          height={containerHeight}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          listening={false}
        >
          <Layer listening={false}>
            {topAnnotationObjects.map((obj) =>
              renderAnnotationNode(obj, { interactive: false }),
            )}

            {strokeObjects.map((stk) => {
              if (stk.style?.dashed) {
                return (
                  <Line
                    key={stk.id}
                    points={(stk.payload?.points || []).flatMap((p) => [p[0], p[1]])}
                    stroke={stk.style?.color || "#0F172A"}
                    strokeWidth={stk.style?.strokeWidth || 4}
                    dash={[14, 10]}
                    lineCap="round"
                    lineJoin="round"
                    opacity={stk.opacity ?? 1}
                    listening={false}
                    perfectDrawEnabled={false}
                  />
                );
              }

              return (
                <Line
                  key={stk.id}
                  points={strokeOutlines.get(stk.id) || []}
                  fill={stk.style?.color || "#0F172A"}
                  closed
                  opacity={stk.opacity ?? 1}
                  listening={false}
                  perfectDrawEnabled={false}
                />
              );
            })}

            {selectedTopBounds && (
              <Rect
                x={selectedTopBounds.x - 4}
                y={selectedTopBounds.y - 4}
                width={selectedTopBounds.width + 8}
                height={selectedTopBounds.height + 8}
                rotation={selectedTopBounds.rotation}
                stroke="#6366F1"
                strokeWidth={1.5 / Math.max(0.5, viewport.scale)}
                dash={[6, 4]}
                listening={false}
                perfectDrawEnabled={false}
              />
            )}
          </Layer>

          {/* Ephemeral Live Stroke, Shape Preview & Laser Overlay Layer */}
          <Layer ref={liveLayerRef} listening={false}>
            <Line
              ref={liveStrokeRef}
              points={[]}
              fill={brushColor}
              closed
              visible={false}
              listening={false}
              perfectDrawEnabled={false}
            />
            <Line
              ref={liveDashedRef}
              points={[]}
              stroke={brushColor}
              strokeWidth={strokeWidth}
              dash={[14, 10]}
              lineCap="round"
              lineJoin="round"
              visible={false}
              listening={false}
              perfectDrawEnabled={false}
            />
            {liveShapePreview &&
              renderShapeNode(liveShapePreview, {
                key: "live-shape-preview",
                x: liveShapePreview.x,
                y: liveShapePreview.y,
                listening: false,
              })}
            <Line
              ref={laserLineRef}
              points={[]}
              stroke="#EF4444"
              strokeWidth={6 / Math.max(0.5, viewport.scale)}
              shadowColor="#EF4444"
              shadowBlur={14}
              lineCap="round"
              lineJoin="round"
              visible={false}
              listening={false}
              perfectDrawEnabled={false}
            />
          </Layer>
        </Stage>
      </div>

      {/* Bangla-IME-Safe Inline Text Editor Overlay */}
      {editingText && editScreenPos && (
        <textarea
          autoFocus
          value={editingText.value}
          onChange={(e) =>
            setEditingText((prev) => (prev ? { ...prev, value: e.target.value } : null))
          }
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          onBlur={commitInlineText}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditingText(null);
            } else if (
              e.key === "Enter" &&
              (e.ctrlKey || e.metaKey) &&
              !isComposingRef.current
            ) {
              commitInlineText();
            }
          }}
          placeholder="এখানে বাংলা বা ইংরেজিতে লিখুন..."
          style={{
            left: `${Math.max(12, editScreenPos.x)}px`,
            top: `${Math.max(12, editScreenPos.y)}px`,
            fontSize: `${(editingText.object.style?.fontSize || 28) * viewport.scale}px`,
            color: editingText.object.style?.color || "#0F172A",
            minWidth: "240px",
            maxWidth: "480px",
          }}
          className="absolute z-40 rounded-xl border-2 border-indigo-500 bg-white/95 px-3 py-2 shadow-lg outline-none font-bengali resize"
        />
      )}
    </div>
  );
}
