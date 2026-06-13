import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/toast";
import { useRouter } from "@/i18n/navigation";
import { getAuthSession } from "@/lib/auth-api";

function isAdminRole(role: unknown) {
  return role === "Admin" || role === 2;
}

export function useAdminAccess() {
  const accountT = useTranslations("AccountMenu");
  const router = useRouter();
  const { showToast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = getAuthSession();

    if (session.status === "expired") {
      showToast({ message: accountT("sessionExpired"), type: "error" });
      router.push("/login");
      setIsReady(true);
      return;
    }

    setIsAdmin(session.status === "authenticated" && isAdminRole(session.user.role));
    setIsReady(true);
  }, [accountT, router, showToast]);

  return { isAdmin, isReady };
}
