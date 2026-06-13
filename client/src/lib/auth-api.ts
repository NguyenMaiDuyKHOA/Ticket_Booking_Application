const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5217";

export type AuthResponse = {
  accessToken: string;
  expiresAt: string;
  fullName: string;
  phone: string;
  role: "Admin" | "User" | "Agency" | 1 | 2 | 3 | string;
  userId: string;
};

export type StoredAuthUser = Omit<AuthResponse, "accessToken">;

export type AuthSession =
  | {
      accessToken: string;
      status: "authenticated";
      user: StoredAuthUser;
    }
  | {
      accessToken: null;
      status: "anonymous" | "expired";
      user: null;
    };

type ProblemDetails = {
  detail?: string;
  title?: string;
};

export async function registerWithPhone(request: {
  fullName: string;
  password: string;
  phone: string;
}) {
  return sendAuthRequest("/api/auth/register", {
    fullName: request.fullName,
    phone: request.phone,
    password: request.password,
  });
}

export async function loginWithPhone(request: {
  password: string;
  phone: string;
}) {
  return sendAuthRequest("/api/auth/login", {
    phone: request.phone,
    password: request.password,
  });
}

export function storeAuthSession(auth: AuthResponse) {
  localStorage.setItem("accessToken", auth.accessToken);
  localStorage.setItem(
    "ticketBookUser",
    JSON.stringify({
      expiresAt: auth.expiresAt,
      fullName: auth.fullName,
      phone: auth.phone,
      role: auth.role,
      userId: auth.userId,
    }),
  );
}

export function clearAuthSession() {
  if (!canUseBrowserStorage()) {
    return;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("ticketBookUser");
}

export function getStoredAuthUser(): StoredAuthUser | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const rawUser = localStorage.getItem("ticketBookUser");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as StoredAuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getStoredAccessToken(): string | null {
  const session = getAuthSession();

  return session.status === "authenticated" ? session.accessToken : null;
}

export function getAuthSession(): AuthSession {
  if (!canUseBrowserStorage()) {
    return { accessToken: null, status: "anonymous", user: null };
  }

  const rawUser = localStorage.getItem("ticketBookUser");
  const accessToken = localStorage.getItem("accessToken")
    ?? localStorage.getItem("token")
    ?? localStorage.getItem("authToken");

  if (!rawUser && !accessToken) {
    return { accessToken: null, status: "anonymous", user: null };
  }

  let user: StoredAuthUser | null = null;

  try {
    user = rawUser ? (JSON.parse(rawUser) as StoredAuthUser) : null;
  } catch {
    clearAuthSession();
    return { accessToken: null, status: "expired", user: null };
  }

  if (!user || !accessToken || isExpired(user.expiresAt)) {
    clearAuthSession();
    return { accessToken: null, status: "expired", user: null };
  }

  return { accessToken, status: "authenticated", user };
}

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

function isExpired(expiresAt: string) {
  const expiresAtTime = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtTime)) {
    return true;
  }

  // Expire slightly early so protected requests do not race against server-side JWT lifetime validation.
  return expiresAtTime <= Date.now() + 30_000;
}

async function sendAuthRequest(path: string, body: object): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const problem = await readProblemDetails(response);
    throw new Error(problem.detail || problem.title || "Authentication request failed.");
  }

  return response.json() as Promise<AuthResponse>;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
