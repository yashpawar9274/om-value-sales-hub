import { t as supabase } from "./client-Cilnn9eP.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useAuth } from "./router-C6PQqzYT.mjs";
import { c as MessageCircle, o as Plus, s as Phone } from "../_libs/lucide-react.mjs";
import { _ as telHref, a as LEAD_STATUSES, g as startOfToday, m as labelOf, p as formatDateTime, t as AppShell, u as endOfToday, y as whatsappHref } from "./crm-BJUNW1E2.mjs";
import { i as StatusChip, n as SectionCard, r as StatTile, t as EmptyState } from "./crm-ui-BV9tP90-.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CAiymSKC.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { profile } = useAuth();
	const from = startOfToday().toISOString();
	const to = endOfToday().toISOString();
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const [leads, followups, visits, bookings, activity] = await Promise.all([
				supabase.from("leads").select("id, customer_name, mobile, status, priority, created_at").order("created_at", { ascending: false }),
				supabase.from("follow_ups").select("id, due_at, status, notes, lead_id, leads(customer_name, mobile)").order("due_at", { ascending: true }),
				supabase.from("site_visits").select("id, visit_at, status, lead_id, leads(customer_name)").order("visit_at"),
				supabase.from("bookings").select("id, booking_amount, booking_date, payment_status, leads(customer_name)"),
				supabase.from("activity_logs").select("id, action, detail, created_at").order("created_at", { ascending: false }).limit(8)
			]);
			return {
				leads: leads.data ?? [],
				followups: followups.data ?? [],
				visits: visits.data ?? [],
				bookings: bookings.data ?? [],
				activity: activity.data ?? []
			};
		}
	});
	const leads = data?.leads ?? [];
	const followups = data?.followups ?? [];
	const todayLeads = leads.filter((l) => l.created_at >= from && l.created_at <= to);
	const activeLeads = leads.filter((l) => !["booked", "lost"].includes(l.status));
	const todayFollowups = followups.filter((f) => f.status === "pending" && f.due_at >= from && f.due_at <= to);
	const missedFollowups = followups.filter((f) => f.status === "pending" && f.due_at < from);
	const todayVisits = (data?.visits ?? []).filter((v) => v.visit_at >= from && v.visit_at <= to);
	const bookings = data?.bookings ?? [];
	const conversion = leads.length ? Math.round(leads.filter((l) => l.status === "booked").length / leads.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: `Hello${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`,
		subtitle: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
			weekday: "long",
			day: "numeric",
			month: "long"
		}),
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "sm",
			variant: "secondary",
			className: "font-semibold",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/leads/new",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Lead"]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Total leads",
					value: leads.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Today's leads",
					value: todayLeads.length,
					tone: "info"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Active leads",
					value: activeLeads.length,
					tone: "info"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Conversion",
					value: `${conversion}%`,
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Today follow-ups",
					value: todayFollowups.length,
					tone: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Missed follow-ups",
					value: missedFollowups.length,
					tone: "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Today's visits",
					value: todayVisits.length,
					tone: "primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
					label: "Bookings",
					value: bookings.length,
					tone: "success"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Today's follow-ups",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/followups",
						className: "text-xs font-semibold text-primary",
						children: "View all"
					}),
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading…"
					}) : todayFollowups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing due today. Well played."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: todayFollowups.slice(0, 5).map((f) => {
							const lead = f.leads;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/leads/$leadId",
									params: { leadId: f.lead_id },
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: lead?.customer_name ?? "Lead"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: formatDateTime(f.due_at)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "icon",
										variant: "outline",
										className: "size-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: telHref(lead?.mobile ?? ""),
											"aria-label": "Call",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "icon",
										variant: "outline",
										className: "size-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: whatsappHref(lead?.mobile ?? ""),
											target: "_blank",
											rel: "noreferrer",
											"aria-label": "WhatsApp",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" })
										})
									})]
								})]
							}, f.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Recent leads",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leads",
						className: "text-xs font-semibold text-primary",
						children: "View all"
					}),
					children: leads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No leads yet",
						description: "Add your first enquiry to get started.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/leads/new",
								children: "Add lead"
							})
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: leads.slice(0, 5).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/leads/$leadId",
							params: { leadId: l.id },
							className: "flex items-center justify-between gap-2 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: l.customer_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: l.mobile
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								label: labelOf(LEAD_STATUSES, l.status),
								value: l.status
							})]
						}) }, l.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Recent activity",
					children: (data?.activity ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Activity will appear here as your team works."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2.5",
						children: data.activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-2 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: a.action
								}),
								a.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: a.detail
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: formatDateTime(a.created_at)
								})
							] })]
						}, a.id))
					})
				})
			]
		})]
	});
}
//#endregion
export { Dashboard as component };
