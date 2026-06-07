"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Create } from "@mui/icons-material";
import { useRouter } from "@/i18n/navigation";

export default function DashboardButton() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setShow(!!data.success));
  }, []);

  if (!show) return null;

  return (
    <Button
      variant="outlined"
      startIcon={<Create />}
      onClick={() => router.push("/dashboard")}
      size="small"
      sx={{ borderRadius: 1.5, textTransform: "none" }}
    >
      创作中心
    </Button>
  );
}
