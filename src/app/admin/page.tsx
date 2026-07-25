export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 md:px-10">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-600">Admin dashboard</p>
        <h1 className="mt-3 font-outfit text-4xl font-extrabold text-slate-900">Blood Coordination Administration</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Manage incoming blood requests, verify area-based donor matches, and coordinate communication between requesters, donors, hospitals, and couriers.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-red-50 p-5"><p className="text-xs font-bold uppercase text-red-600">Requests</p><p className="mt-2 text-sm text-slate-700">Review and prioritize active blood requests.</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase text-slate-500">Donor matching</p><p className="mt-2 text-sm text-slate-700">Coordinate verified donors by blood type and area.</p></div>
          <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-bold uppercase text-slate-500">AI assistant</p><p className="mt-2 text-sm text-slate-700">Use the AI assistant to analyze system data and communicate with users.</p></div>
        </div>
      </section>
    </main>
  );
}
