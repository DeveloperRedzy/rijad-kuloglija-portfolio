import { PageTransition } from "@/components/ui/PageTransition";
import { Hero } from "@/components/hero/Hero";
import { WorkChapters } from "@/components/home/WorkChapters";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <WorkChapters />
    </PageTransition>
  );
}
