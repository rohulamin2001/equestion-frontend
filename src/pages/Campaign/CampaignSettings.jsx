import {
  ExternalLink,
  Eye,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Switch } from "../../components/ui/switch";
import apiClient from "../../lib/apiClient";
import CampaignPopupModal from "../Home/components/CampaignPopupModal";

export default function CampaignSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingModal, setUploadingModal] = useState(false);

  // Settings State
  const [topBanner, setTopBanner] = useState({
    isActive: false,
    imageUrl: "",
    linkUrl: "",
    text: "",
  });

  const [popupModal, setPopupModal] = useState({
    isActive: false,
    imageUrl: "",
    linkUrl: "",
  });

  // Modal preview state
  const [testModalOpen, setTestModalOpen] = useState(false);

  const bannerFileInputRef = useRef(null);
  const modalFileInputRef = useRef(null);

  // Fetch current settings on mount
  useEffect(() => {
    let ignore = false;

    const loadSettings = async () => {
      try {
        const res = await apiClient.get("/campaigns/settings");
        if (!ignore && res.data?.success && res.data?.settings) {
          const s = res.data.settings;
          if (s.topBanner) {
            setTopBanner({
              isActive: Boolean(s.topBanner.isActive),
              imageUrl: s.topBanner.imageUrl || "",
              linkUrl: s.topBanner.linkUrl || "",
              text: s.topBanner.text || "",
            });
          }
          if (s.popupModal) {
            setPopupModal({
              isActive: Boolean(s.popupModal.isActive),
              imageUrl: s.popupModal.imageUrl || "",
              linkUrl: s.popupModal.linkUrl || "",
            });
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch campaign settings:", err);
          toast.error(
            err.response?.data?.error || "ক্যাম্পেইন সেটিংস লোড করা যায়নি।",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      ignore = true;
    };
  }, []);

  // Image upload helper
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে একটি ছবি ফাইল সিলেক্ট করুন (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে।");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "campaigns");

    try {
      if (type === "banner") setUploadingBanner(true);
      if (type === "modal") setUploadingModal(true);

      const res = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.url) {
        if (type === "banner") {
          setTopBanner((prev) => ({ ...prev, imageUrl: res.data.url }));
          toast.success("ব্যানার ছবি সফলভাবে আপলোড হয়েছে।");
        } else {
          setPopupModal((prev) => ({ ...prev, imageUrl: res.data.url }));
          toast.success("পপআপ ছবি সফলভাবে আপলোড হয়েছে।");
        }
      } else {
        throw new Error("ইমেজ আপলোড রেসপন্স পাওয়া যায়নি।");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "ছবি আপলোড করতে ব্যর্থ হয়েছে।",
      );
    } finally {
      if (type === "banner") setUploadingBanner(false);
      if (type === "modal") setUploadingModal(false);
    }
  };

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        topBanner,
        popupModal,
      };

      const res = await apiClient.put("/campaigns/settings", payload);
      if (res.data?.success) {
        toast.success("ক্যাম্পেইন সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(
        err.response?.data?.error || "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-bengali">
        <Loader2 className="size-8 animate-spin text-purple-700" />
        <p className="text-sm text-muted-foreground">
          ক্যাম্পেইন সেটিংস লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-bengali">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
            <Sparkles className="size-3.5" />
            <span>হোম ও ল্যান্ডিং পেজ ক্যাম্পেইন</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            ক্যাম্পেইন কন্ট্রোল
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ওয়েবসাইটের হোম/ল্যান্ডিং পেজে টপ ব্যানার এবং প্রবেশকালীন পপআপ মডাল
            অন/অফ ও পরিচালনা করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md active:scale-95 transition disabled:opacity-50 cursor-pointer shrink-0"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* =========================================
            FEATURE 1: TOP BANNER CONTROL
           ========================================= */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 flex items-center justify-center shrink-0">
                <Megaphone className="size-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  ১. টপ ব্যানার (Top Announcement Banner)
                </h2>
                <p className="text-xs text-muted-foreground">
                  চালু থাকলে ওয়েবসাইটের সবার উপরে ব্যানারটি প্রদর্শিত হবে।
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <div className="flex items-center gap-3 self-start xs:self-auto">
              <Switch
                id="top-banner-active"
                checked={topBanner.isActive}
                onCheckedChange={(checked) =>
                  setTopBanner((prev) => ({
                    ...prev,
                    isActive: checked,
                  }))
                }
              />
              <label
                htmlFor="top-banner-active"
                className="text-xs sm:text-sm font-bold cursor-pointer select-none min-w-16"
              >
                {topBanner.isActive ? (
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                    চালু আছে
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    বন্ধ আছে
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Banner Settings Body */}
          <div className="space-y-4 pt-1">
            {/* Banner Image Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                ব্যানার ইমেজ (ছবি আপলোড):
              </label>

              {topBanner.imageUrl ? (
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900 group max-h-36">
                  <img
                    src={topBanner.imageUrl}
                    alt="ব্যানার প্রিভিউ"
                    className="w-full h-auto max-h-36 object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="size-3.5" />
                      <span>পরিবর্তন করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setTopBanner((prev) => ({ ...prev, imageUrl: "" }))
                      }
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="size-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-xl p-5 text-center cursor-pointer transition bg-slate-50/50 hover:bg-purple-50/30 flex flex-col items-center justify-center gap-2"
                >
                  {uploadingBanner ? (
                    <Loader2 className="size-6 animate-spin text-purple-600" />
                  ) : (
                    <ImageIcon className="size-8 text-slate-400" />
                  )}
                  <div className="text-xs sm:text-sm text-slate-600">
                    <span className="font-bold text-purple-700 hover:underline">
                      ক্লিক করে ছবি আপলোড করুন
                    </span>{" "}
                    (প্রস্তাবিত সাইজ: 1920x80 বা 1200x60 পিক্সেল)
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    JPG, PNG, WebP (সর্বোচ্চ ৮ মেগাবাইট)
                  </p>
                </div>
              )}

              <input
                ref={bannerFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "banner");
                  e.target.value = "";
                }}
              />

              <div className="mt-2.5">
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  অথবা ছবির সরাসরি লিঙ্ক (Image URL) পেস্ট করুন:
                </label>
                <input
                  type="text"
                  value={topBanner.imageUrl}
                  onChange={(e) =>
                    setTopBanner((prev) => ({
                      ...prev,
                      imageUrl: e.target.value.trim(),
                    }))
                  }
                  placeholder="https://example.com/banner.png"
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
                />
              </div>
            </div>

            {/* URL Destination Box */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                ব্যানার ক্লিক ইউআরএল (URL):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topBanner.linkUrl}
                  onChange={(e) =>
                    setTopBanner((prev) => ({
                      ...prev,
                      linkUrl: e.target.value,
                    }))
                  }
                  placeholder="যেমন: /subscription অথবা https://smartproshnobank.com/terms"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans pr-10"
                />
                <ExternalLink className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                ব্যানারে ক্লিক করলে ব্যবহারকারী এই লিংকে চলে যাবে।
              </p>
            </div>

            {/* Optional Banner Text */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                ব্যানার টেক্সট (ঐচ্ছিক):
              </label>
              <input
                type="text"
                value={topBanner.text}
                onChange={(e) =>
                  setTopBanner((prev) => ({ ...prev, text: e.target.value }))
                }
                placeholder="যেমন: বার্ষিক পরীক্ষা উপলক্ষে সকল সাবস্ক্রিপশনে বিশেষ ছাড় চলছে!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                ছবি আপলোড না থাকলে এই টেক্সট দিয়ে আকর্ষণীয় গ্রেডিয়েন্ট ব্যানার
                প্রদর্শিত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            FEATURE 2: POPUP MODAL CONTROL
           ========================================= */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 flex items-center justify-center shrink-0">
                <ImageIcon className="size-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  ২. পপআপ মডাল (Popup Modal)
                </h2>
                <p className="text-xs text-muted-foreground">
                  চালু থাকলে ওয়েবসাইটে প্রবেশের সাথে সাথেই সেন্ট্রাল পপআপ মডাল
                  ভেসে উঠবে।
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <div className="flex items-center gap-3 self-start xs:self-auto">
              <Switch
                id="popup-modal-active"
                checked={popupModal.isActive}
                onCheckedChange={(checked) =>
                  setPopupModal((prev) => ({
                    ...prev,
                    isActive: checked,
                  }))
                }
              />
              <label
                htmlFor="popup-modal-active"
                className="text-xs sm:text-sm font-bold cursor-pointer select-none min-w-16"
              >
                {popupModal.isActive ? (
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold">
                    চালু আছে
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    বন্ধ আছে
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Modal Settings Body */}
          <div className="space-y-4 pt-1">
            {/* Modal Image Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                পপআপ পোস্টার/ছবি আপলোড:
              </label>

              {popupModal.imageUrl ? (
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group max-w-sm mx-auto">
                  <img
                    src={popupModal.imageUrl}
                    alt="পপআপ প্রিভিউ"
                    className="w-full h-auto max-h-72 object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => modalFileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="size-3.5" />
                      <span>পরিবর্তন করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPopupModal((prev) => ({ ...prev, imageUrl: "" }))
                      }
                      className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="size-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => modalFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-7 text-center cursor-pointer transition bg-slate-50/50 hover:bg-purple-50/30 flex flex-col items-center justify-center gap-2"
                >
                  {uploadingModal ? (
                    <Loader2 className="size-7 animate-spin text-purple-600" />
                  ) : (
                    <ImageIcon className="size-9 text-slate-400" />
                  )}
                  <div className="text-xs sm:text-sm text-slate-600">
                    <span className="font-bold text-purple-700 hover:underline">
                      ক্লিক করে পপআপ ছবি আপলোড করুন
                    </span>{" "}
                    (ব্যানার/পোস্টার সাইজ e.g. 600x600 বা 800x600)
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    JPG, PNG, WebP (সর্বোচ্চ ৮ মেগাবাইট)
                  </p>
                </div>
              )}

              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "modal");
                  e.target.value = "";
                }}
              />

              <div className="mt-2.5">
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  অথবা ছবির সরাসরি লিঙ্ক (Image URL) পেস্ট করুন:
                </label>
                <input
                  type="text"
                  value={popupModal.imageUrl}
                  onChange={(e) =>
                    setPopupModal((prev) => ({
                      ...prev,
                      imageUrl: e.target.value.trim(),
                    }))
                  }
                  placeholder="https://example.com/popup-offer.png"
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
                />
              </div>
            </div>

            {/* URL Destination Box */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-foreground mb-1.5">
                পপআপ ক্লিক ইউআরএল (URL):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={popupModal.linkUrl}
                  onChange={(e) =>
                    setPopupModal((prev) => ({
                      ...prev,
                      linkUrl: e.target.value,
                    }))
                  }
                  placeholder="যেমন: /subscription অথবা https://smartproshnobank.com/affiliate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans pr-10"
                />
                <ExternalLink className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                মডালের ছবিতে ক্লিক করলে ব্যবহারকারী স্বয়ংক্রিয়ভাবে এই লিংকে চলে
                যাবে।
              </p>
            </div>

            {/* Test Preview Action */}
            {popupModal.imageUrl && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-purple-800 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 transition cursor-pointer"
                >
                  <Eye className="size-4" />
                  <span>স্ক্রিনে মডালটি টেস্ট করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-lg active:scale-95 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}</span>
        </button>
      </div>

      {/* Test Modal Component Preview */}
      {testModalOpen && (
        <CampaignPopupModal
          modal={{
            isActive: true,
            imageUrl: popupModal.imageUrl,
            linkUrl: popupModal.linkUrl,
          }}
          isOpen={testModalOpen}
          onClose={() => setTestModalOpen(false)}
        />
      )}
    </div>
  );
}
