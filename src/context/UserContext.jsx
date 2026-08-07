import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import apiClient, { getAccessToken, setAccessToken } from "../lib/apiClient";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [drawerDefaultTab, setDrawerDefaultTab] = useState("login"); // 'login' or 'register'

  // Attempt token restore from httpOnly refresh cookie on app init
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await apiClient.post("/auth/refresh");
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
        }
      } catch {
        // No active session or cookie expired
        setAccessToken(null);
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
  }, []);

  // Fetch current user profile when access token exists
  const {
    data: userProfile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", getAccessToken()],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) return null;
      const response = await apiClient.get("/auth/me");
      return response.data.user;
    },
    enabled: !isInitializing && !!getAccessToken(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const openAuthDrawer = (tab = "login") => {
    setDrawerDefaultTab(tab);
    setIsAuthDrawerOpen(true);
  };

  const closeAuthDrawer = () => {
    setIsAuthDrawerOpen(false);
  };

  const login = async (phoneNumber, password) => {
    const response = await apiClient.post("/auth/login", {
      phoneNumber,
      password,
    });
    if (response.data?.code === "PHONE_NOT_VERIFIED") {
      return response.data; // Needs OTP verification
    }
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
      await refetch();
      setIsAuthDrawerOpen(false);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthDrawerOpen(false);
      setAccessToken(null);
      queryClient.setQueryData(["userProfile", null], null);
      queryClient.invalidateQueries();
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        role: userProfile?.role || "Subscriber",
        loading: isInitializing || (!!getAccessToken() && isLoading),
        refreshProfile: refetch,
        isAuthDrawerOpen,
        drawerDefaultTab,
        openAuthDrawer,
        closeAuthDrawer,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
