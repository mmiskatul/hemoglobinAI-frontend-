export default function AgentDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 md:px-10">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-600">Agent account</p>
        <h1 className="mt-3 font-outfit text-4xl font-extrabold text-slate-900">Agent Workspace</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Review blood requests, coordinate area-based donor matches, and use the Hemoglobin AI assistant for verified system information.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-red-50 p-5"><p className="text-xs font-bold uppercase text-red-600">Requests</p><p className="mt-2 text-sm text-slate-700">Coordinate incoming blood requests.</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase text-slate-500">Donor matching</p><p className="mt-2 text-sm text-slate-700">Find relevant nearby donors by area and blood type.</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase text-slate-500">AI assistant</p><p className="mt-2 text-sm text-slate-700">Open the assistant to communicate by text or voice.</p></div>
        </div>
      </section>
    </main>
  );
}
