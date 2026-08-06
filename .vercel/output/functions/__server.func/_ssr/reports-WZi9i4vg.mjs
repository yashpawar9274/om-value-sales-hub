import { t as supabase } from "./client-Cilnn9eP.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as Download } from "../_libs/lucide-react.mjs";
import { a as LEAD_STATUSES, d as formatCurrency, f as formatDate, i as LEAD_SOURCES, l as downloadCsv, m as labelOf, t as AppShell } from "./crm-BJUNW1E2.mjs";
import { n as SectionCard, r as StatTile } from "./crm-ui-BV9tP90-.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-WZi9i4vg.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { data } = useQuery({
		queryKey: ["reports"],
		queryFn: async () => {
			const [leads, bookings] = await Promise.all([supabase.from("leads").select("*"), supabase.from("bookings").select("booking_amount, received_amount, booking_date")]);
			return {
				leads: leads.data ?? [],
				bookings: bookings.data ?? []
			};
		}
	});
	const leads = data?.leads ?? [];
	const bookings = data?.bookings ?? [];
	const revenue = bookings.reduce((s, b) => s + Number(b.booking_amount ?? 0), 0);
	const received = bookings.reduce((s, b) => s + Number(b.received_amount ?? 0), 0);
	const conversion = leads.length ? Math.round(leads.filter((l) => l.status === "booked").length / leads.length * 100) : 0;
	const bySource = LEAD_SOURCES.map((s) => ({
		...s,
		count: leads.filter((l) => l.source === s.value).length
	})).filter((s) => s.count > 0);
	const byStatus = LEAD_STATUSES.map((s) => ({
		...s,
		count: leads.filter((l) => l.status === s.value).length
	})).filter((s) => s.count > 0);
	const max = Math.max(1, ...bySource.map((s) => s.count));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Reports",
		subtitle: "Performance overview",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "secondary",
			className: "font-semibold",
			onClick: () => downloadCsv("lead-report", leads.map((l) => ({
				Name: l.customer_name,
				Mobile: l.mobile,
				Source: labelOf(LEAD_SOURCES, l.source),
				Status: labelOf(LEAD_STATUSES, l.status),
				Budget: l.budget ?? "",
				Created: formatDate(l.created_at)
			}))),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " CSV"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Total leads",
					value: leads.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Conversion",
					value: `${conversion}%`,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Booking value",
					value: formatCurrency(revenue),
					tone: "primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Received",
					value: formatCurrency(received),
					tone: "info"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Leads by source",
				children: bySource.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No data yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2.5",
					children: bySource.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: s.count
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-2 rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-full bg-primary",
							style: { width: `${s.count / max * 100}%` }
						})
					})] }, s.value))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
				title: "Pipeline by status",
				children: byStatus.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No data yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: byStatus.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: s.count
						})]
					}, s.value))
				})
			})]
		})]
	});
}
//#endregion
export { ReportsPage as component };
