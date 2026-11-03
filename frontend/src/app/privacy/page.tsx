import { PageHero } from "@/components/site/PageHero";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How the CodeRoot Solutions website handles your information. In short, it does not collect or store it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Your privacy, in plain words" crumbs={[{ name: "Privacy", path: "/privacy" }]} />
      <section className="section-y !pt-8">
        <div className="shell max-w-3xl space-y-8 text-lg">
          <div>
            <h2 className="text-2xl">What this website collects</h2>
            <p className="mt-3 text-slate">
              This website does not ask you to create an account, does not use tracking or advertising cookies, and
              does not load analytics or other third party scripts.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Our forms</h2>
            <p className="mt-3 text-slate">
              The forms on our contact and quote pages do not save anything on this website. They open WhatsApp or your
              email app with your message ready, and you decide whether to send it. If you do, we receive your message
              through that service and use it only to reply to you.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Cookies and browser storage</h2>
            <p className="mt-3 text-slate">
              Visitors to the public website get no cookies. We keep one small note in your browser&apos;s session storage,
              so the loading animation only plays once. It is never sent to us, and your browser removes it when you close
              the tab.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Server logs</h2>
            <p className="mt-3 text-slate">
              Like most websites, our hosting may keep short term technical logs, such as IP addresses and pages
              requested, to keep the site secure and working.
            </p>
          </div>
          <div>
            <h2 className="text-2xl">Questions</h2>
            <p className="mt-3 text-slate">
              Email us at{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-teal-deep underline underline-offset-2">
                {site.email}
              </a>{" "}
              and we will be happy to help.
            </p>
          </div>
          <p className="text-base text-slate">Last updated: 2 November 2026</p>
        </div>
      </section>
    </>
  );
}
