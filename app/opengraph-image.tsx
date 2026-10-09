import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { OgMonogram } from "./og-shared";
import { profile } from "@/content/profile";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const aura = `data:image/png;base64,${(await readFile("public/media/auras/default.png")).toString("base64")}`;
  const display = await readFile("assets/og/cabinet-grotesk-800.ttf");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, backgroundImage: `url(${aura})`, backgroundSize: "cover", color: "#F2EFEA", fontFamily: "Cabinet" }}>
        <OgMonogram />
        <div style={{ fontSize: 24, letterSpacing: 3, color: "#8A857E", textTransform: "uppercase" }}>{`${profile.name} · ${profile.title}`}</div>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5, lineHeight: 0.95, marginTop: 20, maxWidth: 900 }}>{profile.headline}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cabinet", data: display, weight: 800, style: "normal" }] },
  );
}
