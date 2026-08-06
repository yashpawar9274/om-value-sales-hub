import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cilnn9eP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as Phone } from "../_libs/lucide-react.mjs";
import { _ as telHref, g as startOfToday, m as labelOf, n as FOLLOWUP_STATUSES, p as formatDateTime, t as AppShell, u as endOfToday } from "./crm-BJUNW1E2.mjs";
import { i as StatusChip, t as EmptyState } from "./crm-ui-BV9tP90-.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/followups-CMrcWiSj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FollowUpsPage() {
	const [tab, setTab] = (0, import_react.useState)("today");
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["followups"],
		queryFn: async () => {
			const { data } = await supabase.from("follow_ups").select("id, due_at, status, notes, lead_id, leads(customer_name, mobile)").order("due_at", { ascending: true });
			return data ?? [];
		}
	});
	const from = startOfToday().toISOString();
	const to = endOfToday().toISOString();
	const filtered = data.filter((f) => {
		if (tab === "today") return f.status === "pending" && f.due_at >= from && f.due_at <= to;
		if (tab === "upcoming") return f.status === "pending" && f.due_at > to;
		if (tab === "missed") return f.status === "missed" || f.status === "pending" && f.due_at < from;
		return f.status === "completed";
	});
	async function complete(id) {
		const { error } = await supabase.from("follow_ups").update({
			status: "completed",
			completed_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Marked done");
		queryClient.invalidateQueries();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Follow-ups",
		subtitle: `${filtered.length} in view`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			value: tab,
			onValueChange: setTab,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "grid w-full grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "today",
						children: "Today"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "upcoming",
						children: "Upcoming"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "missed",
						children: "Missed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "completed",
						children: "Done"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-2.5",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "Loading…"
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing here",
				description: "Follow-ups you schedule from a lead will show up here."
			}) : filtered.map((f) => {
				const lead = f.leads;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card space-y-2 p-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/leads/$leadId",
								params: { leadId: f.lead_id },
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: lead?.customer_name ?? "Lead"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: formatDateTime(f.due_at)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								label: labelOf(FOLLOWUP_STATUSES, f.status),
								value: f.status
							})]
						}),
						f.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: f.notes
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: telHref(lead?.mobile ?? ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), " Call"]
								})
							}), f.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "flex-1",
								onClick: () => complete(f.id),
								children: "Mark done"
							}) : null]
						})
					]
				}, f.id);
			})
		})]
	});
}
//#endregion
export { FollowUpsPage as component };
