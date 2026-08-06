import { t as supabase } from "./client-Cilnn9eP.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as MapPin } from "../_libs/lucide-react.mjs";
import { c as VISIT_STATUSES, h as mapsHref, m as labelOf, p as formatDateTime, t as AppShell } from "./crm-BJUNW1E2.mjs";
import { i as StatusChip, t as EmptyState } from "./crm-ui-BV9tP90-.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visits-lxYCqSCV.js
var import_jsx_runtime = require_jsx_runtime();
function VisitsPage() {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["visits"],
		queryFn: async () => {
			const { data } = await supabase.from("site_visits").select("id, visit_at, status, project_name, location, lead_id, leads(customer_name)").order("visit_at", { ascending: false });
			return data ?? [];
		}
	});
	async function setStatus(id, status) {
		const { error } = await supabase.from("site_visits").update({ status }).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		queryClient.invalidateQueries();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Site visits",
		subtitle: `${data.length} scheduled`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2.5",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "Loading…"
			}) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No site visits yet",
				description: "Schedule a visit from any lead's Visits tab."
			}) : data.map((v) => {
				const lead = v.leads;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card space-y-2 p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/leads/$leadId",
								params: { leadId: v.lead_id },
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: lead?.customer_name ?? "Lead"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: formatDateTime(v.visit_at)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								label: labelOf(VISIT_STATUSES, v.status),
								value: v.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [v.project_name ?? "Project TBD", v.location ? ` · ${v.location}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: v.status,
								onValueChange: (s) => setStatus(v.id, s),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-10 flex-1 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: VISIT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s.value,
									children: s.label
								}, s.value)) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								disabled: !v.location,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: mapsHref(v.location ?? ""),
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), " Map"]
								})
							})]
						})
					]
				}, v.id);
			})
		})
	});
}
//#endregion
export { VisitsPage as component };
