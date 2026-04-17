import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    let extractedMessage: string | null = null;

    try {
      const parsed = JSON.parse(text);
      if (parsed?.message && typeof parsed.message === "string") {
        extractedMessage = parsed.message;
      }

      if (!extractedMessage && parsed?.errors?.formErrors?.[0]) {
        extractedMessage = String(parsed.errors.formErrors[0]);
      }

      if (!extractedMessage && parsed?.errors?.fieldErrors && typeof parsed.errors.fieldErrors === "object") {
        const firstFieldError = Object.values(parsed.errors.fieldErrors)
          .flat()
          .find((v) => typeof v === "string");
        if (firstFieldError) {
          extractedMessage = String(firstFieldError);
        }
      }
    } catch {
      // Not JSON or no known shape; fallback below.
    }

    if (extractedMessage) {
      throw new Error(extractedMessage);
    }

    throw new Error(text || `${res.status}: ${res.statusText}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
