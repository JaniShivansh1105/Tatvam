"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export interface UserSubject {
  id: string;
  name: string;
  userId: string;
  createdAt?: string;
}

const SUBJECTS_QUERY_KEY = "user-subjects";

/**
 * Dynamic Subject Engine Hook
 * 
 * Single source of truth for user's selected subjects.
 * Every module (Dashboard, Learn, Practice, Flashcards, Progress, Search, AI)
 * must consume subjects through this hook. No hardcoded subjects anywhere.
 */
export function useSubjects() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  // Fetch subjects from backend
  const {
    data: subjects = [],
    isLoading,
    error,
    refetch,
  } = useQuery<UserSubject[]>({
    queryKey: [SUBJECTS_QUERY_KEY, user?.id],
    queryFn: async () => {
      const res = await apiClient.get("/auth/me");
      return res.data.data.user.userSubjects || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 min cache
    initialData: () => {
      // Use subjects already present in the user object to avoid extra API call
      return (user as any)?.userSubjects || [];
    },
  });

  // Add subject
  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post("/auth/profile/subjects", { name });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY, user?.id] });
    },
  });

  // Remove subject
  const removeMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const res = await apiClient.delete(`/auth/profile/subjects/${subjectId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY, user?.id] });
    },
  });

  const addSubject = useCallback(
    async (name: string) => {
      // Prevent duplicates
      if (subjects.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
        return;
      }
      await addMutation.mutateAsync(name);
    },
    [subjects, addMutation]
  );

  const removeSubject = useCallback(
    async (subjectId: string) => {
      await removeMutation.mutateAsync(subjectId);
    },
    [removeMutation]
  );

  return {
    subjects,
    isLoading,
    error,
    refetch,
    addSubject,
    removeSubject,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    subjectNames: subjects.map((s) => s.name),
  };
}
