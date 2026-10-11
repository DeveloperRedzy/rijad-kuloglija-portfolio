import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, nextProject, profile, projectSlugs } from "@/content";
import { CaseStudy } from "@/components/work/CaseStudy";
import { PageTransition } from "@/components/ui/PageTransition";
import { FrameCanvasMount as FrameCanvas } from "@/components/work/ShaderGate";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  // openGraph is shallow-merged with the layout's, so the shared fields are repeated here.
  return { title: p.name, description: p.oneLiner, alternates: { canonical: `/work/${p.slug}/` },
    openGraph: {
      type: "website", siteName: profile.brand, locale: "en_US", title: `${p.name} — ${profile.name}`, description: p.oneLiner,
      url: `/work/${p.slug}/`, images: [{ url: `/og/${p.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: { images: [`/og/${p.slug}.png`] },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <>
      <PageTransition>
        <CaseStudy project={project} next={nextProject(slug)} />
      </PageTransition>
      {/* one shared WebGL canvas for the shader frames (Tier A, hardware GL); unmounts when leaving the case page */}
      <FrameCanvas />
    </>
  );
}
