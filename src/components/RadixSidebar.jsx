import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/UserContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignOutButton, useUser } from "@clerk/react";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronsUpDown,
  CreditCard,
  Database,
  FolderOpen,
  HelpCircle,
  Home as HomeIcon,
  LayoutDashboard,
  LogOut,
  Monitor,
  PlusCircle,
  ScanLine,
  ShieldAlert,
  Sliders,
  Sparkles,
  Sparkles as SparklesIcon,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const DATA = {
  teams: [
    {
      name: "প্রশ্ন",
      logo: BookOpen,
      plan: "SaaS Platform",
    },
  ],
  navGroups: [
    {
      label: "ওভারভিউ",
      items: [
        {
          title: "ড্যাশবোর্ড",
          url: "/dashboard",
          icon: LayoutDashboard,
          roles: [
            "Super Admin",
            "Admin",
            "Content Manager",
            "Question Creator",
            "Support Team",
            "Subscriber",
          ],
        },
      ],
    },
    {
      label: "প্রশ্ন ইঞ্জিন",
      items: [
        {
          title: "১ ক্লিকে প্রশ্ন তৈরি",
          url: "/dashboard/generate",
          icon: Sparkles,
          roles: ["Subscriber"],
        },
        {
          title: "তৈরিকৃত প্রশ্ন",
          url: "/dashboard/created-questions",
          icon: FolderOpen,
          roles: ["Super Admin", "Admin", "Subscriber"],
        },
        {
          title: "প্রশ্নব্যাংক",
          url: "/dashboard/bank",
          icon: Database,
          roles: ["Super Admin", "Admin"],
        },
        {
          title: "প্রশ্ন অনুমোদন",
          url: "/dashboard/question-approval",
          icon: BadgeCheck,
          roles: ["Super Admin", "Admin", "Content Manager"],
        },
        {
          title: "আমার তৈরি প্রশ্ন",
          url: "/dashboard/my-questions",
          icon: FolderOpen,
          roles: ["Question Creator"],
        },
        {
          title: "নতুন প্রশ্ন যোগ",
          url: "/dashboard/add-question",
          icon: PlusCircle,
          roles: ["Question Creator"],
        },
      ],
    },
    {
      label: "মূল্যায়ন",
      items: [
        {
          title: "অনলাইন পরীক্ষা",
          url: "/dashboard/exams",
          icon: Monitor,
          roles: ["Subscriber"],
        },
        {
          title: "OMR মূল্যায়ন",
          url: "/dashboard/omr",
          icon: ScanLine,
          roles: ["Subscriber"],
        },
      ],
    },
    {
      label: "ব্যবস্থাপনা",
      items: [
        {
          title: "স্টাফ ব্যবস্থাপনা",
          url: "/dashboard/staff",
          icon: Users,
          roles: ["Super Admin", "Admin"],
        },
        {
          title: "সিলেবাস ব্যবস্থাপনা",
          url: "/dashboard/syllabus",
          icon: BookOpen,
          roles: ["Super Admin", "Admin", "Content Manager"],
        },
        {
          title: "সাবজেক্ট সেটআপ",
          url: "/dashboard/subject-setup",
          icon: Sliders,
          roles: ["Super Admin", "Admin"],
        },
        {
          title: "মেটাডাটা সেটআপ",
          url: "/dashboard/metadata-setup",
          icon: Sliders,
          roles: ["Super Admin", "Admin", "Content Manager"],
        },
        {
          title: "অ্যাকাডেমিক সেটআপ",
          url: "/dashboard/academic-setup",
          icon: Sliders,
          roles: ["Super Admin"],
        },
        {
          title: "প্যাকেজ ও ডিসকাউন্ট",
          url: "/dashboard/admin/pricing",
          icon: CreditCard,
          roles: ["Super Admin", "Admin"],
        },
        {
          title: "আমার প্রতিষ্ঠান",
          url: "/dashboard/institution",
          icon: HomeIcon,
          roles: ["Subscriber"],
        },
        {
          title: "সাবস্ক্রিপশন ও প্যাকেজ",
          url: "/dashboard/subscription",
          icon: CreditCard,
          roles: ["Subscriber"],
        },
      ],
    },
    {
      label: "সহায়তা",
      items: [
        {
          title: "সাপোর্ট সেন্টার",
          url: "/dashboard/support",
          icon: HelpCircle,
          roles: [
            "Super Admin",
            "Admin",
            "Content Manager",
            "Question Creator",
            "Support Team",
            "Subscriber",
          ],
        },
        {
          title: "সাপোর্ট হেল্পডেস্ক",
          url: "/dashboard/support-management",
          icon: ShieldAlert,
          roles: ["Super Admin", "Admin", "Content Manager", "Support Team"],
        },
      ],
    },
  ],
};

