import { ApiError, errorMap, type ApiErrorPayload } from "./api.errors.gen";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";

class HttpRequest<T> {
    private url: string;
    private baseOptions: RequestInit;

    constructor(url: string, options: RequestInit = {}) {
        const base = import.meta.env.BASE_URL;
        if (!url.startsWith("http")) {
            const normalizedBase = base.replace(/\/+$/, "");
            const normalizedPath = url.replace(/^\/+/, "");
            url = `${normalizedBase}/${normalizedPath}`;
        }
        this.url = url;
        this.baseOptions = options;
    }

    private async request(method: HttpMethod, body?: any): Promise<T> {
        // Merge headers
        const defaultHeaders = new Headers({
            "Content-Type": "application/json",
            "Accept": "application/json",
        });

        const headers = new Headers(defaultHeaders);

        if (this.baseOptions.headers) {
            const h = this.baseOptions.headers;
            if (h instanceof Headers) h.forEach((v, k) => headers.set(k, v));
            else if (Array.isArray(h)) h.forEach(([k, v]) => headers.set(k, v));
            else Object.entries(h).forEach(([k, v]) => headers.set(k, v as string));
        }

        // Handle body
        let finalBody: BodyInit | undefined = body;
        if (body && typeof body === "object" && !(body instanceof FormData) && method !== "GET" && method !== "HEAD") {
            finalBody = JSON.stringify(body);
        }

        const response = await fetch(this.url, {
            ...this.baseOptions,
            method,
            headers,
            body: finalBody,
            credentials: "include",
        });

        const data = await response.json().catch(() => ({}));
        console.log(data);

        if (!response.ok) {
            const err = data as ApiErrorPayload;
            const ErrorClass = errorMap[err?.error?.type as keyof typeof errorMap] ?? ApiError;
            throw new ErrorClass(err?.error?.message || "Unknown error", err?.error?.code);
        }

        return data as T;
    }

    get(): Promise<T> {
        return this.request("GET");
    }

    post(body?: any): Promise<T> {
        return this.request("POST", body);
    }

    put(body?: any): Promise<T> {
        return this.request("PUT", body);
    }

    patch(body?: any): Promise<T> {
        return this.request("PATCH", body);
    }

    delete(body?: any): Promise<T> {
        return this.request("DELETE", body);
    }
}

/** Factory function */
export function http<T>(url: string, options?: RequestInit): HttpRequest<T> {
    return new HttpRequest<T>(url, options);
}