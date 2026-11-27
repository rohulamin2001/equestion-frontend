import { Pause, Play, RotateCcw, Timer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.75);
  } catch {
    // Autoplay audio restriction ignored gracefully
  }
}

export default function ClassroomPresentationTools({
  presentationState,
  onCloseTool,
}) {
  // Screen Curtain state (% of viewport covered from bottom)
  const [curtainHeightPct, setCurtainHeightPct] = useState(55);
  const curtainDragRef = useRef(false);

  // Spotlight center position (% of container)
  const [spotPos, setSpotPos] = useState({ x: 50, y: 45, radius: 145 });

  // Classroom Timer (uses absolute end timestamp so tab backgrounding never drifts)
  const [timerDurationSec, setTimerDurationSec] = useState(300);
  const [remainingSec, setRemainingSec] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const endTimestampRef = useRef(null);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const interval = window.setInterval(() => {
      if (!endTimestampRef.current) return;
      const diffSec = Math.max(
        0,
        Math.ceil((endTimestampRef.current - Date.now()) / 1000),
      );
      setRemainingSec(diffSec);
      if (diffSec === 0) {
        setTimerRunning(false);
        endTimestampRef.current = null;
        playChime();
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  // Escape exits active spotlight or curtain
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (presentationState.spotlight) onCloseTool("spotlight");
        if (presentationState.curtain) onCloseTool("curtain");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [presentationState.spotlight, presentationState.curtain, onCloseTool]);

  const startTimer = () => {
    const baseSec = remainingSec > 0 ? remainingSec : timerDurationSec;
    endTimestampRef.current = Date.now() + baseSec * 1000;
    setRemainingSec(baseSec);
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    if (endTimestampRef.current) {
      setRemainingSec(
        Math.max(0, Math.ceil((endTimestampRef.current - Date.now()) / 1000)),
      );
    }
    endTimestampRef.current = null;
    setTimerRunning(false);
  };

  const selectPreset = (mins) => {
    const sec = mins * 60;
    endTimestampRef.current = null;
    setTimerRunning(false);
    setTimerDurationSec(sec);
    setRemainingSec(sec);
  };

  const mm = String(Math.floor(remainingSec / 60)).padStart(2, "0");
  const ss = String(remainingSec % 60).padStart(2, "0");

  return (
    <>
      {/* Screen Curtain Overlay */}
      {presentationState.curtain && (
        <div
          onPointerMove={(e) => {
            if (!curtainDragRef.current) return;
            const rect = e.currentTarget.parentElement.getBoundingClientRect();
            const pct = Math.min(
              92,
              Math.max(10, ((rect.bottom - e.clientY) / rect.height) * 100),
            );
            setCurtainHeightPct(pct);
          }}
          onPointerUp={() => {
            curtainDragRef.current = false;
          }}
          style={{ height: `${curtainHeightPct}%` }}
          className="absolute bottom-0 inset-x-0 z-20 bg-slate-900/95 border-t-4 border-purple-500 flex flex-col items-center justify-start shadow-2xl font-bengali"
        >
          <div
            onPointerDown={() => {
              curtainDragRef.current = true;
            }}
            className="w-full py-2 px-4 bg-slate-800/90 flex items-center justify-between cursor-ns-resize select-none"
          >
            <span className="text-xs text-slate-300">
              পর্দা শেড — উপরে/নিচে টেনে উত্তর প্রকাশ করুন
            </span>
            <button
              type="button"
              onClick={() => onCloseTool("curtain")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-rose-500 text-white text-xs cursor-pointer"
            >
              <X className="size-3.5" />
              <span>বন্ধ করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Spotlight Overlay */}
      {presentationState.spotlight && (
        <div
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setSpotPos((p) => ({ ...p, x, y }));
          }}
          style={{
            background: `radial-gradient(circle ${spotPos.radius}px at ${spotPos.x}% ${spotPos.y}%, transparent 0%, rgba(15, 23, 42, 0.82) 100%)`,
          }}
          className="absolute inset-0 z-20 pointer-events-auto cursor-none"
        >
          <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto cursor-default font-bengali">
            <button
              type="button"
              onClick={() =>
                setSpotPos((p) => ({
                  ...p,
                  radius: p.radius === 145 ? 230 : 145,
                }))
              }
              className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-800 text-xs font-semibold shadow cursor-pointer"
            >
              ফোকাস সাইজ বদলান
            </button>
            <button
              type="button"
              onClick={() => onCloseTool("spotlight")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow cursor-pointer"
            >
              <X className="size-3.5" />
              <span>স্পটলাইট বন্ধ</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Classroom Timer Widget */}
      {presentationState.timer && (
        <div className="absolute top-3 right-3 z-30 w-64 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl p-3.5 space-y-2.5 font-bengali">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Timer className="size-4 text-purple-600" />
              <span>ক্লাসরুম টাইমার</span>
            </span>
            <button
              type="button"
              onClick={() => onCloseTool("timer")}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div
            className={`text-center font-sans text-3xl font-extrabold tracking-wider py-2 rounded-xl border ${
              remainingSec === 0
                ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                : "bg-slate-50 text-slate-900 border-slate-200"
            }`}
          >
            {mm}:{ss}
          </div>

          <div className="flex items-center justify-center gap-1">
            {[1, 2, 5, 10].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => selectPreset(m)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-[11px] font-semibold cursor-pointer"
              >
                {m.toLocaleString("bn-BD")}মি
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {timerRunning ? (
              <button
                type="button"
                onClick={pauseTimer}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold cursor-pointer"
              >
                <Pause className="size-3.5" /> বিরতি
              </button>
            ) : (
              <button
                type="button"
                onClick={startTimer}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Play className="size-3.5" /> শুরু করুন
              </button>
            )}
            <button
              type="button"
              onClick={() => selectPreset(timerDurationSec / 60)}
              title="রিসেট"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
