"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import { usePathname } from "next/navigation";

export default function SessionGuard() {
  const { enqueueSnackbar } = useSnackbar();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const deviceId = localStorage.getItem("incrix_device_id");
      // If no device ID, we can't check revocation, so we skip.
      // Or we could generate one? But AccountSecurity generates it.
      // If we are here, we are likely logged in.
      // If we don't have a device ID, we might want to generate one silently?
      // For now, let's only check if it exists.
      if (!deviceId) return;

      try {
        const response = await fetch("/api/user/active-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });

        if (response.status === 403) {
          const data = await response.json();
          if (data.action === "logout") {
            enqueueSnackbar("Session revoked. Signing out...", {
              variant: "error",
            });
            localStorage.removeItem("incrix_device_id");
            await signOut({ callbackUrl: "/signIn" });
          }
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    };

    checkSession();
  }, [pathname, enqueueSnackbar]);

  return null;
}
