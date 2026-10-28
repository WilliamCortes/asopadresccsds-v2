import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { safeAdminNext } from "@/lib/auth/admin";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Ingresar | Admin ASOPADRES CCSDS",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const safeNext = safeAdminNext(Array.isArray(next) ? next[0] : next);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">ASOPADRES</p>
            <p className="text-xs text-gray-400">Panel Admin</p>
          </div>
        </div>
        <LoginForm next={safeNext} />
      </div>
    </main>
  );
}
