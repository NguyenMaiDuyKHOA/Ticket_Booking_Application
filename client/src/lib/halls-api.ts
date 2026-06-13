const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type HallOption = {
  capacity: number;
  hallTypeId: string;
  hallTypeName: string;
  id: string;
  itemTypeId: string;
  itemTypeName: string;
  itemTypeSlug: string;
  name: string;
  venueId: string;
  venueName: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getHalls(venueId?: string, itemTypeId?: string): Promise<HallOption[]> {
  const searchParams = new URLSearchParams();

  if (venueId) {
    searchParams.set("venueId", venueId);
  }

  if (itemTypeId) {
    searchParams.set("itemTypeId", itemTypeId);
  }

  const queryString = searchParams.toString();
  const response = await fetch(`${API_BASE_URL}/api/halls${queryString ? `?${queryString}` : ""}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load halls.");
  }

  return response.json() as Promise<HallOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
