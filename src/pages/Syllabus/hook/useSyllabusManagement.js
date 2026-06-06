import { useState } from 'react';
import { useAuth } from '@clerk/react';
import { useUserContext } from '@/context/UserContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

export function useSyllabusManagement() {
  const { getToken } = useAuth();
  const { role: userRole } = useUserContext();
  const queryClient = useQueryClient();

  // Active filter state
  const [selectedClass, setSelectedClass] = useState('Class 6');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null); // null if creating, contains syllabus object if editing
  const [syllabusToDelete, setSyllabusToDelete] = useState(null); // contains syllabus object to delete

  // Form Fields
  const [formClass, setFormClass] = useState('Class 6');
  const [formSubject, setFormSubject] = useState('');
  const [formChapters, setFormChapters] = useState([
    { chapterNumber: 1, chapterName: '', topicsString: '' }
  ]);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Fetch Syllabus list query
  const {
    data: syllabusList = [],
    isLoading: loading,
    error: fetchError,
    refetch: fetchSyllabus,
  } = useQuery({
    queryKey: ['syllabusList', selectedClass],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/syllabus', {
        params: { className: selectedClass },
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
      setFormSuccess('সিলেবাস সফলভাবে যুক্ত করা হয়েছে!');
      setTimeout(() => {
        setIsModalOpen(false);
        resetForm();
      }, 1500);
    },
    onError: (err) => {
      setFormError(err.response?.data?.error || err.message || 'সিলেবাস যুক্ত করতে ব্যর্থ হয়েছে');
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
      setFormSuccess('সিলেবাস সফলভাবে আপডেট করা হয়েছে!');
      setTimeout(() => {
        setIsModalOpen(false);
        resetForm();
      }, 1500);
    },
    onError: (err) => {
      setFormError(err.response?.data?.error || err.message || 'সিলেবাস আপডেট করতে ব্যর্থ হয়েছে');
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
      setSyllabusToDelete(null);
    },
    onError: (err) => {
      alert(err.response?.data?.error || err.message || 'সিলেবাস মুছতে ব্যর্থ হয়েছে');
    },
  });

  // Reset form states
  const resetForm = () => {
    setFormClass(selectedClass);
    setFormSubject('');
    setFormChapters([{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
    setFormError(null);
    setFormSuccess(null);
    setEditingSyllabus(null);
  };

  // Open modal for adding new syllabus
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing existing syllabus
  const handleOpenEditModal = (syllabus) => {
    setFormError(null);
    setFormSuccess(null);
    setEditingSyllabus(syllabus);
    setFormClass(syllabus.className);
    setFormSubject(syllabus.subjectName);
    
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
    setFormError(null);
    setFormSuccess(null);

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

    const payload = {
      className: formClass,
      subjectName: formSubject.trim(),
      chapters: formattedChapters
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
    selectedClass,
    setSelectedClass,
    // Modal & delete states
    isModalOpen,
    setIsModalOpen,
    editingSyllabus,
    syllabusToDelete,
    setSyllabusToDelete,
    // Form fields & setters
    formClass,
    setFormClass,
    formSubject,
    setFormSubject,
    formChapters,
    formError,
    formSuccess,
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
