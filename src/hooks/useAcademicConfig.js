import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/react';
import apiClient from '../lib/apiClient';

export function useAcademicConfig() {
  const { getToken, isSignedIn } = useAuth();

  const { data: config, isLoading, refetch } = useQuery({
    queryKey: ['academicConfig'],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/academic-config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.config;
    },
    enabled: isSignedIn,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Default fallback classes (Class 3 to 12) if no config exists or loading
  const defaultClasses = [
    { value: 'Class 3', label: '৩য় শ্রেণী', type: 'School', level: 'Primary' },
    { value: 'Class 4', label: '৪র্থ শ্রেণী', type: 'School', level: 'Primary' },
    { value: 'Class 5', label: '৫ম শ্রেণী', type: 'School', level: 'Primary' },
    { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী', type: 'School', level: 'Secondary' },
    { value: 'Class 7', label: '৭ম শ্রেণী', type: 'School', level: 'Secondary' },
    { value: 'Class 8', label: '৮ম শ্রেণী', type: 'School', level: 'Secondary' },
    { value: 'Class 9', label: '৯ম শ্রেণী', type: 'School', level: 'Secondary' },
    { value: 'Class 10', label: '১০ম শ্রেণী', type: 'School', level: 'Secondary' },
    { value: 'Class 11', label: 'একাদশ শ্রেণী', type: 'College', level: 'Higher Secondary' },
    { value: 'Class 12', label: 'দ্বাদশ শ্রেণী', type: 'College', level: 'Higher Secondary' },
  ];

  // Helper to compute classes based on a configuration
  const computeClassesForSetup = (setup) => {
    if (!setup) return defaultClasses;

    const { 
      activeTypes = [], 
      schoolLevels = [], 
      madrasahLevels = [],
      schoolPrimaryClasses = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
      schoolSecondaryClasses = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
      collegeClasses = ["Class 11", "Class 12"],
      madrasahEbtedayeeClasses = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
      madrasahDakhilClasses = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"],
      madrasahAlimClasses = ["Class 11", "Class 12"]
    } = setup;
    const classes = [];

    if (activeTypes.includes('School')) {
      if (schoolLevels.includes('Primary')) {
        const candidates = [
          { value: 'Class 1', label: '১ম শ্রেণী', type: 'School', level: 'Primary' },
          { value: 'Class 2', label: '২য় শ্রেণী', type: 'School', level: 'Primary' },
          { value: 'Class 3', label: '৩য় শ্রেণী', type: 'School', level: 'Primary' },
          { value: 'Class 4', label: '৪র্থ শ্রেণী', type: 'School', level: 'Primary' },
          { value: 'Class 5', label: '৫ম শ্রেণী', type: 'School', level: 'Primary' }
        ];
        classes.push(...candidates.filter(c => schoolPrimaryClasses.includes(c.value)));
      }
      if (schoolLevels.includes('Secondary')) {
        const candidates = [
          { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী', type: 'School', level: 'Secondary' },
          { value: 'Class 7', label: '৭ম শ্রেণী', type: 'School', level: 'Secondary' },
          { value: 'Class 8', label: '৮ম শ্রেণী', type: 'School', level: 'Secondary' },
          { value: 'Class 9', label: '৯ম শ্রেণী', type: 'School', level: 'Secondary' },
          { value: 'Class 10', label: '১০ম শ্রেণী', type: 'School', level: 'Secondary' }
        ];
        classes.push(...candidates.filter(c => schoolSecondaryClasses.includes(c.value)));
      }
    }

    if (activeTypes.includes('College')) {
      const candidates = [
        { value: 'Class 11', label: 'একাদশ শ্রেণী', type: 'College', level: 'Higher Secondary' },
        { value: 'Class 12', label: 'দ্বাদশ শ্রেণী', type: 'College', level: 'Higher Secondary' }
      ];
      classes.push(...candidates.filter(c => collegeClasses.includes(c.value)));
    }

    if (activeTypes.includes('Madrasah')) {
      if (madrasahLevels.includes('Ebtedayee')) {
        const candidates = [
          { value: 'Class 1', label: '১ম শ্রেণী (ইবতেদায়ী)', type: 'Madrasah', level: 'Ebtedayee' },
          { value: 'Class 2', label: '২য় শ্রেণী (ইবতেদায়ী)', type: 'Madrasah', level: 'Ebtedayee' },
          { value: 'Class 3', label: '৩য় শ্রেণী (ইবতেদায়ী)', type: 'Madrasah', level: 'Ebtedayee' },
          { value: 'Class 4', label: '৪র্থ শ্রেণী (ইবতেদায়ী)', type: 'Madrasah', level: 'Ebtedayee' },
          { value: 'Class 5', label: '৫ম শ্রেণী (ইবতেদায়ী)', type: 'Madrasah', level: 'Ebtedayee' }
        ];
        classes.push(...candidates.filter(c => madrasahEbtedayeeClasses.includes(c.value)));
      }
      if (madrasahLevels.includes('Dakhil')) {
        const candidates = [
          { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী (দাখিল)', type: 'Madrasah', level: 'Dakhil' },
          { value: 'Class 7', label: '৭ম শ্রেণী (দাখিল)', type: 'Madrasah', level: 'Dakhil' },
          { value: 'Class 8', label: '৮ম শ্রেণী (দাখিল)', type: 'Madrasah', level: 'Dakhil' },
          { value: 'Class 9', label: '৯ম শ্রেণী (দাখিল)', type: 'Madrasah', level: 'Dakhil' },
          { value: 'Class 10', label: '১০ম শ্রেণী (দাখিল)', type: 'Madrasah', level: 'Dakhil' }
        ];
        classes.push(...candidates.filter(c => madrasahDakhilClasses.includes(c.value)));
      }
      if (madrasahLevels.includes('Alim')) {
        const candidates = [
          { value: 'Class 11', label: 'একাদশ শ্রেণী (আলিম)', type: 'Madrasah', level: 'Alim' },
          { value: 'Class 12', label: 'দ্বাদশ শ্রেণী (আলিম)', type: 'Madrasah', level: 'Alim' }
        ];
        classes.push(...candidates.filter(c => madrasahAlimClasses.includes(c.value)));
      }
    }

    return classes.length > 0 ? classes : defaultClasses;
  };

  const allowedClasses = computeClassesForSetup(config);

  return {
    config,
    isLoading,
    refetch,
    allowedClasses,
    defaultClasses,
  };
}
