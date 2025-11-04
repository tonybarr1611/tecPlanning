export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.length > 0
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")
    : "/api";

interface RequestOptions extends RequestInit {
  token?: string | null;
  skipJson?: boolean;
}

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, skipJson, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...(headers as Record<string, string>),
  };

  if (rest.body instanceof FormData) {
    // Allow multipart when FormData is supplied
    delete finalHeaders["Content-Type"];
  }

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = await response.text();
    }
    throw new ApiError(
      (errorBody as { message?: string })?.message ??
        `Request to ${path} failed with status ${response.status}`,
      response.status,
      errorBody,
    );
  }

  if (response.status === 204 || skipJson) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function formatMeetingSchedule(
  meetings: Array<{ day: string; startTime: string; endTime: string }>,
): string {
  return meetings
    .map((meeting) => `${meeting.day} ${meeting.startTime}-${meeting.endTime}`)
    .join(" | ");
}
