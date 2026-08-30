"use client";

import { ChangeEvent, useState } from "react";

export default function PanelPage() {
  const [preview, setPreview] = useState<string | null>(null);

  const handlePortadaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      setPreview(null);
      return;
    }

    const urlTemporal = URL.createObjectURL(archivo);
    setPreview(urlTemporal);
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Nueva obra
          </h1>

          <p className="mt-3 text-zinc-400">
            Completá los datos principales y seleccioná una portada.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <form className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Título
              </label>

              <input
                type="text"
                placeholder="Ej: Manga de prueba"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Autor
              </label>

              <input
                type="text"
                placeholder="Nombre del autor"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tipo
                </label>

                <select className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none">
                  <option>Manga</option>
                  <option>Comic</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Estado
                </label>

                <select className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none">
                  <option>En publicación</option>
                  <option>Finalizado</option>
                  <option>Próximamente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Géneros
              </label>

              <input
                type="text"
                placeholder="Ej: Acción, Aventura, Fantasía"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sinopsis
              </label>

              <textarea
                rows={5}
                placeholder="Descripción de la obra..."
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Portada
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handlePortadaChange}
                className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-white hover:file:bg-zinc-700"
              />
            </div>

            <button
              type="button"
              className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200"
            >
              Crear obra
            </button>
          </form>

          <aside>
            <p className="mb-3 text-sm font-medium text-zinc-400">
              Vista previa de portada
            </p>

            <div className="flex aspect-[2/3] items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa de portada"
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="px-6 text-center text-sm text-zinc-600">
                  Seleccioná una imagen para verla acá.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}