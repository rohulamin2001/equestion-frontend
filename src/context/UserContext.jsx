import React, { createContext, useContext } from 'react';
import { useAuth } from '@clerk/react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const { data: userProfile, isLoading, refetch } = useQuery({
    queryKey: ['userProfile', isSignedIn],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null;
      const response = await apiClient.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <UserContext.Provider
      value={{
        userProfile,
        role: userProfile?.role || 'Subscriber',
        loading: isLoading || !isLoaded,
        refreshProfile: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
