const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type VenueOption = {
  address: string;
  cityId: string;
  cityName: string;
  id: string;
  name: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getVenues(): Promise<VenueOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/venues`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load venues.");
  }

  return response.json() as Promise<VenueOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
