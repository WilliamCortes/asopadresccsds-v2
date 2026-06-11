import { Users, DollarSign, FileText, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Placeholder stats — will connect to Supabase
const STATS = [
  {
    label: "Afiliados totales",
    value: "—",
    sub: "Registrados en el sistema",
    icon: Users,
    color: "text-brand-blue",
    bg: "bg-brand-blue/8",
    href: "/admin/afiliados",
  },
  {
    label: "Donaciones (mes)",
    value: "—",
    sub: "COP + EUR + USD",
    icon: DollarSign,
    color: "text-brand-gold",
    bg: "bg-brand-gold/8",
    href: "/admin/donaciones",
  },
  {
    label: "Comunicados publicados",
    value: "2",
    sub: "Total publicados",
    icon: FileText,
    color: "text-green-600",
    bg: "bg-green-50",
    href: "/admin/comunicados",
  },
  {
    label: "Meta cancha cubierta",
    value: "0%",
    sub: "De $50.000.000 COP",
    icon: TrendingUp,
    color: "text-brand-red",
    bg: "bg-brand-red/8",
    href: "/admin/proyecto",
  },
];

const QUICK_ACTIONS = [
  { label: "Nuevo comunicado", href: "/admin/comunicados/nuevo", primary: true },
  { label: "Subir imagen", href: "/admin/imagenes", primary: false },
  { label: "Actualizar progreso cancha", href: "/admin/proyecto", primary: false },
  { label: "Ver afiliados", href: "/admin/afiliados", primary: false },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Panel de administración — ASOPADRES CCSDS
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-blue/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-brand-blue transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(({ label, href, primary }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  primary
                    ? "bg-brand-blue text-white hover:bg-brand-blue-dark"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Legal compliance reminder */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Recordatorios de cumplimiento
          </h2>
          <ul className="space-y-3">
            {[
              "Renovar Certificado CCF antes de vencer (cada año)",
              "Publicar informe de gestión semestral",
              "Verificar que las autorizaciones de menores estén al día",
              "Actualizar RUT si cambia la representación legal",
              "Convocar Asamblea Ordinaria según estatutos (al menos una vez al año)",
            ].map((reminder) => (
              <li key={reminder} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 flex-shrink-0" />
                {reminder}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
