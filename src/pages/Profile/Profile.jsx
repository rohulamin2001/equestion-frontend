import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { UserProfile, useUser, useAuth } from '@clerk/react';
import apiClient from '../../lib/apiClient';
import { GraduationCap, Landmark, Sparkles, Phone, Mail, Globe, MapPin, Loader2, Save, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { userProfile, refreshProfile } = useUserContext();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'security'
  const [loading, setLoading] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');
  const [institutionName, setInstitutionName] = useState('');

  // Institution States
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

  // Address
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

  // Prefill states when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
      setDesignation(userProfile.designation || '');
      setInstitutionName(userProfile.institutionName || '');

      setInstitutionType(userProfile.institutionType || '');
      setInstitutionMedium(userProfile.institutionMedium || '');
      setFounderName(userProfile.founderName || '');
      setFoundingYear(userProfile.foundingYear || '');
      setEiin(userProfile.eiin || '');
      setInstitutionCode(userProfile.institutionCode || '');
      setStudentCountRange(userProfile.studentCountRange || '');
      setContactNumber(userProfile.contactNumber || '');
      setOfficialEmail(userProfile.officialEmail || '');
      setOfficialWebsite(userProfile.officialWebsite || '');

      if (userProfile.addressInfo) {
        setDivision(userProfile.addressInfo.division || '');
        setDistrict(userProfile.addressInfo.district || '');
        setUpazila(userProfile.addressInfo.upazila || '');
        setPostOffice(userProfile.addressInfo.postOffice || '');
        setFullAddress(userProfile.addressInfo.fullAddress || '');
      }
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { userType: userProfile.userType };

      if (userProfile.userType === 'Teacher') {
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
      const response = await apiClient.put('/users/profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!');
        await refreshProfile();
      }
    } catch (error) {
      console.error('Update profile failed:', error);
      toast.error(error.response?.data?.error || 'তথ্য আপডেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const isTeacher = userProfile?.userType === 'Teacher';

  return (
    <div className="space-y-6 w-full">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">প্রোফাইল সেটিংস</h1>
        <p className="text-sm text-slate-500 font-bengali">আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য এবং অ্যাকাউন্ট নিরাপত্তা পরিচালনা করুন</p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all font-bengali ${
            activeTab === 'info'
              ? 'border-indigo-600 text-indigo-650'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {isTeacher ? <GraduationCap className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
          প্রোফাইল তথ্য
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all font-bengali ${
            activeTab === 'security'
              ? 'border-indigo-600 text-indigo-650'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          নিরাপত্তা ও অ্যাকাউন্ট
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'info' && (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          
          {/* Teacher Profile Form */}
          {isTeacher && (
            <div className="space-y-4 font-bengali">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                শিক্ষকের কাস্টম তথ্য
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    disabled
                    value={userProfile?.phoneNumber || ''}
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
                />
              </div>
            </div>
          )}

          {/* Institution Profile Form */}
          {!isTeacher && (
            <div className="space-y-4 font-bengali">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Landmark className="h-5 w-5 text-emerald-500" />
                শিক্ষা প্রতিষ্ঠানের কাস্টম তথ্য
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
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">প্রতিষ্ঠান কোড (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans"
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
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Form Save Button */}
          <div className="flex justify-end pt-4">
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
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  পরিবর্তন সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {activeTab === 'security' && (
        <div className="w-full">
          <div className="w-full overflow-hidden flex justify-center custom-clerk-profile-wrapper">
            <UserProfile 
              routing="hash"
              appearance={{
                variables: {
                  colorPrimary: '#4F46E5',
                  colorText: '#1E293B',
                  colorTextSecondary: '#64748B',
                  fontFamily: 'Noto Sans Bengali, sans-serif',
                  borderRadius: '16px',
                },
                elements: {
                  rootBox: "w-full max-w-none shadow-none",
                  card: "border border-slate-100 shadow-none w-full p-4 md:p-6 max-w-none bg-white rounded-2xl",
                  navbar: "border-r border-slate-100 bg-slate-50/50 p-4",
                  scrollBox: "shadow-none max-w-none w-full",
                  pageScrollBox: "p-4 md:p-6 w-full max-w-none",
                  navbarButton: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl px-3 py-2 text-xs font-semibold font-bengali transition-all duration-200",
                  navbarButtonActive: "bg-indigo-50 text-indigo-650 font-bold hover:bg-indigo-50 hover:text-indigo-650",
                  profileSectionTitle: "text-slate-800 font-bold border-b border-slate-100 pb-2 text-sm",
                  profileSectionHeader: "text-slate-800 font-bold",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-4 text-xs font-bold transition-all shadow-md shadow-indigo-500/20 duration-200",
                  formButtonReset: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl py-2 px-4 text-xs font-semibold transition-all duration-200",
                  formFieldInput: "h-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs transition-all duration-200",
                }
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
