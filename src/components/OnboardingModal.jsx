import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Globe,
  GraduationCap,
  Landmark,
  Loader2,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useUserContext } from "../context/UserContext";
import apiClient from "../lib/apiClient";
import BdAddressSelect from "./BdAddressSelect";

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  isEmerald = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    dropUp: false,
  });
  const containerRef = useRef(null);

  const selectedOpt = options.find((o) => o.value === value);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 240; // max-h-60
      const dropUp = spaceBelow < menuHeight && rect.top > menuHeight;

      setCoords({
        top: dropUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        dropUp,
      });
    }
  };

  const handleToggle = () => {
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
        onClick={handleToggle}
        className={`w-full px-3 h-10 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/50 focus:outline-none transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center cursor-pointer shadow-sm ${
          isEmerald
            ? "hover:border-emerald-400 focus:ring-emerald-500/20"
            : "hover:border-purple-400 focus:ring-purple-500/20"
        } ${className}`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
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
              className="z-[10001] bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-2xl p-1.5 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-100 max-h-60 overflow-y-auto font-bengali"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isEmerald
                        ? isSelected
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-slate-700 hover:bg-emerald-50/40"
                        : isSelected
                          ? "bg-purple-50 text-[var(--purple-700)]"
                          : "text-slate-700 hover:bg-purple-50/40"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span
                        className={`size-1.5 rounded-full ${
                          isEmerald
                            ? "bg-emerald-500"
                            : "bg-[var(--purple-600)]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}

export default function OnboardingModal() {
  const { userProfile, refreshProfile } = useUserContext();
  const [step, setStep] = useState(1); // 1: Selection, 2: Form
  const [userType, setUserType] = useState(null); // 'Teacher' or 'Institution'
  const [loading, setLoading] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState(userProfile?.firstName || "");
  const [lastName, setLastName] = useState(userProfile?.lastName || "");
  const [designation, setDesignation] = useState("");
  const [institutionName, setInstitutionName] = useState("");

  // Institution specific form states
  const [institutionType, setInstitutionType] = useState("");
  const [institutionMedium, setInstitutionMedium] = useState("");
  const [founderName, setFounderName] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [eiin, setEiin] = useState("");
  const [institutionCode, setInstitutionCode] = useState("");
  const [studentCountRange, setStudentCountRange] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");

  // Address states
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const studentRanges = [
    { value: "1-100", label: "১–১০০ জন" },
    { value: "101-300", label: "১০১–৩০০ জন" },
    { value: "301-500", label: "৩০১–৫০১ জন" },
    { value: "501-1,000", label: "৫০১–১,০০০ জন" },
    { value: "1,001-2,000", label: "১,০০১–২,০০০ জন" },
    { value: "2,001-5,000", label: "২,০০১–৫,০০০ জন" },
    { value: "5,001+", label: "৫,০০১+ জন" },
  ];

  const handleSelectRole = (role) => {
    setUserType(role);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { userType };

      if (userType === "Teacher") {
        if (!firstName.trim() || !lastName.trim() || !institutionName.trim()) {
          toast.error("দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।");
          setLoading(false);
          return;
        }
        payload = {
          ...payload,
          firstName,
          lastName,
          designation,
          institutionName,
        };
      } else {
        if (
          !institutionName.trim() ||
          !institutionType ||
          !institutionMedium ||
          !founderName.trim() ||
          !foundingYear.trim() ||
          !studentCountRange ||
          !contactNumber.trim() ||
          !division ||
          !district.trim() ||
          !upazila.trim() ||
          !union.trim() ||
          !fullAddress.trim()
        ) {
          toast.error("দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।");
          setLoading(false);
          return;
        }
        payload = {
          ...payload,
          institutionName,
          institutionType,
          institutionMedium,
          founderName,
          foundingYear,
          eiin,
          institutionCode,
          studentCountRange,
          contactNumber,
          officialEmail,
          officialWebsite,
          addressInfo: {
            division,
            district,
            upazila,
            postOffice: union,
            union,
            fullAddress,
          },
        };
      }

      const response = await apiClient.put("/users/onboard", payload);
      if (response.data.success) {
        toast.success("অনবোর্ডিং সফলভাবে সম্পন্ন হয়েছে!");

        // Trigger a gorgeous confetti celebration
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 99999,
        };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          });
        }, 250);

        await refreshProfile();
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error(
        error.response?.data?.error ||
          "অনবোর্ডিং সম্পন্ন করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = userType === "Teacher";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative p-4 sm:p-8 flex flex-col my-auto max-h-[92vh] overflow-hidden font-bengali">
        {/* Top-Right Circular Close Button */}
        <button
          type="button"
          onClick={() =>
            toast.info("ড্যাশবোর্ডে প্রবেশ করতে অনবোর্ডিং তথ্য পূরণ প্রয়োজন।")
          }
          className="absolute top-3 right-3 sm:top-6 sm:right-6 size-8 sm:size-10 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center cursor-pointer z-50"
          title="বন্ধ করুন"
        >
          <X className="size-4 sm:size-5" />
        </button>

        {/* Progress Step Header */}
        <div className="space-y-2 mb-4 sm:mb-6 pr-12">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500 font-bengali">
            <span>ধাপ {step} / ২</span>
            <span>
              {step === 1
                ? "রোল সিলেক্ট করুন"
                : isTeacher
                  ? "শিক্ষকের তথ্য"
                  : "প্রতিষ্ঠানের তথ্য"}
            </span>
          </div>

          {/* Progress Line */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] transition-all duration-300 rounded-full"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center py-2 sm:py-4 space-y-4 sm:space-y-6">
            <div className="text-center space-y-1 sm:space-y-1.5">
              <h1 className="text-xl sm:text-3xl font-bold text-[var(--purple-700)] font-bengali tracking-tight">
                রোল সিলেক্ট করুন
              </h1>
              <p className="text-[11px] sm:text-sm text-slate-500 font-bengali">
                আপনি কোন ধরনের ব্যবহারকারী তা নির্বাচন করুন।
              </p>
            </div>

            {/* 2 Options Cards Side-by-Side: Teacher & Institution */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-6 max-w-xl mx-auto w-full my-2 sm:my-4">
              {/* Teacher Option */}
              <div
                onClick={() => handleSelectRole("Teacher")}
                className={`group p-3.5 sm:p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center space-y-2 sm:space-y-4 ${
                  userType === "Teacher"
                    ? "border-[var(--purple-600)] bg-purple-50/40 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/20"
                    : "border-slate-100 hover:border-purple-200 bg-white hover:bg-slate-50/80 shadow-sm hover:shadow"
                }`}
              >
                <div
                  className={`size-11 sm:size-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    userType === "Teacher"
                      ? "bg-[var(--purple-600)] text-white shadow-md shadow-purple-600/30"
                      : "bg-purple-100/70 text-[var(--purple-700)] group-hover:bg-[var(--purple-600)] group-hover:text-white"
                  }`}
                >
                  <GraduationCap className="size-5 sm:size-8" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className="text-xs sm:text-lg font-bold text-slate-800 font-bengali">
                    শিক্ষক
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bengali leading-snug sm:leading-relaxed">
                    ব্যক্তিগত শিক্ষক বা শিক্ষাবিদদের জন্য।
                  </p>
                </div>
              </div>

              {/* Institution Option */}
              <div
                onClick={() => handleSelectRole("Institution")}
                className={`group p-3.5 sm:p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center space-y-2 sm:space-y-4 ${
                  userType === "Institution"
                    ? "border-[var(--purple-600)] bg-purple-50/40 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/20"
                    : "border-slate-100 hover:border-purple-200 bg-white hover:bg-slate-50/80 shadow-sm hover:shadow"
                }`}
              >
                <div
                  className={`size-11 sm:size-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    userType === "Institution"
                      ? "bg-[var(--purple-600)] text-white shadow-md shadow-purple-600/30"
                      : "bg-purple-100/70 text-[var(--purple-700)] group-hover:bg-[var(--purple-600)] group-hover:text-white"
                  }`}
                >
                  <Landmark className="size-5 sm:size-8" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className="text-xs sm:text-lg font-bold text-slate-800 font-bengali">
                    প্রতিষ্ঠান
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bengali leading-snug sm:leading-relaxed">
                    বিদ্যালয়, কলেজ বা কোচিং সেন্টারের জন্য।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && (
          <form
            id="onboarding-form"
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto max-h-[60vh] p-2 sm:p-4 space-y-6">
              {/* Teacher Form Fields */}
              {isTeacher && (
                <div className="space-y-4 font-bengali">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 border-b border-slate-200/60 pb-2 flex items-center gap-2">
                    <GraduationCap className="size-5 text-[var(--purple-700)]" />
                    শিক্ষকের তথ্য বিবরণ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        প্রথম নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                        placeholder="রাতুল"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        শেষ নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                        placeholder="হাসান"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        মোবাইল নম্বর (ভেরিফাইড)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={userProfile?.phoneNumber || ""}
                        className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-sm font-sans font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        পদবি (Designation)
                      </label>
                      <CustomSelect
                        value={designation}
                        onChange={setDesignation}
                        placeholder="পদবি নির্বাচন করুন"
                        options={[
                          { value: "সহকারী শিক্ষক", label: "সহকারী শিক্ষক" },
                          { value: "সিনিয়র শিক্ষক", label: "সিনিয়র শিক্ষক" },
                          { value: "প্রধান শিক্ষক", label: "প্রধান শিক্ষক" },
                          { value: "প্রভাষক", label: "প্রভাষক" },
                          { value: "সহকারী অধ্যাপক", label: "সহকারী অধ্যাপক" },
                          { value: "সহযোগী অধ্যাপক", label: "সহযোগী অধ্যাপক" },
                          { value: "অধ্যাপক", label: "অধ্যাপক" },
                          { value: "প্রিন্সিপাল", label: "প্রিন্সিপাল" },
                          { value: "অন্যান্য", label: "অন্যান্য" },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm"
                      placeholder="উদা: ঢাকা গভঃ মুসলিম হাই স্কুল"
                    />
                  </div>
                </div>
              )}

              {/* Institution Form Fields */}
              {!isTeacher && (
                <div className="space-y-4 font-bengali">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 border-b border-slate-200/60 pb-2 flex items-center gap-2">
                    <Landmark className="size-5 text-[var(--purple-700)]" />
                    শিক্ষা প্রতিষ্ঠানের তথ্য বিবরণ
                  </h3>

                  {/* Type, Medium, Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        প্রতিষ্ঠানের ধরন <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={institutionType}
                        onChange={setInstitutionType}
                        placeholder="নির্বাচন করুন"
                        options={[
                          { value: "School", label: "স্কুল" },
                          { value: "College", label: "কলেজ" },
                          {
                            value: "School & College",
                            label: "স্কুল অ্যান্ড কলেজ",
                          },
                          { value: "Madrasah", label: "মাদ্রাসা" },
                          { value: "Coaching Center", label: "কোচিং সেন্টার" },
                          { value: "Other", label: "অন্যান্য" },
                        ]}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        মাধ্যম <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={institutionMedium}
                        onChange={setInstitutionMedium}
                        placeholder="নির্বাচন করুন"
                        options={[
                          { value: "Bangla", label: "বাংলা" },
                          { value: "English", label: "ইংরেজি" },
                          { value: "both", label: "উভয় (English & Bangla)" },
                        ]}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        ছাত্র-ছাত্রীর সংখ্যা{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={studentCountRange}
                        onChange={setStudentCountRange}
                        placeholder="নির্বাচন করুন"
                        options={studentRanges}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm"
                      placeholder="উদা: হলি ক্রস স্কুল অ্যান্ড কলেজ"
                    />
                  </div>

                  {/* Founder & Founding Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        প্রতিষ্ঠাতার নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm"
                        placeholder="প্রতিষ্ঠাতার পুরো নাম"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        প্রতিষ্ঠা সাল <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={foundingYear}
                        onChange={(e) => setFoundingYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                        placeholder="উদা: ১৯৯৫"
                      />
                    </div>
                  </div>

                  {/* EIIN & Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        EIIN (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={eiin}
                        onChange={(e) => setEiin(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                        placeholder="প্রতিষ্ঠানের EIIN নম্বর"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        প্রতিষ্ঠান কোড (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={institutionCode}
                        onChange={(e) => setInstitutionCode(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                        placeholder="উদা: বোর্ড বা জাতীয় কোড"
                      />
                    </div>
                  </div>

                  {/* Address Section with BdAddressSelect */}
                  <div className="space-y-3">
                    <BdAddressSelect
                      value={{ division, district, upazila, union }}
                      onChange={({ division, district, upazila, union }) => {
                        setDivision(division);
                        setDistrict(district);
                        setUpazila(upazila);
                        setUnion(union);
                      }}
                    />

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600 font-bengali">
                        সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-xs font-bengali"
                        placeholder="রোড নম্বর, হোল্ডিং, গ্রাম ইত্যাদি"
                      />
                    </div>
                  </div>

                  {/* Communication fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        যোগাযোগের মোবাইল <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                          placeholder="উদা: 01XXXXXXXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        অফিসিয়াল ইমেইল (ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={officialEmail}
                          onChange={(e) => setOfficialEmail(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                          placeholder="info@institution.edu"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        অফিসিয়াল ওয়েবসাইট (ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={officialWebsite}
                          onChange={(e) => setOfficialWebsite(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-sm font-sans"
                          placeholder="www.institution.edu"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Bottom Navigation Actions (Matches Screenshot Layout) */}
        <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
          <button
            type="button"
            disabled={step === 1}
            onClick={handleBack}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] sm:text-sm font-bengali flex items-center gap-1 sm:gap-2 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
            <span>ফিরে যান</span>
          </button>

          {step === 1 ? (
            <button
              type="button"
              disabled={!userType}
              onClick={() => setStep(2)}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] hover:from-[var(--purple-900)] hover:to-[var(--purple-700)] text-white font-bold text-[11px] sm:text-sm font-bengali flex items-center gap-1.5 sm:gap-2 shadow-md shadow-purple-600/20 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="size-3.5 sm:size-4" />
            </button>
          ) : (
            <button
              type="submit"
              form="onboarding-form"
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] hover:from-[var(--purple-900)] hover:to-[var(--purple-700)] text-white font-bold text-[11px] sm:text-sm font-bengali flex items-center gap-1.5 sm:gap-2 shadow-md shadow-purple-600/20 transition disabled:opacity-50 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 sm:size-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <span>তথ্য সংরক্ষণ করুন</span>
                  <ArrowRight className="size-3.5 sm:size-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
