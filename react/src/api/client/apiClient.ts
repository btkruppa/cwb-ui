
import axios, { type AxiosResponse } from "axios";
import { getStageConfig } from "../../config/deploymentStage";
import type { Activity, CreateActivity } from "../model/Activity";
import { fetchAuthSession } from "aws-amplify/auth";


const axiosInstance = axios.create({
  baseURL: getStageConfig().apiEndpoint,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { tokens } = await fetchAuthSession();
    config.headers.Authorization = tokens?.idToken?.toString();
    return config;
  },
  null,
  { synchronous: false },
);

function dataResponse<T>(res: AxiosResponse<T>) {
  return res.data;
}

export const apiClient = {
  async getActivities(user: string) {
    return axiosInstance.get<Activity[]>(`/activities/${user}`)
      .then(dataResponse)
  },

  async createActivity(data: CreateActivity) {
    return axiosInstance.post<Activity>('/activities', data)
      .then(dataResponse)
  },
}


