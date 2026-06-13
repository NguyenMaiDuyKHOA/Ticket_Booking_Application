const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type ItemStatusOption = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function getItemStatuses(): Promise<ItemStatusOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/item-statuses`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Unable to load item statuses.");
  }

  return response.json() as Promise<ItemStatusOption[]>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
