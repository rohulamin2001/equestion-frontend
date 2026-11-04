import { useId } from "react";

export default function ClassSchoolBagSvg({
  text = "\u09E7\u09E8",
  className = "",
  ...props
}) {
  const rawId = useId();
  const idPrefix = `chsc-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}-`;

  const strText = String(text || "\u09E7\u09E8");
  // Adjust font size based on text length so longer labels like "৯-১০" fit perfectly
  const fontSize = strText.length > 3 ? 36 : strText.length > 2 ? 42 : 58;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 230"
      width="100%"
      height="100%"
      className={className}
      {...props}
    >
      <defs>
        <radialGradient id={`${idPrefix}topGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2979FF" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#2979FF" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${idPrefix}handle`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
        <linearGradient id={`${idPrefix}pocket`} x1={0} y1={0} x2={1} y2={0}>
          <stop offset="0%" stopColor="#1976D2" />
          <stop offset="40%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
        <linearGradient id={`${idPrefix}outer`} x1={0.2} y1={0} x2={0.8} y2={1}>
          <stop offset="0%" stopColor="#448AFF" />
          <stop offset="35%" stopColor="#1565C0" />
          <stop offset="100%" stopColor="#0A2472" />
        </linearGradient>
        <radialGradient id={`${idPrefix}inner`} cx="42%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#82B1FF" />
          <stop offset="30%" stopColor="#448AFF" />
          <stop offset="75%" stopColor="#2979FF" />
          <stop offset="100%" stopColor="#1565C0" />
        </radialGradient>
        <filter
          id={`${idPrefix}shadow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx={0}
            dy={7}
            stdDeviation={5}
            floodColor="#061642"
            floodOpacity={0.4}
          />
        </filter>
        <filter
          id={`${idPrefix}crease`}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feDropShadow
            dx={0}
            dy={3}
            stdDeviation={3}
            floodColor="#061642"
            floodOpacity={0.5}
          />
        </filter>
      </defs>
      <ellipse
        cx={100}
        cy={24}
        rx={28}
        ry={12}
        fill={`url(#${idPrefix}topGlow)`}
      />
      <path
        d="M 82 38 C 82 12, 118 12, 118 38"
        fill="none"
        stroke={`url(#${idPrefix}handle)`}
        strokeWidth={12}
        strokeLinecap="round"
      />
      <rect
        x={6}
        y={138}
        width={22}
        height={60}
        rx={11}
        fill={`url(#${idPrefix}pocket)`}
        filter={`url(#${idPrefix}shadow)`}
      />
      <rect
        x={172}
        y={138}
        width={22}
        height={60}
        rx={11}
        fill={`url(#${idPrefix}pocket)`}
        filter={`url(#${idPrefix}shadow)`}
      />
      <path
        d="M 38 52 C 46 34, 70 30, 100 30 C 130 30, 154 34, 162 52 C 172 74, 176 150, 172 190 C 170 206, 154 214, 134 214 L 66 214 C 46 214, 30 206, 28 190 C 24 150, 28 74, 38 52 Z"
        fill={`url(#${idPrefix}outer)`}
        filter={`url(#${idPrefix}shadow)`}
      />
      <path
        d="M 48 64 C 54 48, 76 45, 100 45 C 124 45, 146 48, 152 64 C 160 84, 163 148, 160 182 C 158 196, 145 203, 128 203 L 72 203 C 55 203, 42 196, 40 182 C 37 148, 40 84, 48 64 Z"
        fill={`url(#${idPrefix}inner)`}
        filter={`url(#${idPrefix}crease)`}
      />
      <text
        x={100}
        y={132}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Hind Siliguri', 'SolaimanLipi', system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight={900}
        fill="#FFFFFF"
        style={{
          filter: "drop-shadow(0 3px 4px rgba(6, 22, 66, 0.5))",
        }}
      >
        {strText}
      </text>
    </svg>
  );
}

