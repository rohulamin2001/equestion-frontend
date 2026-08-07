import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GENERATOR_CLASSES as classes } from "../../../constants/classes";
import apiClient from "../../../lib/apiClient";

export const useGenerator = () => {
  const navigate = useNavigate();

  // Form states
  const [examName, setExamName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [tempSelectedSubjects, setTempSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [questionType, setQuestionType] = useState("MCQ");
  const [totalMarks, setTotalMarks] = useState("100");

  // Modal and filter states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all"); // 'all', 'bangla', 'english', 'madrasah'

  // Fetch active subscriptions using React Query
  const mySubscriptionsQuery = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const res = await apiClient.get("/subscriptions/my-subscriptions");
      return res.data.subscriptions || [];
    },
  });

  const userSubs = mySubscriptionsQuery.data || [];
  const loadingSubs = mySubscriptionsQuery.isLoading;

  // Filter classes based on active subscriptions
  const activeClasses = (() => {
    const now = new Date();
    const clsSet = new Set();
    userSubs.forEach((sub) => {
      if (!sub.isActive || sub.isSuspended || new Date(sub.endDate) < now) {
        return;
      }
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        [
          "Class 6",
          "Class 7",
          "Class 8",
          "Class 9-10",
          "Class 9",
          "Class 10",
        ].forEach((c) => clsSet.add(c));
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
      if (selectedClass && !isCurrentClassActive) {
        setSelectedClass("");
      }
    } else if (selectedClass !== "") {
      setSelectedClass("");
    }
  }

  // Fetch syllabus details for selected class using React Query
  const syllabusQuery = useQuery({
    queryKey: ["syllabus", selectedClass],
    queryFn: async () => {
      const res = await apiClient.get(`/syllabus?className=${selectedClass}`);
      const fetchedSyllabus = res.data.syllabus || [];
      // Sort: Bangla version first, English version second, Madrasah version third
      return [...fetchedSyllabus].sort((a, b) => {
        if (a.version === "Bangla" && b.version !== "Bangla") return -1;
        if (b.version === "Bangla" && a.version !== "Bangla") return 1;
        if (a.version === "English" && b.version === "Madrasah") return -1;
        if (a.version === "Madrasah" && b.version === "English") return 1;
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
    if (!selectedClass) {
      toast.error("দয়া করে প্রথমে শ্রেণি সিলেক্ট করুন!");
      return;
    }
    setTempSelectedSubjects(selectedSubjects);
    setShowSubjectModal(true);
  };

  // Verify access helper for a subject
  const hasSubjectAccess = (subject) => {
    if (!subject) return false;

    const subId = subject.subjectId?._id || subject.subjectId;
    const subjectName =
      subject.subjectName || subject.subjectId?.subjectName || "";
    const now = new Date();

    return userSubs.some((sub) => {
      if (!sub.isActive || sub.isSuspended || new Date(sub.endDate) < now)
        return false;

      // Fallback check for teacher package
      if (sub.packageId && sub.packageId.startsWith("teacher-")) {
        if (sub.version && sub.version !== subject.version) return false;
        const pkgKey = sub.packageId.replace("-madrasah", "");
        const classesList = [
          "Class 6",
          "Class 7",
          "Class 8",
          "Class 9-10",
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
        return (
          sub.classNames?.includes(selectedClass) &&
          sub.version === subject.version
        );
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
    if (subjectFilter === "madrasah") return item.version === "Madrasah";
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

        return apiClient.post("/question-sets", {
          examName,
          className: selectedClass,
          subjectId: subId,
          chapters: subjectChapters,
          category: questionType,
          totalMarks: parseInt(totalMarks, 10) || 100,
        });
      });

      return Promise.all(promises);
    },
    onSuccess: (results) => {
      toast.success("প্রশ্ন সেট সফলভাবে তৈরি করা হয়েছে!");
      if (results.length > 0) {
        const ids = results
          .map((r) => r.data?.questionSet?._id)
          .filter(Boolean)
          .join(",");
        navigate(`/dashboard/questions?setId=${ids}`);
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

  const activeCategories = (() => {
    if (!selectedSubjects || selectedSubjects.length === 0) return [];
    const catSet = new Set();
    selectedSubjects.forEach((sub) => {
      const cats = sub.subjectId?.categories || sub.categories || [];
      cats.forEach((cat) => catSet.add(cat));
    });
    return Array.from(catSet);
  })();

  // Reset questionType if it's invalid for current subjects
  const isQuestionTypeValid =
    activeCategories.includes(questionType) || questionType === "Combined";
  if (activeCategories.length > 0 && !isQuestionTypeValid) {
    setQuestionType(activeCategories[0]);
  }

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
    activeCategories,
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
