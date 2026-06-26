"use client";

import ReviewsList from "./ReviewsList";

export default function FeedbackDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">Moderación de reseñas</p>
      </header>
      <ReviewsList />
    </div>
  );
}
