import React, { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { useUser, useAuth } from '@clerk/react';
import apiClient from '../lib/apiClient';
import { GraduationCap, Landmark, Sparkles, Phone, Mail, Globe, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingModal() {
  const { refreshProfile } = useUserContext();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [step, setStep] = useState(1); // 1: Selection, 2: Form
  const [userType, setUserType] = useState(null); // 'Teacher' or 'Institution'
  const [loading, setLoading] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [designation, setDesignation] = useState('');
  const [institutionName, setInstitutionName] = useState('');

  // Institution specific form states
  const [institutionType, setInstitutionType] = useState('');
  const [institutionMedium, setInstitutionMedium] = useState('');
  const [founderName, setFounderName] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [eiin, setEiin] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [studentCountRange, setStudentCountRange] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [officialWebsite, setOfficialWebsite] = useState('');

  // Address states
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  const divisions = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];
  const studentRanges = [
    { value: '1-100', label: '১–১০০ জন' },
    { value: '101-300', label: '১০১–৩০০ জন' },
    { value: '301-500', label: '৩০১–৫০০ জন' },
    { value: '501-1,000', label: '৫০১–১,০০০ জন' },
    { value: '1,001-2,000', label: '১,০০১–২,০০০ জন' },
    { value: '2,001-5,000', label: '২,০০১–৫,০০০ জন' },
    { value: '5,001+', label: '৫,০০১+ জন' }
  ];

  const handleSelectRole = (role) => {
    setUserType(role);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setUserType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { userType };

      if (userType === 'Teacher') {
        if (!firstName.trim() || !lastName.trim() || !institutionName.trim()) {
          toast.error('দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।');
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
          !postOffice.trim() ||
          !fullAddress.trim()
        ) {
          toast.error('দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।');
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
            postOffice,
            fullAddress,
          },
        };
      }

      const token = await getToken();
      const response = await apiClient.put('/users/onboard', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('অনবোর্ডিং সফলভাবে সম্পন্ন হয়েছে!');
        await refreshProfile();
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
      toast.error(error.response?.data?.error || 'অনবোর্ডিং সম্পন্ন করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = userType === 'Teacher';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 transform scale-100 flex flex-col my-8">
        
        {/* Progress Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                ইপ্রশ্নব্যাংক অনবোর্ডিং
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                অ্যাকাউন্ট ভেরিফিকেশন সম্পন্ন করার শেষ ধাপ
              </p>
            </div>
          </div>
          {step === 2 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-55 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              পেছনে ফিরুন
            </button>
          )}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-800 font-bengali">
                ইপ্রশ্নব্যাংক-এ আপনাকে স্বাগতম!
              </h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-bengali">
                ড্যাশবোর্ডে প্রবেশ করার আগে দয়া করে আপনার সঠিক ভূমিকা নির্বাচন করুন। এটি আপনার জন্য উপযুক্ত ফিচারগুলো সক্রিয় করবে।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Teacher Selection Card */}
              <button
                onClick={() => handleSelectRole('Teacher')}
                className="group p-6 text-left rounded-2xl border-2 border-slate-100 hover:border-indigo-500 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 w-fit">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors font-bengali">
                    আমি একজন শিক্ষক
                  </h3>
                  <p className="text-sm text-slate-500 font-bengali leading-relaxed">
                    ব্যক্তিগতভাবে প্রশ্ন তৈরি, শিক্ষার্থীদের অনলাইন পরীক্ষা নেওয়া এবং ওএমআর মূল্যায়নের জন্য আপনার শিক্ষক অ্যাকাউন্ট তৈরি করুন।
                  </p>
                </div>
              </button>

              {/* Institution Selection Card */}
              <button
                onClick={() => handleSelectRole('Institution')}
                className="group p-6 text-left rounded-2xl border-2 border-slate-100 hover:border-emerald-500 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 w-fit">
                  <Landmark className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors font-bengali">
                    শিক্ষা প্রতিষ্ঠান
                  </h3>
                  <p className="text-sm text-slate-500 font-bengali leading-relaxed">
                    আপনার স্কুল, কলেজ, মাদ্রাসা বা কোচিং সেন্টারের জন্য প্রাতিষ্ঠানিক অ্যাকাউন্ট তৈরি করে শিক্ষক ও শিক্ষার্থী পরিচালনা করুন।
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              
              {/* Teacher Form Fields */}
              {isTeacher && (
                <div className="space-y-4 font-bengali">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                    শিক্ষকের তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">প্রথম নাম <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                        placeholder="উদা: সাইফুল"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">শেষ নাম <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                        placeholder="উদা: ইসলাম"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">মোবাইল নম্বর (ভেরিফাইড)</label>
                      <input
                        type="text"
                        disabled
                        value={user?.primaryPhoneNumber?.phoneNumber || ''}
                        className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-sm font-sans font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">পদবি (Designation)</label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                      >
                        <option value="">পদবি নির্বাচন করুন</option>
                        <option value="সহকারী শিক্ষক">সহকারী শিক্ষক</option>
                        <option value="সিনিয়র শিক্ষক">সিনিয়র শিক্ষক</option>
                        <option value="প্রধান শিক্ষক">প্রধান শিক্ষক</option>
                        <option value="প্রভাষক">প্রভাষক</option>
                        <option value="সহকারী অধ্যাপক">সহকারী অধ্যাপক</option>
                        <option value="সহযোগী অধ্যাপক">সহযোগী অধ্যাপক</option>
                        <option value="অধ্যাপক">অধ্যাপক</option>
                        <option value="প্রিন্সিপাল">প্রিন্সিপাল</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠানের নাম <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                      placeholder="উদা: ঢাকা গভঃ মুসলিম হাই স্কুল"
                    />
                  </div>
                </div>
              )}

              {/* Institution Form Fields */}
              {!isTeacher && (
                <div className="space-y-4 font-bengali">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2 flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-emerald-500" />
                    শিক্ষা প্রতিষ্ঠানের তথ্য
                  </h3>
                  
                  {/* Type, Medium, Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠানের ধরন <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={institutionType}
                        onChange={(e) => setInstitutionType(e.target.value)}
                        className="w-full h-10 px-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="School">স্কুল</option>
                        <option value="College">কলেজ</option>
                        <option value="School & College">স্কুল অ্যান্ড কলেজ</option>
                        <option value="Madrasah">মাদ্রাসা</option>
                        <option value="Coaching Center">কোচিং সেন্টার</option>
                        <option value="Other">অন্যান্য</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">মাধ্যম <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={institutionMedium}
                        onChange={(e) => setInstitutionMedium(e.target.value)}
                        className="w-full h-10 px-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="Bangla">বাংলা</option>
                        <option value="English">ইংরেজি</option>
                        <option value="both">উভয় (English & Bangla)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">ছাত্র-ছাত্রীর সংখ্যা <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={studentCountRange}
                        onChange={(e) => setStudentCountRange(e.target.value)}
                        className="w-full h-10 px-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      >
                        <option value="">নির্বাচন করুন</option>
                        {studentRanges.map(range => (
                          <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠানের নাম <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                      placeholder="উদা: হলি ক্রস স্কুল অ্যান্ড কলেজ"
                    />
                  </div>

                  {/* Founder & Founding Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠাতার নাম <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={founderName}
                        onChange={(e) => setFounderName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
                        placeholder="প্রতিষ্ঠাতার পুরো নাম"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠা সাল <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={foundingYear}
                        onChange={(e) => setFoundingYear(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                        placeholder="উদা: ১৯৯৫"
                      />
                    </div>
                  </div>

                  {/* EIIN & Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">EIIN (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={eiin}
                        onChange={(e) => setEiin(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                        placeholder="প্রতিষ্ঠানের EIIN নম্বর"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠান কোড (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={institutionCode}
                        onChange={(e) => setInstitutionCode(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                        placeholder="উদা: বোর্ড বা জাতীয় কোড"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      প্রতিষ্ঠানের ঠিকানা
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">বিভাগ <span className="text-red-500">*</span></label>
                        <select
                          required
                          value={division}
                          onChange={(e) => setDivision(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                        >
                          <option value="">নির্বাচন</option>
                          {divisions.map(div => (
                            <option key={div} value={div}>{div}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">জেলা <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                          placeholder="জেলা"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">উপজেলা <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={upazila}
                          onChange={(e) => setUpazila(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                          placeholder="উপজেলা"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">ডাকঘর <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={postOffice}
                          onChange={(e) => setPostOffice(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                          placeholder="ডাকঘর"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                        placeholder="রোড নম্বর, হোল্ডিং, গ্রাম ইত্যাদি"
                      />
                    </div>
                  </div>

                  {/* Communication fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">যোগাযোগের মোবাইল <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                          placeholder="উদা: 01XXXXXXXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">অফিসিয়াল ইমেইল (ঐচ্ছিক)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={officialEmail}
                          onChange={(e) => setOfficialEmail(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                          placeholder="info@institution.edu"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">অফিসিয়াল ওয়েবসাইট (ঐচ্ছিক)</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={officialWebsite}
                          onChange={(e) => setOfficialWebsite(e.target.value)}
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
                          placeholder="www.institution.edu"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Form Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-300 ${
                  isTeacher 
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    সংরক্ষণ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    তথ্য সংরক্ষণ করুন
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
