import { clearAuthSession, getStoredAccessToken } from "@/lib/auth-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type ShowtimeResponse = {
  availableSeats: number;
  endTime: string;
  hallId: string;
  hallName: string;
  id: string;
  itemId: string;
  itemTitle: string;
  itemTypeId: string;
  itemTypeName: string;
  itemTypeSlug: string;
  price: number;
  seats: unknown[];
  showtimeStatusId: string;
  showtimeStatusName: string;
  showtimeStatusSlug: string;
  startTime: string;
  venueId: string;
  venueName: string;
};

export type PagedShowtimesResponse = {
  items: ShowtimeResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type GetShowtimesQuery = {
  date?: string;
  hallId?: string;
  itemId?: string;
  itemTypeId?: string;
  page?: number;
  pageSize?: number;
  venueId?: string;
};

export type SaveShowtimeRequest = {
  endTime: string;
  hallId: string;
  itemId: string;
  price: number;
  showtimeStatusId?: string | null;
  startTime: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getShowtimes(query: GetShowtimesQuery = {}): Promise<PagedShowtimesResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const response = await fetch(`${API_BASE_URL}/api/showtimes${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load showtimes.");
  }

  return response.json() as Promise<PagedShowtimesResponse>;
}

export async function createShowtime(request: SaveShowtimeRequest): Promise<ShowtimeResponse> {
  return sendShowtimeRequest("POST", "/api/showtimes", request);
}

export async function updateShowtime(id: string, request: SaveShowtimeRequest): Promise<ShowtimeResponse> {
  return sendShowtimeRequest("PUT", `/api/showtimes/${id}`, request);
}

export async function deleteShowtime(id: string): Promise<void> {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("Your login session has expired. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/showtimes/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "DELETE",
  });

  if (!response.ok) {
    await throwProblem(response, "Unable to delete showtime.");
  }
}

async function sendShowtimeRequest(method: "POST" | "PUT", path: string, request: SaveShowtimeRequest) {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("Your login session has expired. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: JSON.stringify(request),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method,
  });

  if (!response.ok) {
    await throwProblem(response, "Unable to save showtime.");
  }

  return response.json() as Promise<ShowtimeResponse>;
}

async function throwProblem(response: Response, fallbackMessage: string): Promise<never> {
  if (response.status === 401) {
    clearAuthSession();
    throw new Error("Your login session has expired. Please log in again.");
  }

  const problem = await readProblemDetails(response);
  throw new Error(problem.detail || problem.title || fallbackMessage);
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
