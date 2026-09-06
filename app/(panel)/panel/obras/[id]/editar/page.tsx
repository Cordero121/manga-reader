"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../../lib/supabase/client";

export default function EditarObraPage() {
  const params = useParams();
  const id = Number(params.id);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [tipo, setTipo] = useState("Manga");
  const [estado, setEstado] = useState("En publicación");
  const [generos, setGeneros] = useState("");
  const [sinopsis, setSinopsis] = useState("");

  const [portadaActual, setPortadaActual] = useState<string | null>(null);
  const [nuevaPortada, setNuevaPortada] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarObra = async () => {
      const { data, error } = await supabase
        .from("mangas")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("No se pudo cargar la obra.");
        setCargando(false);
        return;
      }

      setTitulo(data.titulo ?? "");
      setAutor(data.autor ?? "");
      setTipo(data.tipo ?? "Manga");
      setEstado(data.estado ?? "En publicación");
      setGeneros((data.generos ?? []).join(", "));
      setSinopsis(data.sinopsis ?? "");
      setPortadaActual(data.portada_url ?? null);

      setCargando(false);
    };

    if (!Number.isNaN(id)) {
      cargarObra();
    }
  }, [id]);

  const handlePortadaChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      setNuevaPortada(null);
      setPreview(null);
      return;
    }

    setNuevaPortada(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  const crearSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleGuardar = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setGuardando(true);
    setMensaje("");
    setError("");

    const slug = crearSlug(titulo);

    let portadaUrl = portadaActual;

    if (nuevaPortada) {
      const extension = nuevaPortada.name.split(".").pop();
      const nombreArchivo = `${slug}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("portadas")
        .upload(nombreArchivo, nuevaPortada);

      if (uploadError) {
        setGuardando(false);
        setError(
          `No se pudo subir la nueva portada: ${uploadError.message}`
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

    const { error: updateError } = await supabase
      .from("mangas")
      .update({
        titulo: titulo.trim(),
        slug,
        autor: autor.trim(),
        tipo,
        estado,
        generos: generosArray,
        sinopsis: sinopsis.trim() || null,
        portada_url: portadaUrl,
      })
      .eq("id", id);

    setGuardando(false);

    if (updateError) {
      setError(
        `No se pudo actualizar la obra: ${updateError.message}`
      );
      return;
    }

    setPortadaActual(portadaUrl);
    setNuevaPortada(null);
    setPreview(null);

    setMensaje("Obra actualizada correctamente.");
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <p className="text-zinc-400">
          Cargando obra...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Editar obra
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <form
            onSubmit={handleGuardar}
            className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Título
              </label>

              <input
                type="text"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Autor
              </label>

              <input
                type="text"
                value={autor}
                onChange={(event) => setAutor(event.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
                Nueva portada
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handlePortadaChange}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3"
              />
            </div>

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

            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>

          <aside>
            <p className="mb-3 text-sm text-zinc-400">
              Portada
            </p>

            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              {preview || portadaActual ? (
                <img
                  src={preview ?? portadaActual ?? ""}
                  alt="Portada"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  Sin portada
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}