import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
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
} from '@/components/animate-ui/components/radix/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SignOutButton, useUser } from '@clerk/react';
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
  Sliders,
  Sparkles,
  Sparkles as SparklesIcon,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';

const DATA = {
  teams: [
    {
      name: 'ইপ্রশ্নব্যাংক',
      logo: BookOpen,
      plan: 'SaaS Platform',
    }
  ],
  navGroups: [
    {
      label: 'ওভারভিউ',
      items: [
        {
          title: 'ড্যাশবোর্ড',
          url: '/dashboard',
          icon: LayoutDashboard,
          roles: ['Super Admin', 'Admin', 'Content Manager', 'Question Creator', 'Support Team', 'Subscriber'],
        }
      ]
    },
    {
      label: 'প্রশ্ন ইঞ্জিন',
      items: [
        {
          title: '১ ক্লিকে প্রশ্ন তৈরি',
          url: '/dashboard/generate',
          icon: Sparkles,
          roles: ['Subscriber'],
        },
        {
          title: 'প্রশ্নব্যাংক',
          url: '/dashboard/bank',
          icon: Database,
          roles: ['Subscriber', 'Super Admin', 'Admin', 'Content Manager'],
        },
        {
          title: 'আমার তৈরি প্রশ্ন',
          url: '/dashboard/my-questions',
          icon: FolderOpen,
          roles: ['Subscriber', 'Question Creator'],
        },
        {
          title: 'নতুন প্রশ্ন যোগ',
          url: '/dashboard/add-question',
          icon: PlusCircle,
          roles: ['Question Creator'],
        }
      ]
    },
    {
      label: 'মূল্যায়ন',
      items: [
        {
          title: 'অনলাইন পরীক্ষা',
          url: '/dashboard/exams',
          icon: Monitor,
          roles: ['Subscriber'],
        },
        {
          title: 'OMR মূল্যায়ন',
          url: '/dashboard/omr',
          icon: ScanLine,
          roles: ['Subscriber'],
        }
      ]
    },
    {
      label: 'ব্যবস্থাপনা',
      items: [
        {
          title: 'স্টাফ ব্যবস্থাপনা',
          url: '/dashboard/staff',
          icon: Users,
          roles: ['Super Admin', 'Admin'],
        },
        {
          title: 'সিলেবাস ব্যবস্থাপনা',
          url: '/dashboard/syllabus',
          icon: BookOpen,
          roles: ['Super Admin', 'Admin', 'Content Manager'],
        },
        {
          title: 'সাবজেক্ট সেটআপ',
          url: '/dashboard/subject-setup',
          icon: Sliders,
          roles: ['Super Admin', 'Admin'],
        },
        {
          title: 'অ্যাকাডেমিক সেটআপ',
          url: '/dashboard/academic-setup',
          icon: Sliders,
          roles: ['Super Admin'],
        },
        {
          title: 'আমার প্রতিষ্ঠান',
          url: '/dashboard/institution',
          icon: HomeIcon,
          roles: ['Subscriber'],
        },
        {
          title: 'সাবস্ক্রিপশন ও প্যাকেজ',
          url: '/dashboard/subscription',
          icon: CreditCard,
          roles: ['Subscriber'],
        }
      ]
    },
    {
      label: 'সহায়তা',
      items: [
        {
          title: 'যোগাযোগ ও সাপোর্ট',
          url: '/dashboard/support',
          icon: HelpCircle,
          roles: ['Subscriber', 'Support Team'],
        }
      ]
    }
  ]
};

export const RadixSidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useUser();
  const { toggleSidebar } = useSidebar();
  const { role } = useUserContext();

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'US';

  const currentRole = role || 'Subscriber';
  const filteredNavGroups = DATA.navGroups
    .map((group) => {
      const items = group.items.filter(
        (item) => currentRole === 'Super Admin' || item.roles.includes(currentRole)
      );
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible={isMobile ? "icon" : "none"} className="border-r border-slate-200">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex p-2 items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-slate-800 text-white shadow-md shadow-primary/20 transition-all duration-300">
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
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-slate-400 font-semibold text-[15px] mb-2 px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      className={
                        isActive 
                          ? 'bg-primary/10 text-primary font-semibold text-[15px] h-10 px-3.5 rounded-lg shadow-sm shadow-primary/5 transition-all duration-200' 
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 font-semibold text-[15px] h-10 px-3.5 rounded-lg transition-all duration-200'
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className={isActive ? 'text-primary size-[18px]' : 'text-slate-500 group-hover/menu-item:text-slate-800 size-[18px] transition-colors'} />
                        <span className="font-sans tracking-tight">{item.title}</span>
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
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-slate-200">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || 'User'}
                    />
                    <AvatarFallback className="rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">
                      {user?.fullName || 'ব্যবহারকারী'}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {user?.primaryEmailAddress?.emailAddress || ''}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName || 'User'}
                      />
                      <AvatarFallback className="rounded-lg bg-slate-100">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.fullName || 'ব্যবহারকারী'}
                      </span>
                      <span className="truncate text-xs text-slate-500">
                        {user?.primaryEmailAddress?.emailAddress || ''}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/subscription" className="flex items-center gap-2 w-full">
                      <SparklesIcon className="size-4 text-amber-500" />
                      Upgrade to Pro
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/institution" className="flex items-center gap-2 w-full">
                      <BadgeCheck className="size-4" />
                      Institution Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/support" className="flex items-center gap-2 w-full">
                      <Bell className="size-4" />
                      Support
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <SignOutButton>
                    <button className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md">
                      <LogOut className="size-4" />
                      Log out
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
