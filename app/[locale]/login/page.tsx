"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  Google,
  GitHub,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import SHA256 from "crypto-js/sha256";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const switchMode = () => {
    resetForm();
    setMode(mode === "login" ? "register" : "login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const isLogin = mode === "login";
    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      // 客户端先用 SHA-256 哈希，避免明文传输
      const hashedPassword = SHA256(password).toString();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin
          ? { username, password: hashedPassword }
          : { username, password: hashedPassword, confirmPassword: SHA256(confirmPassword).toString() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
      } else if (isLogin) {
        setSuccess(data.message);
        setTimeout(() => router.push("/"), 1000);
      } else {
        setSuccess(data.message);
        setTimeout(() => switchMode(), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 200px)",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Title */}
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 0.5 }}>
            {mode === "login" ? t("welcomeBack") : t("createAccount")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            {mode === "login" ? t("signInToContinue") : t("registerToContinue")}
          </Typography>

          {/* Username */}
          <TextField
            fullWidth
            label={t("username")}
            variant="outlined"
            size="medium"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label={t("password")}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            size="medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Confirm Password — register mode only */}
          {mode === "register" && (
            <TextField
              fullWidth
              label={t("confirmPassword")}
              type="password"
              variant="outlined"
              size="medium"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {/* Forgot password — login mode only */}
          {mode === "login" && (
            <Box sx={{ textAlign: "right", mb: 2.5 }}>
              <Typography
                variant="body2"
                component="a"
                href="#"
                sx={{ color: "primary.main", textDecoration: "none", cursor: "pointer" }}
              >
                {t("forgotPassword")}
              </Typography>
            </Box>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mb: mode === "register" ? 2.5 : 2.5, borderRadius: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : mode === "login" ? (
              t("signIn")
            ) : (
              t("signUp")
            )}
          </Button>

          {/* Divider — login mode only */}
          {mode === "login" && (
            <>
              <Divider sx={{ mb: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {t("orContinueWith")}
                </Typography>
              </Divider>

              {/* Social buttons */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Google />}
                  sx={{ borderRadius: 1.5, textTransform: "none" }}
                >
                  {t("google")}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GitHub />}
                  sx={{ borderRadius: 1.5, textTransform: "none" }}
                >
                  {t("github")}
                </Button>
              </Box>
            </>
          )}

          {/* Switch mode link */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 3 }}>
            {mode === "login" ? t("noAccount") : t("hasAccount")}{" "}
            <Typography
              variant="body2"
              component="span"
              onClick={switchMode}
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600, cursor: "pointer" }}
            >
              {mode === "login" ? t("signUp") : t("signIn")}
            </Typography>
          </Typography>
        </CardContent>
      </Card>

      {/* Error snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)} variant="filled">
          {error}
        </Alert>
      </Snackbar>

      {/* Success snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
