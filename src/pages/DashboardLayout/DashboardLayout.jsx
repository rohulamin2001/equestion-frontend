import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import OnboardingModal from "@/components/OnboardingModal";
import { RadixSidebar } from "@/components/RadixSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@clerk/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ROUTE_TITLES = {
  "/dashboard": "ড্যাশবোর্ড ওভারভিউ",
  "/dashboard/generate": "১ ক্লিকে প্রশ্ন তৈরি",
  "/dashboard/created-questions": "তৈরিকৃত প্রশ্ন",
  "/dashboard/bank": "প্রশ্নব্যাংক",
  "/dashboard/question-approval": "প্রশ্ন অনুমোদন",
  "/dashboard/my-questions": "আমার তৈরি প্রশ্ন",
  "/dashboard/add-question": "নতুন প্রশ্ন যোগ",
  "/dashboard/exams": "অনলাইন পরীক্ষা",
  "/dashboard/omr": "OMR মূল্যায়ন",
  "/dashboard/staff": "স্টাফ ব্যবস্থাপনা",
  "/dashboard/syllabus": "সিলেবাস ব্যবস্থাপনা",
  "/dashboard/subject-setup": "সাবজেক্ট সেটআপ",
  "/dashboard/metadata-setup": "মেটাডাটা সেটআপ",
  "/dashboard/academic-setup": "অ্যাকাডেমিক সেটআপ",
  "/dashboard/admin/pricing": "প্যাকেজ ও ডিসকাউন্ট",
  "/dashboard/institution": "আমার প্রতিষ্ঠান",
  "/dashboard/subscription": "সাবস্ক্রিপশন ও প্যাকেজ",
  "/dashboard/support": "যোগাযোগ ও সাপোর্ট",
  "/dashboard/profile": "আমার প্রোফাইল",
  "/dashboard/questions": "প্রশ্ন নির্বাচন ও জেনারেট",
  "/dashboard/questions/select": "প্রশ্ন বাছাইকরণ",
  "/dashboard/questions/preview": "প্রশ্ন প্রিভিউ",
};

export default function DashboardLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { userProfile, role, loading: profileLoading } = useUserContext();
  const location = useLocation();

  if (!isLoaded || (isSignedIn && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-55">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const currentTitle = ROUTE_TITLES[location.pathname] || "ড্যাশবোর্ড";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-[#F5F5F7] text-[#1E293B] relative overflow-hidden">
          {/* Compulsory Onboarding Modal overlay - only for Subscribers */}
          {userProfile && role === "Subscriber" && !userProfile.isOnboarded && (
            <OnboardingModal />
          )}
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Top-Left Orb: Royal Purple */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#4F46E5]/[0.06] blur-[120px]" />
            {/* Top-Right Orb: Violet */}
            <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/[0.04] blur-[100px]" />
            {/* Bottom-Center Orb: Accent Orange */}
            <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#F97316]/[0.02] blur-[80px]" />
          </div>

          <RadixSidebar className="relative z-10" />
          <SidebarInset className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
            {/* Top Header - Saturated Light Glass Layer */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.05] bg-white/[0.40] backdrop-blur-[20px] saturate-[180%] px-6 sticky top-0 z-50 transition-[width,height] ease-linear">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="lg:hidden -ml-1 text-slate-500 hover:text-slate-800" />
                <Separator
                  orientation="vertical"
                  className="lg:hidden mx-2 h-4 bg-slate-200"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden lg:block">
                      <BreadcrumbLink className="text-slate-500 hover:text-[#4F46E5] transition font-sans">
                        ইপ্রশ্নব্যাংক
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden lg:block text-slate-400" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-semibold text-slate-800 font-bengali">
                        {currentTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            {/* Dashboard Content Workspace */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 w-full relative z-10">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
