import { REPORT_FLOW as F } from "@/content/figures";

// Drawn 1:1 for the case body's text column (872 px at the 1200 px container), so 12 px labels render at 12 px there.
const W = 872;
const H = 300;
const TOP = 32; // stage boxes start below the stage labels
const MID = TOP + 130; // vertical centre of the stage boxes
const COL = { bricks: [0, 196], table: [236, 216], reports: [492, 172], export: [704, 168] } as const;
const REPORT_Y = [32, 104, 176, 248]; // four 44 px report boxes, 28 px apart
const EXPORT_Y = [72, 142, 212]; // three 40 px export steps

const LABEL = "fill-ink-muted font-mono text-[11px] uppercase tracking-[0.12em]";
const TEXT = "fill-ink-soft font-mono text-[12px]";
const BOX = "fill-surface-1 stroke-hairline-strong";
const CHIP = "fill-surface-2 stroke-hairline-strong";

/** The LibLynx report-builder flow, drawn from the case description (no product screenshots under NDA). */
export function ReportFlow() {
  const [tx, tw] = COL.table;
  return (
    // Keeps the labels legible on phones: the figure scrolls sideways instead of shrinking below ~640 px. The scroll
    // container is a focusable, named region so keyboard users can scroll it (axe scrollable-region-focusable).
    <figure tabIndex={0} role="region" aria-label={F.label} className="m-0 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 640 }} role="img" aria-labelledby="report-flow-title" aria-describedby="report-flow-desc" className="block h-auto" fill="none" strokeWidth={1}>
        <title id="report-flow-title">{F.title}</title>
        <defs>
          <marker id="report-flow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L8 4L0 8z" className="fill-signal" />
          </marker>
        </defs>

        <g className={LABEL}>
          {(Object.keys(COL) as Array<keyof typeof COL>).map((k) => <text key={k} x={COL[k][0]} y={14}>{F.stages[k]}</text>)}
        </g>

        <g textAnchor="middle">
          <rect x={0.5} y={TOP + 0.5} width={COL.bricks[1] - 1} height={259} rx={10} className={BOX} />
          {F.bricks.map((b, i) => (
            <g key={b}>
              <rect x={16.5} y={88.5 + i * 54} width={163} height={39} rx={6} className={CHIP} />
              <text dominantBaseline="central" x={98} y={108 + i * 54} className={TEXT}>{b}</text>
            </g>
          ))}

          <rect x={tx + 0.5} y={TOP + 0.5} width={tw - 1} height={259} rx={10} className="fill-surface-1 stroke-signal/70" />
          <rect x={tx + 16.5} y={56.5} width={tw - 33} height={27} rx={4} className={CHIP} />
          {F.columns.map((c, i) => <text dominantBaseline="central" key={c} x={tx + 16 + (tw - 32) * (i + 0.5) / 3} y={70} className={TEXT}>{c}</text>)}
          <path className="stroke-hairline-strong" d={[0, 1, 2, 3, 4].map((i) => `M${tx + 16} ${108 + i * 22}H${tx + tw - 16}`).join("") + [1, 2].map((i) => `M${tx + 16 + (tw - 32) * i / 3} 84V196`).join("")} />
          <text dominantBaseline="central" x={tx + tw / 2} y={234} className="fill-ink font-mono text-[12px]">{F.table.title}</text>
          <text dominantBaseline="central" x={tx + tw / 2} y={256} className={TEXT}>{F.table.detail}</text>

          {F.reports.map((r, i) => (
            <g key={r}>
              <rect x={COL.reports[0] + 0.5} y={REPORT_Y[i] + 0.5} width={COL.reports[1] - 1} height={43} rx={8} className={BOX} />
              <text dominantBaseline="central" x={COL.reports[0] + COL.reports[1] / 2} y={REPORT_Y[i] + 22} className={TEXT}>{r}</text>
            </g>
          ))}

          <rect x={COL.export[0] + 0.5} y={TOP + 0.5} width={COL.export[1] - 1} height={259} rx={10} className={BOX} />
          {F.exportSteps.map((s, i) => (
            <g key={s}>
              <rect x={COL.export[0] + 16.5} y={EXPORT_Y[i] + 0.5} width={COL.export[1] - 33} height={39} rx={6} className={CHIP} />
              <text dominantBaseline="central" x={COL.export[0] + COL.export[1] / 2} y={EXPORT_Y[i] + 20} className={TEXT}>{s}</text>
            </g>
          ))}
        </g>

        <g className="stroke-signal" markerEnd="url(#report-flow-arrow)">
          <path d={`M${COL.bricks[1]} ${MID}H${tx - 3}`} />
          {REPORT_Y.map((y) => <path key={y} d={`M${tx + tw} ${MID}C${tx + tw + 20} ${MID} ${COL.reports[0] - 20} ${y + 22} ${COL.reports[0] - 3} ${y + 22}`} />)}
          <path d={`M${COL.reports[0] + COL.reports[1] + 16} ${MID}H${COL.export[0] - 3}`} />
          {EXPORT_Y.slice(1).map((y) => <path key={y} d={`M${COL.export[0] + COL.export[1] / 2} ${y - 30}V${y - 2}`} />)}
        </g>
        {/* bracket gathering the four report kinds into the export */}
        <path className="stroke-signal" d={`${REPORT_Y.map((y) => `M${COL.reports[0] + COL.reports[1]} ${y + 22}h16`).join("")}M${COL.reports[0] + COL.reports[1] + 16} ${REPORT_Y[0] + 22}V${REPORT_Y[3] + 22}`} />
      </svg>
      <p id="report-flow-desc" className="sr-only">{F.description}</p>
    </figure>
  );
}
