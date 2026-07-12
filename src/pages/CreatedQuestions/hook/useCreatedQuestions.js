import { useUserContext } from "@/context/UserContext";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function useCreatedQuestions() {
  const { role, userProfile } = useUserContext();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [expandedClass, setExpandedClass] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("Bangla");
  const [setToDelete, setSetToDelete] = useState(null);

  const currentRole = role || "Subscriber";

  // Parse active classes from subscription (Super Admin/Admin see all 3-12)
  const activeClasses = useMemo(() => {
    if (currentRole === "Super Admin" || currentRole === "Admin") {
      return [
        "Class 3",
        "Class 4",
        "Class 5",
        "Class 6",
        "Class 7",
        "Class 8",
        "Class 9",
        "Class 10",
        "Class 11",
        "Class 12",
      ];
    }
    const clsSet = new Set();
    userProfile?.subscriptions?.forEach((sub) => {
      if (sub.isSuspended || !sub.isActive) return;
      const end = new Date(sub.endDate);
      if (end < new Date()) return;

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

    const sorted = Array.from(clsSet)
      .filter((c) => {
        const num = parseInt(c.replace(/\D/g, "")) || 0;
        return num >= 3 && num <= 12;
      })
      .sort((a, b) => {
        const getNum = (str) => parseInt(str.replace(/\D/g, "")) || 0;
        return getNum(a) - getNum(b);
      });
    return sorted;
  }, [userProfile, currentRole]);

  // Fetch question sets
  const questionSetsQuery = useQuery({
    queryKey: ["createdQuestionSets"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return [];
      const res = await apiClient.get("/question-sets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.questionSets || [];
    },
    enabled: !!userProfile,
  });

  const questionSets = useMemo(() => questionSetsQuery.data || [], [questionSetsQuery.data]);
  const isLoading = questionSetsQuery.isLoading;

  // Delete question set mutation
  const deleteMutation = useMutation({
    mutationFn: async (setId) => {
      const token = await getToken();
      await apiClient.delete(`/question-sets/${setId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("প্রশ্ন সেটটি সফলভাবে মুছে ফেলা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["createdQuestionSets"] });
      setSetToDelete(null);
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      toast.error("প্রশ্ন সেটটি মুছতে ব্যর্থ হয়েছে");
    },
  });

  const handleDeleteClick = (e, setId) => {
    e.preventDefault();
    e.stopPropagation();
    setSetToDelete(setId);
  };

  // Calculate count for each category version
  const versionCounts = useMemo(() => {
    let bangla = 0;
    let english = 0;
    let madrasah = 0;

    (questionSets || []).forEach((set) => {
      const instType = set.subjectId?.institutionType;
      const ver = set.subjectId?.version;

      if (instType === "Madrasah") {
        madrasah++;
      } else if (ver === "English") {
        english++;
      } else {
        bangla++;
      }
    });
    return { bangla, english, madrasah };
  }, [questionSets]);

  // Group question sets by class name and category version
  const questionSetsByClass = useMemo(() => {
    const map = {};
    (questionSets || []).forEach((set) => {
      const instType = set.subjectId?.institutionType;
      const ver = set.subjectId?.version;

      const matches =
        selectedVersion === "Madrasah"
          ? instType === "Madrasah"
          : selectedVersion === "English"
            ? instType !== "Madrasah" && ver === "English"
            : instType !== "Madrasah" && ver !== "English";

      if (matches) {
        const cls = set.className;
        if (!map[cls]) map[cls] = [];
        map[cls].push(set);
      }
    });
    return map;
  }, [questionSets, selectedVersion]);

  return {
    expandedClass,
    setExpandedClass,
    selectedVersion,
    setSelectedVersion,
    setToDelete,
    setSetToDelete,
    activeClasses,
    isLoading,
    deleteMutation,
    handleDeleteClick,
    versionCounts,
    questionSetsByClass,
  };
}
