import { site } from "@/lib/site";

export const inputClass =
  "mt-2 block min-h-12 w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-charcoal transition-colors duration-200 hover:border-slate focus:border-teal-deep aria-[invalid=true]:border-danger";

/**
 * The forms hand the message to WhatsApp or the visitor's email app, ready to send. Nothing is
 * posted to this site, so there is no inbox to secure and no personal data stored.
 */
export function handOff(channel: "whatsapp" | "email", subject: string, text: string) {
  if (channel === "whatsapp") {
    window.open(`${site.whatsapp.href}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  }
}
