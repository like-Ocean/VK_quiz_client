import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/store/tokenStore';
import type { RefreshTokenRequest, TokenResponse } from '@/types/auth';

const baseURL = import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

export const api: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

export const authApi: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

let refreshPromise: Promise<TokenResponse> | null = null;

async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error('Missing refresh token');
    }

    if (!refreshPromise) {
        refreshPromise = authApi
            .post<TokenResponse>('/auth/refresh', {
                refresh_token: refreshToken,
            } satisfies RefreshTokenRequest)
            .then((response) => response.data)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        if (status === 403) {
            console.warn('Forbidden request', error.config?.url);
        }

        if (status !== 401) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (!originalRequest || (originalRequest as { _retry?: boolean })._retry) {
            return Promise.reject(error);
        }

        (originalRequest as { _retry?: boolean })._retry = true;

        try {
            const tokens = await refreshAccessToken();
            setTokens(tokens);
            originalRequest.headers.set('Authorization', `Bearer ${tokens.access_token}`);
            return api(originalRequest);
        } catch (refreshError) {
            clearTokens();
            return Promise.reject(refreshError);
        }
    },
);
