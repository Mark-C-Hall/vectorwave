import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SsoCallback() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/").catch((err) => console.error("Redirect error:", err));
  });

  return null;
}
