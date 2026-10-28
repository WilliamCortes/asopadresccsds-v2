export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export function isAuthorizedAdmin(
  user: { email?: string | null; email_confirmed_at?: string | null } | null | undefined
): boolean {
  return !!user && !!user.email_confirmed_at && isAdminEmail(user.email);
}

// Solo rutas relativas dentro de /admin; evita open redirect.
export function safeAdminNext(next: string | null | undefined): string {
  if (
    typeof next === "string" &&
    (next === "/admin" || next.startsWith("/admin/")) &&
    !next.startsWith("//") &&
    !next.includes("\\") &&
    !next.startsWith("/admin/login")
  ) {
    return next;
  }
  return "/admin";
}
