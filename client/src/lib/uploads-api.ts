import { clearAuthSession, getStoredAccessToken } from "@/lib/auth-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type UploadImageResponse = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
};

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function uploadImage(file: File, folder?: string): Promise<UploadImageResponse> {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("Your login session has expired. Please log in again.");
  }

  const formData = new FormData();
  formData.append("file", file);

  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(`${API_BASE_URL}/api/uploads/images`, {
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
      throw new Error("Your login session has expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("Your account does not have permission to upload images.");
    }

    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Image upload failed.");
  }

  return response.json() as Promise<UploadImageResponse>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
