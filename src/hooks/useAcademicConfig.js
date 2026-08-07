import { useQuery } from "@tanstack/react-query";
import {
  CLASSES_MAP,
  DEFAULT_ALIM_CLASSES,
  DEFAULT_COLLEGE_CLASSES,
  DEFAULT_DAKHIL_CLASSES,
  DEFAULT_EBTEDAYEE_CLASSES,
  DEFAULT_PRIMARY_CLASSES,
  DEFAULT_SECONDARY_CLASSES,
  MADRASAH_CLASSES_MAP,
} from "../constants/classes";
import { useUserContext } from "../context/UserContext";
import apiClient from "../lib/apiClient";

export function useAcademicConfig() {
  const { userProfile } = useUserContext();

  const {
    data: config,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["academicConfig"],
    queryFn: async () => {
      const response = await apiClient.get("/academic-config");
      return response.data.config;
    },
    enabled: !!userProfile,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Default fallback classes (Class 3 to HSC) if no config exists or loading
  const defaultClasses = CLASSES_MAP.filter(
    (c) => c.value !== "Class 1" && c.value !== "Class 2",
  );

  // Helper to compute classes based on a configuration
  const computeClassesForSetup = (setup) => {
    if (!setup) return defaultClasses;

    const {
      activeTypes = [],
      schoolLevels = [],
      madrasahLevels = [],
      schoolPrimaryClasses = DEFAULT_PRIMARY_CLASSES,
      schoolSecondaryClasses = DEFAULT_SECONDARY_CLASSES,
      collegeClasses = DEFAULT_COLLEGE_CLASSES,
      madrasahEbtedayeeClasses = DEFAULT_EBTEDAYEE_CLASSES,
      madrasahDakhilClasses = DEFAULT_DAKHIL_CLASSES,
      madrasahAlimClasses = DEFAULT_ALIM_CLASSES,
    } = setup;
    const classes = [];

    if (activeTypes.includes("School")) {
      if (schoolLevels.includes("Primary")) {
        const candidates = CLASSES_MAP.filter(
          (c) => c.type === "School" && c.level === "Primary",
        );
        classes.push(
          ...candidates.filter((c) => schoolPrimaryClasses.includes(c.value)),
        );
      }
      if (schoolLevels.includes("Secondary")) {
        const candidates = CLASSES_MAP.filter(
          (c) => c.type === "School" && c.level === "Secondary",
        );
        classes.push(
          ...candidates.filter((c) => schoolSecondaryClasses.includes(c.value)),
        );
      }
    }

    if (activeTypes.includes("College")) {
      const candidates = CLASSES_MAP.filter((c) => c.type === "College");
      classes.push(
        ...candidates.filter((c) => collegeClasses.includes(c.value)),
      );
    }

    if (activeTypes.includes("Madrasah")) {
      if (madrasahLevels.includes("Ebtedayee")) {
        const candidates = MADRASAH_CLASSES_MAP.filter(
          (c) => c.level === "Ebtedayee",
        );
        classes.push(
          ...candidates.filter((c) =>
            madrasahEbtedayeeClasses.includes(c.value),
          ),
        );
      }
      if (madrasahLevels.includes("Dakhil")) {
        const candidates = MADRASAH_CLASSES_MAP.filter(
          (c) => c.level === "Dakhil",
        );
        classes.push(
          ...candidates.filter((c) => madrasahDakhilClasses.includes(c.value)),
        );
      }
      if (madrasahLevels.includes("Alim")) {
        const candidates = MADRASAH_CLASSES_MAP.filter(
          (c) => c.level === "Alim",
        );
        classes.push(
          ...candidates.filter((c) => madrasahAlimClasses.includes(c.value)),
        );
      }
    }

    return classes.length > 0 ? classes : defaultClasses;
  };

  const allowedClasses = computeClassesForSetup(config);

  return {
    config,
    isLoading,
    allowedClasses,
    refetch,
  };
}
