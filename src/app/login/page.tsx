 "use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/backend-api";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("requester");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Connecting to Hemoglobin AI...");
    try {
      const result = mode === "login"
        ? await authApi.login(email, password)
        : await authApi.register({ name, email, password, role });
      localStorage.setItem("hemoglobin_access_token", result.access_token);
      setMessage("Authenticated. You can now open your dashboard.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
        <Link href="/" className="text-sm font-semibold text-red-600">← Hemoglobin AI</Link>
        <h1 className="font-outfit text-3xl font-extrabold text-slate-900 mt-6">Secure access</h1>
        <p className="text-sm text-slate-500 mt-2">Sign in to connect dashboards to the coordination backend.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "register" && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-300 px-4 py-3" />}
          {mode === "register" && <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3"><option value="requester">Requester</option><option value="donor">Donor</option><option value="hospital">Hospital</option><option value="agent">Agent</option></select>}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (8+ characters)" className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          <button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-3">{mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-5 text-sm text-slate-500 hover:text-red-600">
          {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
        </button>
        {message && <p className="mt-4 text-sm font-semibold text-slate-700" role="status">{message}</p>}
      </section>
    </main>
  );
}
