"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authApi, storeTokens } from "@/lib/backend-api";

type Mode = "login" | "register" | "verify" | "forgot" | "reset";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [role, setRole] = useState("requester");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Please wait...");
    try {
      if (mode === "register") {
        await authApi.register({ name, email, password, role });
        setMode("verify"); setMessage("Verification code sent. Check your email."); return;
      }
      if (mode === "verify") {
        const result = await authApi.verifyEmail(email, code); storeTokens(result);
        const profile = await authApi.me();
        window.location.href = profile.role === "agent" ? "/agent" : profile.role === "hospital" ? "/hospital" : profile.role === "donor" ? "/donor" : "/requester"; return;
      }
      if (mode === "forgot") {
        await authApi.forgotPassword(email); setMode("reset"); setMessage("If the email exists, a reset code was sent."); return;
      }
      if (mode === "reset") {
        await authApi.resetPassword(email, code, password); setMode("login"); setMessage("Password reset. Sign in with your new password."); return;
      }
      const result = await authApi.login(email, password); storeTokens(result);
      const profile = await authApi.me();
      window.location.href = profile.role === "agent" ? "/agent" : profile.role === "hospital" ? "/hospital" : profile.role === "donor" ? "/donor" : "/requester";
    } catch (error) {
      const text = error instanceof Error ? error.message : "Authentication failed.";
      setMessage(text);
      if (mode === "login" && text.toLowerCase().includes("verification")) setMode("verify");
    }
  }

  const title = mode === "register" ? "Create your account" : mode === "verify" ? "Verify your email" : mode === "forgot" ? "Forgot password" : mode === "reset" ? "Reset password" : "Secure access";
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><section className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
    <Link href="/" className="text-sm font-semibold text-red-600">← Hemoglobin AI</Link>
    <h1 className="font-outfit text-3xl font-extrabold text-slate-900 mt-6">{title}</h1>
    <p className="text-sm text-slate-500 mt-2">{mode === "verify" ? "Enter the six-digit code sent to your email." : "Connect securely to the blood coordination system."}</p>
    <form onSubmit={submit} className="mt-6 space-y-4">
      {mode === "register" && <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-300 px-4 py-3" />}
      {mode === "register" && <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3"><option value="requester">Requester</option><option value="donor">Donor</option><option value="hospital">Hospital</option><option value="agent">Agent</option></select>}
      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-300 px-4 py-3" />
      {(mode === "verify" || mode === "reset") && <input required inputMode="numeric" pattern="[0-9]{6}" value={code} onChange={e => setCode(e.target.value)} placeholder="6-digit code" className="w-full rounded-xl border border-slate-300 px-4 py-3" />}
      {!["verify", "forgot"].includes(mode) && <div className="relative"><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (8+ characters)" className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>}
      <button className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-3">{mode === "login" ? "Sign in" : mode === "register" ? "Create account" : mode === "verify" ? "Verify and continue" : mode === "forgot" ? "Send reset code" : "Update password"}</button>
    </form>
    {mode === "login" && <button onClick={() => setMode("forgot")} className="mt-4 text-sm text-red-600">Forgot password?</button>}
    {(mode === "login" || mode === "register") && <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="block mt-3 text-sm text-slate-500 hover:text-red-600">{mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}</button>}
    {(mode === "verify" || mode === "reset") && <button onClick={() => setMode(mode === "verify" ? "register" : "forgot")} className="mt-4 text-sm text-slate-500">Use a different email</button>}
    {message && <p className="mt-4 text-sm font-semibold text-slate-700" role="status">{message}</p>}
  </section></main>;
}
