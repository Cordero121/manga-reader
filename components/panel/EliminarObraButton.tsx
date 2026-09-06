"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface EliminarObraButtonProps {
  mangaId: number;
  titulo: string;
}

export default function EliminarObraButton({
  mangaId,
  titulo,
}: EliminarObraButtonProps) {
  const router = useRouter();

  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const handleEliminar = async () => {
    const confirmado = window.confirm(
      `¿Seguro que querés eliminar "${titulo}"? Se eliminarán también sus capítulos y páginas.`
    );

    if (!confirmado) {
      return;
    }

    setEliminando(true);
    setError("");

    const { error: deleteError } = await supabase
      .from("mangas")
      .delete()
      .eq("id", mangaId);

    setEliminando(false);

    if (deleteError) {
      setError(
        `No se pudo eliminar la obra: ${deleteError.message}`
      );
      return;
    }

    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleEliminar}
        disabled={eliminando}
        className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 transition hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {eliminando ? "Eliminando..." : "Eliminar"}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}