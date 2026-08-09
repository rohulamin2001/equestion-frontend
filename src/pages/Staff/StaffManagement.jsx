import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Button,
  ModalCancelButton,
  ModalSubmitButton,
} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  RippleButton,
  RippleButtonRipples,
} from "@/components/ui/ripple-button";
import {
  AlertCircle,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { useStaffManagement } from "./hook/useStaffManagement";

const ROLE_COLORS = {
  "Super Admin": "bg-red-50 text-red-700 border-red-200",
  Admin: "bg-orange-50 text-orange-700 border-orange-200",
  "Content Manager": "bg-blue-50 text-blue-700 border-blue-200",
  "Question Creator": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Support Team": "bg-purple-50 text-purple-700 border-purple-200",
  Subscriber: "bg-slate-50 text-slate-700 border-slate-200",
};

const BENGALI_ROLES = {
  "Super Admin": "সুপার এডমিন",
  Admin: "এডমিন",
  "Content Manager": "কন্টেন্ট ম্যানেজার",
  "Question Creator": "প্রশ্ন ক্রিয়েটর",
  "Support Team": "সাপোর্ট টিম",
  Subscriber: "সাবস্ক্রাইবার",
};

export default function StaffManagement() {
  const {
    userProfile,
    isModalOpen,
    setIsModalOpen,
    staffToDelete,
    setStaffToDelete,
    activeDropdownMemberId,
    setActiveDropdownMemberId,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    role,
    setRole,
    showPassword,
    setShowPassword,
    isRoleDropdownOpen,
    setIsRoleDropdownOpen,
    staffList,
    loading,
    error,
    fetchStaff,
    formLoading,
    deleteStaffPending,
    deleteStaffVariables,
    handleAddStaff,
    handleRoleChange,
    handleDeleteStaff,
    deleteStaffMutation,
    userToReset2FA,
    setUserToReset2FA,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    reset2FAPending,
    handleConfirmReset2FA,
  } = useStaffManagement();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">
            স্টাফ ও ইউজার ব্যবস্থাপনা
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-bengali">
            প্যানেলের এডমিন, স্টাফ ও ব্যবহারকারীদের সরাসরি এখানে যুক্ত, পরিচালনা
            ও ২-স্টেপ সিকিউরিটি রিসেট করুন।
          </p>
        </div>
        <RippleButton
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-6 rounded-xl bg-primary text-white hover:bg-primary/95 transition font-semibold font-bengali"
        >
          <UserPlus className="size-[18px]" />
          নতুন স্টাফ যোগ করুন
          <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
        </RippleButton>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="ফোন নম্বর, নাম বা প্রতিষ্ঠান দিয়ে সার্চ করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
          {[
            { id: "all", label: "সকল" },
            { id: "Admin", label: "এডমিন" },
            { id: "Content Manager", label: "কন্টেন্ট ম্যানেজার" },
            { id: "Question Creator", label: "প্রশ্ন ক্রিয়েটর" },
            { id: "Support Team", label: "সাপোর্ট টিম" },
            { id: "Subscriber", label: "সাবস্ক্রাইবারগণ" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRoleFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-bengali transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">
              স্টাফ মেম্বারদের তালিকা লোড হচ্ছে...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center max-w-md mx-auto">
            <AlertCircle className="size-10 text-red-500 mb-3" />
            <p className="text-slate-800 font-semibold mb-1">
              তালিকা লোড করা যায়নি
            </p>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <Button onClick={fetchStaff} variant="outline">
              আবার চেষ্টা করুন
            </Button>
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center max-w-md mx-auto">
            <UserCheck className="size-12 text-slate-400 mb-3" />
            <p className="text-slate-800 font-semibold mb-1">
              কোনো স্টাফ পাওয়া যায়নি
            </p>
            <p className="text-slate-500 text-sm">
              আপনার সিস্টেমে এখন পর্যন্ত কোনো অতিরিক্ত স্টাফ মেম্বার যোগ করা
              হয়নি।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                    নাম ও প্রোফাইল
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                    মোবাইল নাম্বার
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                    রোল (পদবি)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                    ২FA সিকিউরিটি
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((member) => {
                  const initials = member.fullName
                    ? member.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "US";

                  const isSelf = member._id === userProfile?._id;
                  // Restrict updating roles to Super Admin only, and cannot modify oneself
                  const canModifyRole =
                    userProfile?.role === "Super Admin" && !isSelf;

                  return (
                    <tr
                      key={member._id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarImage
                              src={member.imageUrl}
                              alt={member.fullName}
                            />
                            <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="block font-semibold text-slate-800 text-[15px]">
                              {member.fullName}
                            </span>
                            {isSelf && (
                              <span className="inline-block bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5">
                                আপনি নিজে
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-[14px]">
                        {member.phoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canModifyRole ? (
                          <DropdownMenu
                            open={activeDropdownMemberId === member._id}
                            onOpenChange={(open) =>
                              setActiveDropdownMemberId(
                                open ? member._id : null,
                              )
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center justify-between gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-slate-700 transition-all duration-300 ease-out cursor-pointer min-w-[140px] hover:-translate-y-[1px] active:translate-y-0 group"
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`size-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${
                                      member.role === "Admin"
                                        ? "bg-orange-500 group-hover:shadow-[0_0_6px_rgba(249,115,22,0.6)]"
                                        : member.role === "Content Manager"
                                          ? "bg-blue-500 group-hover:shadow-[0_0_6px_rgba(59,130,246,0.6)]"
                                          : member.role === "Question Creator"
                                            ? "bg-emerald-500 group-hover:shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                                            : member.role === "Support Team"
                                              ? "bg-purple-500 group-hover:shadow-[0_0_6px_rgba(168,85,247,0.6)]"
                                              : "bg-slate-500"
                                    }`}
                                  />
                                  {BENGALI_ROLES[member.role] || member.role}
                                </span>
                                <ChevronDown
                                  className={`size-4 text-slate-400 transition-all duration-300 group-hover:text-slate-600 group-hover:translate-y-[1px] ${activeDropdownMemberId === member._id ? "rotate-180" : ""}`}
                                />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="w-[180px] bg-white border border-slate-100 rounded-xl shadow-lg p-1.5 space-y-0.5 z-[100]"
                            >
                              {[
                                "Admin",
                                "Content Manager",
                                "Question Creator",
                                "Support Team",
                                "Subscriber",
                              ].map((roleKey) => {
                                const isSelected = member.role === roleKey;
                                return (
                                  <DropdownMenuItem
                                    key={roleKey}
                                    onSelect={() =>
                                      handleRoleChange(member._id, roleKey)
                                    }
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer focus:bg-primary/5 focus:text-primary hover:bg-slate-50/80 hover:translate-x-1 group/item ${
                                      isSelected
                                        ? "bg-primary/5 text-primary"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span
                                        className={`size-1.5 rounded-full transition-all duration-300 group-hover/item:scale-125 ${
                                          roleKey === "Admin"
                                            ? "bg-orange-500 group-hover/item:shadow-[0_0_6px_rgba(249,115,22,0.6)]"
                                            : roleKey === "Content Manager"
                                              ? "bg-blue-500 group-hover/item:shadow-[0_0_6px_rgba(59,130,246,0.6)]"
                                              : roleKey === "Question Creator"
                                                ? "bg-emerald-500 group-hover/item:shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                                                : roleKey === "Support Team"
                                                  ? "bg-purple-500 group-hover/item:shadow-[0_0_6px_rgba(168,85,247,0.6)]"
                                                  : "bg-slate-500"
                                        }`}
                                      />
                                      {BENGALI_ROLES[roleKey]}
                                    </span>
                                    {isSelected && (
                                      <span className="size-1 rounded-full bg-primary" />
                                    )}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${ROLE_COLORS[member.role] || ROLE_COLORS["Subscriber"]}`}
                          >
                            <Shield className="size-3" />
                            {BENGALI_ROLES[member.role] || member.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.twoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-bengali">
                            <ShieldCheck className="size-3.5" /> ২FA সক্রিয়
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/60 font-bengali">
                            <ShieldOff className="size-3.5" /> ২FA নিষ্ক্রিয়
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* 2FA Admin Reset Button */}
                          {member.twoFactorEnabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200/80 px-2.5 py-1.5 rounded-lg text-xs font-bold font-bengali flex items-center gap-1.5 cursor-pointer shadow-none"
                              title="ব্যবহারকারীর ২-স্টেপ ২FA রিসেট করুন"
                              onClick={() => setUserToReset2FA(member)}
                            >
                              <RotateCcw className="size-3.5" />
                              <span>২FA রিসেট</span>
                            </Button>
                          )}

                          {/* Delete Button for Staff */}
                          {isSelf ? (
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <Lock className="size-3.5" /> অ্যাকশন লকড
                            </span>
                          ) : userProfile?.role === "Super Admin" ? (
                            <Button
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                              title="স্থায়ীভাবে মুছুন"
                              onClick={() => handleDeleteStaff(member._id)}
                              disabled={deleteStaffPending}
                            >
                              {deleteStaffPending &&
                              deleteStaffVariables === member._id ? (
                                <Loader2 className="size-[18px] animate-spin text-red-500" />
                              ) : (
                                <Trash2 className="size-[18px]" />
                              )}
                            </Button>
                          ) : !member.twoFactorEnabled ? (
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <Lock className="size-3.5" /> অ্যাকশন লকড
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          from="top"
          showCloseButton={!formLoading}
          onPointerDownOutside={(e) => {
            if (formLoading) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (formLoading) e.preventDefault();
          }}
          className="max-w-lg p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative"
        >
          <form
            onSubmit={handleAddStaff}
            className="flex flex-col h-full max-h-[85vh]"
          >
            <DialogHeader className="bg-transparent px-6 pt-6 pb-5 border-b border-slate-200/50 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl shrink-0 mt-0.5 shadow-sm shadow-primary/5">
                  <UserPlus className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    নতুন স্টাফ মেম্বার যোগ করুন
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    নতুন স্টাফ রেজিস্টার করার ফর্ম
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    First Name (নামের প্রথম অংশ)
                  </label>
                  <Input
                    required
                    placeholder="e.g. Rohul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={formLoading}
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Last Name (নামের শেষ অংশ)
                  </label>
                  <Input
                    required
                    placeholder="e.g. Amin"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={formLoading}
                    className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number (মোবাইল নাম্বার)
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="e.g. 01712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={formLoading}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password (পাসওয়ার্ড)
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={formLoading}
                    minLength={6}
                    className="pl-4 pr-11 py-3 rounded-xl border border-slate-200 bg-white/75 hover:border-indigo-400 hover:bg-white focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-50/50 focus-visible:ring-offset-0 h-11 transition-all shadow-sm text-slate-700 text-xs font-semibold w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 rounded-md"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Staff Role (পদবি নির্বাচন)
                </label>

                <DropdownMenu
                  open={isRoleDropdownOpen}
                  onOpenChange={setIsRoleDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={formLoading}
                      className="w-full px-4 border border-slate-200 rounded-xl text-xs bg-white/75 hover:bg-white hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer transition-all duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="size-4 text-indigo-500" />
                        {BENGALI_ROLES[role] || role}
                      </span>
                      <ChevronDown
                        className={`size-4 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                  >
                    {[
                      "Admin",
                      "Content Manager",
                      "Question Creator",
                      "Support Team",
                    ].map((roleKey) => {
                      const isSelected = role === roleKey;
                      return (
                        <DropdownMenuItem
                          key={roleKey}
                          onSelect={() => setRole(roleKey)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50/80 group ${
                            isSelected
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-slate-700"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`size-1.5 rounded-full ${
                                roleKey === "Admin"
                                  ? "bg-orange-500"
                                  : roleKey === "Content Manager"
                                    ? "bg-blue-500"
                                    : roleKey === "Question Creator"
                                      ? "bg-emerald-500"
                                      : "bg-purple-500"
                              }`}
                            />
                            {BENGALI_ROLES[roleKey]}
                          </span>
                          {isSelected && (
                            <span className="size-1.5 rounded-full bg-indigo-600" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <DialogFooter className="bg-transparent px-6 py-3.5 border-t border-slate-200/50 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton disabled={formLoading}>
                  বাতিল করুন
                </ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    যুক্ত হচ্ছে...
                  </>
                ) : (
                  "যুক্ত করুন"
                )}
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!staffToDelete}
        onOpenChange={(open) => {
          if (!open && !deleteStaffPending) {
            setStaffToDelete(null);
          }
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-3">
              <Trash2 className="h-6 w-6 text-red-600 animate-bounce" />
            </div>
            <AlertDialogTitle className="text-center font-bold text-slate-900 text-lg">
              আপনি কি নিশ্চিত?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500 text-sm mt-2">
              আপনি কি নিশ্চিত যে আপনি এই স্টাফ মেম্বারকে স্থায়ীভাবে মুছে ফেলতে
              চান? এটি আর ফেরত আনা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="w-full sm:w-auto"
              disabled={deleteStaffPending}
              onClick={() => {
                if (!deleteStaffPending) {
                  setStaffToDelete(null);
                }
              }}
            >
              না, বাতিল করুন
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
              disabled={deleteStaffPending}
              onClick={async (e) => {
                e.preventDefault();
                if (staffToDelete) {
                  try {
                    await deleteStaffMutation.mutateAsync(staffToDelete);
                    setStaffToDelete(null);
                  } catch {
                    // Handled in onError of mutation
                  }
                }
              }}
            >
              {deleteStaffPending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                "হ্যাঁ, মুছে ফেলুন"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>

      {/* 2FA Admin Reset Confirmation Modal */}
      <AlertDialog
        open={!!userToReset2FA}
        onOpenChange={(open) => !open && setUserToReset2FA(null)}
      >
        <AlertDialogPopup className="max-w-md p-0 border border-slate-200/50 overflow-hidden bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative">
          <div className="p-6 space-y-4 text-left font-bengali">
            <AlertDialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl shrink-0">
                  <ShieldOff className="size-5" />
                </div>
                <AlertDialogTitle className="font-bold text-slate-800 text-lg">
                  ২-স্টেপ নিরাপত্তা (2FA) রিসেট করুন
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-600 text-xs leading-relaxed pt-1">
                আপনি কি নিশ্চিতভাবে{" "}
                <strong className="text-slate-900 font-bold font-sans">
                  {userToReset2FA?.fullName || userToReset2FA?.phoneNumber}
                </strong>
                -এর ২-স্টেপ টু-ফ্যাক্টর সিকিউরিটি রিসেট করতে চান?
                <br />
                <span className="text-amber-700 block mt-2 font-medium">
                  ⚠️ রিসেট করার পর উক্ত ব্যবহারকারী তার ফোন নম্বর ও পাসওয়ার্ড
                  দিয়ে সরাসরি লগইন করতে পারবেন।
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2 pt-2">
              <AlertDialogCancel
                disabled={reset2FAPending}
                onClick={() => setUserToReset2FA(null)}
                className="flex-1 rounded-xl cursor-pointer"
              >
                বাতিল করুন
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={reset2FAPending}
                onClick={handleConfirmReset2FA}
                className="flex-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
              >
                {reset2FAPending ? (
                  <Loader2 className="size-4 animate-spin mx-auto" />
                ) : (
                  "হ্যাঁ, রিসেট করুন"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
