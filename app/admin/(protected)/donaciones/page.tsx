import { DollarSign, Filter } from "lucide-react";

export default function DonacionesAdmin() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Donaciones</h1>
        <p className="text-gray-500 text-sm mt-1">
          Registro de aportes y donaciones recibidos
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total COP", value: "$0", sub: "Vía Wompi / Bancolombia" },
          { label: "Total EUR", value: "€0", sub: "Vía PayPal (Europa)" },
          { label: "Total USD", value: "$0", sub: "Vía PayPal (Internacional)" },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-brand-gold" />
              <p className="text-sm font-medium text-gray-600">{label}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">Historial de donaciones</p>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </button>
        </div>
        <div className="px-6 py-12 text-center">
          <DollarSign className="h-8 w-8 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">
            Sin donaciones registradas aún
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Las donaciones vía Wompi y PayPal aparecerán aquí automáticamente
          </p>
        </div>
      </div>

      {/* Setup reminder */}
      <div className="mt-6 bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 text-sm">
        <p className="font-medium text-brand-blue mb-1">⚙️ Configuración pendiente</p>
        <ul className="text-gray-600 space-y-1 text-xs">
          <li>• Conecta tu cuenta Wompi en <code>.env.local</code> (WOMPI_PRIVATE_KEY)</li>
          <li>• Conecta tu cuenta PayPal en <code>.env.local</code> (PAYPAL_CLIENT_SECRET)</li>
          <li>• Los webhooks están listos en <code>/api/webhooks/wompi</code> y <code>/api/webhooks/paypal</code></li>
        </ul>
      </div>
    </div>
  );
}
