import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cilnn9eP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as Download, i as Search, o as Plus, s as Phone } from "../_libs/lucide-react.mjs";
import { _ as telHref, a as LEAD_STATUSES, d as formatCurrency, f as formatDate, i as LEAD_SOURCES, l as downloadCsv, m as labelOf, r as LEAD_PRIORITIES, t as AppShell } from "./crm-BJUNW1E2.mjs";
import { i as StatusChip, t as EmptyState } from "./crm-ui-BV9tP90-.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-B5XqFsrs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeadsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [source, setSource] = (0, import_react.useState)("all");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const { data: leads = [], isLoading } = useQuery({
		queryKey: ["leads"],
		queryFn: async () => {
			const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return leads.filter((l) => {
			if (status !== "all" && l.status !== status) return false;
			if (source !== "all" && l.source !== source) return false;
			if (priority !== "all" && l.priority !== priority) return false;
			if (!q) return true;
			return l.customer_name.toLowerCase().includes(q) || l.mobile.includes(q) || (l.location ?? "").toLowerCase().includes(q) || (l.configuration ?? "").toLowerCase().includes(q);
		});
	}, [
		leads,
		search,
		status,
		source,
		priority
	]);
	function exportCsv() {
		downloadCsv("leads", filtered.map((l) => ({
			Name: l.customer_name,
			Mobile: l.mobile,
			Email: l.email ?? "",
			Budget: l.budget ?? "",
			Configuration: l.configuration ?? "",
			Source: labelOf(LEAD_SOURCES, l.source),
			Status: labelOf(LEAD_STATUSES, l.status),
			Priority: labelOf(LEAD_PRIORITIES, l.priority),
			Location: l.location ?? "",
			Created: formatDate(l.created_at)
		})));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Leads",
		subtitle: `${filtered.length} of ${leads.length} leads`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			variant: "secondary",
			className: "font-semibold",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/leads/new",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New"]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search name, mobile, area…",
						className: "h-11 pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							value: status,
							onChange: setStatus,
							placeholder: "Status",
							options: LEAD_STATUSES
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							value: source,
							onChange: setSource,
							placeholder: "Source",
							options: LEAD_SOURCES
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSelect, {
							value: priority,
							onChange: setPriority,
							placeholder: "Priority",
							options: LEAD_PRIORITIES
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: exportCsv,
						disabled: filtered.length === 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Export CSV"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 space-y-2.5",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "Loading leads…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: leads.length === 0 ? "No leads yet" : "No matching leads",
				description: leads.length === 0 ? "Capture your first enquiry to get moving." : "Try clearing a filter or two.",
				action: leads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leads/new",
						children: "Add lead"
					})
				}) : null
			}) : filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card flex items-center gap-3 p-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/leads/$leadId",
					params: { leadId: l.id },
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-semibold",
								children: l.customer_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								label: labelOf(LEAD_STATUSES, l.status),
								value: l.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 truncate text-sm text-muted-foreground",
							children: [
								l.mobile,
								l.configuration ? ` · ${l.configuration}` : "",
								l.budget ? ` · ${formatCurrency(l.budget)}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: [
								labelOf(LEAD_SOURCES, l.source),
								" · ",
								formatDate(l.created_at)
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "icon",
					variant: "outline",
					className: "size-10 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: telHref(l.mobile),
						"aria-label": `Call ${l.customer_name}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
					})
				})]
			}, l.id))
		})]
	});
}
function FilterSelect({ value, onChange, placeholder, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value,
		onValueChange: onChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "h-10 text-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
			value: "all",
			children: ["All ", placeholder.toLowerCase()]
		}), options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: o.value,
			children: o.label
		}, o.value))] })]
	});
}
//#endregion
export { LeadsPage as component };
