const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed')
  }

  return data
}

export const TOKEN_STORAGE_KEY = 'isisproject-token'
