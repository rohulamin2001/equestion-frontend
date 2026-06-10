import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useAcademicConfig } from './useAcademicConfig';
import { toast } from 'sonner';

export function useQuestionManagement() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { allowedClasses, isLoading: configLoading } = useAcademicConfig();

  // Wizard Step State
  const [activeStep, setActiveStep] = useState(1);

  // Active list filters (for QuestionBank and MyQuestions pages)
  const [filterType, setFilterType] = useState('School');
  const [filterLevel, setFilterLevel] = useState('Secondary');
  const [filterClass, setFilterClass] = useState('Class 6');
  const [filterSubjectId, setFilterSubjectId] = useState('');
  const [filterChapter, setFilterChapter] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Form Field States
  const [formType, setFormType] = useState('School');
  const [formLevel, setFormLevel] = useState('Secondary');
  const [formClass, setFormClass] = useState('Class 6');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formGroup, setFormGroup] = useState('General');
  const [formChapterNumber, setFormChapterNumber] = useState('');
  const [formTopics, setFormTopics] = useState([]);
  const [formCategory, setFormCategory] = useState('MCQ');
  const [formDifficulty, setFormDifficulty] = useState('Medium');

  // Draft list for batch question creation
  const [questionsList, setQuestionsList] = useState([]);

  // MCQ Specific Form Fields
  const [mcqType, setMcqType] = useState('Simple');
  const [mcqStem, setMcqStem] = useState('');
  const [mcqQuestionText, setMcqQuestionText] = useState('');
  const [mcqStatements, setMcqStatements] = useState(['', '', '']); // for MultipleCompletion
  const [mcqOptions, setMcqOptions] = useState(['', '', '', '']);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState('');

  // Creative (সৃজনশীল) Specific Form Fields
  const [creativeStem, setCreativeStem] = useState('');
  const [creativeCognitiveA, setCreativeCognitiveA] = useState('');
  const [creativeCognitiveB, setCreativeCognitiveB] = useState('');
  const [creativeCognitiveC, setCreativeCognitiveC] = useState('');
  const [creativeCognitiveD, setCreativeCognitiveD] = useState('');

  // General Questions (Short/Broad/Matching/FillInBlanks)
  const [generalQuestionText, setGeneralQuestionText] = useState('');
  const [generalStem, setGeneralStem] = useState(''); // structured stem (optional)
  const [generalSubQuestions, setGeneralSubQuestions] = useState([]); // array of { text: '', marks: '' }
  const [generalSuggestedAnswer, setGeneralSuggestedAnswer] = useState('');
  const [generalMarks, setGeneralMarks] = useState(1);

  const [editingQuestion, setEditingQuestion] = useState(null); // null if creating

  // Fetch Syllabus list (for populating Class & Subject dropdowns)
  const { data: syllabusList = [], isLoading: loadingSyllabus } = useQuery({
    queryKey: ['globalSyllabusList'],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/syllabus', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.syllabus;
    },
  });

  // Get active subjects for selected class inside the form, filtering by group if class 9-12
  const formSubjects = syllabusList.filter(s => {
    if (s.className !== formClass) return false;
    if (s.institutionType !== formType) return false;
    if (s.academicLevel !== formLevel) return false;
    const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(formClass);
    if (isClass9to12) {
      // Show subjects matching selected group OR general group
      return s.group === formGroup || s.group === 'General' || !s.group;
    }
    return true;
  });
  // Get active chapters for selected subject inside the form
  const selectedSyllabusObj = syllabusList.find(s => s._id === formSubjectId);
  const formChapters = selectedSyllabusObj?.chapters || [];

  // Sync filter state when allowedClasses changes or loads
  useEffect(() => {
    if (allowedClasses && allowedClasses.length > 0) {
      const exists = allowedClasses.some(
        c => c.value === filterClass && c.type === filterType && c.level === filterLevel
      );
      if (!exists) {
        const first = allowedClasses[0];
        setFilterType(first.type);
        setFilterLevel(first.level);
        setFilterClass(first.value);
      }
    }
  }, [allowedClasses, filterClass, filterType, filterLevel]);

  // Sync form state when allowedClasses changes or loads
  useEffect(() => {
    if (allowedClasses && allowedClasses.length > 0) {
      const exists = allowedClasses.some(
        c => c.value === formClass && c.type === formType && c.level === formLevel
      );
      if (!exists) {
        const first = allowedClasses[0];
        setFormType(first.type);
        setFormLevel(first.level);
        setFormClass(first.value);
      }
    }
  }, [allowedClasses, formClass, formType, formLevel]);

  // Curriculum Alignment validation
  useEffect(() => {
    if (!formSubjectId || !selectedSyllabusObj) {
      setFormCategory('');
      return;
    }

    const subjectConfiguredCategories = selectedSyllabusObj?.subjectId?.categories;
    let allowed = [];

    if (subjectConfiguredCategories && Array.isArray(subjectConfiguredCategories) && subjectConfiguredCategories.length > 0) {
      allowed = subjectConfiguredCategories;
    }

    if (allowed.length > 0) {
      if (!allowed.includes(formCategory)) {
        setFormCategory(allowed[0]);
      }
    } else {
      setFormCategory('');
    }
  }, [formSubjectId, selectedSyllabusObj, formCategory]);

  useEffect(() => {
    const primaryLevels = ["Primary", "Ebtedayee"];
    const primaryCats = ["MCQ", "ShortAnswer", "FillInBlanks", "Matching", "BroadQuestion"];
    const secondaryCats = ["MCQ", "Creative", "ShortAnswer", "BroadQuestion"];

    const isPrimary = primaryLevels.includes(filterLevel);
    const allowed = isPrimary ? primaryCats : secondaryCats;
    if (filterCategory && !allowed.includes(filterCategory)) {
      setFilterCategory("");
    }
  }, [filterLevel, filterCategory]);

  // Reset Form
  const resetForm = useCallback(() => {
    setActiveStep(1);
    setFormType(filterType);
    setFormLevel(filterLevel);
    setFormClass(filterClass);
    setFormSubjectId('');
    setFormGroup('General');
    setFormChapterNumber('');
    setFormTopics([]);
    setFormCategory('MCQ');
    setFormDifficulty('Medium');
    setQuestionsList([]);

    setMcqType('Simple');
    setMcqStem('');
    setMcqQuestionText('');
    setMcqStatements(['', '', '']);
    setMcqOptions(['', '', '', '']);
    setMcqCorrectAnswer(0);
    setMcqExplanation('');

    setCreativeStem('');
    setCreativeCognitiveA('');
    setCreativeCognitiveB('');
    setCreativeCognitiveC('');
    setCreativeCognitiveD('');

    setGeneralQuestionText('');
    setGeneralStem('');
    setGeneralSubQuestions([]);
    setGeneralSuggestedAnswer('');
    setGeneralMarks(1);

    setEditingQuestion(null);
  }, [filterClass, filterType, filterLevel]);

  // Set form values from existing question for editing
  const handleOpenEditMode = useCallback((question) => {
    setEditingQuestion(question);

    setFormType(question.institutionType || 'School');
    setFormLevel(question.academicLevel || 'Secondary');
    setFormClass(question.className);
    setFormSubjectId(question.subjectId._id || question.subjectId);
    setFormGroup(question.subjectId?.group || 'General');
    setFormChapterNumber(question.chapterNumber.toString());
    setFormTopics(question.topics || []);
    setFormCategory(question.category);
    setFormDifficulty(question.difficulty);

    if (question.category === 'MCQ') {
      setMcqType(question.mcqData?.mcqType || 'Simple');
      setMcqStem(question.mcqData?.stem || '');
      setMcqQuestionText(question.mcqData?.questionText || '');
      setMcqStatements(question.mcqData?.statements || ['', '', '']);
      setMcqOptions(question.mcqData?.options || ['', '', '', '']);
      setMcqCorrectAnswer(question.mcqData?.correctAnswer || 0);
      setMcqExplanation(question.mcqData?.explanation || '');
    } else if (question.category === 'Creative') {
      setCreativeStem(question.creativeData?.stem || '');
      setCreativeCognitiveA(question.creativeData?.subQuestions?.cognitiveA?.text || '');
      setCreativeCognitiveB(question.creativeData?.subQuestions?.cognitiveB?.text || '');
      setCreativeCognitiveC(question.creativeData?.subQuestions?.cognitiveC?.text || '');
      setCreativeCognitiveD(question.creativeData?.subQuestions?.cognitiveD?.text || '');
    } else {
      setGeneralQuestionText(question.generalData?.questionText || '');
      setGeneralStem(question.generalData?.stem || '');
      setGeneralSubQuestions(question.generalData?.subQuestions || []);
      setGeneralSuggestedAnswer(question.generalData?.suggestedAnswer || '');
      setGeneralMarks(question.generalData?.marks || 1);
    }
    
    setActiveStep(2); // Jump straight to editor when editing
  }, []);

  // Fetch Questions list (for QuestionBank and MyQuestions)
  const fetchQuestionsQuery = (isPersonalOnly = false) => {
    return useQuery({
      queryKey: [
        isPersonalOnly ? 'myQuestionsList' : 'globalQuestionsList',
        filterType,
        filterLevel,
        filterClass,
        filterSubjectId,
        filterChapter,
        filterCategory,
        filterDifficulty,
        filterSearch,
      ],
      queryFn: async () => {
        const token = await getToken();
        const params = {
          className: filterClass,
          personal: isPersonalOnly ? 'true' : 'false',
          institutionType: filterType,
          academicLevel: filterLevel,
        };
        if (filterSubjectId) params.subjectId = filterSubjectId;
        if (filterChapter) params.chapterNumber = filterChapter;
        if (filterCategory) params.category = filterCategory;
        if (filterDifficulty) params.difficulty = filterDifficulty;
        if (filterSearch) params.search = filterSearch;

        const response = await apiClient.get('/questions', {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.questions;
      },
    });
  };

  // Add Question Mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const response = await apiClient.post('/questions', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myQuestionsList'] });
      queryClient.invalidateQueries({ queryKey: ['globalQuestionsList'] });
      toast.success('প্রশ্নটি সফলভাবে ডাটাবেজে যুক্ত হয়েছে!');
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'প্রশ্ন সংরক্ষণ করতে ব্যর্থ হয়েছে');
    },
  });

  // Update Question Mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const token = await getToken();
      const response = await apiClient.put(`/questions/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myQuestionsList'] });
      queryClient.invalidateQueries({ queryKey: ['globalQuestionsList'] });
      toast.success('প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!');
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'প্রশ্ন আপডেট করতে ব্যর্থ হয়েছে');
    },
  });

  // Delete Question Mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      await apiClient.delete(`/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myQuestionsList'] });
      queryClient.invalidateQueries({ queryKey: ['globalQuestionsList'] });
      toast.success('প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'প্রশ্ন মুছতে ব্যর্থ হয়েছে');
    },
  });

  // Validate and build payload from current editor values
  const buildPayloadFromForm = useCallback(() => {
    if (!formClass || !formSubjectId || !formChapterNumber || !formCategory || !formType || !formLevel) {
      toast.error('দয়া করে আবশ্যকীয় মেটাডাটা ক্ষেত্রসমূহ পূরণ করুন');
      return null;
    }

    const payload = {
      className: formClass,
      subjectId: formSubjectId,
      chapterNumber: Number(formChapterNumber),
      topics: formTopics,
      category: formCategory,
      difficulty: formDifficulty,
      institutionType: formType,
      academicLevel: formLevel,
    };

    if (formCategory === 'MCQ') {
      payload.mcqData = {
        mcqType,
        stem: mcqStem.trim(),
        questionText: mcqQuestionText.trim(),
        statements: mcqType === 'MultipleCompletion' ? mcqStatements.filter(s => s.trim()) : [],
        options: mcqOptions.map(o => o.trim()),
        correctAnswer: Number(mcqCorrectAnswer),
        explanation: mcqExplanation.trim(),
      };

      if (!payload.mcqData.questionText && mcqType !== 'Contextual') {
        toast.error('দয়া করে প্রশ্নের মূল টেক্সট লিখুন');
        return null;
      }
      if (payload.mcqData.options.some(o => !o)) {
        toast.error('বহুনির্বাচনি প্রশ্নের ৪টি অপশনই আবশ্যক');
        return null;
      }
    } else if (formCategory === 'Creative') {
      payload.creativeData = {
        stem: creativeStem.trim(),
        subQuestions: {
          cognitiveA: { text: creativeCognitiveA.trim(), marks: 1 },
          cognitiveB: { text: creativeCognitiveB.trim(), marks: 2 },
          cognitiveC: { text: creativeCognitiveC.trim(), marks: 3 },
          cognitiveD: { text: creativeCognitiveD.trim(), marks: 4 },
        },
      };

      if (!payload.creativeData.stem) {
        toast.error('সৃজনশীল প্রশ্নের জন্য উদ্দীপক আবশ্যক');
        return null;
      }
      if (!creativeCognitiveA || !creativeCognitiveB || !creativeCognitiveC || !creativeCognitiveD) {
        toast.error('সৃজনশীল প্রশ্নের ক, খ, গ, ঘ চারটি উপ-প্রশ্নই পূরণ করুন');
        return null;
      }
    } else {
      payload.generalData = {
        questionText: generalQuestionText.trim(),
        stem: generalStem.trim(),
        subQuestions: generalSubQuestions.filter(q => q.text.trim()),
        suggestedAnswer: generalSuggestedAnswer.trim(),
        marks: Number(generalMarks),
      };

      if (!payload.generalData.questionText) {
        toast.error('দয়া করে প্রশ্নের বিবরণ লিখুন');
        return null;
      }
    }

    return payload;
  }, [
    formClass,
    formSubjectId,
    formChapterNumber,
    formTopics,
    formCategory,
    formDifficulty,
    mcqType,
    mcqStem,
    mcqQuestionText,
    mcqStatements,
    mcqOptions,
    mcqCorrectAnswer,
    mcqExplanation,
    creativeStem,
    creativeCognitiveA,
    creativeCognitiveB,
    creativeCognitiveC,
    creativeCognitiveD,
    generalQuestionText,
    generalStem,
    generalSubQuestions,
    generalSuggestedAnswer,
    generalMarks
  ]);

  // Add current form data as a draft question to list
  const addQuestionToList = useCallback(() => {
    const qPayload = buildPayloadFromForm();
    if (!qPayload) return false;

    // Attach temporary frontend ID
    qPayload.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setQuestionsList(prev => [...prev, qPayload]);

    // Clear question editors only, keep metadata
    setMcqType('Simple');
    setMcqStem('');
    setMcqQuestionText('');
    setMcqStatements(['', '', '']);
    setMcqOptions(['', '', '', '']);
    setMcqCorrectAnswer(0);
    setMcqExplanation('');

    setCreativeStem('');
    setCreativeCognitiveA('');
    setCreativeCognitiveB('');
    setCreativeCognitiveC('');
    setCreativeCognitiveD('');

    setGeneralQuestionText('');
    setGeneralStem('');
    setGeneralSubQuestions([]);
    setGeneralSuggestedAnswer('');
    setGeneralMarks(1);

    toast.success('প্রশ্নটি সফলভাবে তালিকায় যুক্ত হয়েছে!');
    return true;
  }, [buildPayloadFromForm]);

  // Remove draft question from list
  const removeQuestionFromList = useCallback((tempId) => {
    setQuestionsList(prev => prev.filter(q => q.id !== tempId));
  }, []);

  // Submit Handler
  const handleSaveQuestion = async () => {

    if (editingQuestion) {
      const payload = buildPayloadFromForm();
      if (!payload) return;
      updateQuestionMutation.mutate({ id: editingQuestion._id, payload });
      return;
    }

    let payloads = [];
    if (questionsList.length > 0) {
      payloads = questionsList.map(({ id, ...rest }) => rest);
    } else {
      const singlePayload = buildPayloadFromForm();
      if (!singlePayload) return;
      payloads = [singlePayload];
    }

    addQuestionMutation.mutate(payloads);
  };

  const formLoading = addQuestionMutation.isPending || updateQuestionMutation.isPending;

  return {
    // Wizard Steps
    activeStep,
    setActiveStep,
    
    // Syllabus helpers
    syllabusList,
    loadingSyllabus,
    formSubjects,
    formChapters,
    selectedSyllabusObj,
    allowedClasses,
    configLoading,

    // Filter states
    filterType,
    setFilterType,
    filterLevel,
    setFilterLevel,
    filterClass,
    setFilterClass,
    filterSubjectId,
    setFilterSubjectId,
    filterChapter,
    setFilterChapter,
    filterCategory,
    setFilterCategory,
    filterDifficulty,
    setFilterDifficulty,
    filterSearch,
    setFilterSearch,

    // Form fields & setters
    formType,
    setFormType,
    formLevel,
    setFormLevel,
    formClass,
    setFormClass,
    formSubjectId,
    setFormSubjectId,
    formGroup,
    setFormGroup,
    formChapterNumber,
    setFormChapterNumber,
    formTopics,
    setFormTopics,
    formCategory,
    setFormCategory,
    formDifficulty,
    setFormDifficulty,

    // MCQ fields & setters
    mcqType,
    setMcqType,
    mcqStem,
    setMcqStem,
    mcqQuestionText,
    setMcqQuestionText,
    mcqStatements,
    setMcqStatements,
    mcqOptions,
    setMcqOptions,
    mcqCorrectAnswer,
    setMcqCorrectAnswer,
    mcqExplanation,
    setMcqExplanation,

    // Creative fields & setters
    creativeStem,
    setCreativeStem,
    creativeCognitiveA,
    setCreativeCognitiveA,
    creativeCognitiveB,
    setCreativeCognitiveB,
    creativeCognitiveC,
    setCreativeCognitiveC,
    creativeCognitiveD,
    setCreativeCognitiveD,

    // General fields & setters
    generalQuestionText,
    setGeneralQuestionText,
    generalStem,
    setGeneralStem,
    generalSubQuestions,
    setGeneralSubQuestions,
    generalSuggestedAnswer,
    setGeneralSuggestedAnswer,
    generalMarks,
    setGeneralMarks,

    // CRUD Queries & Mutations
    fetchQuestionsQuery,
    deleteQuestionMutation,
    handleSaveQuestion,
    handleOpenEditMode,
    resetForm,

    // Draft batch creation
    questionsList,
    setQuestionsList,
    addQuestionToList,
    removeQuestionFromList,

    // API statuses
    formLoading,
    editingQuestion,
  };
}
