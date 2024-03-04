import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function useAuthRedirect(redirectPath = "/auth/login") {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      router
        .replace(redirectPath)
        .catch((err) => console.error("Redirect error:", err));
    }
  }, [isSignedIn, isLoaded, router, redirectPath]);
}
