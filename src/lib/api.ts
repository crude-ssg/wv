
/** Fetch like  wrapper that sends with proper credentials */
export async function http(url: string, options: RequestInit = {}) {
    const base = import.meta.env.BASE_URL;
    if (!url.startsWith("http")) {
        const normalizedBase = base.replace(/\/+$/, ""); // strip trailing slashes
        const normalizedPath = url.replace(/^\/+/, ""); // strip leading slashes
        url = `${normalizedBase}/${normalizedPath}`;
    }

    // Default headers
    const defaultHeaders = new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json",
    });

    // Merge with options.headers
    const mergedHeaders = new Headers(defaultHeaders);

    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => mergedHeaders.set(key, value));
        } else if (Array.isArray(options.headers)) {
            options.headers.forEach(([key, value]) => mergedHeaders.set(key, value));
        } else {
            Object.entries(options.headers).forEach(([key, value]) => mergedHeaders.set(key, value as string));
        }
    }

    const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers: mergedHeaders,
    });

    return response;
}

export enum MembershipType {
    FREE,
    PREMIUM_LIGH,
    PREMIUM_PLUS
}

export interface User {
    id: number,
    username: string,
    email: string,
    premium: MembershipType,
    tokens: number,
    admin: number,
    created_at: string,
    updated_at: string,
}

const DUMMY_USER: User = {
    id: 1,
    username: "DEV_DUMMY",
    email: "example@email.com",
    premium: MembershipType.PREMIUM_PLUS,
    tokens: 2450,
    created_at: "",
    updated_at: "",
    admin: 1.
}

export async function getAuthenticatedUser(): Promise<User | null> {
    if (import.meta.env.PROD) {
        const response = await http("/api/auth")
        const data = await response.json();
        if (response.status == 200) {
            return data.user as User
        }
        return null
    }

    return DUMMY_USER;
}