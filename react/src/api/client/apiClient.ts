
import axios, { type AxiosResponse } from "axios";
// import { fetchAuthSession } from "aws-amplify/auth";
import { getStageConfig } from "../../config/deploymentStage";
import { Activity } from "../models/Activity";


const axiosInstance = axios.create({
  baseURL: getStageConfig().apiEndpoint,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // const { tokens } = await fetchAuthSession();
    // config.headers.Authorization = tokens?.idToken?.toString();
    return config;
  },
  null,
  { synchronous: false },
);

async function dataResponse<T>(res: AxiosResponse<T>) {
  return res.data;
}

export const apiClient = {
  async getActivities(user: string) {
    return axiosInstance.get<Activity>(`/activities?user=${user}`)
      .then(dataResponse)
  }
}
