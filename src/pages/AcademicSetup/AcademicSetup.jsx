import { RippleButton, RippleButtonRipples } from '@/components/ui/ripple-button';
import { useUserContext } from '@/context/UserContext';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@clerk/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ShieldAlert, Sliders } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Reusable custom checkbox
function CustomCheck({ checked, color = 'indigo' }) {
  const colors = {
    indigo:  { box: 'bg-indigo-600 border-indigo-600',   empty: 'bg-white border-slate-300' },
    orange:  { box: 'bg-orange-500 border-orange-500',   empty: 'bg-white border-slate-300' },
    emerald: { box: 'bg-emerald-600 border-emerald-600', empty: 'bg-white border-slate-300' },
  };
  const c = colors[color] || colors.indigo;
  return (
    <span className={`size-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${checked ? c.box : c.empty}`}>
      {checked && (
        <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

// Reusable class pill checkboxes — must be defined OUTSIDE the parent component
function ClassPills({ classes, setClasses, allOptions, color }) {
  return allOptions.map((cls) => {
    const isChecked = classes.includes(cls.value);
    return (
      <label
        key={cls.value}
        className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
          isChecked
            ? color === 'orange'
              ? 'bg-orange-50 border-orange-300/50 text-orange-700'
              : color === 'emerald'
              ? 'bg-emerald-50 border-emerald-300/40 text-emerald-700'
              : 'bg-indigo-50 border-indigo-300/40 text-indigo-700'
            : 'bg-white/[0.30] border-black/[0.06] text-slate-600 hover:bg-white/[0.50]'
        }`}
      >
        <CustomCheck checked={isChecked} color={color} />
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            if (isChecked) setClasses(classes.filter(c => c !== cls.value));
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
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { role } = useUserContext();
  const { config, isLoading, refetch } = useAcademicConfig();

  const DEFAULT_FORM = {
    activeTypes: ['School'],
    schoolLevels: ['Primary', 'Secondary'],
    madrasahLevels: ['Ebtedayee', 'Dakhil', 'Alim'],
    versions: ['Bangla'],
    schoolPrimaryClasses: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    schoolSecondaryClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    collegeClasses: ['Class 11', 'Class 12'],
    madrasahEbtedayeeClasses: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    madrasahDakhilClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    madrasahAlimClasses: ['Class 11', 'Class 12'],
  };

  // Derived state pattern: no useEffect needed.
  // userEdits = null means "not yet edited by user" → read from config.
  // Once user edits any field, userEdits holds the full form.
  const [userEdits, setUserEdits] = useState(null);

  const form = userEdits ?? (config ? {
    activeTypes:              config.activeTypes              || DEFAULT_FORM.activeTypes,
    schoolLevels:             config.schoolLevels             || DEFAULT_FORM.schoolLevels,
    madrasahLevels:           config.madrasahLevels           || DEFAULT_FORM.madrasahLevels,
    versions:                 config.versions                 || DEFAULT_FORM.versions,
    schoolPrimaryClasses:     config.schoolPrimaryClasses     || DEFAULT_FORM.schoolPrimaryClasses,
    schoolSecondaryClasses:   config.schoolSecondaryClasses   || DEFAULT_FORM.schoolSecondaryClasses,
    collegeClasses:           config.collegeClasses           || DEFAULT_FORM.collegeClasses,
    madrasahEbtedayeeClasses: config.madrasahEbtedayeeClasses || DEFAULT_FORM.madrasahEbtedayeeClasses,
    madrasahDakhilClasses:    config.madrasahDakhilClasses    || DEFAULT_FORM.madrasahDakhilClasses,
    madrasahAlimClasses:      config.madrasahAlimClasses      || DEFAULT_FORM.madrasahAlimClasses,
  } : DEFAULT_FORM);

  const setField = (key) => (val) =>
    setUserEdits((prev) => ({ ...(prev ?? form), [key]: val }));

  const {
    activeTypes, schoolLevels, madrasahLevels, versions,
    schoolPrimaryClasses, schoolSecondaryClasses, collegeClasses,
    madrasahEbtedayeeClasses, madrasahDakhilClasses, madrasahAlimClasses,
  } = form;

  const setActiveTypes              = setField('activeTypes');
  const setSchoolLevels             = setField('schoolLevels');
  const setMadrasahLevels           = setField('madrasahLevels');
  const setVersions                 = setField('versions');
  const setSchoolPrimaryClasses     = setField('schoolPrimaryClasses');
  const setSchoolSecondaryClasses   = setField('schoolSecondaryClasses');
  const setCollegeClasses           = setField('collegeClasses');
  const setMadrasahEbtedayeeClasses = setField('madrasahEbtedayeeClasses');
  const setMadrasahDakhilClasses    = setField('madrasahDakhilClasses');
  const setMadrasahAlimClasses      = setField('madrasahAlimClasses');

  // ── ALL HOOKS MUST BE BEFORE ANY EARLY RETURN ──────────────────────────────

  // Mutation to save config
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const response = await apiClient.post('/academic-config', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicConfig'] });
      toast.success('প্রতিষ্ঠান কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
      refetch();
      setUserEdits(null); // reset edits so next config load re-populates
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    },
  });

  // ── EARLY RETURNS (after all hooks) ────────────────────────────────────────

  if (role !== 'Super Admin') {
    return (
      <div className="bg-glass rounded-2xl border border-red-200/40 backdrop-blur-md shadow-sm p-16 text-center max-w-md mx-auto space-y-4 font-bengali">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">অননুমোদিত অ্যাক্সেস</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          দুঃখিত, এই পেজটি শুধুমাত্র **সুপার এডমিন** (Super Admin) অ্যাক্সেস করতে পারবেন।
        </p>
      </div>
    );
  }

  // Toggle handlers
  const handleTypeToggle = (type) => {
    if (activeTypes.includes(type)) {
      if (activeTypes.length === 1) { toast.error('কমপক্ষে একটি প্রতিষ্ঠানের ধরন নির্বাচন করতে হবে।'); return; }
      setActiveTypes(activeTypes.filter(t => t !== type));
    } else {
      setActiveTypes([...activeTypes, type]);
    }
  };

  const handleSchoolLevelToggle = (lvl) => {
    if (schoolLevels.includes(lvl)) setSchoolLevels(schoolLevels.filter(l => l !== lvl));
    else setSchoolLevels([...schoolLevels, lvl]);
  };

  const handleMadrasahLevelToggle = (lvl) => {
    if (madrasahLevels.includes(lvl)) setMadrasahLevels(madrasahLevels.filter(l => l !== lvl));
    else setMadrasahLevels([...madrasahLevels, lvl]);
  };

  const handleVersionToggle = (ver) => {
    if (versions.includes(ver)) {
      if (versions.length === 1) { toast.error('কমপক্ষে একটি সক্রিয় সংস্করণ (Version) নির্বাচন করতে হবে।'); return; }
      setVersions(versions.filter(v => v !== ver));
    } else {
      setVersions([...versions, ver]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      activeTypes,
      schoolLevels: activeTypes.includes('School') ? schoolLevels : [],
      madrasahLevels: activeTypes.includes('Madrasah') ? madrasahLevels : [],
      versions,
      schoolPrimaryClasses: activeTypes.includes('School') && schoolLevels.includes('Primary') ? schoolPrimaryClasses : [],
      schoolSecondaryClasses: activeTypes.includes('School') && schoolLevels.includes('Secondary') ? schoolSecondaryClasses : [],
      collegeClasses: activeTypes.includes('College') ? collegeClasses : [],
      madrasahEbtedayeeClasses: activeTypes.includes('Madrasah') && madrasahLevels.includes('Ebtedayee') ? madrasahEbtedayeeClasses : [],
      madrasahDakhilClasses: activeTypes.includes('Madrasah') && madrasahLevels.includes('Dakhil') ? madrasahDakhilClasses : [],
      madrasahAlimClasses: activeTypes.includes('Madrasah') && madrasahLevels.includes('Alim') ? madrasahAlimClasses : [],
    });
  };

  if (isLoading) {
    return (
      <div className="bg-glass rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm p-16 flex flex-col items-center justify-center space-y-3 font-bengali">
        <Loader2 className="size-8 text-[#4F46E5] animate-spin" />
        <p className="text-slate-500 text-sm">কনফিগারেশন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full font-bengali">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">অ্যাকাডেমিক সেটআপ (সুপার এডমিন)</h1>
          <p className="text-slate-500 text-sm mt-1">আপনার শিক্ষাপ্রতিষ্ঠানের ধরণ, স্তর এবং ভাষা সংস্করণসমূহ কনফিগার করুন।</p>
        </div>
        <div className="p-3 bg-[#4F46E5]/10 text-[#4F46E5] rounded-2xl shrink-0">
          <Sliders className="size-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Active Types */}
        <div className="bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b border-black/[0.05] pb-2">১. প্রতিষ্ঠানের ধরণ (Institution Types)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার প্রতিষ্ঠানে যে যে শিক্ষাব্যবস্থা চালু আছে তা সিলেক্ট করুন (একাধিক সিলেক্ট করা যাবে):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: 'School',   label: 'স্কুল (School)',     desc: '১ম থেকে ১০ম শ্রেণীর সাধারণ পাঠ্যক্রম' },
              { value: 'College',  label: 'কলেজ (College)',     desc: 'একাদশ ও দ্বাদশ শ্রেণীর পাঠ্যক্রম' },
              { value: 'Madrasah', label: 'মাদ্রাসা (Madrasah)', desc: 'ইবতেদায়ী, দাখিল ও আলিম পাঠ্যক্রম' },
            ].map((item) => {
              const isChecked = activeTypes.includes(item.value);
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleTypeToggle(item.value)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 ${
                    isChecked
                      ? 'bg-[#4F46E5]/10 border-[#4F46E5] ring-2 ring-[#4F46E5]/10'
                      : 'bg-white/[0.45] border-black/[0.06] hover:border-black/[0.12] hover:bg-white/[0.60] backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-slate-800 text-[15px]">{item.label}</span>
                    <span className={`size-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                      isChecked ? 'bg-[#4F46E5] border-[#4F46E5] text-white' : 'border-black/[0.15] text-transparent'
                    }`}>✓</span>
                  </div>
                  <span className="text-slate-500 text-xs">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Levels Configuration */}
        {(activeTypes.includes('School') || activeTypes.includes('Madrasah') || activeTypes.includes('College')) && (
          <div className="bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b border-black/[0.05] pb-2">২. স্তরসমূহ কনফিগার করুন (Levels Configuration)</h3>

            {/* School levels */}
            {activeTypes.includes('School') && (
              <div className="space-y-4 p-6 rounded-2xl border border-[#4F46E5]/10 bg-[#4F46E5]/5">
                <h4 className="font-bold text-[#4F46E5] text-sm">স্কুল স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</h4>
                <div className="space-y-4">
                  {/* Primary */}
                  <div className="p-4 rounded-xl border border-black/[0.05] bg-white/[0.50] backdrop-blur-sm shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck checked={schoolLevels.includes('Primary')} color="indigo" />
                      <input type="checkbox" checked={schoolLevels.includes('Primary')} onChange={() => handleSchoolLevelToggle('Primary')} className="sr-only" />
                      <span className="text-base font-bold text-slate-800">প্রাইমারি স্কুল</span>
                    </label>
                    {schoolLevels.includes('Primary') && (
                      <div className="pl-7 pt-2 border-t border-black/[0.05]">
                        <p className="text-xs text-slate-500 mb-2">প্রাইমারি স্কুল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={schoolPrimaryClasses} setClasses={setSchoolPrimaryClasses} color="indigo"
                            allOptions={[
                              { value: 'Class 1', label: '১ম শ্রেণী' }, { value: 'Class 2', label: '২য় শ্রেণী' },
                              { value: 'Class 3', label: '৩য় শ্রেণী' }, { value: 'Class 4', label: '৪র্থ শ্রেণী' },
                              { value: 'Class 5', label: '৫ম শ্রেণী' },
                            ]}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Secondary */}
                  <div className="p-4 rounded-xl border border-black/[0.05] bg-white/[0.50] backdrop-blur-sm shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck checked={schoolLevels.includes('Secondary')} color="indigo" />
                      <input type="checkbox" checked={schoolLevels.includes('Secondary')} onChange={() => handleSchoolLevelToggle('Secondary')} className="sr-only" />
                      <span className="text-base font-bold text-slate-800">মাধ্যমিক স্কুল</span>
                    </label>
                    {schoolLevels.includes('Secondary') && (
                      <div className="pl-7 pt-2 border-t border-black/[0.05]">
                        <p className="text-xs text-slate-500 mb-2">মাধ্যমিক স্কুল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={schoolSecondaryClasses} setClasses={setSchoolSecondaryClasses} color="indigo"
                            allOptions={[
                              { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী' }, { value: 'Class 7', label: '৭ম শ্রেণী' },
                              { value: 'Class 8', label: '৮ম শ্রেণী' }, { value: 'Class 9', label: '৯ম শ্রেণী' },
                              { value: 'Class 10', label: '১০ম শ্রেণী' },
                            ]}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* College levels */}
            {activeTypes.includes('College') && (
              <div className="space-y-4 p-6 rounded-2xl border border-[#F97316]/10 bg-[#F97316]/5">
                <h4 className="font-bold text-[#F97316] text-sm">কলেজ স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</h4>
                <div className="p-4 rounded-xl border border-black/[0.05] bg-white/[0.50] backdrop-blur-sm shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="size-2.5 rounded-full bg-[#F97316]"></span>
                    <span className="text-base font-bold text-slate-800">উচ্চ মাধ্যমিক</span>
                  </div>
                  <div className="pl-5 pt-2 border-t border-black/[0.05]">
                    <p className="text-xs text-slate-500 mb-2">উচ্চ মাধ্যমিক স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                    <div className="flex flex-wrap gap-3">
                      <ClassPills
                        classes={collegeClasses} setClasses={setCollegeClasses} color="orange"
                        allOptions={[
                          { value: 'Class 11', label: 'একাদশ শ্রেণী' },
                          { value: 'Class 12', label: 'দ্বাদশ শ্রেণী' },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Madrasah levels */}
            {activeTypes.includes('Madrasah') && (
              <div className="space-y-4 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
                <h4 className="font-bold text-emerald-600 text-sm">মাদ্রাসা স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</h4>
                <div className="space-y-4">
                  {/* Ebtedayee */}
                  <div className="p-4 rounded-xl border border-black/[0.05] bg-white/[0.50] backdrop-blur-sm shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck checked={madrasahLevels.includes('Ebtedayee')} color="emerald" />
                      <input type="checkbox" checked={madrasahLevels.includes('Ebtedayee')} onChange={() => handleMadrasahLevelToggle('Ebtedayee')} className="sr-only" />
                      <span className="text-base font-bold text-slate-800">ইবতেদায়ী</span>
                    </label>
                    {madrasahLevels.includes('Ebtedayee') && (
                      <div className="pl-7 pt-2 border-t border-black/[0.05]">
                        <p className="text-xs text-slate-500 mb-2">ইবতেদায়ী স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={madrasahEbtedayeeClasses} setClasses={setMadrasahEbtedayeeClasses} color="emerald"
                            allOptions={[
                              { value: 'Class 1', label: '১ম শ্রেণী' }, { value: 'Class 2', label: '২য় শ্রেণী' },
                              { value: 'Class 3', label: '৩য় শ্রেণী' }, { value: 'Class 4', label: '৪র্থ শ্রেণী' },
                              { value: 'Class 5', label: '৫ম শ্রেণী' },
                            ]}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dakhil */}
                  <div className="p-4 rounded-xl border border-black/[0.05] bg-white/[0.50] backdrop-blur-sm shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck checked={madrasahLevels.includes('Dakhil')} color="emerald" />
                      <input type="checkbox" checked={madrasahLevels.includes('Dakhil')} onChange={() => handleMadrasahLevelToggle('Dakhil')} className="sr-only" />
                      <span className="text-base font-bold text-slate-800">দাখিল</span>
                    </label>
                    {madrasahLevels.includes('Dakhil') && (
                      <div className="pl-7 pt-2 border-t border-black/[0.05]">
                        <p className="text-xs text-slate-500 mb-2">দাখিল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={madrasahDakhilClasses} setClasses={setMadrasahDakhilClasses} color="emerald"
                            allOptions={[
                              { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী' }, { value: 'Class 7', label: '৭ম শ্রেণী' },
                              { value: 'Class 8', label: '৮ম শ্রেণী' }, { value: 'Class 9', label: '৯ম শ্রেণী' },
                              { value: 'Class 10', label: '১০ম শ্রেণী' },
                            ]}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alim */}
                  <div className="p-4 rounded-xl border border-black/[0.05] bg-white/[0.50] backdrop-blur-sm shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheck checked={madrasahLevels.includes('Alim')} color="emerald" />
                      <input type="checkbox" checked={madrasahLevels.includes('Alim')} onChange={() => handleMadrasahLevelToggle('Alim')} className="sr-only" />
                      <span className="text-base font-bold text-slate-800">আলিম</span>
                    </label>
                    {madrasahLevels.includes('Alim') && (
                      <div className="pl-7 pt-2 border-t border-black/[0.05]">
                        <p className="text-xs text-slate-500 mb-2">আলিম স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          <ClassPills
                            classes={madrasahAlimClasses} setClasses={setMadrasahAlimClasses} color="emerald"
                            allOptions={[
                              { value: 'Class 11', label: 'একাদশ শ্রেণী' },
                              { value: 'Class 12', label: 'দ্বাদশ শ্রেণী' },
                            ]}
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
        <div className="bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b border-black/[0.05] pb-2">৩. ভাষা সংস্করণ (Active Versions)</h3>
          <p className="text-xs text-slate-500">
            আপনার শিক্ষাপ্রতিষ্ঠানে কোন কোন ভাষা সংস্করণ সক্রিয় রয়েছে সিলেক্ট করুন:
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'Bangla',  label: 'বাংলা সংস্করণ (Bangla Version)' },
              { value: 'English', label: 'ইংরেজি সংস্করণ (English Version)' },
            ].map((ver) => {
              const isChecked = versions.includes(ver.value);
              return (
                <label
                  key={ver.value}
                  className={`flex items-center gap-3 p-4 px-5 rounded-xl border cursor-pointer shadow-sm transition-all backdrop-blur-sm ${
                    isChecked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                      : 'bg-white/[0.45] border-black/[0.06] hover:border-indigo-300/60'
                  }`}
                >
                  <CustomCheck checked={isChecked} color="indigo" />
                  <input type="checkbox" checked={isChecked} onChange={() => handleVersionToggle(ver.value)} className="sr-only" />
                  <span className="text-sm font-bold text-slate-700">{ver.label}</span>
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
            className="flex items-center gap-2 px-8 py-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-purple-500/10 transition-all duration-200"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                সংরক্ষণ করা হচ্ছে...
              </>
            ) : (
              'কনফিগারেশন সংরক্ষণ করুন'
            )}
            <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
          </RippleButton>
        </div>
      </form>
    </div>
  );
}
