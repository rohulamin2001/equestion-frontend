export const WORLD_WIDTH = 1920;
export const WORLD_HEIGHT = 1080;

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4.0;
export const ZOOM_STEP = 0.15;

export const MAX_HISTORY_PER_SLIDE = 50;

export const BOARD_TOOLS = {
  SELECT: "select",
  HAND: "hand",
  PEN: "pen",
  FOUNTAIN: "fountain",
  HIGHLIGHTER: "highlighter",
  DASHED_PEN: "dashed_pen",
  ERASER: "eraser",
  TEXT: "text",
  LINE: "line",
  ARROW: "arrow",
  RECT: "rect",
  ELLIPSE: "ellipse",
  RIGHT_TRIANGLE: "right_triangle",
  EQUILATERAL_TRIANGLE: "equilateral_triangle",
  XY_AXIS: "xy_axis",
  LASER: "laser",
};

export const SHAPE_TOOLS = [
  { id: BOARD_TOOLS.LINE, label: "সরলরেখা" },
  { id: BOARD_TOOLS.ARROW, label: "তীর চিহ্ন" },
  { id: BOARD_TOOLS.RECT, label: "আয়তক্ষেত্র" },
  { id: BOARD_TOOLS.ELLIPSE, label: "বৃত্ত / উপবৃত্ত" },
  { id: BOARD_TOOLS.RIGHT_TRIANGLE, label: "সমকোণী ত্রিভুজ" },
  { id: BOARD_TOOLS.EQUILATERAL_TRIANGLE, label: "সমবাহু ত্রিভুজ" },
  { id: BOARD_TOOLS.XY_AXIS, label: "X-Y অক্ষ" },
];

export const BACKGROUND_TEMPLATES = {
  WHITEBOARD: {
    id: "WHITEBOARD",
    label: "হোয়াইটবোর্ড",
    color: "#FFFFFF",
    isDark: false,
    gridColor: "#E2E8F0",
  },
  BLACKBOARD: {
    id: "BLACKBOARD",
    label: "ব্ল্যাকবোর্ড",
    color: "#141E1B",
    isDark: true,
    gridColor: "#263832",
  },
  GREENBOARD: {
    id: "GREENBOARD",
    label: "গ্রিনবোর্ড",
    color: "#133A27",
    isDark: true,
    gridColor: "#1F573C",
  },
  RULED: {
    id: "RULED",
    label: "রুলড খাতা",
    color: "#FFFDF7",
    isDark: false,
    gridColor: "#CBD5E1",
  },
  XY_GRID: {
    id: "XY_GRID",
    label: "গ্রাফ পেপার",
    color: "#FFFFFF",
    isDark: false,
    gridColor: "#CBD5E1",
  },
  DOT_GRID: {
    id: "DOT_GRID",
    label: "ডট গ্রিড",
    color: "#F8FAFC",
    isDark: false,
    gridColor: "#94A3B8",
  },
};

export const LIGHT_PEN_COLORS = [
  "#0F172A",
  "#4F46E5",
  "#DC2626",
  "#059669",
  "#D97706",
  "#9333EA",
  "#0284C7",
];

export const DARK_PEN_COLORS = [
  "#F8FAFC",
  "#FDE047",
  "#38BDF8",
  "#4ADE80",
  "#FB7185",
  "#C084FC",
  "#FDBA74",
];

export const HIGHLIGHTER_COLORS = [
  "#FDE047",
  "#86EFAC",
  "#93C5FD",
  "#F9A8D4",
  "#FDBA74",
];

export const STROKE_WIDTHS = [2, 4, 7, 12];
