import { AxiosRequestConfig } from "axios";

export const getAxiosAuthInterceptor = (token: string) => (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (!token) {
    return config;
  }

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: (config.headers && config.headers.Authorization) || `Bearer ${token}`,
    },
  };
};
