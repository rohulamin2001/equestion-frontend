import React from 'react';
import { useStaffManagement } from './hook/useStaffManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, 
  Shield, 
  Trash2, 
  Lock, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  X,
  UserCheck,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';


const ROLE_COLORS = {
  'Super Admin': 'bg-red-50 text-red-700 border-red-200',
  'Admin': 'bg-orange-50 text-orange-700 border-orange-200',
  'Content Manager': 'bg-blue-50 text-blue-700 border-blue-200',
  'Question Creator': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Support Team': 'bg-purple-50 text-purple-700 border-purple-200',
  'Subscriber': 'bg-slate-50 text-slate-700 border-slate-200',
};

const BENGALI_ROLES = {
  'Super Admin': 'সুপার এডমিন',
  'Admin': 'এডমিন',
  'Content Manager': 'কন্টেন্ট ম্যানেজার',
  'Question Creator': 'প্রশ্ন ক্রিয়েটর',
  'Support Team': 'সাপোর্ট টিম',
  'Subscriber': 'সাবস্ক্রাইবার',
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
    formError,
    formSuccess,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
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
  } = useStaffManagement();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">স্টাফ ব্যবস্থাপনা</h1>
          <p className="text-slate-500 text-sm mt-1">প্যানেলের অন্যান্য এডমিন ও কন্টেন্ট মেম্বারদের সরাসরি এখানে যুক্ত ও পরিচালনা করুন।</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-6 rounded-xl bg-primary text-white hover:bg-primary/95 transition font-semibold"
        >
          <UserPlus className="size-[18px]" />
          নতুন স্টাফ যোগ করুন
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">স্টাফ মেম্বারদের তালিকা লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center max-w-md mx-auto">
            <AlertCircle className="size-10 text-red-500 mb-3" />
            <p className="text-slate-800 font-semibold mb-1">তালিকা লোড করা যায়নি</p>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <Button onClick={fetchStaff} variant="outline">আবার চেষ্টা করুন</Button>
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center max-w-md mx-auto">
            <UserCheck className="size-12 text-slate-400 mb-3" />
            <p className="text-slate-800 font-semibold mb-1">কোনো স্টাফ পাওয়া যায়নি</p>
            <p className="text-slate-500 text-sm">আপনার সিস্টেমে এখন পর্যন্ত কোনো অতিরিক্ত স্টাফ মেম্বার যোগ করা হয়নি।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">নাম ও প্রোফাইল</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">ইমেইল</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">রোল (পদবি)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((member) => {
                  const initials = member.fullName
                    ? member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                    : 'US';
                  
                  const isSelf = member.clerkId === userProfile?.clerkId;
                  // Restrict updating roles to Super Admin only, and cannot modify oneself
                  const canModifyRole = userProfile?.role === 'Super Admin' && !isSelf;

                  return (
                    <tr key={member._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-100">
                            <AvatarImage src={member.imageUrl} alt={member.fullName} />
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
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canModifyRole ? (
                          <DropdownMenu 
                            open={activeDropdownMemberId === member._id} 
                            onOpenChange={(open) => setActiveDropdownMemberId(open ? member._id : null)}
                          >
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center justify-between gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-slate-700 transition-all duration-300 ease-out cursor-pointer min-w-[140px] hover:-translate-y-[1px] active:translate-y-0 group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`size-1.5 rounded-full transition-all duration-300 group-hover:scale-125 ${
                                    member.role === 'Admin' ? 'bg-orange-500 group-hover:shadow-[0_0_6px_rgba(249,115,22,0.6)]' :
                                    member.role === 'Content Manager' ? 'bg-blue-500 group-hover:shadow-[0_0_6px_rgba(59,130,246,0.6)]' :
                                    member.role === 'Question Creator' ? 'bg-emerald-500 group-hover:shadow-[0_0_6px_rgba(16,185,129,0.6)]' :
                                    member.role === 'Support Team' ? 'bg-purple-500 group-hover:shadow-[0_0_6px_rgba(168,85,247,0.6)]' :
                                    'bg-slate-500'
                                  }`} />
                                  {BENGALI_ROLES[member.role] || member.role}
                                </span>
                                <ChevronDown className={`size-4 text-slate-400 transition-all duration-300 group-hover:text-slate-600 group-hover:translate-y-[1px] ${activeDropdownMemberId === member._id ? 'rotate-180' : ''}`} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="start" 
                              className="w-[180px] bg-white border border-slate-100 rounded-xl shadow-lg p-1.5 space-y-0.5 z-[100]"
                            >
                              {['Admin', 'Content Manager', 'Question Creator', 'Support Team', 'Subscriber'].map((roleKey) => {
                                const isSelected = member.role === roleKey;
                                return (
                                  <DropdownMenuItem
                                    key={roleKey}
                                    onSelect={() => handleRoleChange(member._id, roleKey)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer focus:bg-primary/5 focus:text-primary hover:bg-slate-50/80 hover:translate-x-1 group/item ${
                                      isSelected 
                                        ? 'bg-primary/5 text-primary' 
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5">
                                      <span className={`size-1.5 rounded-full transition-all duration-300 group-hover/item:scale-125 ${
                                        roleKey === 'Admin' ? 'bg-orange-500 group-hover/item:shadow-[0_0_6px_rgba(249,115,22,0.6)]' :
                                        roleKey === 'Content Manager' ? 'bg-blue-500 group-hover/item:shadow-[0_0_6px_rgba(59,130,246,0.6)]' :
                                        roleKey === 'Question Creator' ? 'bg-emerald-500 group-hover/item:shadow-[0_0_6px_rgba(16,185,129,0.6)]' :
                                        roleKey === 'Support Team' ? 'bg-purple-500 group-hover/item:shadow-[0_0_6px_rgba(168,85,247,0.6)]' :
                                        'bg-slate-500'
                                      }`} />
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
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${ROLE_COLORS[member.role] || ROLE_COLORS['Subscriber']}`}>
                            <Shield className="size-3" />
                            {BENGALI_ROLES[member.role] || member.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSelf ? (
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Lock className="size-3.5" /> অ্যাকশন লকড
                          </span>
                        ) : userProfile?.role === 'Super Admin' ? (
                          <Button 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                            title="স্থায়ীভাবে মুছুন"
                            onClick={() => handleDeleteStaff(member._id)}
                            disabled={deleteStaffPending}
                          >
                            {deleteStaffPending && deleteStaffVariables === member._id ? (
                              <Loader2 className="size-[18px] animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="size-[18px]" />
                            )}
                          </Button>
                        ) : (
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <Lock className="size-3.5" /> অ্যাকশন লকড
                          </span>
                        )}
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
          className="max-w-lg p-0 border border-slate-100 overflow-visible"
        >
          <div className="flex items-center bg-slate-50/50 px-6 py-4 border-b border-slate-100 rounded-t-2xl">
            <DialogTitle className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              নতুন স্টাফ মেম্বার যোগ করুন
            </DialogTitle>
            <DialogDescription className="sr-only">
              নতুন স্টাফ রেজিস্টার করার ফর্ম
            </DialogDescription>
          </div>

          <form onSubmit={handleAddStaff} className="p-6 space-y-4">
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-xl text-sm">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 p-3.5 rounded-xl text-sm">
                <CheckCircle className="size-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">First Name (নামের প্রথম অংশ)</label>
                <Input
                  required
                  placeholder="e.g. Rohul"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={formLoading}
                  className="px-4 py-5 rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Last Name (নামের শেষ অংশ)</label>
                <Input
                  required
                  placeholder="e.g. Amin"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={formLoading}
                  className="px-4 py-5 rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address (ইমেইল)</label>
              <Input
                required
                type="email"
                placeholder="e.g. example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={formLoading}
                className="px-4 py-5 rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Password (পাসওয়ার্ড)</label>
              <div className="relative">
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="নূন্যতম ৮ অক্ষরের পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={formLoading}
                  minLength={8}
                  className="pl-4 pr-11 py-5 rounded-xl border-slate-200 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 rounded-md"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-500 uppercase">Staff Role (পদবি নির্বাচন)</label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  disabled={formLoading}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50/50 transition focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-slate-700 flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="size-4 text-slate-400" />
                    {BENGALI_ROLES[role] || role}
                  </span>
                  <ChevronDown className={`size-4 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRoleDropdownOpen && (
                  /* Invisible backdrop to close the dropdown when clicking outside */
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsRoleDropdownOpen(false)} 
                  />
                )}

                <AnimatePresence>
                  {isRoleDropdownOpen && (
                    <motion.div
                      key="role-dropdown-content"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-20"
                    >
                      <div className="p-1.5 space-y-0.5">
                        {['Admin', 'Content Manager', 'Question Creator', 'Support Team'].map((roleKey) => {
                          const isSelected = role === roleKey;
                          return (
                            <button
                              key={roleKey}
                              type="button"
                              onClick={() => {
                                setRole(roleKey);
                                setIsRoleDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-primary/5 text-primary' 
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`size-1.5 rounded-full ${
                                  roleKey === 'Admin' ? 'bg-orange-500' :
                                  roleKey === 'Content Manager' ? 'bg-blue-500' :
                                  roleKey === 'Question Creator' ? 'bg-emerald-500' :
                                  'bg-purple-500'
                                }`} />
                                {BENGALI_ROLES[roleKey]}
                              </span>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={formLoading}
                className="px-5 py-5 rounded-xl"
              >
                বাতিল করুন
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="flex items-center gap-2 px-5 py-5 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    যুক্ত হচ্ছে...
                  </>
                ) : (
                  'যুক্ত করুন'
                )}
              </Button>
            </div>
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
            <AlertDialogTitle className="text-center font-bold text-slate-900 text-lg">আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500 text-sm mt-2">
              আপনি কি নিশ্চিত যে আপনি এই স্টাফ মেম্বারকে স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফেরত আনা যাবে না।
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
                  } catch (err) {
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
                'হ্যাঁ, মুছে ফেলুন'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
