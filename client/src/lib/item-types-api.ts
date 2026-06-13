const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type ItemTypeOption = {
  description?: string | null;
  id: string;
  name: string;
  slug: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getItemTypes(): Promise<ItemTypeOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/item-types`);

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load item types.");
  }

  return response.json() as Promise<ItemTypeOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
