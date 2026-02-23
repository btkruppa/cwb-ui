import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import type { CreateActivity } from "../model/Activity";

export function useGetActivities(user: string) {
  return useQuery({
    queryKey: ['getActivities', 'user', user],
    queryFn: () => apiClient.getActivities(user),
    enabled: Boolean(user)
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateActivity) => apiClient.createActivity(data),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['getActivities'] }) },
  })
}
