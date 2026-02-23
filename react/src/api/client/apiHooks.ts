import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export function useGetActivities(user: string) {
  return useQuery({
    queryKey: ['getActivities', 'user', user],
    queryFn: () => apiClient.getActivities(user)
  })
}
