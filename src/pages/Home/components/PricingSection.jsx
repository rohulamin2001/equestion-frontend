import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  Package,
  PackageOpen,
  School,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAcademicConfig } from "../../../hooks/useAcademicConfig";
import apiClient from "../../../lib/apiClient";
import PricingCard from "../../Subscription/components/PricingCard";
import PricingCardSkeleton from "../../Subscription/components/PricingCardSkeleton";
import { SectionHeading } from "./ui";

const PACKAGE_CATEGORIES = [
  { id: "tutor", label: "১। শিক্ষক/টিউটর প্যাকেজ" },
  { id: "bundle", label: "২। একাডেমিক বান্ডেল প্যাকেজ" },
  { id: "coaching", label: "৩। কোচিং/প্রতিষ্ঠান প্যাকেজ" },
  { id: "school", label: "৪। শ্রেণি ভিত্তিক প্যাকেজ" },
  { id: "teacher-subject", label: "৫। বিষয়ভিত্তিক শিক্ষক প্যাকেজ" },
];

const getCategoryIcon = (catId) => {
  switch (catId) {
    case "tutor":
      return GraduationCap;
    case "bundle":
      return Layers;
    case "coaching":
      return Building2;
    case "school":
      return School;
    case "teacher-subject":
      return BookOpen;
    default:
      return Package;
  }
};

export default function PricingSection({ onSelectPackage }) {
  const { config } = useAcademicConfig();
  const [packages, setPackages] = useState([]);
  const [apiActiveVersions, setApiActiveVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("tutor");
  const [selectedVersion, setSelectedVersion] = useState("Bangla");

  const activeVersionIds =
    config?.versions && config.versions.length > 0
      ? config.versions
      : apiActiveVersions && apiActiveVersions.length > 0
        ? apiActiveVersions
        : ["Bangla"];

  const availableVersions = [
    { id: "Bangla", label: "বাংলা ভার্সন" },
    { id: "English", label: "English Version" },
    { id: "Madrasah", label: "মাদ্রাসা" },
  ].filter((ver) => activeVersionIds.includes(ver.id));

  const effectiveVersion = availableVersions.some(
    (v) => v.id === selectedVersion,
  )
    ? selectedVersion
    : (availableVersions[0]?.id ?? "Bangla");

  useEffect(() => {
    let ignore = false;

    const fetchPackages = async () => {
      try {
        const res = await apiClient.get("/subscriptions/packages");
        if (!ignore && res.data) {
          if (res.data.packages) {
            setPackages(res.data.packages);
          }
          if (res.data.activeVersions && res.data.activeVersions.length > 0) {
            setApiActiveVersions(res.data.activeVersions);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch landing packages:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchPackages();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCardAction = (pkg) => {
    toast.info("প্যাকেজটি ক্রয় করতে অনুগ্রহ করে রেজিস্টার অথবা লগইন করুন।", {
      duration: 3500,
    });
    if (onSelectPackage) {
      onSelectPackage(pkg);
    }
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.category === selectedCategory &&
      (pkg.version || "Bangla") === effectiveVersion,
  );

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 font-bengali"
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <SectionHeading
            eyebrow="স্বচ্ছ ও সাশ্রয়ী প্রাইসিং"
            title="আপনার প্রয়োজন অনুযায়ী সেরা প্যাকেজ বেছে নিন"
            description="শিক্ষক, কোচিং সেন্টার ও শিক্ষা প্রতিষ্ঠানের জন্য রয়েছে বিভিন্ন আকর্ষণীয় প্যাকেজ। ড্যাশবোর্ড থেকে সহজেই কিনতে পারবেন।"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-6">
          {PACKAGE_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md shadow-purple-200"
                    : "text-slate-700 bg-white/70 border border-slate-200 hover:bg-white hover:border-purple-300 shadow-sm"
                }`}
              >
                <Icon className="size-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Version Switcher */}
        {availableVersions.length > 0 && (
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="flex gap-1.5 bg-slate-100/90 p-1.5 border border-slate-200/80 rounded-xl shadow-inner">
              {availableVersions.map((ver) => {
                const isActive = effectiveVersion === ver.id;
                return (
                  <button
                    key={ver.id}
                    type="button"
                    onClick={() => setSelectedVersion(ver.id)}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--purple-700)] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>{ver.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Packages Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[1, 2, 3].map((n) => (
              <PricingCardSkeleton key={n} />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-glass-elevated px-6 py-14 text-center max-w-md mx-auto shadow-soft">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-purple-200/60 bg-purple-50/80 text-[var(--purple-700)]">
              <PackageOpen className="size-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              এই ক্যাটাগরিতে বর্তমানে কোনো প্যাকেজ নেই
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              অন্য ভার্সন বা ক্যাটাগরি নির্বাচন করে অন্যান্য আকর্ষণীয় প্যাকেজগুলো দেখুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {filteredPackages.map((pkg) => (
              <div key={`${pkg.id || pkg._id}-${pkg.version}`} className="h-full">
                <PricingCard
                  pkg={pkg}
                  Icon={getCategoryIcon(pkg.category)}
                  isSubscribed={false}
                  isPurchasing={false}
                  onSelect={() => handleCardAction(pkg)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
