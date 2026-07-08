import { useAuth } from "@clerk/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserContext } from "../../../context/UserContext";
import apiClient from "../../../lib/apiClient";

export const useGenerator = () => {
  const { userProfile } = useUserContext();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Form states
  const [examName, setExamName] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class 7");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [tempSelectedSubjects, setTempSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("MCQ");
  const [totalMarks, setTotalMarks] = useState("100");

  // Modal and filter states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all"); // 'all', 'bangla', 'english'

  const classes = [
    { value: "Class 3", label: "৩য় শ্রেণী" },
    { value: "Class 4", label: "৪র্থ শ্রেণী" },
    { value: "Class 5", label: "৫ম শ্রেণী" },
    { value: "Class 6", label: "৬ষ্ঠ শ্রেণী" },
    { value: "Class 7", label: "৭ম শ্রেণী" },
    { value: "Class 8", label: "৮ম শ্রেণী" },
    { value: "Class 9", label: "৯ম শ্রেণী" },
    { value: "Class 10", label: "১০ম শ্রেণী" },
    { value: "Class 11", label: "একাদশ শ্রেণী" },
    { value: "Class 12", label: "দ্বাদশ শ্রেণী" },
  ];

  // Fetch active subscriptions using React Query
  const mySubscriptionsQuery = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/subscriptions/my-subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.subscriptions || [];
    },
  });

  const userSubs = mySubscriptionsQuery.data || [];
  const loadingSubs = mySubscriptionsQuery.isLoading;

  // Filter classes based on active subscriptions
  const activeClasses = (() => {
    if (
      userProfile?.role &&
      ["Super Admin", "Admin"].includes(userProfile.role)
    ) {
      return classes.map((c) => c.value);
    }
    const now = new Date();
    const clsSet = new Set();
    userSubs.forEach((sub) => {
      if (!sub.isActive || sub.isSuspended || new Date(sub.endDate) < now) {
        return;
      }
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].forEach((c) =>
          clsSet.add(c),
        );
      } else if (
        sub.purchaseType === "Package" ||
        sub.purchaseType === "Class"
      ) {
        sub.classNames?.forEach((c) => clsSet.add(c));
      } else if (sub.purchaseType === "Subject") {
        sub.subjectIds?.forEach((s) => {
          const clsName = s?.className;
          if (clsName) clsSet.add(clsName);
        });
      }
    });
    return Array.from(clsSet);
  })();

  const filteredClasses = classes.filter((c) =>
    activeClasses.includes(c.value),
  );

  // Set default selected class during render based on active subscriptions
  if (!loadingSubs) {
    if (filteredClasses.length > 0) {
      const isCurrentClassActive = filteredClasses.some(
        (c) => c.value === selectedClass,
      );
      if (!isCurrentClassActive && selectedClass !== filteredClasses[0].value) {
        setSelectedClass(filteredClasses[0].value);
      }
    } else if (filteredClasses.length === 0 && selectedClass !== "") {
      setSelectedClass("");
    }
  }
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  // subscription sober jonno applicable seta hok super admin admin or others
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  // Fetch syllabus details for selected class using React Query
  const syllabusQuery = useQuery({
    queryKey: ["syllabus", selectedClass],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get(`/syllabus?className=${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedSyllabus = res.data.syllabus || [];
      // Sort: Bangla version first, English version second
      return [...fetchedSyllabus].sort((a, b) => {
        if (a.version === "Bangla" && b.version === "English") return -1;
        if (a.version === "English" && b.version === "Bangla") return 1;
        return 0;
      });
    },
    enabled: !!selectedClass,
  });

  const syllabusList = syllabusQuery.data || [];
  const fetchingSyllabus = syllabusQuery.isFetching || syllabusQuery.isLoading;

  // Handle class change: update class and synchronously reset subjects & chapters
  const handleClassChange = (newClassOrUpdater) => {
    const nextClass =
      typeof newClassOrUpdater === "function"
        ? newClassOrUpdater(selectedClass)
        : newClassOrUpdater;

    setSelectedClass(nextClass);
    setSelectedSubjects([]);
    setSelectedChapters([]);
    setTotalMarks("100");
  };

  // Handle subjects change: update subjects and synchronously update default total marks
  const handleSubjectsChange = (newSubjectsOrUpdater) => {
    const nextSubjects =
      typeof newSubjectsOrUpdater === "function"
        ? newSubjectsOrUpdater(selectedSubjects)
        : newSubjectsOrUpdater;

    setSelectedSubjects(nextSubjects);

    if (nextSubjects && nextSubjects.length > 0) {
      const defaultMarks = nextSubjects[0].subjectId?.totalMarks || "100";
      setTotalMarks(defaultMarks);
    } else {
      setTotalMarks("100");
    }
  };

  const handleOpenSubjectModal = () => {
    setTempSelectedSubjects(selectedSubjects);
    setShowSubjectModal(true);
  };

  // Verify access helper for a subject
  const hasSubjectAccess = (subject) => {
    if (!subject) return false;
    if (["Super Admin", "Admin"].includes(userProfile?.role)) return true;

    const subId = subject.subjectId?._id || subject.subjectId;
    const subjectName =
      subject.subjectName || subject.subjectId?.subjectName || "";
    const now = new Date();

    return userSubs.some((sub) => {
      if (!sub.isActive || sub.isSuspended || new Date(sub.endDate) < now)
        return false;

      // Fallback check for teacher package
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        const pkgKey = sub.packageId;
        const classesList = [
          "Class 6",
          "Class 7",
          "Class 8",
          "Class 9",
          "Class 10",
        ];
        if (classesList.includes(selectedClass)) {
          if (
            pkgKey === "teacher-bangla-6-10" &&
            /বাংলা|Bangla/i.test(subjectName)
          )
            return true;
          if (pkgKey === "teacher-math-6-10" && /গণিত|Math/i.test(subjectName))
            return true;
          if (
            pkgKey === "teacher-science-6-10" &&
            /বিজ্ঞান|Science/i.test(subjectName)
          )
            return true;
          if (
            pkgKey === "teacher-english-6-10" &&
            /English|ইংরেজি/i.test(subjectName)
          )
            return true;
          if (pkgKey === "teacher-ict-6-10" && /আইসিটি|ICT/i.test(subjectName))
            return true;
          if (
            pkgKey === "teacher-bgs-6-10" &&
            /বাংলাদেশ ও বিশ্বপরিচয়|BGS|Bangladesh/i.test(subjectName)
          )
            return true;
          if (
            pkgKey === "teacher-islam-6-10" &&
            /ইসলাম শিক্ষা|Islam/i.test(subjectName)
          )
            return true;
          if (
            pkgKey === "teacher-agriculture-6-10" &&
            /কৃষি শিক্ষা|Agri/i.test(subjectName)
          )
            return true;
        }
      }

      if (sub.purchaseType === "Package" || sub.purchaseType === "Class") {
        return sub.classNames?.includes(selectedClass);
      }
      if (sub.purchaseType === "Subject") {
        return sub.subjectIds?.some((s) => (s._id || s) === subId);
      }
      return false;
    });
  };

  const hasLockedSubject = selectedSubjects.some(
    (sub) => !hasSubjectAccess(sub),
  );

  // Filter subjects based on version select tab and active subscription access
  const filteredSyllabusList = syllabusList.filter((item) => {
    if (!hasSubjectAccess(item)) return false;
    if (subjectFilter === "bangla") return item.version === "Bangla";
    if (subjectFilter === "english") return item.version === "English";
    return true;
  });

  // Generate mutation using React Query Mutation
  const generateMutation = useMutation({
    mutationFn: async ({
      examName,
      selectedClass,
      selectedSubjects,
      selectedChapters,
      questionType,
      totalMarks,
    }) => {
      const token = await getToken();

      const promises = selectedSubjects.map(async (subject) => {
        const subId = subject.subjectId?._id || subject.subjectId;
        const subjectChapters = selectedChapters
          .filter((key) => key.startsWith(subId))
          .map((key) => parseInt(key.split("_")[1], 10));

        if (subjectChapters.length === 0) {
          throw new Error(
            `দয়া করে ${subject.subjectName} বিষয়ের জন্য অন্তত একটি অধ্যায় সিলেক্ট করুন।`,
          );
        }

        return apiClient.post(
          "/question-sets",
          {
            examName,
            className: selectedClass,
            subjectId: subId,
            chapters: subjectChapters,
            category: questionType,
            totalMarks: parseInt(totalMarks, 10) || 100,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      });

      return Promise.all(promises);
    },
    onSuccess: (results) => {
      toast.success("প্রশ্ন সেট সফলভাবে তৈরি করা হয়েছে!");
      if (results.length > 0 && results[0].data?.questionSet?._id) {
        navigate(
          `/dashboard/questions?setId=${results[0].data.questionSet._id}`,
        );
      } else {
        navigate("/dashboard/questions");
      }
    },
    onError: (err) => {
      console.error("Error generating question set:", err);
      toast.error(
        err.message ||
          err.response?.data?.error ||
          "প্রশ্ন সেট তৈরি করতে ব্যর্থ হয়েছে",
      );
    },
  });

  return {
    // States & Setters
    examName,
    setExamName,
    selectedClass,
    setSelectedClass: handleClassChange,
    selectedSubjects,
    setSelectedSubjects: handleSubjectsChange,
    tempSelectedSubjects,
    setTempSelectedSubjects,
    selectedChapters,
    setSelectedChapters,
    questionType,
    setQuestionType,
    totalMarks,
    setTotalMarks,
    showSubjectModal,
    setShowSubjectModal,
    showChapterModal,
    setShowChapterModal,
    subjectFilter,
    setSubjectFilter,

    // Lists
    classes: filteredClasses,
    syllabusList,
    filteredSyllabusList,

    // Loading/Fetching states
    loadingSubs,
    fetchingSyllabus,
    generating: generateMutation.isPending,

    // Helper status
    hasLockedSubject,
    hasSubjectAccess,

    // Actions
    handleOpenSubjectModal,
    handleGenerate: (e) => {
      e.preventDefault();
      if (!examName.trim()) {
        toast.error("দয়া করে পরীক্ষার নাম লিখুন!");
        return;
      }
      if (selectedSubjects.length === 0) {
        toast.error("দয়া করে অন্তত একটি বিষয় সিলেক্ট করুন!");
        return;
      }
      if (selectedChapters.length === 0) {
        toast.error("দয়া করে অন্তত একটি অধ্যায় সিলেক্ট করুন!");
        return;
      }

      generateMutation.mutate({
        examName,
        selectedClass,
        selectedSubjects,
        selectedChapters,
        questionType,
        totalMarks,
      });
    },
  };
};
