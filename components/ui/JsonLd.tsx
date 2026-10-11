import { profile } from "@/content/profile";

const PORTRAIT = "/media/about/portrait-1200.webp";

export function JsonLd() {
  const url = `https://www.${profile.domain}`;
  const data = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: profile.jobTitle,
    url, image: `${url}${PORTRAIT}`, email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: profile.countryCode },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: profile.stack.flatMap((g) => g.items),
    worksFor: profile.worksFor.map((o) => ({ "@type": "Organization", ...o })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
