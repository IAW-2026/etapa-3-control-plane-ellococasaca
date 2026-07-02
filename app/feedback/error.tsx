"use client";

export default function FeedbackError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Feedback</h1>
      </header>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-3">
        <p className="text-sm font-medium text-red-700">Error al cargar la sección</p>
        <p className="text-xs text-red-600 font-mono">{error.message}</p>
        <button
          onClick={reset}
          className="text-xs rounded-md bg-red-700 text-white px-3 py-1.5"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
