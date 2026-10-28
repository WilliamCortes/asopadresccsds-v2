"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function ProyectoAdmin() {
  const [goal, setGoal] = useState(1000000000);
  const [raised, setRaised] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  const formatCOP = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(n);

  const handleSave = async () => {
    setSaving(true);
    // TODO: conectar con Supabase
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Proyecto Cancha Cubierta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Actualiza el progreso de financiación del proyecto
        </p>
      </div>

      <div className="max-w-xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          {/* Visual progress */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-4xl font-bold text-brand-blue">{percentage}%</p>
                <p className="text-sm text-gray-500">de la meta alcanzado</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Meta</p>
                <p className="font-semibold text-gray-900">{formatCOP(goal)}</p>
              </div>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-blue rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Recaudado: <span className="font-medium text-gray-700">{formatCOP(raised)}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta total (COP)
              </label>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto recaudado (COP)
              </label>
              <input
                type="number"
                value={raised}
                onChange={(e) => setRaised(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <p className="text-xs text-gray-400 mt-1">
                Incluye donaciones Wompi + PayPal + aportes manuales
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">📋 Nota</p>
          <p>
            Este panel actualiza directamente el porcentaje visible en el sitio web.
            Conecta tu cuenta de Supabase en <code>.env.local</code> para que los
            cambios se guarden automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
