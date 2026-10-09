import { PageTransition } from "@/components/ui/PageTransition";
import { Hero } from "@/components/hero/Hero";
import { WorkChapters } from "@/components/home/WorkChapters";
import { Companies } from "@/components/home/Companies";
import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Lab } from "@/components/home/Lab";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <WorkChapters />
      <Companies />
      <About />
      <Experience />
      <Lab />
      <Contact />
    </PageTransition>
  );
}
