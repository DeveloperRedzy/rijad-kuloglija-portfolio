import type { Metadata } from "next";
import { Cv } from "@/components/cv/Cv";
import { Pill } from "@/components/ui/Pill";
// validate: parses all content at build time, so an invalid edit fails `npm run build`
import { profile } from "@/content/validate";
import { buildDay } from "@/lib/format";

export const metadata: Metadata = {
  title: "CV",
  description: `CV of ${profile.name}, ${profile.jobTitle} and ${profile.secondTitle}, ${profile.city}.`,
  alternates: { canonical: "/cv/" },
};

export default function CvPage() {
  const updated = buildDay();
  return (
    <div className="cv-wrap bg-paper">
      <div className="no-print mx-auto flex max-w-[800px] items-center justify-between px-8 pt-8 md:px-12">
        <p className="eyebrow text-paper-ink/70">{updated && `Updated ${updated}`}</p>
        <Pill href="/Rijad-Kuloglija-CV.pdf" external variant="outline" className="border-paper-ink/30 text-paper-ink">Download PDF</Pill>
      </div>
      <Cv />
    </div>
  );
}
