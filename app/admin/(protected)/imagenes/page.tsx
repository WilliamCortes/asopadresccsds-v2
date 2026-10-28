"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Edit } from "lucide-react";

const CURRENT_IMAGES = [
  { src: "/images/ninos_gradas.jpg", alt_es: "Estudiantes del CCSDS", section: "hero" },
  { src: "/images/proyecto_cancha.jpg", alt_es: "Proyecto cancha cubierta", section: "project" },
  { src: "/images/proyecto_cancha_2.jpg", alt_es: "Proyecto cancha cubierta 2", section: "project" },
  { src: "/images/danzas_cachipay.jpg", alt_es: "Danzas Cachipay", section: "gallery" },
  { src: "/images/evento_teatro.jpg", alt_es: "Evento de teatro", section: "gallery" },
  { src: "/images/personas_bailando.jpg", alt_es: "Presentación artística", section: "gallery" },
  { src: "/images/papa_hijo.jpg", alt_es: "Padre e hijo", section: "gallery" },
  { src: "/images/volando_cometa.jpg", alt_es: "Niño volando cometa", section: "gallery" },
];

const SECTIONS = ["todos", "hero", "project", "gallery", "board", "general"];

export default function ImagenesAdmin() {
  const [filter, setFilter] = useState("todos");

  const filtered = filter === "todos"
    ? CURRENT_IMAGES
    : CURRENT_IMAGES.filter((i) => i.section === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imágenes</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona las imágenes del sitio web
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-brand-blue-dark transition-colors">
          <Upload className="h-4 w-4" />
          Subir imagen
        </button>
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === s
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(({ src, alt_es, section }) => (
          <div
            key={src}
            className="group relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200"
          >
            <div className="relative aspect-square">
              <Image
                src={src}
                alt={alt_es}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-50">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {/* Info */}
            <div className="p-2.5">
              <p className="text-xs font-medium text-gray-700 truncate">{alt_es}</p>
              <span className="text-xs text-gray-400 capitalize">{section}</span>
            </div>
          </div>
        ))}

        {/* Upload placeholder */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center text-gray-400 hover:border-brand-blue/40 hover:text-brand-blue/60 transition-colors cursor-pointer">
          <Upload className="h-6 w-6 mb-2" />
          <p className="text-xs font-medium">Subir nueva</p>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">⚠️ Menores de edad (Ley 1098/2006 Art. 12)</p>
        <p className="text-xs">
          Las imágenes que contengan estudiantes menores de edad solo pueden publicarse
          con autorización firmada del padre o acudiente. Gestiona autorizaciones en
          Supabase Storage antes de subir este tipo de imágenes.
        </p>
      </div>
    </div>
  );
}
