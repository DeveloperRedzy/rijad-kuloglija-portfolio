import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, nextProject, projectSlugs } from "@/content";
import { CaseStudy } from "@/components/work/CaseStudy";
import { PageTransition } from "@/components/ui/PageTransition";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.name, description: p.oneLiner, alternates: { canonical: `/work/${p.slug}/` },
    openGraph: { images: [{ url: `/og/${p.slug}.png`, width: 1200, height: 630 }] },
    twitter: { images: [`/og/${p.slug}.png`] },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <PageTransition>
      <CaseStudy project={project} next={nextProject(slug)} />
    </PageTransition>
  );
}
