const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type GenreOption = {
  description?: string | null;
  id: string;
  itemTypeId: string;
  itemTypeSlug: string;
  name: string;
  slug: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getGenres(): Promise<GenreOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/genres`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load genres.");
  }

  return response.json() as Promise<GenreOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
