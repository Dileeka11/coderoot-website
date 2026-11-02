"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Mail, WhatsApp } from "@/components/ui/icons";
import { handOff, inputClass } from "./handoff";

export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<"name" | "message", string>>>({});

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = submitter?.value === "email" ? "email" : "whatsapp";
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const found: typeof errors = {};
    if (!name) found.name = "Please tell us your name.";
    if (!message) found.message = "Please write your message.";
    setErrors(found);

    if (found.name || found.message) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${found.name ? "name" : "message"}"]`)?.focus();
      return;
    }

    handOff(channel, `Message from ${name}`, `Hi CodeRoot, I'm ${name}.\n\n${message}`);
  };

  return (
    <form onSubmit={send} noValidate className="min-w-0 rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 className="text-2xl">Send us a message</h2>
      <p className="mt-2 text-slate">A question, an idea or just a hello. Write it here and send it the way you prefer.</p>

      <div className="mt-7 grid gap-5">
        <div>
          <label htmlFor="contact-name" className="font-medium">
            Your name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-sm text-danger">
              {errors.name}
            </p>
          )}
        </div>

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

      <div className="mt-7 flex flex-wrap gap-3">
        <button type="submit" value="whatsapp" className={buttonClass("dark", "flex-1 sm:flex-none")}>
          <WhatsApp className="size-5" />
          Send on WhatsApp
        </button>
        <button type="submit" value="email" className={buttonClass("outlineDark", "flex-1 sm:flex-none")}>
          <Mail className="size-5" />
          Send by email
        </button>
      </div>
      <p className="mt-4 text-sm text-slate">
        Your message opens in WhatsApp or your email app, ready to send. Nothing is saved on this website.
      </p>
    </form>
  );
}
