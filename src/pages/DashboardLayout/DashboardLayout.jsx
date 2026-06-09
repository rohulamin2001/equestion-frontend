import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/animate-ui/components/radix/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { RadixSidebar } from '@/components/RadixSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

const ROUTE_TITLES = {
  '/dashboard': 'ড্যাশবোর্ড ওভারভিউ',
  '/dashboard/generate': '১ ক্লিকে প্রশ্ন তৈরি',
  '/dashboard/bank': 'প্রশ্নব্যাংক',
  '/dashboard/my-questions': 'আমার তৈরি প্রশ্ন',
  '/dashboard/add-question': 'নতুন প্রশ্ন যোগ',
  '/dashboard/exams': 'অনলাইন পরীক্ষা',
  '/dashboard/omr': 'OMR মূল্যায়ন',
  '/dashboard/institution': 'আমার প্রতিষ্ঠান',
  '/dashboard/subscription': 'সাবস্ক্রিপশন ও প্যাকেজ',
  '/dashboard/support': 'যোগাযোগ ও সাপোর্ট'
};

export default function DashboardLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const currentTitle = ROUTE_TITLES[location.pathname] || 'ড্যাশবোর্ড';

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-slate-50/50">
          <RadixSidebar />
          <SidebarInset className="flex-1 flex flex-col min-w-0 bg-transparent">
            {/* Top Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white/80 backdrop-blur px-4 sticky top-0 z-10 transition-[width,height] ease-linear">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="lg:hidden -ml-1 text-slate-500 hover:text-slate-900" />
                <Separator orientation="vertical" className="lg:hidden mx-2 h-4 bg-slate-200" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden lg:block">
                      <BreadcrumbLink className="text-slate-500 hover:text-slate-900 transition">
                        ইপ্রশ্নব্যাংক
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden lg:block text-slate-400" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-semibold text-slate-800">
                        {currentTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>

            {/* Dashboard Content Workspace */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 w-full">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
