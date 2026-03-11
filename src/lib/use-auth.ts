import { AuthContext } from "@/components/require-auth";
import { useContext } from "react";

export function useAuth(fresh: boolean = false) {
    const data =  useContext(AuthContext)
    if(fresh) {
        data.refetch();
    }
    return data;
}