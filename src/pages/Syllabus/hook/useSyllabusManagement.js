import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { useUserContext } from '@/context/UserContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import { toast } from 'sonner';

export function useSyllabusManagement() {
  const { getToken } = useAuth();
  const { role: userRole } = useUserContext();
  const queryClient = useQueryClient();
  const { allowedClasses, isLoading: configLoading } = useAcademicConfig();

  // Active filter state
  const [selectedType, setSelectedType] = useState('School');
  const [selectedLevel, setSelectedLevel] = useState('Secondary');
  const [selectedClass, setSelectedClass] = useState('Class 6');

  // Sync state when allowedClasses changes or loaded
  useEffect(() => {
    if (allowedClasses && allowedClasses.length > 0) {
      const exists = allowedClasses.some(
        c => c.value === selectedClass && c.type === selectedType && c.level === selectedLevel
      );
      if (!exists) {
        const first = allowedClasses[0];
        setSelectedType(first.type);
        setSelectedLevel(first.level);
        setSelectedClass(first.value);
      }
    }
  }, [allowedClasses, selectedClass, selectedType, selectedLevel]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null); // null if creating, contains syllabus object if editing
  const [syllabusToDelete, setSyllabusToDelete] = useState(null); // contains syllabus object to delete

  // Form Fields
  const [formType, setFormType] = useState('School');
  const [formLevel, setFormLevel] = useState('Secondary');
  const [formClass, setFormClass] = useState('Class 6');
  const [formSubject, setFormSubject] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formSubjectCode, setFormSubjectCode] = useState('');
  const [formGroup, setFormGroup] = useState('General');
  const [formYears, setFormYears] = useState([new Date().getFullYear()]);
  const [formChapters, setFormChapters] = useState([
    { chapterNumber: 1, chapterName: '', topicsString: '' }
  ]);

  // Fetch configured subjects dynamically for the selected Type, Level, Class in the form
  const { data: formSubjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects-form', formType, formLevel, formClass],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/subjects', {
        params: {
          className: formClass,
          institutionType: formType,
          academicLevel: formLevel
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.subjects;
    },
    enabled: !!formClass
  });

  // Reset subject states when class/type/level changes (unless editing)
  useEffect(() => {
    if (!editingSyllabus) {
      setFormSubject('');
      setFormSubjectId('');
      setFormSubjectCode('');
      setFormYears([new Date().getFullYear()]);
    }
  }, [formClass, formType, formLevel, editingSyllabus]);

  const handleAddYear = (year) => {
    const y = Number(year);
    if (!y || isNaN(y)) return;
    if (formYears.includes(y)) return;
    setFormYears([...formYears, y].sort((a, b) => a - b));
  };

  const handleRemoveYear = (year) => {
    const y = Number(year);
    setFormYears(formYears.filter(item => item !== y));
  };

  // Fetch Syllabus list query
  const {
    data: syllabusList = [],
    isLoading: loading,
    error: fetchError,
    refetch: fetchSyllabus,
  } = useQuery({
    queryKey: ['syllabusList', selectedType, selectedLevel, selectedClass],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/syllabus', {
        params: { 
          className: selectedClass,
          institutionType: selectedType,
          academicLevel: selectedLevel
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.syllabus;
    },
  });

  const error = fetchError
    ? fetchError.response?.data?.error || fetchError.message || 'সিলেবাস তালিকা লোড করতে ব্যর্থ হয়েছে'
    : null;

  // Add Syllabus mutation
  const addSyllabusMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const response = await apiClient.post('/syllabus', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusList'] });
      toast.success('সিলেবাস সফলভাবে যুক্ত করা হয়েছে!');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সিলেবাস যুক্ত করতে ব্যর্থ হয়েছে');
    },
  });

  // Edit Syllabus mutation
  const updateSyllabusMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const token = await getToken();
      const response = await apiClient.put(`/syllabus/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusList'] });
      toast.success('সিলেবাস সফলভাবে আপডেট করা হয়েছে!');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সিলেবাস আপডেট করতে ব্যর্থ হয়েছে');
    },
  });

  // Delete Syllabus mutation
  const deleteSyllabusMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      await apiClient.delete(`/syllabus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusList'] });
      toast.success('সিলেবাস সফলভাবে মুছে ফেলা হয়েছে!');
      setSyllabusToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সিলেবাস মুছতে ব্যর্থ হয়েছে');
    },
  });

  // Reset form states
  const resetForm = () => {
    setFormType(selectedType);
    setFormLevel(selectedLevel);
    setFormClass(selectedClass);
    setFormSubject('');
    setFormSubjectId('');
    setFormSubjectCode('');
    setFormGroup('General');
    setFormYears([new Date().getFullYear()]);
    setFormChapters([{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
    setEditingSyllabus(null);
  };

  // Open modal for adding new syllabus
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing existing syllabus
  const handleOpenEditModal = (syllabus) => {
    setEditingSyllabus(syllabus);
    setFormType(syllabus.institutionType || 'School');
    setFormLevel(syllabus.academicLevel || 'Secondary');
    setFormClass(syllabus.className);
    setFormSubject(syllabus.subjectName);
    setFormSubjectId(syllabus.subjectId || '');
    setFormSubjectCode(syllabus.subjectCode || '');
    setFormGroup(syllabus.group || 'General');
    setFormYears(syllabus.years && syllabus.years.length > 0 ? syllabus.years : [new Date().getFullYear()]);
    
    // Map chapters to include topicsString (comma-separated list for easy textarea editing)
    const mappedChapters = syllabus.chapters.map(c => ({
      chapterNumber: c.chapterNumber,
      chapterName: c.chapterName,
      topicsString: c.topics ? c.topics.join(', ') : ''
    }));
    setFormChapters(mappedChapters.length > 0 ? mappedChapters : [{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
    setIsModalOpen(true);
  };

  // Dynamic form handlers for chapters
  const handleAddChapterField = () => {
    const nextNum = formChapters.length + 1;
    setFormChapters([
      ...formChapters,
      { chapterNumber: nextNum, chapterName: '', topicsString: '' }
    ]);
  };

  const handleRemoveChapterField = (index) => {
    if (formChapters.length === 1) {
      setFormChapters([{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
      return;
    }
    const updated = formChapters.filter((_, i) => i !== index).map((c, i) => ({
      ...c,
      chapterNumber: i + 1 // Re-index chapter numbers
    }));
    setFormChapters(updated);
  };

  const handleChapterFieldChange = (index, field, value) => {
    const updated = formChapters.map((c, i) => {
      if (i === index) {
        return { ...c, [field]: value };
      }
      return c;
    });
    setFormChapters(updated);
  };

  // Handle submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format payload
    const formattedChapters = formChapters
      .filter(c => c.chapterName.trim()) // filter out empty chapters
      .map(c => ({
        chapterNumber: Number(c.chapterNumber),
        chapterName: c.chapterName.trim(),
        topics: c.topicsString
          ? c.topicsString.split(',').map(t => t.trim()).filter(Boolean)
          : []
      }));

    const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(formClass);
    const payload = {
      className: formClass,
      subjectId: formSubjectId,
      subjectCode: formSubjectCode,
      subjectName: formSubject.trim(),
      group: isClass9to12 ? formGroup : 'General',
      years: formYears,
      chapters: formattedChapters,
      institutionType: formType,
      academicLevel: formLevel
    };

    if (editingSyllabus) {
      updateSyllabusMutation.mutate({ id: editingSyllabus._id, payload });
    } else {
      addSyllabusMutation.mutate(payload);
    }
  };

  const handleDelete = async () => {
    if (syllabusToDelete) {
      deleteSyllabusMutation.mutate(syllabusToDelete._id);
    }
  };

  const formLoading = addSyllabusMutation.isPending || updateSyllabusMutation.isPending;

  return {
    userRole,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
    selectedClass,
    setSelectedClass,
    allowedClasses,
    configLoading,
    // Modal & delete states
    isModalOpen,
    setIsModalOpen,
    editingSyllabus,
    syllabusToDelete,
    setSyllabusToDelete,
    // Form fields & setters
    formType,
    setFormType,
    formLevel,
    setFormLevel,
    formClass,
    setFormClass,
    formSubject,
    setFormSubject,
    formSubjectId,
    setFormSubjectId,
    formSubjectCode,
    setFormSubjectCode,
    formSubjects,
    subjectsLoading,
    formGroup,
    setFormGroup,
    formYears,
    setFormYears,
    handleAddYear,
    handleRemoveYear,
    formChapters,
    formLoading,
    deletePending: deleteSyllabusMutation.isPending,
    // Data list
    syllabusList,
    loading,
    error,
    refetch: fetchSyllabus,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleAddChapterField,
    handleRemoveChapterField,
    handleChapterFieldChange,
    handleSubmit,
    handleDelete,
  };
}
