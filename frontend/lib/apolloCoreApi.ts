// lib/apolloCoreApi.ts
// Small helper around the Jetson Nano HTTP API.

export type ApolloStatus = {
  service: string;
  status: string;
  listening?: boolean;
  last_command?: string;
  last_response?: string;
};

export type AudioCommandResponse = {
  transcription: string;
  response: string;
  intent: string;
  room?: string | null;
  device?: string | null;
  value?: number | null;
  scene?: string | null;
  device_action_success: boolean;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_APOLLO_CORE_URL ?? 'http://192.168.1.202:5000';

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

/**
 * Health check endpoint
 */
export async function getHealth(): Promise<{ service: string; status: string }> {
  return request<{ service: string; status: string }>('/api/health');
}

/**
 * Get Apollo Core status
 */
export async function getApolloStatus(): Promise<ApolloStatus> {
  return request<ApolloStatus>('/api/status');
}

/**
 * Trigger "How can I help you" TTS acknowledgment
 */
export async function speakAcknowledgment(): Promise<{ message: string }> {
  return request<{ message: string }>('/api/speak', {
    method: 'POST',
  });
}

/**
 * Send a text command to Apollo Core
 */
export async function sendTextCommand(command: string): Promise<AudioCommandResponse> {
  return request<AudioCommandResponse>('/api/command', {
    method: 'POST',
    body: JSON.stringify({ command }),
  });
}

/**
 * Send an audio file for transcription and processing
 * @param audioUri - URI to the audio file (blob URI for web, file path for native)
 * @param speak - Whether to play TTS response (default: true)
 */
export async function sendAudioCommand(
  audioUri: string,
  speak: boolean = true
): Promise<AudioCommandResponse> {
  // Create FormData for multipart upload
  const formData = new FormData();
  
  // Handle different platforms
  if (typeof window !== 'undefined' && audioUri.startsWith('blob:')) {
    // Web platform: fetch the blob and append it
    const response = await fetch(audioUri);
    const blob = await response.blob();
    // Ensure we're sending as WAV (should already be converted)
    formData.append('audio', blob, 'recording.wav');
  } else {
    // Native platform: use file URI
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/wav',
      name: 'recording.wav',
    } as any);
  }
  
  formData.append('speak', speak.toString());

  const url = `${API_BASE_URL}/api/audio/command`;

  // Don't set Content-Type header - let the browser set it with boundary
  const headers: HeadersInit = {};
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || 'Request failed'}`);
  }

  return (await res.json()) as AudioCommandResponse;
}

/**
 * Turn on lights
 */
export async function turnOnLights(room?: string): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>('/api/lights/on', {
    method: 'POST',
    body: JSON.stringify({ room: room || null }),
  });
}

/**
 * Turn off lights
 */
export async function turnOffLights(room?: string): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>('/api/lights/off', {
    method: 'POST',
    body: JSON.stringify({ room: room || null }),
  });
}

/**
 * Set light brightness (0-100)
 */
export async function setLightBrightness(
  brightness: number,
  room?: string
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>('/api/lights/brightness', {
    method: 'POST',
    body: JSON.stringify({
      brightness: Math.max(0, Math.min(100, brightness)),
      room: room || null,
    }),
  });
}

export const apolloApi = {
  getHealth,
  getApolloStatus,
  speakAcknowledgment,
  sendTextCommand,
  sendAudioCommand,
  turnOnLights,
  turnOffLights,
  setLightBrightness,
};
