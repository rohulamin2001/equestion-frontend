import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../../lib/apiClient";

export function useQuestions() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const setIdParam = searchParams.get("setId") || searchParams.get("setIds") || "";
  const setIds = useMemo(() => setIdParam.split(",").filter(Boolean), [setIdParam]);

  // Active Subject for drawer questions selection
  const [activeSetId, setActiveSetId] = useState(null);

  // Filters for adding questions
  const [searchKeyword, setSearchKeyword] = useState("");
  const [uniqueMode, setUniqueMode] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState([]); // Knowledge, Understanding, Application, Higher Order
  const [selectedTags, setSelectedTags] = useState([]); // Exercise, HasImage, MultipleCompletion, StimulusBased, etc.
  const [selectedDifficulties, setSelectedDifficulties] = useState([]); // Easy, Medium, Hard

  // Fetch all question sets
  const questionSetsQuery = useQuery({
    queryKey: ["questionSets", setIds],
    queryFn: async () => {
      const token = await getToken();
      const promises = setIds.map(async (id) => {
        const res = await apiClient.get(`/question-sets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.questionSet;
      });
      return Promise.all(promises);
    },
    enabled: setIds.length > 0,
  });

  const questionSets = questionSetsQuery.data || [];
  const activeSet = questionSets.find((s) => s._id === activeSetId);

  // Fetch syllabus list to map chapter numbers to chapter names
  const syllabusListQuery = useQuery({
    queryKey: ["syllabusList"],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/syllabus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.syllabus || [];
    },
  });

  const syllabusList = syllabusListQuery.data || [];

  // Fetch other question sets of the user (for Unique Mode exclusion)
  const allQuestionSetsQuery = useQuery({
    queryKey: ["allQuestionSets"],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/question-sets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.questionSets || [];
    },
    enabled: uniqueMode,
  });

  // Calculate question IDs to exclude when Unique Mode is active
  const excludedQuestionIds = useMemo(() => {
    if (!uniqueMode) return [];
    const otherSets = (allQuestionSetsQuery.data || []).filter(
      (s) => s._id !== activeSetId
    );
    const ids = new Set();
    otherSets.forEach((s) => {
      s.questions?.forEach((q) => ids.add(q._id || q));
    });
    return Array.from(ids);
  }, [uniqueMode, allQuestionSetsQuery.data, activeSetId]);

  // Fetch questions from bank matching active subject & filters
  const bankQuestionsQuery = useInfiniteQuery({
    queryKey: [
      "bankQuestions",
      activeSetId,
      activeSet?.subjectId?._id,
      activeSet?.className,
      searchKeyword,
      selectedLevels,
      selectedTags,
      selectedDifficulties,
      excludedQuestionIds,
    ],
    enabled: !!activeSetId && !!activeSet,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      
      const params = {
        className: activeSet.className,
        category: activeSet.category,
        page: pageParam,
        limit: 10,
        status: "Approved",
      };

      if (searchKeyword) params.search = searchKeyword;

      // Determine subjectId
      const targetSubId = activeSet.subjectId?._id || activeSet.subjectId;
      if (targetSubId) params.subjectId = targetSubId;

      const res = await apiClient.get("/questions", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      let questionsList = res.data.questions || [];

      // Client-side filtering for Cognitive Level
      if (selectedLevels.length > 0) {
        questionsList = questionsList.filter((q) =>
          selectedLevels.includes(q.level)
        );
      }

      // Client-side filtering for Difficulty
      if (selectedDifficulties.length > 0) {
        questionsList = questionsList.filter((q) =>
          selectedDifficulties.includes(q.difficulty)
        );
      }

      // Client-side filtering for Special Tags
      if (selectedTags.length > 0) {
        questionsList = questionsList.filter((q) => {
          return selectedTags.some((tag) => {
            if (tag === "Exercise") return q.specialSearch?.includes("Exercise") || q.year?.includes("Exercise");
            if (tag === "HasImage") return !!q.mcqData?.stem?.includes("<img") || !!q.mcqData?.questionText?.includes("<img");
            if (tag === "MultipleCompletion") return q.mcqData?.mcqType === "MultipleCompletion";
            if (tag === "StimulusBased") return q.mcqData?.mcqType === "StimulusBased";
            return false;
          });
        });
      }

      // Filter out excluded question IDs for Unique Mode
      if (uniqueMode && excludedQuestionIds.length > 0) {
        questionsList = questionsList.filter(
          (q) => !excludedQuestionIds.includes(q._id)
        );
      }

      return {
        questions: questionsList,
        nextPage: questionsList.length === 10 ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const bankQuestions = bankQuestionsQuery.data?.pages
    ? bankQuestionsQuery.data.pages.flatMap((p) => p.questions)
    : [];

  // Update mutation (PUT /api/question-sets/:id)
  const updateQuestionSetMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const token = await getToken();
      const res = await apiClient.put(`/question-sets/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionSets", setIds] });
    },
  });

  return {
    questionSets,
    loadingSets: questionSetsQuery.isLoading,
    refetchSets: questionSetsQuery.refetch,

    activeSetId,
    setActiveSetId,
    activeSet,

    bankQuestions,
    loadingBank: bankQuestionsQuery.isLoading,
    fetchNextBankPage: bankQuestionsQuery.fetchNextPage,
    hasMoreBankQuestions: bankQuestionsQuery.hasNextPage,
    refetchBank: bankQuestionsQuery.refetch,

    searchKeyword,
    setSearchKeyword,
    uniqueMode,
    setUniqueMode,
    selectedLevels,
    setSelectedLevels,
    selectedTags,
    setSelectedTags,
    selectedDifficulties,
    setSelectedDifficulties,

    updateQuestionSet: updateQuestionSetMutation,
    syllabusList,
  };
}
