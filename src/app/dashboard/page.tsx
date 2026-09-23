import { redirect } from "next/navigation";
import { getUserOrganizations } from "@/actions/organizations";
import { isSuperAdmin } from "@/actions/admin";

export default async function DashboardRoot() {
  try {
    const organizations = (await getUserOrganizations()) as any[];

    if (organizations && organizations.length > 0) {
      redirect(`/dashboard/${organizations[0].slug}`);
    }

    redirect("/dashboard/default-org");
  } catch (error: any) {
    if ((error?.message && error.message === "NEXT_REDIRECT") || (error?.digest && error.digest.startsWith("NEXT_REDIRECT"))) {
      throw error;
    }
    redirect("/dashboard/default-org");
  }
}
