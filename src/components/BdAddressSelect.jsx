import BdAddress, { bdUnionByUpazilla } from "bd-address";
import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

function CustomAddressDropdown({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  isEmerald = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, dropUp: false });
  const containerRef = useRef(null);
  const selectedOpt = options.find((o) => o.value === value);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 224; // max-h-56
      const dropUp = spaceBelow < menuHeight && rect.top > menuHeight;

      setCoords({
        top: dropUp ? rect.top - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        dropUp,
      });
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full px-3 h-9 sm:h-10 border rounded-xl text-xs bg-white hover:bg-slate-50/50 focus:outline-none transition-all duration-200 font-semibold flex justify-between items-center cursor-pointer shadow-sm disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 disabled:cursor-not-allowed ${
          isEmerald
            ? "hover:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            : "hover:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)]"
        } ${selectedOpt ? "text-slate-800" : "text-slate-400"}`}
      >
        <span className="truncate">
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
            disabled ? "text-slate-200" : "text-slate-400"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        !disabled &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[10000]"
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                position: "fixed",
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                ...(coords.dropUp
                  ? { bottom: `${window.innerHeight - coords.top}px` }
                  : { top: `${coords.top}px` }),
              }}
              className="z-[10001] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-100 max-h-56 overflow-y-auto font-bengali"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400 text-center">
                  কোনো বিকল্প পাওয়া যায়নি
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                        isEmerald
                          ? isSelected
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-slate-700 hover:bg-emerald-50/50"
                          : isSelected
                            ? "bg-purple-50 text-[var(--purple-700)]"
                            : "text-slate-700 hover:bg-purple-50/50"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <span
                          className={`size-1.5 rounded-full shrink-0 ${
                            isEmerald
                              ? "bg-emerald-500"
                              : "bg-[var(--purple-600)]"
                          }`}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

export default function BdAddressSelect({
  value = { division: "", district: "", upazila: "", union: "" },
  onChange,
  isEmerald = false,
}) {
  // 1. All Divisions
  const divisions = useMemo(() => {
    try {
      const list = BdAddress.divisions() || [];
      return list.map((d) => ({
        id: String(d.id),
        value: d.bn_name || d.name,
        label: d.bn_name || d.name,
        raw: d,
      }));
    } catch {
      return [];
    }
  }, []);

  const divisionName = value?.division;
  const districtName = value?.district;
  const upazilaName = value?.upazila;

  // Find selected division ID derived directly from value.division
  const selectedDivisionId = useMemo(() => {
    if (!divisionName) return "";
    const foundDiv = divisions.find(
      (d) => d.value === divisionName || d.raw?.name === divisionName,
    );
    return foundDiv ? foundDiv.id : "";
  }, [divisionName, divisions]);

  // 2. Districts based on Division ID
  const districts = useMemo(() => {
    if (!selectedDivisionId) return [];
    try {
      const list = BdAddress.district(selectedDivisionId) || [];
      return list.map((d) => ({
        id: String(d.id),
        value: d.bn_name || d.name,
        label: d.bn_name || d.name,
        raw: d,
      }));
    } catch {
      return [];
    }
  }, [selectedDivisionId]);

  // Find selected district ID derived directly from value.district
  const selectedDistrictId = useMemo(() => {
    if (!districtName || !selectedDivisionId) return "";
    const foundDist = districts.find(
      (d) => d.value === districtName || d.raw?.name === districtName,
    );
    return foundDist ? foundDist.id : "";
  }, [districtName, selectedDivisionId, districts]);

  // 3. Upazilas based on District ID
  const upazilas = useMemo(() => {
    if (!selectedDistrictId) return [];
    try {
      const list = BdAddress.upazilla(selectedDistrictId) || [];
      return list.map((u) => ({
        id: String(u.id),
        value: u.bn_name || u.name,
        label: u.bn_name || u.name,
        raw: u,
      }));
    } catch {
      return [];
    }
  }, [selectedDistrictId]);

  // Find selected upazila ID derived directly from value.upazila
  const selectedUpazilaId = useMemo(() => {
    if (!upazilaName || !selectedDistrictId) return "";
    const foundUp = upazilas.find(
      (u) => u.value === upazilaName || u.raw?.name === upazilaName,
    );
    return foundUp ? foundUp.id : "";
  }, [upazilaName, selectedDistrictId, upazilas]);

  // 4. Unions based on Upazila ID
  const unions = useMemo(() => {
    if (!selectedUpazilaId) return [];
    try {
      const list = bdUnionByUpazilla(selectedUpazilaId) || [];
      return list.map((un) => ({
        id: String(un.id),
        value: un.bn_name || un.name,
        label: un.bn_name || un.name,
        raw: un,
      }));
    } catch {
      return [];
    }
  }, [selectedUpazilaId]);

  // Handlers
  const handleDivisionChange = (opt) => {
    onChange({
      division: opt.value,
      district: "",
      upazila: "",
      union: "",
    });
  };

  const handleDistrictChange = (opt) => {
    onChange({
      ...value,
      district: opt.value,
      upazila: "",
      union: "",
    });
  };

  const handleUpazilaChange = (opt) => {
    onChange({
      ...value,
      upazila: opt.value,
      union: "",
    });
  };

  const handleUnionChange = (opt) => {
    onChange({
      ...value,
      union: opt.value,
    });
  };

  return (
    <div className="bg-purple-50/30 p-4 rounded-2xl border border-purple-100/80 space-y-3 font-bengali">
      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <MapPin className="size-4 text-[var(--purple-700)]" />
        প্রতিষ্ঠানের ঠিকানা
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Division */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600">
            বিভাগ <span className="text-red-500">*</span>
          </label>
          <CustomAddressDropdown
            value={value.division}
            onChange={handleDivisionChange}
            options={divisions}
            placeholder="বিভাগ নির্বাচন"
            isEmerald={isEmerald}
          />
        </div>

        {/* District */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600">
            জেলা <span className="text-red-500">*</span>
          </label>
          <CustomAddressDropdown
            value={value.district}
            onChange={handleDistrictChange}
            options={districts}
            placeholder="জেলা নির্বাচন"
            disabled={!selectedDivisionId}
            isEmerald={isEmerald}
          />
        </div>

        {/* Upazila */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600">
            উপজেলা <span className="text-red-500">*</span>
          </label>
          <CustomAddressDropdown
            value={value.upazila}
            onChange={handleUpazilaChange}
            options={upazilas}
            placeholder="উপজেলা নির্বাচন"
            disabled={!selectedDistrictId}
            isEmerald={isEmerald}
          />
        </div>

        {/* Union */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600">
            ইউনিয়ন <span className="text-red-500">*</span>
          </label>
          <CustomAddressDropdown
            value={value.union}
            onChange={handleUnionChange}
            options={unions}
            placeholder="ইউনিয়ন নির্বাচন"
            disabled={!selectedUpazilaId}
            isEmerald={isEmerald}
          />
        </div>
      </div>
    </div>
  );
}
