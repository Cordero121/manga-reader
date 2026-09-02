"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "../../../lib/supabase/client";

export default function PanelPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [portada, setPortada] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [tipo, setTipo] = useState("Manga");
  const [estado, setEstado] = useState("En publicación");
  const [generos, setGeneros] = useState("");
  const [sinopsis, setSinopsis] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const crearSlug = (texto: string) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
  const handlePortadaChange = (event: ChangeEvent<HTMLInputElement>) => {
  const archivo = event.target.files?.[0];

  if (!archivo) {
    setPortada(null);
    setPreview(null);
    return;
  }

  setPortada(archivo);

  const urlTemporal = URL.createObjectURL(archivo);
  setPreview(urlTemporal);
};

  const handleCrearObra = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setMensaje("");
  setError("");

  if (!titulo.trim() || !autor.trim()) {
    setError("Completá al menos el título y el autor.");
    return;
  }

  setGuardando(true);

  const slug = crearSlug(titulo);

let portadaUrl: string | null = null;

if (portada) {
  const extension = portada.name.split(".").pop();
  const nombreArchivo = `${slug}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("portadas")
    .upload(nombreArchivo, portada);

  if (uploadError) {
    setGuardando(false);
    setError(
      `No se pudo subir la portada: ${uploadError.message}`
    );
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("portadas")
    .getPublicUrl(nombreArchivo);

  portadaUrl = publicUrlData.publicUrl;
}

  const generosArray = generos
    .split(",")
    .map((genero) => genero.trim())
    .filter(Boolean);

  const { error: supabaseError } = await supabase
    .from("mangas")
    .insert({
      titulo: titulo.trim(),
      slug,
      autor: autor.trim(),
      tipo,
      estado,
      sinopsis: sinopsis.trim() || null,
      generos: generosArray.length > 0 ? generosArray : null,
      portada_url: portadaUrl,
    });

  setGuardando(false);

  if (supabaseError) {
    console.error(supabaseError);

    if (supabaseError.code === "23505") {
      setError(
        "Ya existe una obra con ese slug. Probá con otro título."
      );
      return;
    }

    setError(`No se pudo crear la obra: ${supabaseError.message}`);
    return;
  }

  setMensaje(`"${titulo}" fue creada correctamente.`);

  setTitulo("");
  setAutor("");
  setTipo("Manga");
  setEstado("En publicación");
  setGeneros("");
  setSinopsis("");
  setPreview(null);
  setPortada(null)
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
            <form
              onSubmit={handleCrearObra}
              className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div>
              <label className="mb-2 block text-sm font-medium">
                Título
              </label>

              <input
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Autor
              </label>

              <input
                type="text"
                value={autor}
                onChange={(event) => setAutor(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tipo
                </label>

                <select
                  value={tipo}
                  onChange={(event) => setTipo(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
                >
                  <option value="Manga">Manga</option>
                  <option value="Comic">Comic</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Estado
                </label>

                <select
                  value={estado}
                  onChange={(event) => setEstado(event.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
                >
                  <option value="En publicación">En publicación</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Próximamente">Próximamente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Géneros
              </label>

              <input
                type="text"
                value={generos}
                onChange={(event) => setGeneros(event.target.value)}
                placeholder="Acción, Aventura, Fantasía"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sinopsis
              </label>

              <textarea
                value={sinopsis}
                onChange={(event) => setSinopsis(event.target.value)}
                rows={5}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
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
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              {guardando ? "Guardando..." : "Crear obra"}
            </button>

            {mensaje && (
              <p className="text-sm text-green-400">
                {mensaje}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

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