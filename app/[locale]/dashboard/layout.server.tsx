import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import DashboardPage from "./page";

export default async function DashboardLayout() {
  const user = await getCurrentUser();
  if (!user) redirect({ href: "/login", locale: "zh" });
  return <DashboardPage />;
}
