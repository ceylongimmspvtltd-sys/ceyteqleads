import { AdminLeads } from "@/components/AdminLeads";
import { hasAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const configured = isAdminConfigured();
  const authenticated = configured ? await hasAdminSession() : false;
  return <AdminLeads configured={configured} authenticated={authenticated} />;
}
