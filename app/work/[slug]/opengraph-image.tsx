import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { OgMonogram } from "../../og-shared";
import { getProject, projectSlugs } from "@/content";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export function generateStaticParams() { return projectSlugs.map((slug) => ({ slug })); }

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug)!;
  const aura = `data:image/png;base64,${(await readFile(`public/media/auras/${slug}.png`)).toString("base64")}`;
  const display = await readFile("assets/og/cabinet-grotesk-800.ttf");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, backgroundImage: `url(${aura})`, backgroundSize: "cover", color: "#F2EFEA", fontFamily: "Cabinet" }}>
        <OgMonogram size={72} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 3, color: "#8A857E", textTransform: "uppercase" }}>
          <span style={{ color: "#FF4A26" }}>{String(p.index).padStart(2, "0")} / 05</span><span>{p.categories.join(" · ")}</span>
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95, marginTop: 18 }}>{p.name}</div>
        <div style={{ fontSize: 28, color: "#B8B2AA", marginTop: 18, maxWidth: 980 }}>{p.oneLiner}</div>
        <div style={{ position: "absolute", top: 96, right: 72, fontSize: 24, letterSpacing: 3, color: "#8A857E" }}>{`REDZY · ${p.role.toUpperCase()}`}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cabinet", data: display, weight: 800, style: "normal" }] },
  );
}
