"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
interface PaginaCapitulo {
  id: number;
  numero: number;
  imagen_url: string;
}
interface PaginaNueva {
  archivo: File;
  preview: string;
}
export default function EditarCapituloPage() {
  const params = useParams();
  const router = useRouter();
  const mangaId = Number(params.id);
  const capituloId = Number(params.capituloId);

  const [numero, setNumero] = useState("");
  const [titulo, setTitulo] = useState("");
  const [paginas, setPaginas] = useState<PaginaCapitulo[]>([]);
  const [paginasNuevas, setPaginasNuevas] = useState<PaginaNueva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCapitulo = async () => {
      const { data, error } = await supabase
        .from("capitulos")
        .select(`
                id,
                manga_id,
                numero,
                titulo,
                paginas (
                id,
                numero,
                imagen_url
                )
            `)
        .eq("id", capituloId)
        .eq("manga_id", mangaId)
        .single();

      if (error || !data) {
        setError("No se pudo cargar el capítulo.");
        setCargando(false);
        return;
      }

      setNumero(String(data.numero));
      setTitulo(data.titulo ?? "");
      setPaginas( [...(data.paginas ?? [])].sort( (a, b) => a.numero - b.numero));
  
      setCargando(false);
    };

    if (
      !Number.isNaN(mangaId) &&
      !Number.isNaN(capituloId)
    ) {
      cargarCapitulo();
    }
  }, [mangaId, capituloId]);



const moverPaginaArriba = (index: number) => {
  if (index === 0) return;

  setPaginas((prev) => {
    const nuevasPaginas = [...prev];

    [nuevasPaginas[index - 1], nuevasPaginas[index]] = [
      nuevasPaginas[index],
      nuevasPaginas[index - 1],
    ];

    return nuevasPaginas;
  });
};

const moverPaginaAbajo = (index: number) => {
  setPaginas((prev) => {
    if (index === prev.length - 1) {
      return prev;
    }

    const nuevasPaginas = [...prev];

    [nuevasPaginas[index], nuevasPaginas[index + 1]] = [
      nuevasPaginas[index + 1],
      nuevasPaginas[index],
    ];

    return nuevasPaginas;
  });
};
const eliminarPagina = async (paginaId: number) => {
  const paginaAEliminar = paginas.find(
    (pagina) => pagina.id === paginaId
  );

  if (!paginaAEliminar) {
    return;
  }

  setGuardando(true);
  setMensaje("");
  setError("");

  const { error: deleteError } = await supabase
    .from("paginas")
    .delete()
    .eq("id", paginaId);

  if (deleteError) {
    setGuardando(false);
    setError(
      `No se pudo eliminar la página: ${deleteError.message}`
    );
    return;
  }

  setPaginas((prev) =>
    prev.filter((pagina) => pagina.id !== paginaId)
  );

  setGuardando(false);
  setMensaje("Página eliminada correctamente.");
};