export const RadixSidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useUser();
  const { toggleSidebar, setOpenMobile } = useSidebar();
  const { role, userProfile } = useUserContext();
  const currentRole = role || "Subscriber";

  const isInstitution = userProfile?.userType === "Institution";
  const displayName = isInstitution
    ? userProfile?.institutionName || user?.fullName || "প্রতিষ্ঠান"
    : userProfile?.fullName || user?.fullName || "ব্যবহারকারী";

  const userInitials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  const filteredNavGroups = DATA.navGroups
    .map((group) => {
      const items = group.items.filter(
        (item) =>
          currentRole === "Super Admin" || item.roles.includes(currentRole),
      );
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar
      collapsible={isMobile ? "icon" : "none"}
      className="border-r border-black/[0.05] bg-glass-sidebar"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex p-2 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex aspect-square size-9 items-center justify-center rounded-xl text-white transition-all duration-300"
                  style={{
                    background: "var(--sidebar-brand-gradient)",
                    boxShadow: "var(--sidebar-brand-shadow)",
                  }}
                >
                  <BookOpen className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-[15px] leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-slate-800 font-sans tracking-tight">
                    {DATA.teams[0].name}
                  </span>
                  <span className="truncate text-xs font-medium text-slate-500 font-sans">
                    {DATA.teams[0].plan}
                  </span>
                </div>
              </div>

              {/* Collapse Toggle Button */}
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors group-data-[collapsible=icon]:hidden"
                  title="মেনু সঙ্কুচিত করুন"
                >
                  <ChevronLeft className="size-4" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {filteredNavGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel
              className="group-data-[collapsible=icon]:hidden  text-[12px] uppercase tracking-widest mb-1.5 px-4 font-bengali"
              style={{ color: "var(--sidebar-section-label)" }}
            >
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] font-semibold text-[14px] h-10 px-4 rounded-xl transition-all duration-200 font-bengali"
                          : "text-slate-600 hover:text-[var(--sidebar-hover-text)] hover:bg-[var(--sidebar-hover-bg)] font-medium text-[14px] h-10 px-4 rounded-xl transition-all duration-200 font-bengali"
                      }
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 w-full"
                        style={{
                          color: isActive
                            ? "var(--sidebar-active-text)"
                            : undefined,
                        }}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <item.icon
                          className="size-[18px] transition-colors"
                          style={{
                            color: isActive
                              ? "var(--sidebar-active-icon)"
                              : undefined,
                          }}
                        />
                        <span
                          className="font-sans tracking-tight"
                          style={{
                            color: isActive
                              ? "var(--sidebar-active-text)"
                              : undefined,
                          }}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:text-slate-800 transition-all duration-200"
                  style={{
                    "--open-bg": "var(--sidebar-active-bg)",
                  }}
                >
                  <Avatar
                    className="h-8 w-8 rounded-lg"
                    style={{
                      border: "1.5px solid var(--sidebar-active-indicator)",
                      boxShadow: "0 0 0 2px rgba(144,14,176,0.12)",
                    }}
                  >
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || "User"}
                    />
                    <AvatarFallback
                      className="rounded-lg text-xs font-semibold text-white"
                      style={{ background: "var(--sidebar-brand-gradient)" }}
                    >
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">
                      {displayName}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {user?.primaryEmailAddress?.emailAddress || ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl p-1.5 z-50"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2.5 py-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.imageUrl} alt={displayName} />
                      <AvatarFallback className="rounded-lg bg-slate-100">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-slate-850">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-slate-400">
                        {user?.primaryEmailAddress?.emailAddress || ""}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                {currentRole === "Subscriber" && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg cursor-pointer px-2.5 py-2 text-[13px] font-semibold font-bengali transition-all duration-150 focus:bg-[var(--sidebar-dropdown-hover-bg)] focus:text-[var(--sidebar-dropdown-hover-text)]"
                      >
                        <Link
                          to="/dashboard/subscription"
                          className="flex items-center gap-2 w-full"
                          onClick={() => {
                            if (isMobile) {
                              setOpenMobile(false);
                            }
                          }}
                        >
                          <SparklesIcon className="size-4 text-amber-500" />
                          প্রো-তে আপগ্রেড করুন
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-black/[0.04]" />
                  </>
                )}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer px-2.5 py-2 text-[13px] font-semibold font-bengali transition-all duration-150 focus:bg-[var(--sidebar-dropdown-hover-bg)] focus:text-[var(--sidebar-dropdown-hover-text)]"
                  >
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 w-full"
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Users className="size-4" />
                      আমার প্রোফাইল
                    </Link>
                  </DropdownMenuItem>

                  {userProfile?.userType === "Institution" && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg cursor-pointer px-2.5 py-2 text-[13px] font-semibold font-bengali transition-all duration-150 focus:bg-[var(--sidebar-dropdown-hover-bg)] focus:text-[var(--sidebar-dropdown-hover-text)]"
                    >
                      <Link
                        to="/dashboard/institution"
                        className="flex items-center gap-2 w-full"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <BadgeCheck className="size-4" />
                        প্রতিষ্ঠানের প্রোফাইল
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer px-2.5 py-2 text-[13px] font-semibold font-bengali transition-all duration-150 focus:bg-[var(--sidebar-dropdown-hover-bg)] focus:text-[var(--sidebar-dropdown-hover-text)]"
                  >
                    <Link
                      to="/dashboard/support"
                      className="flex items-center gap-2 w-full"
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Bell className="size-4" />
                      যোগাযোগ ও সাপোর্ট
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-black/[0.04]" />
                <DropdownMenuItem className="p-0 focus:bg-transparent">
                  <SignOutButton>
                    <button className="flex w-full items-center gap-2 px-2.5 py-2 text-[13px] font-semibold text-red-650 hover:bg-red-500/10 rounded-lg transition-colors font-bengali">
                      <LogOut className="size-4" />
                      লগ আউট
                    </button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
