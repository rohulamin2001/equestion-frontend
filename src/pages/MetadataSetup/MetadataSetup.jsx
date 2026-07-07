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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RippleButton, RippleButtonRipples } from "@/components/ui/ripple-button";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Layers,
  Loader2,
  Plus,
  School,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TABS = [
  { id: "School", label: "শীর্ষস্থানীয় স্কুল", icon: School, placeholder: "যেমন: মতিঝিল আইডিয়াল স্কুল" },
  { id: "Board", label: "বোর্ড", icon: Award, placeholder: "যেমন: ঢাকা বোর্ড" },
  { id: "Year", label: "সাল", icon: Calendar, placeholder: "যেমন: ২০২৬" },
  { id: "Level", label: "লেভেল", icon: Layers, placeholder: "যেমন: সহজ" },
  { id: "SpecialSearch", label: "স্পেশাল সার্চ", icon: Search, placeholder: "যেমন: হাফ ইয়ার্লি ২০২৬" },
];

export default function MetadataSetup() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("School");
  const [newValue, setNewValue] = useState("");
  const [newShortValue, setNewShortValue] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Edit / Delete dialog states
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editShortName, setEditShortName] = useState("");
  const [deletingItem, setDeletingItem] = useState(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setNewValue("");
    setNewShortValue("");
  };

  // Fetch metadata options
  const { data: rawMetadata = [], isLoading } = useQuery({
    queryKey: ["metadataOptions", activeTab],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get("/question-metadata", {
        params: { type: activeTab },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.metadata || [];
    },
  });

  // Create metadata mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const response = await apiClient.post("/question-metadata", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metadataOptions", activeTab] });
      toast.success("মেটাডাটা অপশনটি সফলভাবে সংরক্ষণ করা হয়েছে!");
      setNewValue("");
      setNewShortValue("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || "সংরক্ষণ করতে ব্যর্থ হয়েছে");
    },
  });

  // Edit metadata mutation
  const editMutation = useMutation({
    mutationFn: async ({ id, name, shortName }) => {
      const token = await getToken();
      const response = await apiClient.put(`/question-metadata/${id}`, { name, shortName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metadataOptions", activeTab] });
      toast.success("মেটাডাটা অপশনটি সফলভাবে আপডেট করা হয়েছে!");
      setEditingItem(null);
      setEditName("");
      setEditShortName("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || "আপডেট করতে ব্যর্থ হয়েছে");
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      const response = await apiClient.patch(`/question-metadata/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metadataOptions", activeTab] });
      toast.success("মেটাডাটার স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে");
    },
  });

  // Delete metadata mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      await apiClient.delete(`/question-metadata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metadataOptions", activeTab] });
      toast.success("মেটাডাটা অপশনটি সফলভাবে মুছে ফেলা হয়েছে!");
      setDeletingItem(null);
      const remainingCount = rawMetadata.length - 1;
      const maxPage = Math.max(1, Math.ceil(remainingCount / itemsPerPage));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || "মুছে ফেলতে ব্যর্থ হয়েছে");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newValue.trim()) {
      toast.error("দয়া করে একটি নাম লিখুন");
      return;
    }
    if (activeTab === "Board" && !newShortValue.trim()) {
      toast.error("দয়া করে বোর্ডের সংক্ষিপ্ত নাম লিখুন");
      return;
    }
    createMutation.mutate({
      type: activeTab,
      name: newValue.trim(),
      shortName: activeTab === "Board" ? newShortValue.trim() : undefined
    });
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditShortName(item.shortName || "");
  };

  const handleEditSubmit = () => {
    if (!editName.trim()) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }
    if (activeTab === "Board" && !editShortName.trim()) {
      toast.error("সংক্ষিপ্ত নাম খালি রাখা যাবে না");
      return;
    }
    editMutation.mutate({
      id: editingItem?._id,
      name: editName.trim(),
      shortName: activeTab === "Board" ? editShortName.trim() : undefined
    });
  };

  // Client-side pagination logic
  const totalItems = rawMetadata.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedMetadata = rawMetadata.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 pb-12 w-full font-bengali">
      {/* Page Header */}
      <div className="bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">মেটাডাটা সেটআপ</h1>
        <p className="text-slate-500 text-sm mt-1">
          প্রশ্ন তৈরির সময় ব্যবহারের জন্য ডাইনামিক স্কুল, বোর্ড, সাল, লেভেল এবং স্পেশাল সার্চ ট্যাগ কনফিগার করুন।
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-black/[0.02] border border-black/[0.05] rounded-2xl backdrop-blur-sm">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition cursor-pointer select-none ${
                isActive
                  ? "text-white"
                  : "text-slate-650 hover:bg-black/[0.03]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] rounded-xl -z-10 shadow-md shadow-purple-500/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <IconComponent className="size-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Input Form (Left/Top) & Paginated Table (Right/Bottom) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
        {/* Entry Creation Form */}
        <div className="bg-glass p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-[16px] border-b border-black/[0.05] pb-2 flex items-center gap-2">
            <Plus className="size-4 text-[#4F46E5]" />
            নতুন এন্ট্রি যোগ করুন
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {TABS.find((t) => t.id === activeTab)?.label} নাম
              </label>
              <Input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={TABS.find((t) => t.id === activeTab)?.placeholder}
                className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5] h-11 text-sm"
              />
            </div>

            {activeTab === "Board" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  সংক্ষিপ্ত নাম (যেমন: ঢা বো)
                </label>
                <Input
                  type="text"
                  value={newShortValue}
                  onChange={(e) => setNewShortValue(e.target.value)}
                  placeholder="সংক্ষিপ্ত নাম লিখুন"
                  className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5] h-11 text-sm"
                />
              </div>
            )}

            <RippleButton
              type="submit"
              disabled={createMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] hover:from-[#4338CA] hover:to-[#7C3AED] text-white font-semibold h-11 rounded-xl shadow-md disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              সংরক্ষণ করুন
              <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
            </RippleButton>
          </form>
        </div>

        {/* Paginated Data Table */}
        <div className="lg:col-span-2 bg-glass rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm overflow-hidden">
          <div className="p-5 border-b border-black/[0.05]">
            <h2 className="font-bold text-slate-800 text-[16px] font-sans">
              নিবন্ধিত {TABS.find((t) => t.id === activeTab)?.label} তালিকা
            </h2>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="size-8 text-[#4F46E5] animate-spin" />
            </div>
          ) : rawMetadata.length === 0 ? (
            <div className="py-16 text-center text-slate-400 italic text-sm">
              কোনো তথ্য পাওয়া যায়নি। বাম পাশের ফর্ম থেকে নতুন তথ্য যুক্ত করুন।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.04] bg-black/[0.01] text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-5 w-16">ক্রম</th>
                    <th className="py-3 px-5">নাম / লেবেল</th>
                    <th className="py-3 px-5 w-32 text-center">স্ট্যাটাস</th>
                    <th className="py-3 px-5 w-28 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.03]">
                  {paginatedMetadata.map((item, index) => {
                    const rowNumber = startIndex + index + 1;
                    return (
                      <tr key={item._id} className="hover:bg-black/[0.01] text-sm text-slate-700 font-semibold font-sans">
                        <td className="py-3.5 px-5 font-bold text-slate-400">{rowNumber}</td>
                        <td className="py-3.5 px-5 text-slate-800">
                          {item.name}
                          {item.shortName && (
                            <span className="text-slate-400 font-normal text-xs ml-1.5">
                              ({item.shortName})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              onClick={() => toggleMutation.mutate(item._id)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                item.isActive ? "bg-[#4F46E5]" : "bg-slate-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  item.isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditDialog(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#4F46E5] hover:bg-black/[0.03] transition cursor-pointer"
                              title="সম্পাদন করুন"
                            >
                              <Edit2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingItem(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-black/[0.04] bg-black/[0.005] flex justify-between items-center text-xs text-slate-500 font-semibold font-sans">
                  <div>
                    মোট {totalItems}টি এন্ট্রির মধ্যে {startIndex + 1} - {endIndex} দেখানো হচ্ছে।
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-3 rounded-lg border-black/[0.08] hover:bg-black/[0.02] flex items-center gap-1 text-[11px]"
                    >
                      <ChevronLeft className="size-3.5" />
                      পূর্ববর্তী
                    </Button>
                    <div className="flex items-center px-2 font-bold text-slate-700">
                      পৃষ্ঠা {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3 rounded-lg border-black/[0.08] hover:bg-black/[0.02] flex items-center gap-1 text-[11px]"
                    >
                      পরবর্তী
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>

      {/* Edit dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl z-50">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold text-slate-800 text-lg">
              মেটাডাটা অপশন এডিট করুন
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {TABS.find((t) => t.id === activeTab)?.label} নাম
              </label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5] h-11 text-sm font-sans"
              />
            </div>

            {activeTab === "Board" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  সংক্ষিপ্ত নাম (যেমন: ঢা বো)
                </label>
                <Input
                  type="text"
                  value={editShortName}
                  onChange={(e) => setEditShortName(e.target.value)}
                  className="bg-white/[0.45] border-black/[0.08] backdrop-blur-sm focus-visible:ring-[#4F46E5]/20 focus-visible:border-[#4F46E5] h-11 text-sm font-sans"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setEditingItem(null)}
              className="border-black/[0.10] text-slate-600 hover:bg-black/[0.02] rounded-xl h-10 px-5 font-semibold cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={editMutation.isPending}
              className="bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white rounded-xl h-10 px-5 font-semibold cursor-pointer shadow-md shadow-purple-500/10"
            >
              {editMutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
              আপডেট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogPopup className="max-w-md bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-xl z-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans font-bold text-slate-800 text-lg">
              আপনি কি নিশ্চিত?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-semibold text-slate-500">
              আপনি মেটাডাটা অপশন <strong>&ldquo;{deletingItem?.name}&rdquo;</strong> মুছে ফেলতে যাচ্ছেন। এটি চিরতরে মুছে যাবে এবং প্রশ্ন তৈরির ড্রপডাউনে আর পাওয়া যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel
              onClick={() => setDeletingItem(null)}
              className="border-black/[0.10] text-slate-600 hover:bg-black/[0.02] rounded-xl h-10 px-5 font-semibold cursor-pointer"
            >
              বাতিল
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingItem && deleteMutation.mutate(deletingItem._id)}
              disabled={deleteMutation.isPending}
              className="bg-red-500 hover:bg-red-650 text-white rounded-xl h-10 px-5 font-semibold cursor-pointer shadow-md shadow-red-500/10"
            >
              {deleteMutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
