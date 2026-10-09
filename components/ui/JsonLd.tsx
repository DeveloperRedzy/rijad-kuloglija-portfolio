import { profile } from "@/content/profile";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name, jobTitle: "Lead Software Developer",
    url: `https://www.${profile.domain}`, email: `mailto:${profile.email}`, address: { "@type": "PostalAddress", addressLocality: "Sarajevo", addressCountry: "BA" },
    sameAs: [profile.links.github, profile.links.linkedin], knowsAbout: profile.strengths,
    worksFor: profile.roles.filter((r) => r.current).map((r) => ({ "@type": "Organization", name: r.company, url: r.url })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
