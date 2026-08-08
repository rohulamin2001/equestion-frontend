import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "../../../context/UserContext";
import apiClient, { getAccessToken } from "../../../lib/apiClient";

export function useProfile() {
  const queryClient = useQueryClient();
  const { userProfile, role, refreshProfile, logout } = useUserContext();

  // Extract current sessionId from JWT access token
  const currentSessionId = (() => {
    try {
      const token = getAccessToken();
      if (!token) return null;
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload)?.sessionId || null;
    } catch {
      return null;
    }
  })();

  const [activeTab, setActiveTab] = useState("info"); // 'info', 'security', 'subscriptions'
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch active subscriptions
  const { data: mySubs = [], isLoading: mySubsLoading } = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const res = await apiClient.get("/subscriptions/my-subscriptions");
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

  const [imageUploading, setImageUploading] = useState(false);
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

  const activeSessions = userProfile?.deviceSessions || [];
  const sessionsLoading = !userProfile;

  // Custom Profile/Logo Image uploader
  const handleImageClick = () => {
    if (imageUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    if (imageUploading) return;
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("দয়া করে একটি সঠিক ইমেজ ফাইল নির্বাচন করুন।");
      if (e.target) e.target.value = "";
      return;
    }

    setImageUploading(true);
    const toastId = toast.loading("ছবি আপলোড করা হচ্ছে...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = uploadRes.data?.url;
      if (uploadedUrl) {
        const updateRes = await apiClient.put("/users/profile", {
          imageUrl: uploadedUrl,
        });
        toast.success("ছবিটি সফলভাবে আপডেট করা হয়েছে!", { id: toastId });
        if (updateRes.data?.user) {
          queryClient.setQueryData(
            ["userProfile", getAccessToken()],
            updateRes.data.user,
          );
        }
        await refreshProfile();
      } else {
        throw new Error("ইমেজ আপলোড করতে সমস্যা হয়েছে।");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("ছবি আপলোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।", {
        id: toastId,
      });
    } finally {
      setImageUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const isSubscriber = role === "Subscriber";
  const isTeacher = userProfile?.userType === "Teacher";

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

      const response = await apiClient.put("/users/profile", payload);
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

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowPasswordForm(false);
  };

  // Custom Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("বর্তমান পাসওয়ার্ড প্রদান করুন।");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি।");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(
        res.data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
      );
      resetPasswordForm();
    } catch (err) {
      console.error("Password update failed:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const confirmRevokeSession = async () => {
    if (!sessionToRevoke) return;
    setSessionToRevoke(null);
    try {
      await logout();
      toast.success("আপনি সফলভাবে লগ আউট হয়েছেন!");
    } catch (err) {
      console.error("Failed to revoke session:", err);
      toast.error("লগ আউট করতে ব্যর্থ হয়েছে।");
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
    const isCurrent =
      (session.sessionId && session.sessionId === currentSessionId) ||
      (session.id && session.id === currentSessionId) ||
      (session._id && session._id === currentSessionId);

    let os = session.os || "";
    let browser = session.browser || "";
    let deviceType = session.deviceType || "";

    if (
      (!os || !browser || os === "Unknown" || browser === "Unknown") &&
      typeof window !== "undefined"
    ) {
      const ua = session.userAgent || navigator.userAgent || "";

      if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
      else if (ua.includes("Linux")) os = "Linux";
      else os = "Desktop";

      if (ua.includes("Edg")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari") && !ua.includes("Chrome"))
        browser = "Safari";
      else if (ua.includes("Firefox")) browser = "Firefox";
      else browser = "Browser";
    }

    let IconComponent;
    if (os === "Android" || os === "iOS" || deviceType === "Mobile") {
      IconComponent = Smartphone;
    } else if (deviceType === "Tablet") {
      IconComponent = Tablet;
    } else {
      IconComponent = Laptop;
    }

    let osDisplay;
    if (os === "Windows") osDisplay = "Windows Operating System";
    else if (os === "macOS") osDisplay = "Mac (macOS)";
    else if (os === "Linux") osDisplay = "Linux OS";
    else if (os === "Android") osDisplay = "Android Mobile";
    else if (os === "iOS") osDisplay = "iPhone / iPad (iOS)";
    else if (os === "Desktop") osDisplay = "Desktop Device";
    else osDisplay = os || "অন্যান্য ডিভাইস";

    return {
      os: osDisplay,
      browser: browser || "অজানা ব্রাউজার",
      IconComponent,
      isCurrent,
    };
  };

  const roleLabels = {
    "Super Admin": "সুপার এডমিন",
    Admin: "এডমিন",
    "Content Manager": "কনটেন্ট ম্যানেজার",
    "Question Creator": "প্রশ্ন ক্রিয়েটর",
    "Support Team": "সাপোর্ট টিম",
    Subscriber: "সাবস্ক্রাইবার",
  };

  return {
    userProfile,
    role,
    activeTab,
    setActiveTab,
    loading,
    fileInputRef,
    mySubs,
    mySubsLoading,
    packagesList,
    formatDate,
    // Form fields
    firstName,
    setFirstName,
    lastName,
    setLastName,
    designation,
    setDesignation,
    institutionName,
    setInstitutionName,
    institutionType,
    setInstitutionType,
    institutionMedium,
    setInstitutionMedium,
    founderName,
    setFounderName,
    foundingYear,
    setFoundingYear,
    eiin,
    setEiin,
    institutionCode,
    setInstitutionCode,
    studentCountRange,
    setStudentCountRange,
    contactNumber,
    setContactNumber,
    officialEmail,
    setOfficialEmail,
    officialWebsite,
    setOfficialWebsite,
    division,
    setDivision,
    district,
    setDistrict,
    upazila,
    setUpazila,
    postOffice,
    setPostOffice,
    fullAddress,
    setFullAddress,
    // Security fields
    currentPassword,
    setCurrentPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordLoading,
    showPasswordForm,
    setShowPasswordForm,
    imageUploading,
    sessionToRevoke,
    setSessionToRevoke,
    divisions,
    studentRanges,
    institutionTypeLabels,
    institutionMediumLabels,
    roleLabels,
    activeSessions,
    sessionsLoading,
    currentSessionId,
    isSubscriber,
    isTeacher,
    // Handlers
    handleImageClick,
    handleImageChange,
    handleProfileSubmit,
    generateSecurePassword,
    handlePasswordSubmit,
    confirmRevokeSession,
    formatSessionDate,
    getSessionInfo,
  };
}
