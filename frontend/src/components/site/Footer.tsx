import Image from "next/image";
import Link from "next/link";
import { footerLinks, site } from "@/lib/site";
import { Facebook, Instagram, LinkedIn, Mail, MapPin, Phone, TikTok, WhatsApp } from "@/components/ui/icons";

const socials = [
  { label: "Facebook", href: site.social.facebook, Icon: Facebook },
  { label: "Instagram", href: site.social.instagram, Icon: Instagram },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedIn },
  { label: "TikTok", href: site.social.tiktok, Icon: TikTok },
];

/** Set when the site is built. */
function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}

const headingClass = "mb-4 font-display text-sm font-semibold uppercase tracking-[0.18em] text-white";
const linkClass = "inline-block py-1.5 text-mist transition-colors duration-200 hover:text-teal";

export function Footer() {
  return (
    <footer className="border-t-4 border-teal bg-charcoal text-white">
      <div className="shell grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.45fr_1.05fr_0.9fr_0.9fr_1.5fr]">
        <div>
          <Image
            src="/images/logo-white.svg"
            alt="CodeRoot Solutions"
            width={198}
            height={56}
            unoptimized
            loading="lazy"
            className="h-14 w-auto"
          />
          <p className="mt-6 max-w-xs text-mist">{site.purpose}</p>
          <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.26em] text-teal">{site.tagline}</p>
          <ul className="mt-7 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`CodeRoot Solutions on ${label}`}
                  className="grid size-11 place-items-center rounded-lg border border-white/15 text-mist transition-colors duration-200 hover:border-teal hover:text-teal"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Services">
          <h2 className={headingClass}>Services</h2>
          <ul>
            {footerLinks.services.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className={headingClass}>Company</h2>
          <ul>
            {footerLinks.company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Resources">
          <h2 className={headingClass}>Resources</h2>
          <ul>
            {footerLinks.resources.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className={headingClass}>Contact</h2>
          <ul>
            <li>
              <a href={site.phone.href} className={`${linkClass} !flex items-center gap-3`}>
                <Phone className="size-[18px] flex-none text-teal" />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} !flex items-center gap-3`}
              >
                <WhatsApp className="size-[18px] flex-none text-teal" />
                {site.phone.international}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={`${linkClass} !flex items-center gap-3 break-all`}>
                <Mail className="size-[18px] flex-none text-teal" />
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3 py-1.5 text-mist">
              <MapPin className="size-[18px] flex-none text-teal" />
              {site.address.street}, {site.address.postalCode}, {site.address.country}
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-1 py-5 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            {footerLinks.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1 transition-colors duration-200 hover:text-teal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
