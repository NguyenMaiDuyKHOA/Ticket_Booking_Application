import { clearAuthSession, getStoredAccessToken } from "@/lib/auth-api";
import type { GenreOption } from "@/lib/genres-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type CreateItemRequest = {
  description: string;
  genreIds: string[];
  imageUrl?: string | null;
  itemStatusId: string;
  itemTypeId: string;
  metadata?: string | null;
  posterUrl?: string | null;
  price: number;
  slug: string;
  startDate: string;
  title: string;
};

export type ItemResponse = {
  createdAt: string;
  description: string;
  genres: GenreOption[];
  id: string;
  imageUrl?: string | null;
  itemStatusId: string;
  itemStatusSlug: string;
  itemTypeId: string;
  itemTypeSlug: string;
  metadata: string;
  posterUrl?: string | null;
  price: number;
  slug: string;
  startDate: string;
  showtimeCount: number;
  title: string;
};

export type PagedItemsResponse = {
  items: ItemResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type GetItemsQuery = {
  itemTypeSlug?: string;
  page?: number;
  pageSize?: number;
  statusSlug?: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getItems(query: GetItemsQuery = {}): Promise<PagedItemsResponse> {
  const searchParams = new URLSearchParams();

  if (query.page) {
    searchParams.set("page", String(query.page));
  }

  if (query.pageSize) {
    searchParams.set("pageSize", String(query.pageSize));
  }

  if (query.itemTypeSlug) {
    searchParams.set("itemTypeSlug", query.itemTypeSlug);
  }

  if (query.statusSlug) {
    searchParams.set("statusSlug", query.statusSlug);
  }

  const queryString = searchParams.toString();
  const response = await fetch(`${API_BASE_URL}/api/items${queryString ? `?${queryString}` : ""}`, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load items.");
  }

  return response.json() as Promise<PagedItemsResponse>;
}

export async function getItemById(id: string): Promise<ItemResponse> {
  const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load item.");
  }

  return response.json() as Promise<ItemResponse>;
}

export async function getItemBySlug(slug: string): Promise<ItemResponse> {
  const response = await fetch(`${API_BASE_URL}/api/items/by-slug/${encodeURIComponent(slug)}`, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load item.");
  }

  return response.json() as Promise<ItemResponse>;
}

export async function createItem(request: CreateItemRequest): Promise<ItemResponse> {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("Your login session has expired. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/items`, {
    body: JSON.stringify(request),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
      throw new Error("Your login session has expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("Your account does not have permission to create items.");
    }

    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to create item.");
  }

  return response.json() as Promise<ItemResponse>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
