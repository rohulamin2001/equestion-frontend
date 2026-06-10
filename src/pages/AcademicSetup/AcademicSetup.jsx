import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserContext } from '@/context/UserContext';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { RippleButton, RippleButtonRipples } from '@/components/ui/ripple-button';
import { Loader2, Sliders, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AcademicSetup() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { role } = useUserContext();
  const { config, isLoading, refetch } = useAcademicConfig();

  // Local Form States
  const [activeTypes, setActiveTypes] = useState(['School']);
  const [schoolLevels, setSchoolLevels] = useState(['Primary', 'Secondary']);
  const [madrasahLevels, setMadrasahLevels] = useState(['Ebtedayee', 'Dakhil', 'Alim']);
  const [versions, setVersions] = useState(['Bangla']);

  const [schoolPrimaryClasses, setSchoolPrimaryClasses] = useState(["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"]);
  const [schoolSecondaryClasses, setSchoolSecondaryClasses] = useState(["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]);
  const [collegeClasses, setCollegeClasses] = useState(["Class 11", "Class 12"]);
  const [madrasahEbtedayeeClasses, setMadrasahEbtedayeeClasses] = useState(["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"]);
  const [madrasahDakhilClasses, setMadrasahDakhilClasses] = useState(["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]);
  const [madrasahAlimClasses, setMadrasahAlimClasses] = useState(["Class 11", "Class 12"]);

  // Sync state with loaded config
  useEffect(() => {
    if (config) {
      setActiveTypes(config.activeTypes || []);
      setSchoolLevels(config.schoolLevels || []);
      setMadrasahLevels(config.madrasahLevels || []);
      setVersions(config.versions || ['Bangla']);

      setSchoolPrimaryClasses(config.schoolPrimaryClasses || ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"]);
      setSchoolSecondaryClasses(config.schoolSecondaryClasses || ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]);
      setCollegeClasses(config.collegeClasses || ["Class 11", "Class 12"]);
      setMadrasahEbtedayeeClasses(config.madrasahEbtedayeeClasses || ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"]);
      setMadrasahDakhilClasses(config.madrasahDakhilClasses || ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]);
      setMadrasahAlimClasses(config.madrasahAlimClasses || ["Class 11", "Class 12"]);
    }
  }, [config]);

  // Check if role is strictly Super Admin
  if (role !== 'Super Admin') {
    return (
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-16 text-center max-w-md mx-auto space-y-4">
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
      if (activeTypes.length === 1) {
        toast.error('কমপক্ষে একটি প্রতিষ্ঠানের ধরন নির্বাচন করতে হবে।');
        return;
      }
      setActiveTypes(activeTypes.filter(t => t !== type));
    } else {
      setActiveTypes([...activeTypes, type]);
    }
  };

  const handleSchoolLevelToggle = (lvl) => {
    if (schoolLevels.includes(lvl)) {
      setSchoolLevels(schoolLevels.filter(l => l !== lvl));
    } else {
      setSchoolLevels([...schoolLevels, lvl]);
    }
  };

  const handleMadrasahLevelToggle = (lvl) => {
    if (madrasahLevels.includes(lvl)) {
      setMadrasahLevels(madrasahLevels.filter(l => l !== lvl));
    } else {
      setMadrasahLevels([...madrasahLevels, lvl]);
    }
  };

  const handleVersionToggle = (ver) => {
    if (versions.includes(ver)) {
      if (versions.length === 1) {
        toast.error('কমপক্ষে একটি সক্রিয় সংস্করণ (Version) নির্বাচন করতে হবে।');
        return;
      }
      setVersions(versions.filter(v => v !== ver));
    } else {
      setVersions([...versions, ver]);
    }
  };

  // Mutation to save config
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const response = await apiClient.post('/academic-config', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicConfig'] });
      toast.success('প্রতিষ্ঠান কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
      refetch();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
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
    };

    saveMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-slate-500 text-sm">কনফিগারেশন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">অ্যাকাডেমিক সেটআপ (সুপার এডমিন)</h1>
          <p className="text-slate-500 text-sm mt-1">আপনার শিক্ষাপ্রতিষ্ঠানের ধরণ, স্তর এবং ভাষা সংস্করণসমূহ কনফিগার করুন।</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
          <Sliders className="size-6" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Active Types */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b pb-2">১. প্রতিষ্ঠানের ধরণ (Institution Types)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার প্রতিষ্ঠানে যে যে শিক্ষাব্যবস্থা চালু আছে তা সিলেক্ট করুন (একাধিক সিলেক্ট করা যাবে):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: 'School', label: 'স্কুল (School)', desc: '১ম থেকে ১০ম শ্রেণীর সাধারণ পাঠ্যক্রম' },
              { value: 'College', label: 'কলেজ (College)', desc: 'একাদশ ও দ্বাদশ শ্রেণীর পাঠ্যক্রম' },
              { value: 'Madrasah', label: 'মাদ্রাসা (Madrasah)', desc: 'ইবতেদায়ী, দাখিল ও আলিম পাঠ্যক্রম' }
            ].map((item) => {
              const isChecked = activeTypes.includes(item.value);
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => handleTypeToggle(item.value)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 ${
                    isChecked
                      ? 'bg-indigo-50/20 border-indigo-500 ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-slate-800 text-[15px]">{item.label}</span>
                    <span className={`size-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                      isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 text-transparent'
                    }`}>✓</span>
                  </div>
                  <span className="text-slate-500 text-xs">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Levels Configurations */}
        {(activeTypes.includes('School') || activeTypes.includes('Madrasah') || activeTypes.includes('College')) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b pb-2">২. স্তরসমূহ কনফিগার করুন (Levels Configuration)</h3>
            
            {/* School levels */}
            {activeTypes.includes('School') && (
              <div className="space-y-4 p-6 rounded-2xl border border-indigo-50 bg-indigo-50/5">
                <h4 className="font-bold text-indigo-700 text-sm">স্কুল স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</h4>
                <div className="space-y-4">
                  {/* Primary Level */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolLevels.includes('Primary')}
                        onChange={() => handleSchoolLevelToggle('Primary')}
                        className="accent-indigo-600 size-4"
                      />
                      <span className="text-base font-bold text-slate-800">প্রাইমারি স্কুল</span>
                    </label>
                    {schoolLevels.includes('Primary') && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">প্রাইমারি স্কুল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'Class 1', label: '১ম শ্রেণী' },
                            { value: 'Class 2', label: '২য় শ্রেণী' },
                            { value: 'Class 3', label: '৩য় শ্রেণী' },
                            { value: 'Class 4', label: '৪র্থ শ্রেণী' },
                            { value: 'Class 5', label: '৫ম শ্রেণী' }
                          ].map((cls) => {
                            const isClsChecked = schoolPrimaryClasses.includes(cls.value);
                            return (
                              <label key={cls.value} className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                                isClsChecked 
                                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={isClsChecked}
                                  onChange={() => {
                                    if (isClsChecked) {
                                      setSchoolPrimaryClasses(schoolPrimaryClasses.filter(c => c !== cls.value));
                                    } else {
                                      setSchoolPrimaryClasses([...schoolPrimaryClasses, cls.value]);
                                    }
                                  }}
                                  className="accent-indigo-600 size-3.5"
                                />
                                <span>{cls.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Secondary Level */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolLevels.includes('Secondary')}
                        onChange={() => handleSchoolLevelToggle('Secondary')}
                        className="accent-indigo-600 size-4"
                      />
                      <span className="text-base font-bold text-slate-800">মাধ্যমিক স্কুল</span>
                    </label>
                    {schoolLevels.includes('Secondary') && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">মাধ্যমিক স্কুল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী' },
                            { value: 'Class 7', label: '৭ম শ্রেণী' },
                            { value: 'Class 8', label: '৮ম শ্রেণী' },
                            { value: 'Class 9', label: '৯ম শ্রেণী' },
                            { value: 'Class 10', label: '১০ম শ্রেণী' }
                          ].map((cls) => {
                            const isClsChecked = schoolSecondaryClasses.includes(cls.value);
                            return (
                              <label key={cls.value} className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                                isClsChecked 
                                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={isClsChecked}
                                  onChange={() => {
                                    if (isClsChecked) {
                                      setSchoolSecondaryClasses(schoolSecondaryClasses.filter(c => c !== cls.value));
                                    } else {
                                      setSchoolSecondaryClasses([...schoolSecondaryClasses, cls.value]);
                                    }
                                  }}
                                  className="accent-indigo-600 size-3.5"
                                />
                                <span>{cls.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* College levels */}
            {activeTypes.includes('College') && (
              <div className="space-y-4 p-6 rounded-2xl border border-amber-50 bg-amber-50/5">
                <h4 className="font-bold text-amber-700 text-sm">কলেজ স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</h4>
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="size-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-base font-bold text-slate-800">উচ্চ মাধ্যমিক</span>
                  </div>
                  <div className="pl-5 pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">উচ্চ মাধ্যমিক স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'Class 11', label: 'একাদশ শ্রেণী' },
                        { value: 'Class 12', label: 'দ্বাদশ শ্রেণী' }
                      ].map((cls) => {
                        const isClsChecked = collegeClasses.includes(cls.value);
                        return (
                          <label key={cls.value} className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                            isClsChecked 
                              ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}>
                            <input
                              type="checkbox"
                              checked={isClsChecked}
                              onChange={() => {
                                if (isClsChecked) {
                                  setCollegeClasses(collegeClasses.filter(c => c !== cls.value));
                                } else {
                                  setCollegeClasses([...collegeClasses, cls.value]);
                                }
                              }}
                              className="accent-amber-600 size-3.5"
                            />
                            <span>{cls.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Madrasah levels */}
            {activeTypes.includes('Madrasah') && (
              <div className="space-y-4 p-6 rounded-2xl border border-emerald-50 bg-emerald-50/5">
                <h4 className="font-bold text-emerald-700 text-sm">মাদ্রাসা স্তরের সিলেবাসসমূহ ও ক্লাসসমূহ:</h4>
                <div className="space-y-4">
                  {/* Ebtedayee Level */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={madrasahLevels.includes('Ebtedayee')}
                        onChange={() => handleMadrasahLevelToggle('Ebtedayee')}
                        className="accent-emerald-600 size-4"
                      />
                      <span className="text-base font-bold text-slate-800">ইবতেদায়ী</span>
                    </label>
                    {madrasahLevels.includes('Ebtedayee') && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">ইবতেদায়ী স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'Class 1', label: '১ম শ্রেণী' },
                            { value: 'Class 2', label: '২য় শ্রেণী' },
                            { value: 'Class 3', label: '৩য় শ্রেণী' },
                            { value: 'Class 4', label: '৪র্থ শ্রেণী' },
                            { value: 'Class 5', label: '৫ম শ্রেণী' }
                          ].map((cls) => {
                            const isClsChecked = madrasahEbtedayeeClasses.includes(cls.value);
                            return (
                              <label key={cls.value} className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                                isClsChecked 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={isClsChecked}
                                  onChange={() => {
                                    if (isClsChecked) {
                                      setMadrasahEbtedayeeClasses(madrasahEbtedayeeClasses.filter(c => c !== cls.value));
                                    } else {
                                      setMadrasahEbtedayeeClasses([...madrasahEbtedayeeClasses, cls.value]);
                                    }
                                  }}
                                  className="accent-emerald-600 size-3.5"
                                />
                                <span>{cls.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dakhil Level */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={madrasahLevels.includes('Dakhil')}
                        onChange={() => handleMadrasahLevelToggle('Dakhil')}
                        className="accent-emerald-600 size-4"
                      />
                      <span className="text-base font-bold text-slate-800">দাখিল</span>
                    </label>
                    {madrasahLevels.includes('Dakhil') && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">দাখিল স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী' },
                            { value: 'Class 7', label: '৭ম শ্রেণী' },
                            { value: 'Class 8', label: '৮ম শ্রেণী' },
                            { value: 'Class 9', label: '৯ম শ্রেণী' },
                            { value: 'Class 10', label: '১০ম শ্রেণী' }
                          ].map((cls) => {
                            const isClsChecked = madrasahDakhilClasses.includes(cls.value);
                            return (
                              <label key={cls.value} className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                                isClsChecked 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={isClsChecked}
                                  onChange={() => {
                                    if (isClsChecked) {
                                      setMadrasahDakhilClasses(madrasahDakhilClasses.filter(c => c !== cls.value));
                                    } else {
                                      setMadrasahDakhilClasses([...madrasahDakhilClasses, cls.value]);
                                    }
                                  }}
                                  className="accent-emerald-600 size-3.5"
                                />
                                <span>{cls.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alim Level */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={madrasahLevels.includes('Alim')}
                        onChange={() => handleMadrasahLevelToggle('Alim')}
                        className="accent-emerald-600 size-4"
                      />
                      <span className="text-base font-bold text-slate-800">আলিম</span>
                    </label>
                    {madrasahLevels.includes('Alim') && (
                      <div className="pl-7 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">আলিম স্তরের কোন কোন ক্লাস সক্রিয় থাকবে নির্বাচন করুন:</p>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'Class 11', label: 'একাদশ শ্রেণী' },
                            { value: 'Class 12', label: 'দ্বাদশ শ্রেণী' }
                          ].map((cls) => {
                            const isClsChecked = madrasahAlimClasses.includes(cls.value);
                            return (
                              <label key={cls.value} className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                                isClsChecked 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={isClsChecked}
                                  onChange={() => {
                                    if (isClsChecked) {
                                      setMadrasahAlimClasses(madrasahAlimClasses.filter(c => c !== cls.value));
                                    } else {
                                      setMadrasahAlimClasses([...madrasahAlimClasses, cls.value]);
                                    }
                                  }}
                                  className="accent-emerald-600 size-3.5"
                                />
                                <span>{cls.label}</span>
                              </label>
                            );
                          })}
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b pb-2">৩. ভাষা সংস্করণ (Active Versions)</h3>
          <p className="text-xs text-slate-500">
            আপনার শিক্ষাপ্রতিষ্ঠানে কোন কোন ভাষা সংস্করণ সক্রিয় রয়েছে সিলেক্ট করুন:
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'Bangla', label: 'বাংলা সংস্করণ (Bangla Version)' },
              { value: 'English', label: 'ইংরেজি সংস্করণ (English Version)' }
            ].map((ver) => {
              const isChecked = versions.includes(ver.value);
              return (
                <label key={ver.value} className="flex items-center gap-3 bg-white p-4 px-5 rounded-xl border border-slate-200 cursor-pointer shadow-sm hover:border-indigo-400 transition-all">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleVersionToggle(ver.value)}
                    className="accent-indigo-600 size-4"
                  />
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
            className="flex items-center gap-2 px-8 py-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-150 transition-all duration-200"
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
