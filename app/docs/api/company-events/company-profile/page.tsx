import { permanentRedirect } from "next/navigation";

export default function LegacyCompanyProfileRoute() {
  permanentRedirect("/docs/api/company/company-profile");
}