const handlePaginasNuevasChange = (
  event: ChangeEvent<HTMLInputElement>
) => {
  const archivos = Array.from(event.target.files ?? []);

  const nuevas = archivos.map((archivo) => ({
    archivo,
    preview: URL.createObjectURL(archivo),
  }));

  setPaginasNuevas(nuevas);
};
const handleAgregarPaginas = async () => {
  if (paginasNuevas.length === 0) {
    return;
  }

  setGuardando(true);
  setMensaje("");
  setError("");

  const { data: manga, error: mangaError } = await supabase
    .from("mangas")
    .select("slug")
    .eq("id", mangaId)
    .single();

  if (mangaError || !manga) {
    setGuardando(false);
    setError("No se pudo identificar la obra.");
    return;
  }

  const numeroInicial = paginas.length + 1;

  for (let index = 0; index < paginasNuevas.length; index++) {
    const paginaNueva = paginasNuevas[index];

    const numeroPagina = numeroInicial + index;
    const extension = paginaNueva.archivo.name.split(".").pop();

    const nombreArchivo =
      `${manga.slug}/capitulo-${numero}/` +
      `${String(numeroPagina).padStart(3, "0")}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("paginas")
      .upload(nombreArchivo, paginaNueva.archivo);

    if (uploadError) {
      setGuardando(false);
      setError(
        `No se pudo subir la página ${numeroPagina}: ${uploadError.message}`
      );
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("paginas")
      .getPublicUrl(nombreArchivo);

    const { data: paginaCreada, error: paginaError } = await supabase
      .from("paginas")
      .insert({
        capitulo_id: capituloId,
        numero: numeroPagina,
        imagen_url: publicUrlData.publicUrl,
      })
      .select("id, numero, imagen_url")
      .single();

    if (paginaError || !paginaCreada) {
      setGuardando(false);
      setError(
        `No se pudo registrar la página ${numeroPagina}: ${
          paginaError?.message ?? "Error desconocido"
        }`
      );
      return;
    }

    setPaginas((prev) => [...prev, paginaCreada]);
  }

  setPaginasNuevas([]);
  setGuardando(false);
  setMensaje("Páginas agregadas correctamente.");
};
const handleGuardarOrden = async () => {
  setGuardando(true);
  setMensaje("");
  setError("");

  for (let index = 0; index < paginas.length; index++) {
    const pagina = paginas[index];

    const { error: updateError } = await supabase
      .from("paginas")
      .update({
        numero: index + 1,
      })
      .eq("id", pagina.id);

    if (updateError) {
      setGuardando(false);
      setError(
        `No se pudo actualizar la página ${index + 1}: ${updateError.message}`
      );
      return;
    }
  }

  setPaginas((prev) =>
    prev.map((pagina, index) => ({
      ...pagina,
      numero: index + 1,
    }))
  );

  setGuardando(false);
  setMensaje("Orden de páginas actualizado correctamente.");
};


  const handleGuardar = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    const numeroConvertido = Number(numero);

    if (
      Number.isNaN(numeroConvertido) ||
      numeroConvertido < 1 ||
      !titulo.trim()
    ) {
      setError("Completá correctamente número y título.");
      return;
    }

    setGuardando(true);

    const { error: updateError } = await supabase
      .from("capitulos")
      .update({
        numero: numeroConvertido,
        titulo: titulo.trim(),
      })
      .eq("id", capituloId)
      .eq("manga_id", mangaId);

    setGuardando(false);

    if (updateError) {
      setError(
        `No se pudo actualizar el capítulo: ${updateError.message}`
      );
      return;
    }

    setMensaje("Capítulo actualizado correctamente.");
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <p className="text-zinc-400">
          Cargando capítulo...
        </p>
      </main>
    );
  }


const handleEliminarCapitulo = async () => {
  const confirmado = window.confirm(
    "¿Seguro que querés eliminar este capítulo? Esta acción no se puede deshacer."
  );

  if (!confirmado) {
    return;
  }

  setGuardando(true);
  setMensaje("");
  setError("");

  const { error: deleteError } = await supabase
    .from("capitulos")
    .delete()
    .eq("id", capituloId)
    .eq("manga_id", mangaId);

  setGuardando(false);

  if (deleteError) {
    setError(
      `No se pudo eliminar el capítulo: ${deleteError.message}`
    );
    return;
  }

  router.push(`/panel/obras/${mangaId}/capitulos`);
  router.refresh();
};

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Editar capítulo
          </h1>
        </div>

        <form
          onSubmit={handleGuardar}
          className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Número
            </label>

            <input
              type="number"
              min="1"
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Título
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
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
          
          <button
  type="button"
  onClick={handleEliminarCapitulo}
  disabled={guardando}
  className="rounded-lg border border-red-900 px-5 py-3 font-medium text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
>
  Eliminar capítulo
</button>

<div className="mt-10">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-xl font-semibold">
      Páginas actuales
    </h2>

    <p className="text-sm text-zinc-500">
      {paginas.length} páginas
    </p>
  </div>

  {paginas.length === 0 ? (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-zinc-400">
        Este capítulo no tiene páginas.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
     {paginas.map((pagina, index) => (
        <div key={pagina.id}>
          <div className="mb-2 flex items-center justify-between gap-2">
  <p className="text-sm text-zinc-500">
    Página {index + 1}
  </p>

  <div className="flex gap-1">
    <button
      type="button"
      onClick={() => moverPaginaArriba(index)}
      disabled={index === 0}
      className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
    >
      ↑
    </button>

    <button
      type="button"
      onClick={() => moverPaginaAbajo(index)}
      disabled={index === paginas.length - 1}
      className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
    >
      ↓
    </button>
    <button
  type="button"
  onClick={() => eliminarPagina(pagina.id)}
  disabled={guardando}
  className="rounded border border-red-900 px-2 py-1 text-xs text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
>
  Eliminar
</button>
  </div>
</div>

          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            <img
              src={pagina.imagen_url}
              alt={`Página ${pagina.numero}`}
              className="aspect-[2/3] h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  )}


  {paginas.length > 1 && (
  <button
    type="button"
    onClick={handleGuardarOrden}
    disabled={guardando}
    className="mt-6 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
  >
    {guardando ? "Guardando..." : "Guardar orden de páginas"}
  </button>
)}
</div>
<div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
  <h2 className="text-xl font-semibold">
    Agregar páginas
  </h2>

  <p className="mt-2 text-sm text-zinc-400">
    Las nuevas páginas se agregarán al final del capítulo.
  </p>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handlePaginasNuevasChange}
    className="mt-5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3"
  />

  {paginasNuevas.length > 0 && (
    <>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {paginasNuevas.map((pagina, index) => (
          <div
            key={`${pagina.archivo.name}-${pagina.archivo.lastModified}-${index}`}
          >
            <p className="mb-2 text-sm text-zinc-500">
              Nueva página {paginas.length + index + 1}
            </p>

            <div className="overflow-hidden rounded-lg border border-zinc-800">
              <img
                src={pagina.preview}
                alt={`Nueva página ${index + 1}`}
                className="aspect-[2/3] h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAgregarPaginas}
        disabled={guardando}
        className="mt-6 rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
      >
        {guardando ? "Agregando..." : "Agregar páginas"}
      </button>
    </>
  )}
</div>
        </form>
      </div>
    </main>
  );
}