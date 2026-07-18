import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

// Locale-aware navigation primitives: <Link>, redirect, usePathname, useRouter, getPathname.
// They keep the current locale prefix automatically, so callers use bare paths ("/pricing").
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
