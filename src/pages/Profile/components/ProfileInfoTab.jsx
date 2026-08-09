import {
  Camera,
  ChevronDown,
  Globe,
  GraduationCap,
  Loader2,
  Mail,
  Phone,
  Save,
} from "lucide-react";
import BdAddressSelect from "../../../components/BdAddressSelect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export default function ProfileInfoTab({ profile }) {
  const {
    userProfile,
    role,
    loading,
    fileInputRef,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    designation,
    setDesignation,
    institutionName,
    setInstitutionName,
    institutionType,
    setInstitutionType,
    institutionMedium,
    setInstitutionMedium,
    founderName,
    setFounderName,
    foundingYear,
    setFoundingYear,
    eiin,
    setEiin,
    institutionCode,
    setInstitutionCode,
    studentCountRange,
    setStudentCountRange,
    contactNumber,
    setContactNumber,
    officialEmail,
    setOfficialEmail,
    officialWebsite,
    setOfficialWebsite,
    division,
    setDivision,
    district,
    setDistrict,
    upazila,
    setUpazila,
    union,
    setUnion,
    postOffice,
    setPostOffice,
    fullAddress,
    setFullAddress,
    imageUploading,
    studentRanges,
    institutionTypeLabels,
    institutionMediumLabels,
    roleLabels,
    isSubscriber,
    isTeacher,
    handleImageClick,
    handleImageChange,
    handleProfileSubmit,
  } = profile;

  return (
    <div className="bg-glass-elevated backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-soft space-y-8">
      {/* Custom Avatar Upload Section */}
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200/60 pb-6">
        <div
          onClick={imageUploading ? undefined : handleImageClick}
          className={`relative h-28 w-28 rounded-full border-2 border-purple-200/70 bg-purple-50/50 overflow-hidden group shadow-md flex items-center justify-center transition-all duration-300 ring-4 ring-purple-500/15 ${
            imageUploading
              ? "cursor-not-allowed opacity-80 pointer-events-none"
              : "cursor-pointer hover:border-[var(--purple-600)] hover:shadow-purple-500/20"
          }`}
        >
          {imageUploading ? (
            <Loader2 className="h-8 w-8 text-[var(--purple-600)] animate-spin" />
          ) : userProfile?.imageUrl ? (
            <img
              src={userProfile.imageUrl}
              alt="Profile"
              className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
            />
          ) : (
            <GraduationCap className="h-12 w-12 text-purple-400" />
          )}
          {!imageUploading && (
            <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 backdrop-blur-[2px]">
              <Camera className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={imageUploading}
          className="hidden"
          accept="image/*"
        />
        <div className="text-center">
          <h4 className="text-sm font-bold text-slate-800 font-sans">
            {!isSubscriber || isTeacher
              ? "প্রোফাইল ছবি পরিবর্তন করুন"
              : "প্রতিষ্ঠানের লোগো পরিবর্তন করুন"}
          </h4>
          <p className="text-xs text-slate-400 font-bengali mt-0.5">
            JPG, PNG ফরম্যাটে সর্বোচ্চ ৫ মেগাবাইট
          </p>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Management/Personal Profile Form */}
        {!isSubscriber && (
          <div className="space-y-4 font-bengali">
            <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
              <span className="text-xs font-semibold text-slate-500">
                আপনার রোল:
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100/60 text-[var(--purple-700)] border border-purple-200/60 font-sans">
                {roleLabels[role] || role}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                মোবাইল নম্বর (অপরিবর্তনযোগ্য)
              </label>
              <input
                type="text"
                disabled
                value={userProfile?.phoneNumber || ""}
                className="w-full h-10 px-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-sm font-sans font-medium"
              />
            </div>
          </div>
        )}

        {/* Teacher Profile Form */}
        {isSubscriber && isTeacher && (
          <div className="space-y-4 font-bengali">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  মোবাইল নম্বর (অপরিবর্তনযোগ্য)
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
                    >
                      <span>{designation || "পদবি নির্বাচন করুন"}</span>
                      <ChevronDown className="size-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuItem
                      onSelect={() => setDesignation("")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                        !designation
                          ? "bg-purple-50 text-[var(--purple-700)]"
                          : "text-slate-700"
                      }`}
                    >
                      <span>পদবি নির্বাচন করুন</span>
                      {!designation && (
                        <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                      )}
                    </DropdownMenuItem>
                    {[
                      "সহকারী শিক্ষক",
                      "সিনিয়র শিক্ষক",
                      "প্রধান শিক্ষক",
                      "প্রভাষক",
                      "সহকারী অধ্যাপক",
                      "সহযোগী অধ্যাপক",
                      "অধ্যাপক",
                      "প্রিন্সিপাল",
                      "অন্যান্য",
                    ].map((deg) => (
                      <DropdownMenuItem
                        key={deg}
                        onSelect={() => setDesignation(deg)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                          designation === deg
                            ? "bg-purple-50 text-[var(--purple-700)]"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{deg}</span>
                        {designation === deg && (
                          <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
              />
            </div>
          </div>
        )}

        {/* Institution Profile Form */}
        {isSubscriber && !isTeacher && (
          <div className="space-y-4 font-bengali">
            {/* Type, Medium, Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  প্রতিষ্ঠানের ধরন <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
                    >
                      <span>
                        {institutionTypeLabels[institutionType] ||
                          "নির্বাচন করুন"}
                      </span>
                      <ChevronDown className="size-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuItem
                      onSelect={() => setInstitutionType("")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                        !institutionType
                          ? "bg-purple-50 text-[var(--purple-700)]"
                          : "text-slate-700"
                      }`}
                    >
                      <span>নির্বাচন করুন</span>
                      {!institutionType && (
                        <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                      )}
                    </DropdownMenuItem>
                    {Object.entries(institutionTypeLabels).map(
                      ([val, label]) => (
                        <DropdownMenuItem
                          key={val}
                          onSelect={() => setInstitutionType(val)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                            institutionType === val
                              ? "bg-purple-50 text-[var(--purple-700)]"
                              : "text-slate-700"
                          }`}
                        >
                          <span>{label}</span>
                          {institutionType === val && (
                            <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                          )}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  মাধ্যম <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
                    >
                      <span>
                        {institutionMediumLabels[institutionMedium] ||
                          "নির্বাচন করুন"}
                      </span>
                      <ChevronDown className="size-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuItem
                      onSelect={() => setInstitutionMedium("")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                        !institutionMedium
                          ? "bg-purple-50 text-[var(--purple-700)]"
                          : "text-slate-700"
                      }`}
                    >
                      <span>নির্বাচন করুন</span>
                      {!institutionMedium && (
                        <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                      )}
                    </DropdownMenuItem>
                    {Object.entries(institutionMediumLabels).map(
                      ([val, label]) => (
                        <DropdownMenuItem
                          key={val}
                          onSelect={() => setInstitutionMedium(val)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                            institutionMedium === val
                              ? "bg-purple-50 text-[var(--purple-700)]"
                              : "text-slate-700"
                          }`}
                        >
                          <span>{label}</span>
                          {institutionMedium === val && (
                            <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                          )}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">
                  ছাত্র-ছাত্রীর সংখ্যা <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
                    >
                      <span>
                        {studentRanges.find(
                          (r) => r.value === studentCountRange,
                        )?.label || "নির্বাচন করুন"}
                      </span>
                      <ChevronDown className="size-3.5 text-slate-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuItem
                      onSelect={() => setStudentCountRange("")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                        !studentCountRange
                          ? "bg-purple-50 text-[var(--purple-700)]"
                          : "text-slate-700"
                      }`}
                    >
                      <span>নির্বাচন করুন</span>
                      {!studentCountRange && (
                        <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                      )}
                    </DropdownMenuItem>
                    {studentRanges.map((range) => {
                      const isSelected = studentCountRange === range.value;
                      return (
                        <DropdownMenuItem
                          key={range.value}
                          onSelect={() => setStudentCountRange(range.value)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-purple-50 focus:text-[var(--purple-700)] hover:bg-slate-50 ${
                            isSelected
                              ? "bg-purple-50 text-[var(--purple-700)]"
                              : "text-slate-700"
                          }`}
                        >
                          <span>{range.label}</span>
                          {isSelected && (
                            <span className="size-1 rounded-full bg-[var(--purple-600)]" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <BdAddressSelect
                value={{
                  division,
                  district,
                  upazila,
                  union: union || postOffice,
                }}
                onChange={({ division, district, upazila, union }) => {
                  setDivision(division);
                  setDistrict(district);
                  setUpazila(upazila);
                  setUnion(union);
                  setPostOffice(union);
                }}
              />

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[var(--purple-600)] text-xs"
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
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Save Button */}
        <div className="flex justify-center pt-4 w-full">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[var(--purple-800)] to-[var(--purple-600)] shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/35 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
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
    </div>
  );
}
