"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Mail, WhatsApp } from "@/components/ui/icons";
import { contactErrors, honeypotClass, inputClass, openWhatsApp, sendEnquiry } from "./handoff";

type Field = "name" | "phone" | "email" | "message";

type Status =
  | { state: "idle" | "sending" }
  | { state: "sent"; channel: "whatsapp" | "email" }
  | { state: "error"; message: string };

const FIELDS: { name: Exclude<Field, "message">; label: string; type: string; autoComplete: string; maxLength: number }[] = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name", maxLength: 80 },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", maxLength: 20 },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 120 },
];

export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "sending") return;

    const formElement = event.currentTarget;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.value === "email" ? "email" : "whatsapp";
    const form = new FormData(formElement);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const name = value("name");
    const phone = value("phone");
    const email = value("email");
    const message = value("message");

    const found: typeof errors = { ...contactErrors(email, phone) };
    if (!name) found.name = "Please tell us your name.";
    if (!message) found.message = "Please write your message.";
    setErrors(found);

    const first = (["name", "phone", "email", "message"] as const).find((field) => found[field]);
    if (first) {
      formElement.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (channel === "whatsapp") {
      openWhatsApp(`Hi CodeRoot, I'm ${name}.\n\n${message}\n\nMobile: ${phone}\nEmail: ${email}`);
      setStatus({ state: "sent", channel });
      return;
    }

    setStatus({ state: "sending" });
    try {
      await sendEnquiry({ kind: "contact", name, phone, email, message, website: value("website") });
      formElement.reset();
      setStatus({ state: "sent", channel });
    } catch (error) {
      setStatus({ state: "error", message: (error as Error).message });
    }
  };

  return (
    <form onSubmit={send} noValidate className="min-w-0 rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 className="text-2xl">Send us a message</h2>
      <p className="mt-2 text-slate">A question, an idea or just a hello. Write it here and send it the way you prefer.</p>

      <div className="mt-7 grid gap-5">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={`contact-${field.name}`} className="font-medium">
              {field.label}
            </label>
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              required
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={errors[field.name] ? `contact-${field.name}-error` : undefined}
              className={inputClass}
            />
            {errors[field.name] && (
              <p id={`contact-${field.name}-error`} className="mt-1.5 text-sm text-danger">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="contact-message" className="font-medium">
            Your message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={1500}
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={inputClass}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-1.5 text-sm text-danger">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div className={honeypotClass} aria-hidden="true">
        <label htmlFor="contact-website">Leave this empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button type="submit" value="whatsapp" disabled={status.state === "sending"} className={buttonClass("dark", "flex-1 sm:flex-none")}>
          <WhatsApp className="size-5" />
          Send on WhatsApp
        </button>
        <button type="submit" value="email" disabled={status.state === "sending"} className={buttonClass("outlineDark", "flex-1 sm:flex-none")}>
          <Mail className="size-5" />
          {status.state === "sending" ? "Sending..." : "Send by email"}
        </button>
      </div>
      <p className={`mt-4 text-sm ${status.state === "error" ? "text-danger" : "text-slate"}`} role="status">
        {status.state === "sent" && status.channel === "email"
          ? "Thank you. Your message has been sent to our team, and we will get back to you soon."
          : status.state === "sent"
            ? "Your message is ready in WhatsApp. Press send there and we will get back to you."
            : status.state === "error"
              ? status.message
              : status.state === "sending"
                ? "Sending your message..."
                : "Send by email and it comes straight to our inbox, or open it in WhatsApp ready to send."}
      </p>
    </form>
  );
}
