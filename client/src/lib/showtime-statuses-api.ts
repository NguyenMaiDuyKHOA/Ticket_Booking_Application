const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type ShowtimeStatusOption = {
  description?: string | null;
  id: string;
  name: string;
  slug: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getShowtimeStatuses(): Promise<ShowtimeStatusOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/showtime-statuses`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load showtime statuses.");
  }

  return response.json() as Promise<ShowtimeStatusOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
