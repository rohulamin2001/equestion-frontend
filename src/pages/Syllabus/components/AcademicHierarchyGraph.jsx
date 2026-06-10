import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, GraduationCap, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

const TYPE_LABELS = {
  School: 'স্কুল (School)',
  College: 'কলেজ (College)',
  Madrasah: 'মাদ্রাসা (Madrasah)',
};

const LEVEL_LABELS = {
  Primary: 'প্রাথমিক (Primary)',
  Secondary: 'মাধ্যমিক (Secondary)',
  'Higher Secondary': 'উচ্চমাধ্যমিক',
  Ebtedayee: 'ইবতেদায়ী (Ebtedayee)',
  Dakhil: 'দাখিল (Dakhil)',
  Alim: 'আলিম (Alim)',
};

const TYPE_ICONS = {
  School: School,
  College: GraduationCap,
  Madrasah: BookOpen,
};

const TYPE_COLORS = {
  School: {
    bg: 'bg-white/45 border-slate-200/50 text-slate-700 hover:bg-white/70 shadow-sm',
    activeBg: 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-indigo-100 shadow-md',
    glow: 'from-[#4F46E5] to-[#8B5CF6]',
  },
  College: {
    bg: 'bg-white/45 border-slate-200/50 text-slate-700 hover:bg-white/70 shadow-sm',
    activeBg: 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-purple-100 shadow-md',
    glow: 'from-[#8B5CF6] to-[#A78BFA]',
  },
  Madrasah: {
    bg: 'bg-white/45 border-slate-200/50 text-slate-700 hover:bg-white/70 shadow-sm',
    activeBg: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-100 shadow-md',
    glow: 'from-emerald-500 to-emerald-600',
  },
};

