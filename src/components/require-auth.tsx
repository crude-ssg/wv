import { getAuthenticatedUser } from "@/lib/api";
import type { User } from "@/lib/api.types.gen";
import { Loader2Icon } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router"

interface AuthContextValues {
    user: User,
    refetch: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValues>({ user: {} as User, refetch: async () => { } })

export default function RequireAuth() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        fetch()
    }, [])

    async function fetch() {
        setLoading(true)
        try {
            const user = await getAuthenticatedUser();
            setUser(user)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-card h-screen w-screen flex items-center justify-center">
                <Loader2Icon className="animate-spin" size={20} />
            </div>
        )
    }

    if (!user) {
        window.location.replace(`${window.location.protocol}//${window.location.host}/generator/web/login.php?next=/video-gen`);
        return;
    }


    return (
        <AuthContext.Provider value={{ user, refetch: fetch }}>
            <Outlet />
        </AuthContext.Provider>
    )
}