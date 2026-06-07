"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Login, Logout, Person } from "@mui/icons-material";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface AuthUser {
  userId: string;
  username: string;
}

export default function LoginButton() {
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.replace("/");
  };

  if (loading) return null;

  if (user) {
    return (
      <Button
        variant="outlined"
        startIcon={<Person />}
        endIcon={<Logout />}
        onClick={handleLogout}
        size="small"
        sx={{ borderRadius: 1.5, textTransform: "none" }}
      >
        {user.username}
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      startIcon={<Login />}
      onClick={() => router.push("/login")}
      size="small"
      sx={{ borderRadius: 1.5, textTransform: "none" }}
    >
      Sign in
    </Button>
  );
}
