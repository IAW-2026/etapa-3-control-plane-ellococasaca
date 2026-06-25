const FEEDBACK_APP_URL =
  process.env.FEEDBACK_APP_URL ??
  "https://proyecto-web-feedback-ellococasaca.vercel.app";

export default function FeedbackPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Feedback</h1>
          <p className="text-sm text-slate-500 mt-1">
            Reseñas y moderación
          </p>
        </div>
        <a
          href={`${FEEDBACK_APP_URL}/feedback/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Abrir panel de admin
        </a>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-12 flex flex-col items-center gap-4 text-center">
        <p className="text-slate-600 text-sm max-w-md">
          La gestión de reseñas, moderación y reportes se administra desde el
          panel propio de la Feedback App.
        </p>
        <a
          href={`${FEEDBACK_APP_URL}/feedback/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
          Ir al panel de Feedback →
        </a>
        <p className="text-xs text-slate-400">
          {FEEDBACK_APP_URL}/feedback/admin
        </p>
      </div>
    </div>
  );
}
