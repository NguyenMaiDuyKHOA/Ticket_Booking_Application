const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type CityOption = {
  id: string;
  name: string;
  slug: string;
};

export async function getCities(): Promise<CityOption[]> {
  const response = await fetch(`${API_BASE_URL}/api/cities`, {
    cache: "no-store",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Unable to load cities.");
  }

  return response.json() as Promise<CityOption[]>;
}
