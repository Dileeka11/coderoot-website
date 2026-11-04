import { site } from "@/lib/site";

export const inputClass =
  "mt-2 block min-h-12 w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-charcoal transition-colors duration-200 hover:border-slate focus:border-teal-deep aria-[invalid=true]:border-danger";

/** Opens WhatsApp with the message ready to send. */
export function openWhatsApp(text: string) {
  window.open(`${site.whatsapp.href}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
}

export interface Enquiry {
  kind: "quote" | "contact";
  name: string;
  email: string;
  phone: string;
  business?: string;
  message: string;
  /** Hidden from people. Bots fill it, and the server drops those. */
  website?: string;
}

/**
 * Sends the enquiry to Laravel, which emails it to the company inbox. Nothing is stored.
 * Resolves on success, otherwise throws with a message that can be shown to the visitor.
 */
export async function sendEnquiry(enquiry: Enquiry) {
  let response: Response;
  try {
    response = await fetch("/api/v1/enquiries", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(enquiry),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error("We could not reach the server. Please check your connection and try again.");
  }

  if (response.ok) return;
  if (response.status === 429) throw new Error("Too many requests. Please wait a minute and try again.");

  const body = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(
    response.status === 422 && body?.message ? body.message : "Something went wrong. Please try again, or send it on WhatsApp.",
  );
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;

/** Shared checks for the contact details on both forms. */
export function contactErrors(email: string, phone: string) {
  const found: { email?: string; phone?: string } = {};
  if (!phone) found.phone = "Please enter your mobile number.";
  else if (!PHONE_PATTERN.test(phone)) found.phone = "Please enter a valid mobile number, like 077 123 4567.";
  if (!email) found.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) found.email = "Please enter a valid email address.";
  return found;
}

/** The fields people never see. Kept off screen rather than display:none, which some bots skip. */
export const honeypotClass = "absolute -left-[9999px] h-px w-px overflow-hidden";
