"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Mic, Send, Square, Volume2, X } from "lucide-react";
import { agentApi } from "@/lib/backend-api";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface DashboardAssistantProps {
  dashboard?: string;
}

export default function DashboardAssistant({ dashboard = "dashboard" }: DashboardAssistantProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const recognition = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => () => recognition.current?.stop(), []);

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = message.trim();
    if (!text || busy) return;
    setMessage("");
    setMessages((current) => [...current, { role: "user", content: text }]);
    setBusy(true);
    try {
      const hasToken = Boolean(window.localStorage.getItem("hemoglobin_access_token"));
      const result: { message: string; conversation_id?: string } = hasToken
        ? await agentApi.chat(text, dashboard, conversationId)
        : await agentApi.publicChat(text, dashboard);
      if ("conversation_id" in result) setConversationId(result.conversation_id);
      setMessages((current) => [...current, { role: "assistant", content: result.message }]);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(result.message));
      }
    } catch (error) {
      setMessages((current) => [...current, {
        role: "assistant",
        content: error instanceof Error && error.message.includes("Authentication")
          ? "Please sign in first at /login so I can securely access your dashboard context."
          : "The assistant is temporarily unavailable. Please try again or contact the hospital emergency desk.",
      }]);
    } finally {
      setBusy(false);
    }
  }

  function toggleListening() {
    if (listening) {
      recognition.current?.stop();
      setListening(false);
      return;
    }
    const browserWindow = window as Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const Constructor = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Constructor) {
      setMessages((current) => [...current, { role: "assistant", content: "Voice input is not supported in this browser. You can still use text chat." }]);
      return;
    }
    const instance = new Constructor();
    instance.lang = "en-US";
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index][0].transcript).join(" ");
      setMessage(transcript);
      setListening(false);
    };
    instance.onerror = () => setListening(false);
    instance.onend = () => setListening(false);
    recognition.current = instance;
    setListening(true);
    instance.start();
  }

  return (
    <>
      {open && (
        <section className="fixed bottom-24 right-4 z-[1001] flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" aria-label="Hemoglobin AI assistant">
          <header className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-red-400" /><div><p className="text-sm font-bold">Hemoglobin AI Agent</p><p className="text-[10px] text-slate-300">{dashboard} assistant · text and voice</p></div></div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X className="h-4 w-4" /></button>
          </header>
          <div className="flex max-h-80 min-h-48 flex-col gap-2 overflow-y-auto p-3">
            {messages.length === 0 && <p className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">Ask me about this dashboard, requests, donor matching, inventory, dispatch, or notifications.</p>}
            {messages.map((item, index) => <div key={index} className={item.role === "user" ? "ml-8 rounded-xl bg-red-50 p-2.5 text-xs text-slate-800" : "mr-8 rounded-xl bg-slate-100 p-2.5 text-xs text-slate-700"}>{item.content}</div>)}
            {busy && <div className="mr-8 rounded-xl bg-slate-100 p-2.5 text-xs text-slate-500">Agent is checking the system...</div>}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-200 p-3">
            <button type="button" onClick={toggleListening} aria-label={listening ? "Stop voice input" : "Start voice input"} className={listening ? "rounded-lg bg-red-600 p-2 text-white" : "rounded-lg bg-slate-100 p-2 text-slate-700"}>{listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</button>
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={listening ? "Listening..." : "Ask the agent..."} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-red-500" />
            <button type="submit" disabled={busy || !message.trim()} aria-label="Send message" className="rounded-lg bg-red-600 p-2 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button>
          </form>
          <button onClick={() => window.speechSynthesis?.cancel()} className="flex items-center justify-center gap-1 pb-2 text-[10px] text-slate-400 hover:text-slate-700"><Volume2 className="h-3 w-3" /> Stop spoken reply</button>
        </section>
      )}
      <button onClick={() => setOpen((value) => !value)} className="fixed bottom-4 right-4 z-[1001] flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-xl hover:bg-red-700" aria-label="Open Hemoglobin AI assistant"><Bot className="h-5 w-5" /> AI Agent</button>
    </>
  );
}
