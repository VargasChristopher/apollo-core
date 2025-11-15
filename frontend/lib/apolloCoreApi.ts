// lib/apolloCoreApi.ts
// Small helper around the Jetson Nano HTTP API.

export type LightMode =
  | 'off'
  | 'focus'
  | 'relax'
  | 'night'
  | 'energy';

export type ApolloStatus = {
  muted: boolean;
  lightMode: LightMode | null;
  availableModes?: LightMode[];
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_APOLLO_CORE_URL ?? 'http://192.168.1.202:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || 'Request failed'}`);
  }

  return (await res.json()) as T;
}

export async function getApolloStatus(): Promise<ApolloStatus> {
  return request<ApolloStatus>('/api/status');
}

export async function setMuted(muted: boolean): Promise<ApolloStatus> {
  return request<ApolloStatus>('/api/mute', {
    method: 'POST',
    body: JSON.stringify({ muted }),
  });
}

export async function setLightMode(mode: LightMode): Promise<ApolloStatus> {
  return request<ApolloStatus>('/api/lights/mode', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  });
}

export const apolloApi = {
  getApolloStatus,
  setMuted,
  setLightMode,
};