export default function AcademicHierarchyGraph({
  selectedType,
  handleTypeChange,
  selectedLevel,
  handleLevelChange,
  selectedClass,
  setSelectedClass,
  setExpandedSubjectId,
  allowedClasses = [],
  activeTypes = [],
}) {
  const [coords, setCoords] = useState({ typeToLevel: null, levelToClass: null });

  // Filter levels and classes for display
  const activeLevels = Array.from(
    new Set(allowedClasses.filter((c) => c.type === selectedType).map((c) => c.level))
  );

  const classesForLevel = allowedClasses.filter(
    (c) => c.type === selectedType && c.level === selectedLevel
  );

  // Compute connecting line coordinates
  useEffect(() => {
    const updateCoords = () => {
      const typeEl = document.getElementById(`node-type-${selectedType}`);
      const levelEl = document.getElementById(`node-level-${selectedLevel}`);
      const classEl = document.getElementById(`node-class-${selectedClass}`);
      const svgEl = document.getElementById('hierarchy-svg');

      if (!svgEl) return;

      const svgRect = svgEl.getBoundingClientRect();
      let typeToLevel = null;
      let levelToClass = null;

      if (typeEl && levelEl) {
        const typeRect = typeEl.getBoundingClientRect();
        const levelRect = levelEl.getBoundingClientRect();

        typeToLevel = {
          x1: typeRect.right - svgRect.left,
          y1: typeRect.top + typeRect.height / 2 - svgRect.top,
          x2: levelRect.left - svgRect.left,
          y2: levelRect.top + levelRect.height / 2 - svgRect.top,
        };
      }

      if (levelEl && classEl) {
        const levelRect = levelEl.getBoundingClientRect();
        const classRect = classEl.getBoundingClientRect();

        levelToClass = {
          x1: levelRect.right - svgRect.left,
          y1: levelRect.top + levelRect.height / 2 - svgRect.top,
          x2: classRect.left - svgRect.left,
          y2: classRect.top + classRect.height / 2 - svgRect.top,
        };
      }

      setCoords({ typeToLevel, levelToClass });
    };

    updateCoords();
    window.addEventListener('resize', updateCoords);
    // Trigger on dynamic layout changes
    const timer = setTimeout(updateCoords, 100);

    return () => {
      window.removeEventListener('resize', updateCoords);
      clearTimeout(timer);
    };
  }, [selectedType, selectedLevel, selectedClass, allowedClasses, activeLevels.length, classesForLevel.length]);

  // Helper for generating Bezier path
  const getBezierPath = (c) => {
    if (!c) return '';
    const dx = c.x2 - c.x1;
    const cx1 = c.x1 + dx * 0.5;
    const cy1 = c.y1;
    const cx2 = c.x1 + dx * 0.5;
    const cy2 = c.y2;
    return `M ${c.x1} ${c.y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${c.x2} ${c.y2}`;
  };

  const activeColor = TYPE_COLORS[selectedType] || TYPE_COLORS.School;

  return (
    <div className="relative w-full bg-glass p-6 rounded-2xl border shadow-sm space-y-6 overflow-hidden">
      {/* Background SVG for Connecting Lines (only shown on md and larger screens) */}
      <svg
        id="hierarchy-svg"
        className="absolute inset-0 size-full pointer-events-none hidden md:block z-0"
      >
        <defs>
          <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Gray connecting paths for inactive connections */}
        {activeTypes.map((type) => {
          const typeEl = document.getElementById(`node-type-${type}`);
          const svgEl = document.getElementById('hierarchy-svg');
          if (!typeEl || !svgEl) return null;
          const svgRect = svgEl.getBoundingClientRect();
          const typeRect = typeEl.getBoundingClientRect();
          const x1 = typeRect.right - svgRect.left;
          const y1 = typeRect.top + typeRect.height / 2 - svgRect.top;

          const relatedLevels = Array.from(
            new Set(allowedClasses.filter((c) => c.type === type).map((c) => c.level))
          );

          return relatedLevels.map((lvl) => {
            const lvlEl = document.getElementById(`node-level-${lvl}`);
            if (!lvlEl) return null;
            const lvlRect = lvlEl.getBoundingClientRect();
            const x2 = lvlRect.left - svgRect.left;
            const y2 = lvlRect.top + lvlRect.height / 2 - svgRect.top;

            const isCurrentPath = selectedType === type && selectedLevel === lvl;
            if (isCurrentPath) return null; // Drawn as active layer later

            return (
              <path
                key={`${type}-${lvl}`}
                d={getBezierPath({ x1, y1, x2, y2 })}
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="2"
              />
            );
          });
        })}

        {/* Active glowing path Type -> Level */}
        {coords.typeToLevel && (
          <>
            {/* Outline Glow */}
            <motion.path
              d={getBezierPath(coords.typeToLevel)}
              fill="none"
              stroke={`url(#glow-grad)`}
              strokeWidth="5"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
            {/* Solid Center Line */}
            <motion.path
              d={getBezierPath(coords.typeToLevel)}
              fill="none"
              stroke={`url(#glow-grad)`}
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          </>
        )}

        {/* Active glowing path Level -> Class */}
        {coords.levelToClass && (
          <>
            {/* Outline Glow */}
            <motion.path
              d={getBezierPath(coords.levelToClass)}
              fill="none"
              stroke={`url(#glow-grad)`}
              strokeWidth="5"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
            {/* Solid Center Line */}
            <motion.path
              d={getBezierPath(coords.levelToClass)}
              fill="none"
              stroke={`url(#glow-grad)`}
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          </>
        )}
      </svg>

      {/* Main Hierarchy Layout Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Column 1: Institution Type */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-1.5 font-sans">
            <span className="size-2 rounded-full bg-[#4F46E5]"></span>
            প্রতিষ্ঠানের ধরণ (Type)
          </h4>
          <div className="flex flex-col gap-3">
            {activeTypes.map((type) => {
              const IconComp = TYPE_ICONS[type] || School;
              const isActive = selectedType === type;
              const colStyle = TYPE_COLORS[type] || TYPE_COLORS.School;

              return (
                <motion.button
                  id={`node-type-${type}`}
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                    isActive ? colStyle.activeBg : colStyle.bg
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive ? 'bg-white/20 text-white' : 'bg-black/[0.03] text-slate-700'
                      }`}
                    >
                      <IconComp className="size-5" />
                    </div>
                    <div>
                      <span className={`font-bold text-[14px] font-sans block ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {TYPE_LABELS[type] || type}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isActive ? 'text-white/85' : 'text-slate-400'
                        }`}
                      >
                        সিলেক্ট করতে ট্যাপ করুন
                      </span>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="size-4 text-white hidden md:block" />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Academic Level */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-1.5 font-sans">
            <span className="size-2 rounded-full bg-[#8B5CF6]"></span>
            শিক্ষার স্তর (Level)
          </h4>
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {activeLevels.map((level) => {
                const isActive = selectedLevel === level;
                return (
                  <motion.button
                    id={`node-level-${level}`}
                    key={level}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLevelChange(level)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      isActive
                        ? activeColor.activeBg
                        : 'bg-white/45 border-slate-200/50 text-slate-700 hover:border-slate-300 hover:bg-white/70 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2.5 rounded-full ${
                          isActive ? 'bg-white animate-pulse' : 'bg-slate-350'
                        }`}
                      />
                      <span className={`font-bold text-[14px] font-sans ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {LEVEL_LABELS[level] || level}
                      </span>
                    </div>
                    {isActive && <ChevronRight className="size-4 text-white hidden md:block" />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 3: Class Selection */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider pl-1 flex items-center gap-1.5 font-sans">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            শ্রেণী নির্বাচন (Class)
          </h4>
          <div className="p-5 rounded-2xl border border-black/[0.04] bg-black/[0.01] min-h-[120px] flex items-center justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
              <AnimatePresence mode="popLayout">
                {classesForLevel.map((cls) => {
                  const isActive = selectedClass === cls.value;
                  return (
                    <motion.button
                      id={`node-class-${cls.value}`}
                      key={cls.value}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => {
                        setSelectedClass(cls.value);
                        setExpandedSubjectId(null);
                      }}
                      className={`p-3 py-3.5 rounded-xl text-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200'
                          : 'bg-white/45 border border-slate-200/50 text-slate-650 hover:border-slate-300 hover:bg-white/70 hover:text-slate-900 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {isActive && <Sparkles className="size-3 text-white/80 animate-bounce" />}
                        <span className="font-extrabold">{cls.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
