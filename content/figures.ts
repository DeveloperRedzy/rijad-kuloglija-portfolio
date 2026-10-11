/** Copy for the LibLynx report-builder flow figure (`figure: "report-flow"`), drawn by components/work/ReportFlow.tsx. */
export const REPORT_FLOW = {
  label: "Report flow",
  title: "How a report moves through the LibLynx report builder",
  description:
    "A customer drags filter bricks, such as event type, date range and COUNTER metric, into a report. Each brick becomes a column of the report table, which sorts, filters and paginates on the server. A report can be saved, shared across the organization, started from a template or compared across two periods. Exports run in the background: the app requests an export, polls until it is ready, then downloads the file.",
  stages: { bricks: "Filter bricks", table: "Report table", reports: "Reports", export: "Export" },
  bricks: ["Event type", "Date range", "COUNTER metric"],
  columns: ["Event", "Date", "Metric"],
  table: { title: "Server-side", detail: "sort · filter · paginate" },
  reports: ["Saved", "Shared", "Template", "Comparison"],
  exportSteps: ["Request", "Poll", "Download"],
} as const;
