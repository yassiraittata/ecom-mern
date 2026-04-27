import { useAuth } from "@clerk/react";
import { useAuthStore } from "./store";
import { useEffect } from "react";
import { getUser, syncUser } from "./api";

export function useBootstrapAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { setLoading, setUser, clearAuth, setError } = useAuthStore();

  useEffect(() => {
    async function run() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        clearAuth();
        return;
      }

      try {
        setLoading();

        await syncUser();
        const user = await getUser();
        setUser(user?.user);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load user data. Please try again.";
        setError(errorMessage);
      }
    }
    void run();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
    setLoading,
    setUser,
    clearAuth,
    setError,
  ]);
}
