import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { OgMonogram } from "../../og-shared";
import { getProject, projectSlugs, projects } from "@/content";
import { profile } from "@/content/profile";
import { pad2 } from "@/lib/format";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return [{ slug: "home.png" }, ...projectSlugs.map((s) => ({ slug: `${s}.png` }))];
}

async function fonts() {
  const display = await readFile("assets/og/cabinet-grotesk-800.ttf");
  return [{ name: "Cabinet", data: display, weight: 800 as const, style: "normal" as const }];
}

const aura = async (seed: string) => `data:image/png;base64,${(await readFile(`public/media/auras/${seed}.png`)).toString("base64")}`;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.replace(/\.png$/, "");
  if (slug === "home") {
    const bg = await aura("default");
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, backgroundImage: `url(${bg})`, backgroundSize: "cover", color: "#F2EFEA", fontFamily: "Cabinet" }}>
          <OgMonogram />
          <div style={{ fontSize: 24, letterSpacing: 3, color: "#8A857E", textTransform: "uppercase" }}>{`${profile.name} · ${profile.title}`}</div>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5, lineHeight: 0.95, marginTop: 20, maxWidth: 900 }}>{profile.headline}</div>
        </div>
      ),
      { ...size, fonts: await fonts() },
    );
  }
  const p = getProject(slug);
  if (!p) return new Response("Not found", { status: 404 });
  const bg = await aura(slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, backgroundImage: `url(${bg})`, backgroundSize: "cover", color: "#F2EFEA", fontFamily: "Cabinet" }}>
        <OgMonogram size={72} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 3, color: "#8A857E", textTransform: "uppercase" }}>
          <span style={{ color: "#FF4A26" }}>{`${pad2(p.index)} / ${pad2(projects.length)}`}</span><span>{p.categories.join(" · ")}</span>
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95, marginTop: 18 }}>{p.name}</div>
        <div style={{ fontSize: 28, color: "#B8B2AA", marginTop: 18, maxWidth: 980 }}>{p.oneLiner}</div>
        <div style={{ position: "absolute", top: 96, right: 72, fontSize: 24, letterSpacing: 3, color: "#8A857E" }}>{`${profile.brand} · ${p.role}`.toUpperCase()}</div>
      </div>
    ),
    { ...size, fonts: await fonts() },
  );
}
