import { useAuth, useClerk, useReverification, useUser } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  KeyRound,
  Landmark,
  Laptop,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  QrCode,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { translateSubscriptionKey } from "../../constants/subscriptions";
import { useUserContext } from "../../context/UserContext";
import apiClient from "../../lib/apiClient";

export default function Profile() {
  const { userProfile, role, refreshProfile } = useUserContext();
  const { getToken, sessionId: currentSessionId } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState("info"); // 'info' or 'security'
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch active subscriptions
  const { data: mySubs = [], isLoading: mySubsLoading } = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/subscriptions/my-subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.subscriptions || [];
    },
  });

  // Fetch packages for titles fallback
  const { data: packagesList = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await apiClient.get("/subscriptions/packages");
      return res.data.packages || [];
    },
  });

  const formatDate = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Profile Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [institutionName, setInstitutionName] = useState("");

  // Institution States
  const [institutionType, setInstitutionType] = useState("");
  const [institutionMedium, setInstitutionMedium] = useState("");
  const [founderName, setFounderName] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [eiin, setEiin] = useState("");
  const [institutionCode, setInstitutionCode] = useState("");
  const [studentCountRange, setStudentCountRange] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");

  // Address
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [postOffice, setPostOffice] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // Security Form States (Password)
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // 2FA TOTP States
  const totpEnabled = user?.twoFactorEnabled ?? false;
  const [showTotpSetup, setShowTotpSetup] = useState(false);
  const [totpResource, setTotpResource] = useState(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpLoading, setTotpLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState(null);

  const divisions = [
    "ঢাকা",
    "চট্টগ্রাম",
    "রাজশাহী",
    "খুলনা",
    "বরিশাল",
    "সিলেট",
    "রংপুর",
    "ময়মনসিংহ",
  ];
  const studentRanges = [
    { value: "1-100", label: "১–১০০ জন" },
    { value: "101-300", label: "১০১–৩০০ জন" },
    { value: "301-500", label: "৩০১–৫০০ জন" },
    { value: "501-1,000", label: "৫০১–১,০০০ জন" },
    { value: "1,001-2,000", label: "১,০০১–২,০০০ জন" },
    { value: "2,001-5,000", label: "২,০০১–৫,০০০ জন" },
    { value: "5,001+", label: "৫,০০১+ জন" },
  ];

  const institutionTypeLabels = {
    School: "স্কুল",
    College: "কলেজ",
    "School & College": "স্কুল অ্যান্ড কলেজ",
    Madrasah: "মাদ্রাসা",
    "Coaching Center": "কোচিং সেন্টার",
    Other: "অন্যান্য",
  };

  const institutionMediumLabels = {
    Bangla: "বাংলা",
    English: "ইংরেজি",
    both: "উভয় (English & Bangla)",
  };

  // Track previous values for sync/initialization during rendering
  const [prevUserProfile, setPrevUserProfile] = useState(null);

  if (userProfile !== prevUserProfile) {
    setPrevUserProfile(userProfile);
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");
      setDesignation(userProfile.designation || "");
      setInstitutionName(userProfile.institutionName || "");

      setInstitutionType(userProfile.institutionType || "");
      setInstitutionMedium(userProfile.institutionMedium || "");
      setFounderName(userProfile.founderName || "");
      setFoundingYear(userProfile.foundingYear || "");
      setEiin(userProfile.eiin || "");
      setInstitutionCode(userProfile.institutionCode || "");
      setStudentCountRange(userProfile.studentCountRange || "");
      setContactNumber(userProfile.contactNumber || "");
      setOfficialEmail(userProfile.officialEmail || "");
      setOfficialWebsite(userProfile.officialWebsite || "");

      if (userProfile.addressInfo) {
        setDivision(userProfile.addressInfo.division || "");
        setDistrict(userProfile.addressInfo.district || "");
        setUpazila(userProfile.addressInfo.upazila || "");
        setPostOffice(userProfile.addressInfo.postOffice || "");
        setFullAddress(userProfile.addressInfo.fullAddress || "");
      }
    }
  }

  const [activeSessions, setActiveSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    if (!user) return;
    try {
      setSessionsLoading(true);
      const res = await user.getSessions();
      setActiveSessions(res);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;
    if (user && activeTab === "security") {
      Promise.resolve().then(() => {
        if (!ignore) {
          loadSessions();
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [user, activeTab, loadSessions]);

  // Custom Profile/Logo Image uploader
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন।");
      return;
    }

    setImageUploading(true);
    const toastId = toast.loading("ছবি আপলোড করা হচ্ছে...");

    try {
      await user.setProfileImage({ file });
      toast.success("ছবিটি সফলভাবে আপডেট করা হয়েছে!", { id: toastId });
      // Refresh profile to trigger Webhook sync and reload image in state
      await refreshProfile();
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("ছবি আপলোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।", {
        id: toastId,
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Custom Profile Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { userType: userProfile?.userType };

      if (!isSubscriber) {
        if (!firstName.trim() || !lastName.trim()) {
          toast.error("দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।");
          setLoading(false);
          return;
        }
        payload = {
          ...payload,
          firstName,
          lastName,
        };
      } else if (userProfile.userType === "Teacher") {
        if (!firstName.trim() || !lastName.trim() || !institutionName.trim()) {
          toast.error("দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।");
          setLoading(false);
          return;
        }
        payload = {
          ...payload,
          firstName,
          lastName,
          designation,
          institutionName,
        };
      } else {
        if (
          !institutionName.trim() ||
          !institutionType ||
          !institutionMedium ||
          !founderName.trim() ||
          !foundingYear.trim() ||
          !studentCountRange ||
          !contactNumber.trim() ||
          !division ||
          !district.trim() ||
          !upazila.trim() ||
          !postOffice.trim() ||
          !fullAddress.trim()
        ) {
          toast.error("দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।");
          setLoading(false);
          return;
        }
        payload = {
          ...payload,
          institutionName,
          institutionType,
          institutionMedium,
          founderName,
          foundingYear,
          eiin,
          institutionCode,
          studentCountRange,
          contactNumber,
          officialEmail,
          officialWebsite,
          addressInfo: {
            division,
            district,
            upazila,
            postOffice,
            fullAddress,
          },
        };
      }

      const token = await getToken();
      const response = await apiClient.put("/users/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে!");
        await refreshProfile();
      }
    } catch (error) {
      console.error("Update profile failed:", error);
      toast.error(
        error.response?.data?.error || "তথ্য আপডেট করতে ব্যর্থ হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  // Base function to perform the actual update
  const executePasswordUpdate = async () => {
    await user.updatePassword({
      currentPassword,
      newPassword,
      signOutOfOtherSessions: true,
    });
    toast.success("পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  };

  // Generate strong compliant password
  const generateSecurePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 0; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle characters
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    setNewPassword(password);
    setConfirmPassword(password);

    toast.info(`একটি সুরক্ষিত পাসওয়ার্ড তৈরি করা হয়েছে: ${password}`, {
      duration: 15000,
      action: {
        label: "কপি করুন",
        onClick: () => {
          try {
            navigator.clipboard.writeText(password);
            toast.success("পাসওয়ার্ড ক্লিপবোর্ডে কপি করা হয়েছে!");
          } catch {
            toast.error("পাসওয়ার্ড কপি করতে ব্যর্থ হয়েছে।");
          }
        },
      },
    });
  };

  // Wrap with Clerk's reverification hook to automatically handle session step-up authentication
  const triggerPasswordUpdate = useReverification(executePasswordUpdate);

  // Custom Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি।");
      return;
    }

    setPasswordLoading(true);
    const toastId = toast.loading("পাসওয়ার্ড আপডেট করা হচ্ছে...");

    try {
      await triggerPasswordUpdate();
    } catch (err) {
      console.error("Password update failed:", err);
      if (err.errors?.[0]) {
        toast.error(
          err.errors[0].longMessage || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।",
        );
      }
    } finally {
      setPasswordLoading(false);
      toast.dismiss(toastId);
    }
  };

  const executeEnable2FA = async () => {
    const resource = await user.createTOTP();
    setTotpResource(resource);
    setShowTotpSetup(true);
  };

  const triggerEnable2FA = useReverification(executeEnable2FA);

  // Enable Custom 2FA (TOTP)
  const handleEnable2FA = async () => {
    setTotpLoading(true);
    try {
      await triggerEnable2FA();
    } catch (err) {
      console.error("Failed to create TOTP configuration:", err);
      const errMsg =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "২FA কনফিগারেশন তৈরি করতে ব্যর্থ হয়েছে।";
      toast.error(errMsg);
    } finally {
      setTotpLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.length !== 6) {
      toast.error("দয়া করে ৬ ডিজিটের সঠিক ভেরিফিকেশন কোড লিখুন।");
      return;
    }

    setTotpLoading(true);
    try {
      await user.verifyTOTP({ code: totpCode });
      toast.success("২-ফ্যাক্টর অথেনটিকেশন সফলভাবে সক্রিয় করা হয়েছে!");
      setShowTotpSetup(false);
      setTotpResource(null);
      setTotpCode("");
    } catch (err) {
      console.error("2FA verification failed:", err);
      const errMsg =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "ভেরিফিকেশন কোডটি সঠিক নয়। আবার চেষ্টা করুন।";
      toast.error(errMsg);
    } finally {
      setTotpLoading(false);
    }
  };

  const executeDisable2FA = async () => {
    await user.disableTOTP();
    toast.success("২-ফ্যাক্টর অথেনটিকেশন সফলভাবে নিষ্ক্রিয় করা হয়েছে।");
  };

  const triggerDisable2FA = useReverification(executeDisable2FA);

  // Disable Custom 2FA
  const handleDisable2FA = () => {
    setShowDisableConfirm(true);
  };

  const confirmDisable2FA = async () => {
    setShowDisableConfirm(false);
    setTotpLoading(true);
    try {
      await triggerDisable2FA();
    } catch (err) {
      console.error("Disable 2FA failed:", err);
      const errMsg =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "২-ফ্যাক্টর অথেনটিকেশন নিষ্ক্রিয় করতে ব্যর্থ হয়েছে।";
      toast.error(errMsg);
    } finally {
      setTotpLoading(false);
    }
  };

  const confirmRevokeSession = async () => {
    if (!sessionToRevoke) return;
    const session = sessionToRevoke;
    const isCurrent = session.id === currentSessionId;
    setSessionToRevoke(null);
    try {
      if (isCurrent) {
        await signOut();
        toast.success("আপনি সফলভাবে লগ আউট হয়েছেন!");
      } else {
        await signOut({ sessionId: session.id });
        toast.success("ডিভাইসটি সফলভাবে লগ আউট করা হয়েছে!");
        loadSessions();
      }
    } catch (err) {
      console.error("Failed to revoke session:", err);
      toast.error("ডিভাইসটি লগ আউট করতে ব্যর্থ হয়েছে।");
    }
  };

  // Format Date to DD/MM/YYYY, HH:MM:SS AM/PM
  const formatSessionDate = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHour = String(hours).padStart(2, "0");

    return `${day}/${month}/${year}, ${formattedHour}:${minutes}:${seconds} ${ampm}`;
  };

  // Device/Browser information parser from Session data & User Agent
  const getSessionInfo = (session) => {
    const activity = session.latestActivity;
    const isCurrent = session.id === currentSessionId;

    let os = "অন্যান্য ডিভাইস";
    let browser = "অজানা ব্রাউজার";
    let IconComponent;

    if (isCurrent && typeof window !== "undefined" && navigator.userAgent) {
      const ua = navigator.userAgent;

      // Parse OS
      if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
      else if (ua.includes("Linux")) os = "Linux";
      else os = "Desktop";

      // Parse Browser
      if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari") && !ua.includes("Chrome"))
        browser = "Safari";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Edge")) browser = "Edge";
      else browser = "Browser";

      // Add version if available in latestActivity
      if (activity?.browserVersion) {
        browser = `${browser} ${activity.browserVersion}`;
      } else {
        const match =
          ua.match(
            /(chrome|safari|firefox|msie|trident|opera(?=\/))\/?\s*(\d+)/i,
          ) || [];
        if (match[2]) {
          browser = `${browser} ${match[2]}`;
        }
      }
    } else if (activity) {
      // For other sessions, use Clerk's latestActivity properties
      const deviceType = activity.deviceType || "";
      const isMobile = activity.isMobile;

      if (deviceType === "desktop") {
        os = "Desktop";
      } else if (deviceType === "mobile" || isMobile) {
        os = "Mobile";
      } else if (deviceType === "tablet") {
        os = "Tablet";
      } else {
        os = "Desktop";
      }

      if (activity.browserName) {
        browser = activity.browserName;
        if (activity.browserVersion) {
          browser = `${browser} ${activity.browserVersion}`;
        }
      }
    }

    // Determine Icon
    if (os === "Android" || os === "iOS" || os === "Mobile") {
      IconComponent = Smartphone;
    } else if (os === "Tablet") {
      IconComponent = Tablet;
    } else {
      IconComponent = Laptop;
    }

    // Translate OS for display
    let osDisplay = os;
    if (os === "Windows") osDisplay = "Windows";
    else if (os === "macOS") osDisplay = "macOS";
    else if (os === "Linux") osDisplay = "Linux";
    else if (os === "Android") osDisplay = "Android Mobile";
    else if (os === "iOS") osDisplay = "iOS Device";
    else if (os === "Desktop")
      osDisplay = "Windows"; // Default to Windows if desktop in Clerk config
    else if (os === "Mobile") osDisplay = "Mobile Device";
    else if (os === "Tablet") osDisplay = "Tablet Device";

    return { os: osDisplay, browser, IconComponent };
  };

  const isSubscriber = role === "Subscriber";
  const isTeacher = userProfile?.userType === "Teacher";

  const roleLabels = {
    "Super Admin": "সুপার এডমিন",
    Admin: "এডমিন",
    "Content Manager": "কনটেন্ট ম্যানেজার",
    "Question Creator": "প্রশ্ন ক্রিয়েটর",
    "Support Team": "সাপোর্ট টিম",
    Subscriber: "সাবস্ক্রাইবার",
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          প্রোফাইল সেটিংস
        </h1>
        <p className="text-sm text-slate-500 font-bengali">
          আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য এবং অ্যাকাউন্ট নিরাপত্তা পরিচালনা
          করুন
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all font-bengali ${
            activeTab === "info"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          {!isSubscriber || isTeacher ? (
            <GraduationCap className="h-4 w-4" />
          ) : (
            <Landmark className="h-4 w-4" />
          )}
          প্রোফাইল তথ্য
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all font-bengali ${
            activeTab === "security"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          নিরাপত্তা ও অ্যাকাউন্ট
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all font-bengali ${
            activeTab === "subscriptions"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          সাবস্ক্রিপশন
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8"
          >
            {/* Custom Avatar Upload Section */}
            <div className="flex flex-col items-center space-y-4 border-b border-slate-100 pb-6">
              <div
                onClick={handleImageClick}
                className="relative h-24 w-24 rounded-full border border-slate-200 bg-slate-50 cursor-pointer overflow-hidden group shadow-sm flex items-center justify-center transition-all duration-300"
              >
                {imageUploading ? (
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                ) : user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <GraduationCap className="h-10 w-10 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
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
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="text-xs font-semibold text-slate-500">
                      আপনার রোল:
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-650 border border-indigo-100 font-sans">
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                            className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
                          >
                            <span>{designation || "পদবি নির্বাচন করুন"}</span>
                            <ChevronDown className="size-3.5 text-slate-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                          <DropdownMenuItem
                            onSelect={() => setDesignation("")}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                              !designation
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>পদবি নির্বাচন করুন</span>
                            {!designation && (
                              <span className="size-1 rounded-full bg-indigo-500" />
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
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                                designation === deg
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{deg}</span>
                              {designation === deg && (
                                <span className="size-1 rounded-full bg-indigo-500" />
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
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
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
                            className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
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
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                              !institutionType
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>নির্বাচন করুন</span>
                            {!institutionType && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                          {Object.entries(institutionTypeLabels).map(
                            ([val, label]) => (
                              <DropdownMenuItem
                                key={val}
                                onSelect={() => setInstitutionType(val)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                                  institutionType === val
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{label}</span>
                                {institutionType === val && (
                                  <span className="size-1 rounded-full bg-indigo-500" />
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
                            className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
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
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                              !institutionMedium
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>নির্বাচন করুন</span>
                            {!institutionMedium && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                          {Object.entries(institutionMediumLabels).map(
                            ([val, label]) => (
                              <DropdownMenuItem
                                key={val}
                                onSelect={() => setInstitutionMedium(val)}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                                  institutionMedium === val
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{label}</span>
                                {institutionMedium === val && (
                                  <span className="size-1 rounded-full bg-indigo-500" />
                                )}
                              </DropdownMenuItem>
                            ),
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        ছাত্র-ছাত্রীর সংখ্যা{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-full h-10 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
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
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                              !studentCountRange
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            <span>নির্বাচন করুন</span>
                            {!studentCountRange && (
                              <span className="size-1 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                          {studentRanges.map((range) => {
                            const isSelected =
                              studentCountRange === range.value;
                            return (
                              <DropdownMenuItem
                                key={range.value}
                                onSelect={() =>
                                  setStudentCountRange(range.value)
                                }
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                                  isSelected
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{range.label}</span>
                                {isSelected && (
                                  <span className="size-1 rounded-full bg-indigo-500" />
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
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 font-sans">
                      <MapPin className="h-4 w-4 text-indigo-500" />
                      প্রতিষ্ঠানের ঠিকানা
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          বিভাগ <span className="text-red-500">*</span>
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="w-full h-9 px-3 border border-black/[0.08] bg-white/[0.45] hover:bg-white/[0.65] hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center shadow-sm backdrop-blur-sm cursor-pointer select-none"
                            >
                              <span>{division || "নির্বাচন"}</span>
                              <ChevronDown className="size-3.5 text-slate-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-[var(--radix-dropdown-menu-trigger-width)]">
                            <DropdownMenuItem
                              onSelect={() => setDivision("")}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                                !division
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>নির্বাচন</span>
                              {!division && (
                                <span className="size-1 rounded-full bg-indigo-500" />
                              )}
                            </DropdownMenuItem>
                            {divisions.map((div) => {
                              const isSelected = division === div;
                              return (
                                <DropdownMenuItem
                                  key={div}
                                  onSelect={() => setDivision(div)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50 ${
                                    isSelected
                                      ? "bg-indigo-50 text-indigo-600"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span>{div}</span>
                                  {isSelected && (
                                    <span className="size-1 rounded-full bg-indigo-500" />
                                  )}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          জেলা <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          উপজেলা <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={upazila}
                          onChange={(e) => setUpazila(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          ডাকঘর <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={postOffice}
                          onChange={(e) => setPostOffice(e.target.value)}
                          className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">
                        সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
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
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
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
                          className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-300 ${
                    isTeacher
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
                  } disabled:opacity-50`}
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
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="space-y-6"
          >
            {/* Custom Password Update Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-bengali">
                  <KeyRound className="h-5 w-5 text-indigo-500" />
                  পাসওয়ার্ড পরিবর্তন করুন
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-850 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                >
                  {showPasswordForm ? "বাতিল করুন" : "পাসওয়ার্ড আপডেট করুন"}
                </button>
              </div>

              {showPasswordForm && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4 font-bengali pt-2 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Password - Full Width */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600">
                        বর্তমান পাসওয়ার্ড{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                          placeholder="আপনার বর্তমান পাসওয়ার্ড লিখুন"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center h-6">
                        <label className="text-xs font-semibold text-slate-600">
                          নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={generateSecurePassword}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-all duration-200"
                        >
                          <Sparkles className="h-3 w-3" />
                          পাসওয়ার্ড জেনারেট করুন
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                          placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        * পাসওয়ার্ডে অন্তত ৮টি অক্ষর, একটি বড় হাতের অক্ষর, একটি
                        ছোট হাতের অক্ষর, একটি সংখ্যা এবং একটি বিশেষ চিহ্নের
                        সংমিশ্রণ থাকতে হবে।
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center h-6">
                        <label className="text-xs font-semibold text-slate-600">
                          নতুন পাসওয়ার্ড পুনরায় নিশ্চিত করুন{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans"
                          placeholder="পাসওয়ার্ড পুনরায় টাইপ করুন"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        আপডেট হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        পাসওয়ার্ড আপডেট করুন
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Custom 2-Factor Authentication Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-2 font-bengali">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                ২-ফ্যাক্টর অথেনটিকেশন (2FA)
              </h3>

              <div className="space-y-4 font-bengali">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      অথেনটিকেটর অ্যাপস (Authenticator Apps)
                    </p>
                    <p className="text-xs text-slate-500">
                      গুগল অথেনটিকেটর বা অনুরূপ অ্যাপ ব্যবহার করে বাড়তি
                      নিরাপত্তা যোগ করুন
                    </p>
                  </div>
                  {totpEnabled ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      সক্রিয় রয়েছে
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                      নিষ্ক্রিয় রয়েছে
                    </span>
                  )}
                </div>

                {!totpEnabled && !showTotpSetup && (
                  <button
                    onClick={handleEnable2FA}
                    disabled={totpLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    {totpLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <QrCode className="h-4 w-4" />
                    )}
                    ২-ফ্যাক্টর অথেনটিকেশন চালু করুন
                  </button>
                )}

                {showTotpSetup && totpResource && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 max-w-md transition-all duration-300">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-sans">
                      <QrCode className="h-4 w-4 text-indigo-500" />
                      অথেনটিকেটর সেটআপ করুন
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ১. আপনার ফোনের গুগল অথেনটিকেটর (Google Authenticator)
                      অ্যাপ দিয়ে নিচের কিউআর কোডটি স্ক্যান করুন অথবা কোডটি
                      ম্যানুয়ালি এন্ট্রি করুন।
                    </p>

                    {/* Public Secure QR API Generation */}
                    <div className="flex justify-center py-2 bg-white rounded-xl border border-slate-200 w-fit mx-auto p-2">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totpResource.uri)}`}
                        alt="Authenticator QR Code"
                        className="h-[180px] w-[180px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-600">
                        ম্যানুয়াল কী (Key):
                      </p>
                      <code className="block p-2 bg-slate-200 rounded-lg text-xs font-sans font-bold select-all text-slate-800 text-center tracking-wider">
                        {totpResource.secret}
                      </code>
                    </div>

                    <form onSubmit={handleVerify2FA} className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          ২. অ্যাপে প্রাপ্ত ৬ ডিজিটের সাময়িক ভেরিফিকেশন কোডটি
                          নিচে লিখে ভেরিফাই করুন।
                        </p>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={totpCode}
                          onChange={(e) =>
                            setTotpCode(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-center font-sans tracking-widest font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          placeholder="000000"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowTotpSetup(false);
                            setTotpResource(null);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                          বাতিল
                        </button>
                        <button
                          type="submit"
                          disabled={totpLoading}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                        >
                          {totpLoading && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          ভেরিফাই ও সক্রিয় করুন
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {totpEnabled && (
                  <button
                    onClick={handleDisable2FA}
                    disabled={totpLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    {totpLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    ২-ফ্যাক্টর অথেনটিকেশন নিষ্ক্রিয় করুন
                  </button>
                )}

                <AlertDialog
                  open={showDisableConfirm}
                  onOpenChange={setShowDisableConfirm}
                >
                  <AlertDialogPopup>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ২-ফ্যাক্টর অথেনটিকেশন নিষ্ক্রিয় করুন
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্ট থেকে ২-ফ্যাক্টর
                        অথেনটিকেশন নিষ্ক্রিয় করতে চান? এর ফলে আপনার অ্যাকাউন্টের
                        নিরাপত্তা হ্রাস পাবে।
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmDisable2FA}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        নিষ্ক্রিয় করুন
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogPopup>
                </AlertDialog>
              </div>
            </div>

            {/* Custom Active Sessions / Devices Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-2 font-bengali">
                <Laptop className="h-5 w-5 text-indigo-500" />
                সক্রিয় সেশন ও ডিভাইস ট্র্যাকিং
              </h3>

              <div className="space-y-3 font-bengali">
                {sessionsLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                  </div>
                ) : (
                  activeSessions.map((session) => {
                    const isCurrent = session.id === currentSessionId;
                    const { os, browser, IconComponent } =
                      getSessionInfo(session);
                    const location =
                      session.latestActivity?.city &&
                      session.latestActivity?.country
                        ? `${session.latestActivity.city}, ${session.latestActivity.country}`
                        : "";

                    return (
                      <div
                        key={session.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? "border-indigo-100 bg-indigo-50/20"
                            : "border-slate-100 bg-slate-50/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${isCurrent ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-bold text-slate-800 font-sans tracking-tight">
                                {os}
                              </h5>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                  বর্তমানে সক্রিয়
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-sans font-medium mt-0.5">
                              {browser}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              আইপি অ্যাড্রেস:{" "}
                              <span className="font-sans font-semibold text-slate-500">
                                {session.latestActivity?.ipAddress ||
                                  "অজানা আইপি"}
                              </span>
                              {location && (
                                <span className="text-slate-400 font-sans">
                                  {" "}
                                  ({location})
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              সর্বশেষ সক্রিয়:{" "}
                              <span className="font-sans text-slate-500">
                                {formatSessionDate(
                                  session.latestActivity?.updatedAt ||
                                    session.lastActiveAt,
                                )}
                              </span>
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition focus:outline-none cursor-pointer">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSessionToRevoke(session)}
                              variant="destructive"
                              className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 font-sans cursor-pointer text-xs flex items-center gap-1.5"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              লগআউট করুন
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })
                )}
              </div>

              <AlertDialog
                open={!!sessionToRevoke}
                onOpenChange={(open) => !open && setSessionToRevoke(null)}
              >
                <AlertDialogPopup>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ডিভাইস লগ আউট করুন</AlertDialogTitle>
                    <AlertDialogDescription>
                      আপনি কি নিশ্চিতভাবে এই ডিভাইসটি থেকে আপনার অ্যাকাউন্ট লগ
                      আউট করতে চান?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmRevokeSession}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      লগ আউট করুন
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogPopup>
              </AlertDialog>
            </div>
          </motion.div>
        )}

        {activeTab === "subscriptions" && (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1 text-left font-bengali">
                <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                আপনার সক্রিয় লাইসেন্স সমূহ
              </h3>
              <p className="text-xs text-slate-400 text-left mb-6 font-bengali">
                আপনার অ্যাকাউন্টে সক্রিয় সাবস্ক্রিপশন এবং বিষয়ভিত্তিক
                লাইসেন্সসমূহের তালিকা
              </p>
            </div>

            {mySubsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              (() => {
                const activeSubs = mySubs.filter(
                  (sub) =>
                    sub.isActive &&
                    !sub.isSuspended &&
                    new Date(sub.endDate) >= new Date(),
                );
                if (activeSubs.length === 0) {
                  return (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-3 text-left font-bengali">
                      <ShieldCheck className="h-6 w-6 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          কোনো সক্রিয় লাইসেন্স পাওয়া যায়নি
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          প্রশ্নপত্র তৈরির সম্পূর্ণ অ্যাক্সেস পেতে দয়া করে
                          সাবস্ক্রিপশন প্যানেল থেকে কোনো প্যাকেজ বা বিষয় ক্রয়
                          করুন।
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-bengali">
                    {activeSubs.map((sub, idx) => (
                      <div
                        key={idx}
                        className="border border-indigo-50 bg-indigo-50/10 p-5 rounded-2xl flex items-center justify-between hover:shadow-sm transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md">
                              {sub.purchaseType === "Package"
                                ? "গ্রুপ প্যাক"
                                : sub.purchaseType === "Class"
                                  ? "শ্রেণি প্যাক"
                                  : "বিষয় প্যাক"}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {sub.purchaseType === "Package"
                                ? packagesList.find(
                                    (p) => p.id === sub.packageId,
                                  )?.title ||
                                  translateSubscriptionKey(sub.packageId)
                                : sub.purchaseType === "Class"
                                  ? sub.classNames
                                      ?.map((c) => translateSubscriptionKey(c))
                                      .join(", ") || ""
                                  : "একক বিষয়"}
                            </span>
                          </div>
                          {sub.purchaseType === "Subject" && sub.subjectIds && (
                            <p className="text-xs text-slate-500 mt-2">
                              বিষয়:{" "}
                              <span className="font-bold text-slate-700">
                                {sub.subjectIds
                                  .map((s) => s.subjectName)
                                  .join(", ")}
                              </span>
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3 font-sans">
                            <Camera className="h-3.5 w-3.5" />
                            <span>মেয়াদ শেষ: {formatDate(sub.endDate)}</span>
                          </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
