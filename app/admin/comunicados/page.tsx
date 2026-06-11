import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Calendar } from "lucide-react";

const PLACEHOLDER_POSTS = [
  {
    id: "1",
    slug: "asamblea-general-2025",
    title_es: "Asamblea General — Elección Junta Directiva 2025",
    category: "asambleas",
    published: true,
    created_at: "2025-04-01",
  },
  {
    id: "2",
    slug: "proyecto-cancha-cubierta",
    title_es: "Lanzamiento: Proyecto Cancha Cubierta",
    category: "proyectos",
    published: true,
    created_at: "2025-05-10",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  proyectos: "Proyectos",
  asambleas: "Asambleas",
  actividades: "Actividades",
  logros: "Logros",
};

export default function ComunicadosAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comunicados</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona las noticias y comunicados del sitio
          </p>
        </div>
        <Link
          href="/admin/comunicados/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo comunicado
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-600">
            {PLACEHOLDER_POSTS.length} comunicados
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {PLACEHOLDER_POSTS.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium bg-brand-blue/8 text-brand-blue px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[post.category]}
                  </span>
                  {post.published ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <Eye className="h-3 w-3" /> Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <EyeOff className="h-3 w-3" /> Borrador
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm text-gray-900 truncate">
                  {post.title_es}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.created_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/admin/comunicados/${post.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
