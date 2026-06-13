const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type HallTypeOption = {
  id: string;
  name: string;
  slug: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getHallTypes(): Promise<HallTypeOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/hall-types`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load hall types.");
  }

  return response.json() as Promise<HallTypeOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
