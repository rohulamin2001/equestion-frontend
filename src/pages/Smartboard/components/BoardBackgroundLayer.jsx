import { Line, Layer, Rect, Shape } from "react-konva";
import {
  BACKGROUND_TEMPLATES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../constants/boardDefaults";

/**
 * Renders the static 1920x1080 world slide background on a non-listening Konva layer.
 */
export default function BoardBackgroundLayer({ background }) {
  const type = background?.type || "WHITEBOARD";
  const tpl = BACKGROUND_TEMPLATES[type] || BACKGROUND_TEMPLATES.WHITEBOARD;
  const bgColor = background?.color || tpl.color;

  return (
    <Layer listening={false}>
      {/* Slide paper / board surface */}
      <Rect
        x={0}
        y={0}
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
        fill={bgColor}
        shadowColor="rgba(15, 23, 42, 0.14)"
        shadowBlur={24}
        shadowOffset={{ x: 0, y: 8 }}
        perfectDrawEnabled={false}
      />

      {type === "RULED" && (
        <Shape
          perfectDrawEnabled={false}
          listening={false}
          sceneFunc={(ctx) => {
            ctx.beginPath();
            ctx.strokeStyle = "#CBD5E1";
            ctx.lineWidth = 1.5;
            for (let y = 96; y < WORLD_HEIGHT - 32; y += 54) {
              ctx.moveTo(48, y);
              ctx.lineTo(WORLD_WIDTH - 48, y);
            }
            ctx.stroke();

            // Left red margin line
            ctx.beginPath();
            ctx.strokeStyle = "#FCA5A5";
            ctx.lineWidth = 2;
            ctx.moveTo(132, 0);
            ctx.lineTo(132, WORLD_HEIGHT);
            ctx.stroke();
          }}
        />
      )}

      {type === "XY_GRID" && (
        <Shape
          perfectDrawEnabled={false}
          listening={false}
          sceneFunc={(ctx) => {
            const minor = 32;
            const major = 160;

            // Minor grid
            ctx.beginPath();
            ctx.strokeStyle = "#E2E8F0";
            ctx.lineWidth = 1;
            for (let x = 0; x <= WORLD_WIDTH; x += minor) {
              ctx.moveTo(x, 0);
              ctx.lineTo(x, WORLD_HEIGHT);
            }
            for (let y = 0; y <= WORLD_HEIGHT; y += minor) {
              ctx.moveTo(0, y);
              ctx.lineTo(WORLD_WIDTH, y);
            }
            ctx.stroke();

            // Major grid
            ctx.beginPath();
            ctx.strokeStyle = "#CBD5E1";
            ctx.lineWidth = 1.6;
            for (let x = 0; x <= WORLD_WIDTH; x += major) {
              ctx.moveTo(x, 0);
              ctx.lineTo(x, WORLD_HEIGHT);
            }
            for (let y = 0; y <= WORLD_HEIGHT; y += major) {
              ctx.moveTo(0, y);
              ctx.lineTo(WORLD_WIDTH, y);
            }
            ctx.stroke();
          }}
        />
      )}

      {type === "DOT_GRID" && (
        <Shape
          perfectDrawEnabled={false}
          listening={false}
          sceneFunc={(ctx) => {
            ctx.fillStyle = "#94A3B8";
            const gap = 40;
            for (let x = gap; x < WORLD_WIDTH; x += gap) {
              for (let y = gap; y < WORLD_HEIGHT; y += gap) {
                ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
              }
            }
          }}
        />
      )}

      {/* Subtle frame border */}
      <Line
        points={[0, 0, WORLD_WIDTH, 0, WORLD_WIDTH, WORLD_HEIGHT, 0, WORLD_HEIGHT]}
        closed
        stroke={tpl.isDark ? "rgba(255,255,255,0.12)" : "#CBD5E1"}
        strokeWidth={2}
        listening={false}
        perfectDrawEnabled={false}
      />
    </Layer>
  );
}
