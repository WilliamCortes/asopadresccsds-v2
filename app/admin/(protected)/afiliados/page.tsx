import { Users, Download } from "lucide-react";

export default function AfiliadosAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Afiliados</h1>
          <p className="text-gray-500 text-sm mt-1">
            Registro de familias afiliadas a ASOPADRES CCSDS
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-600">0 afiliados registrados</p>
        </div>
        <div className="px-6 py-16 text-center">
          <Users className="h-8 w-8 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">
            Sin afiliados registrados aún
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Los formularios de afiliación del sitio enviarán datos aquí
          </p>
        </div>
      </div>

      <div className="mt-6 bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 text-sm">
        <p className="font-medium text-brand-blue mb-1">ℹ️ Datos personales — Ley 1581/2012</p>
        <p className="text-xs text-gray-600">
          Los datos de afiliados están protegidos por la Ley 1581 de 2012 y el Decreto 1377 de 2013.
          Solo personal autorizado de la Junta Directiva debe acceder a este panel.
          Exporta datos únicamente cuando sea necesario para la gestión institucional.
        </p>
      </div>
    </div>
  );
}
