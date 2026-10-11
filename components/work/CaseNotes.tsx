import type { Project } from "@/content/schema";
import { REPORT_FLOW } from "@/content/figures";
import { CASE } from "@/content/labels";
import { ReportFlow } from "./ReportFlow";

// Same row markup as CaseStudy's body sections: a label cell and a content cell in its two-column grid.
const LABEL = "eyebrow border-t border-hairline pt-7 md:pb-7";
// min-w-0: a wide child (the report-flow figure) scrolls inside its cell instead of widening the grid track.
const CELL = "min-w-0 border-t border-hairline pb-7 pt-3 md:pt-7";
const PROSE = "max-w-[62ch] text-base leading-relaxed text-ink-soft md:text-lg";

/** Evidence rows of a case study (figure, decisions, since launch), rendered only when the project has them. */
export function CaseNotes({ project }: { project: Project }) {
  const { figure, decisions, sinceLaunch } = project;
  return (
    <>
      {figure === "report-flow" && (
        <div className="contents">
          <h2 className={LABEL}>{REPORT_FLOW.label}</h2>
          <div className={CELL}><ReportFlow /></div>
        </div>
      )}
      {decisions && decisions.length > 0 && (
        <div className="contents">
          <h2 className={LABEL}>{CASE.decisions}</h2>
          <dl className={CELL}>
            {decisions.map((d) => (
              <div key={d.choice} className="border-b border-surface-2 py-2.5">
                <dt className="text-ink">{d.choice}</dt>
                <dd className="mt-1 max-w-[62ch] text-ink-soft">{d.why}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {sinceLaunch && (
        <div className="contents">
          <h2 className={LABEL}>{CASE.sinceLaunch}</h2>
          <p data-split className={`${CELL} ${PROSE}`}>{sinceLaunch}</p>
        </div>
      )}
    </>
  );
}
