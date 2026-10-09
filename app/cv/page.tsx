import type { Metadata } from "next";
import { Cv } from "@/components/cv/Cv";
import { Pill } from "@/components/ui/Pill";

export const metadata: Metadata = { title: "CV", description: "Rijad Kuloglija, Lead Software Developer. CV generated from the same data as this site.", alternates: { canonical: "/cv/" } };

export default function CvPage() {
  return (
    <div className="cv-wrap bg-paper">
      <div className="no-print mx-auto flex max-w-[800px] items-center justify-between px-8 pt-8 md:px-12">
        <p className="eyebrow text-paper-ink/70">Generated from the same data as the site</p>
        <Pill href="/Rijad-Kuloglija-CV.pdf" external variant="outline" className="border-paper-ink/30 text-paper-ink">Download PDF</Pill>
      </div>
      <Cv />
    </div>
  );
}
