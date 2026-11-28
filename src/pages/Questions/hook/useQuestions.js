import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../../../lib/apiClient";

const PAGE_LIMIT = 20;

export function useQuestions() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const setIdParam =
    searchParams.get("setId") || searchParams.get("setIds") || "";
  const setIds = useMemo(
    () => setIdParam.split(",").filter(Boolean),
    [setIdParam],
  );

  // Active set ID
  const [activeSetId, setActiveSetId] = useState(null);

  // Filters for QuestionSelect
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [uniqueMode, setUniqueMode] = useState(false);
  const [chapterFilterOverride, setChapterFilterOverride] = useState({
    setId: null,
    chapters: null,
  });
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMcqTypes, setSelectedMcqTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [hasImageOnly, setHasImageOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchKeyword.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchKeyword]);

  // Fetch all question sets in context
  const questionSetsQuery = useQuery({
    queryKey: ["questionSets", setIds],
    queryFn: async () => {
      const promises = setIds.map(async (id) => {
        const res = await apiClient.get(`/question-sets/${id}`);
        return res.data.questionSet;
      });
      return Promise.all(promises);
    },
    enabled: setIds.length > 0,
  });

  const questionSets = questionSetsQuery.data || [];
  const activeSet = questionSets.find((s) => s._id === activeSetId);

  // Fetch syllabus list (for chapter names & topics)
  const syllabusListQuery = useQuery({
    queryKey: ["syllabusList"],
    queryFn: async () => {
      const res = await apiClient.get("/syllabus");
      return res.data.syllabus || [];
    },
  });

  const syllabusList = useMemo(
    () => syllabusListQuery.data || [],
    [syllabusListQuery.data],
  );

  // Fetch dynamic active QuestionMetadata (School, Board, Year, Level, SpecialSearch)
  const metadataQuery = useQuery({
    queryKey: ["activeQuestionMetadata"],
    queryFn: async () => {
      const res = await apiClient.get("/question-metadata", {
        params: { activeOnly: "true" },
      });
      return res.data.metadata || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const metadataOptions = useMemo(() => {
    const all = metadataQuery.data || [];
    return {
      schools: all.filter((m) => m.type === "School"),
      boards: all.filter((m) => m.type === "Board"),
      years: all.filter((m) => m.type === "Year"),
      levels: all.filter((m) => m.type === "Level"),
      specialSearches: all.filter((m) => m.type === "SpecialSearch"),
    };
  }, [metadataQuery.data]);

  // Extract chapters & topics for activeSet subject/class from Syllabus
  const matchingSyllabus = useMemo(() => {
    if (!activeSet) return null;
    const targetSubId = activeSet.subjectId?._id || activeSet.subjectId;
    return (
      syllabusList.find(
        (s) =>
          s.className === activeSet.className &&
          (s.subjectId?._id === targetSubId || s.subjectId === targetSubId),
      ) || null
    );
  }, [activeSet, syllabusList]);

  const availableChapters = useMemo(() => {
    const chs = matchingSyllabus?.chapters || [];
    return [...chs].sort(
      (a, b) => Number(a.chapterNumber) - Number(b.chapterNumber),
    );
  }, [matchingSyllabus]);

  const setChapterNumbers = useMemo(
    () =>
      Array.isArray(activeSet?.chapters)
        ? activeSet.chapters.map(Number).filter((n) => Number.isFinite(n))
        : [],
    [activeSet],
  );

  // Default selectedChapters to activeSet.chapters from 1-Click Generator until user overrides
  const selectedChapters = useMemo(() => {
    if (
      chapterFilterOverride.setId === activeSetId &&
      Array.isArray(chapterFilterOverride.chapters)
    ) {
      return chapterFilterOverride.chapters;
    }
    return setChapterNumbers;
  }, [chapterFilterOverride, activeSetId, setChapterNumbers]);

  const setSelectedChapters = useCallback(
    (updater) => {
      const next =
        typeof updater === "function" ? updater(selectedChapters) : updater;
      setChapterFilterOverride({ setId: activeSetId, chapters: next });
    },
    [activeSetId, selectedChapters],
  );

  const availableTopics = useMemo(() => {
    const topicSet = new Set();
    const targetChapters =
      selectedChapters.length > 0
        ? availableChapters.filter((c) =>
            selectedChapters.includes(Number(c.chapterNumber)),
          )
        : availableChapters;
    for (const ch of targetChapters) {
      for (const tp of ch.topics || []) {
        const clean = tp ? String(tp).trim() : "";
        if (clean) topicSet.add(clean);
      }
    }
    return Array.from(topicSet);
  }, [availableChapters, selectedChapters]);

  const allowedSubjectCategories = useMemo(
    () => activeSet?.subjectId?.categories || [],
    [activeSet?.subjectId],
  );

  const resetAllFilters = useCallback(() => {
    setSearchKeyword("");
    setDebouncedSearch("");
    setUniqueMode(false);
    setChapterFilterOverride({ setId: activeSetId, chapters: setChapterNumbers });
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSelectedLevels([]);
    setSelectedBoards([]);
    setSelectedYears([]);
    setSelectedSchools([]);
    setSelectedTags([]);
    setSelectedMcqTypes([]);
    setSelectedCategories([]);
    setHasImageOnly(false);
    setSortOrder("desc");
  }, [activeSetId, setChapterNumbers]);

  // Fetch approved questions with full server-side multi-filter pagination
  const bankQuestionsQuery = useInfiniteQuery({
    queryKey: [
      "bankQuestions",
      activeSetId,
      activeSet?.subjectId?._id || activeSet?.subjectId,
      activeSet?.className,
      activeSet?.category,
      debouncedSearch,
      uniqueMode,
      selectedChapters,
      selectedTopics,
      selectedDifficulties,
      selectedLevels,
      selectedBoards,
      selectedYears,
      selectedSchools,
      selectedTags,
      selectedMcqTypes,
      selectedCategories,
      hasImageOnly,
      sortOrder,
    ],
    enabled: Boolean(activeSetId && activeSet),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        className: activeSet.className,
        category: activeSet.category,
        page: pageParam,
        limit: PAGE_LIMIT,
        sortOrder,
        status: "Approved",
      };

      const targetSubId = activeSet.subjectId?._id || activeSet.subjectId;
      if (targetSubId) params.subjectId = targetSubId;

      if (debouncedSearch) params.search = debouncedSearch;
      if (uniqueMode) {
        params.uniqueOnly = "true";
        params.excludeSetId = activeSetId;
      }
      if (selectedChapters.length > 0) {
        params.chapters = selectedChapters.join(",");
      }
      if (selectedTopics.length > 0) {
        params.topics = JSON.stringify(selectedTopics);
      }
      if (selectedDifficulties.length > 0) {
        params.difficulties = JSON.stringify(selectedDifficulties);
      }
      if (selectedLevels.length > 0) {
        params.levels = JSON.stringify(selectedLevels);
      }
      if (selectedBoards.length > 0) {
        params.boards = JSON.stringify(selectedBoards);
      }
      if (selectedYears.length > 0) {
        params.years = JSON.stringify(selectedYears);
      }
      if (selectedSchools.length > 0) {
        params.schools = JSON.stringify(selectedSchools);
      }
      if (selectedTags.length > 0) {
        params.specialSearch = JSON.stringify(selectedTags);
      }
      if (selectedMcqTypes.length > 0) {
        params.mcqTypes = JSON.stringify(selectedMcqTypes);
      }
      if (selectedCategories.length > 0) {
        params.categories = JSON.stringify(selectedCategories);
      }
      if (hasImageOnly) {
        params.hasImage = "true";
      }

      const res = await apiClient.get("/questions", { params });
      const questionsList = res.data.questions || [];
      const pagination = res.data.pagination || {};
      const hasMore =
        typeof pagination.hasMore === "boolean"
          ? pagination.hasMore
          : questionsList.length === PAGE_LIMIT;

      return {
        questions: questionsList,
        total: pagination.total ?? questionsList.length,
        nextPage: hasMore ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const bankQuestions = useMemo(
    () =>
      bankQuestionsQuery.data?.pages
        ? bankQuestionsQuery.data.pages.flatMap((p) => p.questions)
        : [],
    [bankQuestionsQuery.data],
  );

  const totalBankCount =
    bankQuestionsQuery.data?.pages?.[0]?.total ?? bankQuestions.length;

  // Update Question Set mutation (PUT /api/question-sets/:id)
  const updateQuestionSetMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await apiClient.put(`/question-sets/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionSets", setIds] });
    },
  });

  // Update Question Mutation (PUT /api/questions/:id)
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await apiClient.put(`/questions/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionSets", setIds] });
    },
  });

  // Create Question Mutation (POST /api/questions)
  const createQuestionMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post("/questions", payload);
      return res.data.question;
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
    totalBankCount,
    loadingBank: bankQuestionsQuery.isLoading,
    isFetchingBank: bankQuestionsQuery.isFetching,
    isFetchingNextBankPage: bankQuestionsQuery.isFetchingNextPage,
    fetchNextBankPage: bankQuestionsQuery.fetchNextPage,
    hasMoreBankQuestions: bankQuestionsQuery.hasNextPage,
    refetchBank: bankQuestionsQuery.refetch,

    // Search & filter controls
    searchKeyword,
    setSearchKeyword,
    uniqueMode,
    setUniqueMode,
    selectedChapters,
    setSelectedChapters,
    setChapterNumbers,
    selectedTopics,
    setSelectedTopics,
    selectedDifficulties,
    setSelectedDifficulties,
    selectedLevels,
    setSelectedLevels,
    selectedBoards,
    setSelectedBoards,
    selectedYears,
    setSelectedYears,
    selectedSchools,
    setSelectedSchools,
    selectedTags,
    setSelectedTags,
    selectedMcqTypes,
    setSelectedMcqTypes,
    selectedCategories,
    setSelectedCategories,
    hasImageOnly,
    setHasImageOnly,
    sortOrder,
    setSortOrder,
    resetAllFilters,

    // Contextual Metadata & Syllabus options
    metadataOptions,
    loadingMetadata: metadataQuery.isLoading,
    availableChapters,
    availableTopics,
    allowedSubjectCategories,
    syllabusList,

    // Mutations
    updateQuestionSet: updateQuestionSetMutation,
    updateQuestion: updateQuestionMutation,
    createQuestion: createQuestionMutation,
  };
}
