import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/ui/ripple-button";
import {
  CLASSES_MAP,
  DEFAULT_ALIM_CLASSES,
  DEFAULT_COLLEGE_CLASSES,
  DEFAULT_DAKHIL_CLASSES,
  DEFAULT_EBTEDAYEE_CLASSES,
  DEFAULT_PRIMARY_CLASSES,
  DEFAULT_SECONDARY_CLASSES,
  MADRASAH_CLASSES_MAP,
} from "@/constants/classes";
import { useUserContext } from "@/context/UserContext";
import { useAcademicConfig } from "@/hooks/useAcademicConfig";
import apiClient from "@/lib/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Globe,
  GraduationCap,
  Layers,
  Loader2,
  Save,
  School,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Reusable custom checkbox
function CustomCheck({ checked, color = "purple" }) {
  const colors = {
    purple: {
      box: "bg-primary border-primary",
      empty: "bg-white border-slate-300",
    },
    orange: {
      box: "bg-purple-600 border-purple-600",
      empty: "bg-white border-slate-300",
    },
    emerald: {
      box: "bg-emerald-600 border-emerald-600",
      empty: "bg-white border-slate-300",
    },
  };
  const c = colors[color] || colors.purple;
  return (
    <span
      className={`size-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${checked ? c.box : c.empty}`}
    >
      {checked && (
        <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none">
          <path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

// Reusable class pill checkboxes — defined OUTSIDE the parent component
function ClassPills({ classes, setClasses, allOptions, color = "purple" }) {
  return allOptions.map((cls) => {
    const isChecked = classes.includes(cls.value);
    return (
      <label
        key={cls.value}
        className={`flex items-center gap-2 p-2 px-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all select-none ${
          isChecked
            ? color === "emerald"
              ? "bg-emerald-50 border-emerald-300/60 text-emerald-700 shadow-sm"
              : "bg-purple-50 border-purple-300/60 text-purple-700 shadow-sm"
            : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white hover:border-purple-200"
        }`}
      >
        <CustomCheck checked={isChecked} color={color} />
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            if (isChecked) setClasses(classes.filter((c) => c !== cls.value));
            else setClasses([...classes, cls.value]);
          }}
          className="sr-only"
        />
        <span>{cls.label}</span>
      </label>
    );
  });
}

export default function AcademicSetup() {
  const queryClient = useQueryClient();
  const { role } = useUserContext();
  const { config, isLoading, refetch } = useAcademicConfig();

  const DEFAULT_FORM = {
    activeTypes: ["School"],
    schoolLevels: ["Primary", "Secondary"],
    madrasahLevels: ["Ebtedayee", "Dakhil", "Alim"],
    versions: ["Bangla"],
    schoolPrimaryClasses: DEFAULT_PRIMARY_CLASSES,
    schoolSecondaryClasses: DEFAULT_SECONDARY_CLASSES,
    collegeClasses: DEFAULT_COLLEGE_CLASSES,
    madrasahEbtedayeeClasses: DEFAULT_EBTEDAYEE_CLASSES,
    madrasahDakhilClasses: DEFAULT_DAKHIL_CLASSES,
    madrasahAlimClasses: DEFAULT_ALIM_CLASSES,
  };

  const [userEdits, setUserEdits] = useState(null);

  const form =
    userEdits ??
    (config
      ? {
          activeTypes: config.activeTypes || DEFAULT_FORM.activeTypes,
          schoolLevels: config.schoolLevels || DEFAULT_FORM.schoolLevels,
          madrasahLevels: config.madrasahLevels || DEFAULT_FORM.madrasahLevels,
          versions: config.versions || DEFAULT_FORM.versions,
          schoolPrimaryClasses:
            config.schoolPrimaryClasses || DEFAULT_FORM.schoolPrimaryClasses,
          schoolSecondaryClasses:
            config.schoolSecondaryClasses ||
            DEFAULT_FORM.schoolSecondaryClasses,
          collegeClasses: config.collegeClasses || DEFAULT_FORM.collegeClasses,
          madrasahEbtedayeeClasses:
            config.madrasahEbtedayeeClasses ||
            DEFAULT_FORM.madrasahEbtedayeeClasses,
          madrasahDakhilClasses:
            config.madrasahDakhilClasses || DEFAULT_FORM.madrasahDakhilClasses,
          madrasahAlimClasses:
            config.madrasahAlimClasses || DEFAULT_FORM.madrasahAlimClasses,
        }
      : DEFAULT_FORM);

  const setField = (key) => (val) =>
    setUserEdits((prev) => ({ ...(prev ?? form), [key]: val }));

  const {
    activeTypes,
    schoolLevels,
    madrasahLevels,
    versions,
    schoolPrimaryClasses,
    schoolSecondaryClasses,
    collegeClasses,
    madrasahEbtedayeeClasses,
    madrasahDakhilClasses,
    madrasahAlimClasses,
  } = form;

  const setActiveTypes = setField("activeTypes");
  const setSchoolLevels = setField("schoolLevels");
  const setMadrasahLevels = setField("madrasahLevels");
  const setVersions = setField("versions");
  const setSchoolPrimaryClasses = setField("schoolPrimaryClasses");
  const setSchoolSecondaryClasses = setField("schoolSecondaryClasses");
  const setCollegeClasses = setField("collegeClasses");
  const setMadrasahEbtedayeeClasses = setField("madrasahEbtedayeeClasses");
  const setMadrasahDakhilClasses = setField("madrasahDakhilClasses");
  const setMadrasahAlimClasses = setField("madrasahAlimClasses");

  // Mutation to save config
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/academic-config", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicConfig"] });
      toast.success("প্রতিষ্ঠান কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!");
      refetch();
      setUserEdits(null);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "সংরক্ষণ করতে ব্যর্থ হয়েছে।",
      );
    },
  });

  if (role !== "Super Admin") {
    return (
      <div className="bg-glass border border-red-200/40 backdrop-blur-md rounded-2xl shadow-sm p-16 text-center max-w-md mx-auto space-y-4 font-sans">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          অননুমোদিত অ্যাক্সেস
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          দুঃখিত, এই পেজটি শুধুমাত্র <strong>সুপার এডমিন</strong> (Super Admin)
          অ্যাক্সেস করতে পারবেন।
        </p>
      </div>
    );
  }

  // Toggle handlers
  const handleTypeToggle = (type) => {
    if (activeTypes.includes(type)) {
      if (activeTypes.length === 1) {
        toast.error("কমপক্ষে একটি প্রতিষ্ঠানের ধরন নির্বাচন করতে হবে।");
        return;
      }
      setActiveTypes(activeTypes.filter((t) => t !== type));
    } else {
      setActiveTypes([...activeTypes, type]);
    }
  };

  const handleSchoolLevelToggle = (lvl) => {
    if (schoolLevels.includes(lvl))
      setSchoolLevels(schoolLevels.filter((l) => l !== lvl));
    else setSchoolLevels([...schoolLevels, lvl]);
  };

  const handleMadrasahLevelToggle = (lvl) => {
    if (madrasahLevels.includes(lvl))
      setMadrasahLevels(madrasahLevels.filter((l) => l !== lvl));
    else setMadrasahLevels([...madrasahLevels, lvl]);
  };

  const handleVersionToggle = (ver) => {
    if (versions.includes(ver)) {
      if (versions.length === 1) {
        toast.error("কমপক্ষে একটি সক্রিয় ভার্সন (Version) নির্বাচন করতে হবে।");
        return;
      }
      setVersions(versions.filter((v) => v !== ver));
    } else {
      setVersions([...versions, ver]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      activeTypes,
      schoolLevels: activeTypes.includes("School") ? schoolLevels : [],
      madrasahLevels: activeTypes.includes("Madrasah") ? madrasahLevels : [],
      versions,
      schoolPrimaryClasses:
        activeTypes.includes("School") && schoolLevels.includes("Primary")
          ? schoolPrimaryClasses
          : [],
      schoolSecondaryClasses:
        activeTypes.includes("School") && schoolLevels.includes("Secondary")
          ? schoolSecondaryClasses
          : [],
      collegeClasses: activeTypes.includes("College") ? collegeClasses : [],
      madrasahEbtedayeeClasses:
        activeTypes.includes("Madrasah") && madrasahLevels.includes("Ebtedayee")
          ? madrasahEbtedayeeClasses
          : [],
      madrasahDakhilClasses:
        activeTypes.includes("Madrasah") && madrasahLevels.includes("Dakhil")
          ? madrasahDakhilClasses
          : [],
      madrasahAlimClasses:
        activeTypes.includes("Madrasah") && madrasahLevels.includes("Alim")
          ? madrasahAlimClasses
          : [],
    });
  };

  if (isLoading) {
    return (
      <div className="bg-glass border border-slate-200/50 backdrop-blur-md rounded-2xl shadow-sm p-16 flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-slate-500 text-sm">কনফিগারেশন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            <span>অ্যাকাডেমিক সেটআপ (সুপার এডমিন)</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            আপনার শিক্ষাপ্রতিষ্ঠানের ধরণ, স্তর এবং ভার্সনসমূহ কনফিগার করুন।
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Active Types */}
        <div className="bg-glass p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-lg border-b pb-3 flex items-center gap-2">
            <School className="size-5 text-primary" />
            <span>১. প্রতিষ্ঠানের ধরণ (Institution Types)</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার প্রতিষ্ঠানে যে যে শিক্ষাব্যবস্থা চালু আছে তা সিলেক্ট করুন
            (একাধিক সিলেক্ট করা যাবে):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                value: "School",
                label: "স্কুল (School)",
                desc: "১ম থেকে ১০ম শ্রেণীর সাধারণ পাঠ্যক্রম",
                icon: School,
                activeClass:
                  "bg-purple-50/60 border-purple-300 ring-2 ring-purple-100",
              },
              {
                value: "College",
                label: "কলেজ (College)",
                desc: "একাদশ ও দ্বাদশ শ্রেণীর পাঠ্যক্রম",
                icon: GraduationCap,
                activeClass:
                  "bg-purple-50/60 border-purple-300 ring-2 ring-purple-100",
              },
              {
                value: "Madrasah",
                label: "মাদ্রাসা (Madrasah)",
                desc: "ইবতেদায়ী, দাখিল ও আলিম পাঠ্যক্রম",
                icon: BookOpen,
                activeClass:
                  "bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-100",
              },
            ].map((item) => {
              const isChecked = activeTypes.includes(item.value);
              const IconComp = item.icon;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleTypeToggle(item.value)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 ${
                    isChecked
                      ? item.activeClass
                      : "bg-white/45 border-slate-200 hover:border-slate-300 hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <IconComp className="size-4.5 text-primary" />
                      <span className="font-semibold text-slate-800 text-[15px]">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`size-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        isChecked
                          ? item.value === "Madrasah"
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-primary border-primary text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                  <span className="text-slate-500 text-xs font-medium">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Levels Configuration */}
        {(activeTypes.includes("School") ||
          activeTypes.includes("Madrasah") ||
          activeTypes.includes("College")) && (
          <div className="bg-glass p-6 rounded-2xl border shadow-sm space-y-6">
            <h3 className="font-semibold text-slate-800 text-lg border-b pb-3 flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              <span>২. স্তরসমূহ কনফিগার করুন (Levels Configuration)</span>
            </h3>

            {/* School levels */}
            {activeTypes.includes("School") && (
              <div className="space-y-4 p-6 rounded-2xl border border-purple-100 bg-purple-50/20">
                <h4 className="font-semibold text-primary text-sm flex items-center gap-2">
                  <School className="size-4" />
                  <span>স্কুল স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</span>
                </h4>
                <div className="space-y-4">
                  {/* Primary */}
                  <div className="p-4 rounded-xl border border-slate-200/60 bg-white/70 shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck
                        checked={schoolLevels.includes("Primary")}
                        color="purple"
                      />
                      <input
                        type="checkbox"
                        checked={schoolLevels.includes("Primary")}
                        onChange={() => handleSchoolLevelToggle("Primary")}
                        className="sr-only"
                      />
                      <span className="text-base font-semibold text-slate-800">
                        প্রাইমারি স্কুল
                      </span>
                    </label>
                    {schoolLevels.includes("Primary") && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">
                          প্রাইমারি স্কুল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে
                          নির্বাচন করুন:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={schoolPrimaryClasses}
                            setClasses={setSchoolPrimaryClasses}
                            color="purple"
                            allOptions={CLASSES_MAP.filter(
                              (c) =>
                                c.type === "School" && c.level === "Primary",
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Secondary */}
                  <div className="p-4 rounded-xl border border-slate-200/60 bg-white/70 shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck
                        checked={schoolLevels.includes("Secondary")}
                        color="purple"
                      />
                      <input
                        type="checkbox"
                        checked={schoolLevels.includes("Secondary")}
                        onChange={() => handleSchoolLevelToggle("Secondary")}
                        className="sr-only"
                      />
                      <span className="text-base font-semibold text-slate-800">
                        মাধ্যমিক স্কুল
                      </span>
                    </label>
                    {schoolLevels.includes("Secondary") && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">
                          মাধ্যমিক স্কুল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে
                          নির্বাচন করুন:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={schoolSecondaryClasses}
                            setClasses={setSchoolSecondaryClasses}
                            color="purple"
                            allOptions={CLASSES_MAP.filter(
                              (c) =>
                                c.type === "School" && c.level === "Secondary",
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* College levels */}
            {activeTypes.includes("College") && (
              <div className="space-y-4 p-6 rounded-2xl border border-purple-100 bg-purple-50/20">
                <h4 className="font-semibold text-primary text-sm flex items-center gap-2">
                  <GraduationCap className="size-4" />
                  <span>কলেজ স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</span>
                </h4>
                <div className="p-4 rounded-xl border border-slate-200/60 bg-white/70 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="size-2.5 rounded-full bg-primary"></span>
                    <span className="text-base font-semibold text-slate-800">
                      উচ্চ মাধ্যমিক
                    </span>
                  </div>
                  <div className="pl-5 pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2 font-medium">
                      উচ্চ মাধ্যমিক স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন
                      করুন:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <ClassPills
                        classes={collegeClasses}
                        setClasses={setCollegeClasses}
                        color="purple"
                        allOptions={CLASSES_MAP.filter(
                          (c) => c.type === "College",
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Madrasah levels */}
            {activeTypes.includes("Madrasah") && (
              <div className="space-y-4 p-6 rounded-2xl border border-emerald-100 bg-emerald-50/20">
                <h4 className="font-semibold text-emerald-600 text-sm flex items-center gap-2">
                  <BookOpen className="size-4" />
                  <span>মাদ্রাসা স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</span>
                </h4>
                <div className="space-y-4">
                  {/* Ebtedayee */}
                  <div className="p-4 rounded-xl border border-slate-200/60 bg-white/70 shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck
                        checked={madrasahLevels.includes("Ebtedayee")}
                        color="emerald"
                      />
                      <input
                        type="checkbox"
                        checked={madrasahLevels.includes("Ebtedayee")}
                        onChange={() => handleMadrasahLevelToggle("Ebtedayee")}
                        className="sr-only"
                      />
                      <span className="text-base font-semibold text-slate-800">
                        ইবতেদায়ী
                      </span>
                    </label>
                    {madrasahLevels.includes("Ebtedayee") && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">
                          ইবতেদায়ী স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন
                          করুন:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={madrasahEbtedayeeClasses}
                            setClasses={setMadrasahEbtedayeeClasses}
                            color="emerald"
                            allOptions={MADRASAH_CLASSES_MAP.filter(
                              (c) => c.level === "Ebtedayee",
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dakhil */}
                  <div className="p-4 rounded-xl border border-slate-200/60 bg-white/70 shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck
                        checked={madrasahLevels.includes("Dakhil")}
                        color="emerald"
                      />
                      <input
                        type="checkbox"
                        checked={madrasahLevels.includes("Dakhil")}
                        onChange={() => handleMadrasahLevelToggle("Dakhil")}
                        className="sr-only"
                      />
                      <span className="text-base font-semibold text-slate-800">
                        দাখিল
                      </span>
                    </label>
                    {madrasahLevels.includes("Dakhil") && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">
                          দাখিল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন
                          করুন:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={madrasahDakhilClasses}
                            setClasses={setMadrasahDakhilClasses}
                            color="emerald"
                            allOptions={MADRASAH_CLASSES_MAP.filter(
                              (c) => c.level === "Dakhil",
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alim */}
                  <div className="p-4 rounded-xl border border-slate-200/60 bg-white/70 shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck
                        checked={madrasahLevels.includes("Alim")}
                        color="emerald"
                      />
                      <input
                        type="checkbox"
                        checked={madrasahLevels.includes("Alim")}
                        onChange={() => handleMadrasahLevelToggle("Alim")}
                        className="sr-only"
                      />
                      <span className="text-base font-semibold text-slate-800">
                        আলিম
                      </span>
                    </label>
                    {madrasahLevels.includes("Alim") && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2 font-medium">
                          আলিম স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={madrasahAlimClasses}
                            setClasses={setMadrasahAlimClasses}
                            color="emerald"
                            allOptions={MADRASAH_CLASSES_MAP.filter(
                              (c) => c.level === "Alim",
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Versions */}
        <div className="bg-glass p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-lg border-b pb-3 flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            <span>৩. ভার্সন (Active Versions)</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            আপনার শিক্ষাপ্রতিষ্ঠানে কোন কোন ভার্সন সক্রিয় রয়েছে সিলেক্ট করুন:
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { value: "Bangla", label: "বাংলা (Bangla)" },
              { value: "English", label: "ইংরেজি (English)" },
              { value: "Madrasah", label: "মাদ্রাসা (Madrasah)" },
            ].map((ver) => {
              const isChecked = versions.includes(ver.value);
              return (
                <label
                  key={ver.value}
                  className={`flex items-center gap-3 p-4 px-5 rounded-xl border cursor-pointer shadow-sm transition-all select-none ${
                    isChecked
                      ? "bg-purple-50 border-purple-300 text-purple-800 font-semibold"
                      : "bg-white/50 border-slate-200 text-slate-600 hover:border-purple-200"
                  }`}
                >
                  <CustomCheck checked={isChecked} color="purple" />
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleVersionToggle(ver.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    {ver.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <RippleButton
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>সংরক্ষণ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>কনফিগারেশন সংরক্ষণ করুন</span>
              </>
            )}
            <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
