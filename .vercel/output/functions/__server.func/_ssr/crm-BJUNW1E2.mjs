import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { _ as ChartColumn, a as Receipt, d as LayoutDashboard, l as MapPin, m as ChevronLeft, r as Settings, t as Users, v as CalendarCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-BJUNW1E2.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/dashboard",
		label: "Home",
		icon: LayoutDashboard
	},
	{
		to: "/leads",
		label: "Leads",
		icon: Users
	},
	{
		to: "/followups",
		label: "Follow-up",
		icon: CalendarCheck
	},
	{
		to: "/visits",
		label: "Visits",
		icon: MapPin
	},
	{
		to: "/settings",
		label: "More",
		icon: Settings
	}
];
var DESKTOP_NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/leads",
		label: "Leads",
		icon: Users
	},
	{
		to: "/followups",
		label: "Follow-ups",
		icon: CalendarCheck
	},
	{
		to: "/visits",
		label: "Site Visits",
		icon: MapPin
	},
	{
		to: "/bookings",
		label: "Bookings",
		icon: Receipt
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell({ title, subtitle, action, back, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "no-print fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-sidebar px-3 py-5 lg:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold tracking-tight text-sidebar-foreground",
						children: "OM Value Homes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Sales CRM"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-1",
					children: DESKTOP_NAV.map((item) => {
						const active = pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "no-print sticky top-0 z-30 gradient-hero px-4 pb-5 pt-6 text-primary-foreground shadow-[var(--shadow-card)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-4xl items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							back ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: back,
								className: "mb-1 inline-flex items-center gap-1 text-xs font-semibold opacity-85",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-3.5" }), " Back"]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl font-bold tracking-tight",
								children: title
							}),
							subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-sm opacity-85",
								children: subtitle
							}) : null
						] }), action]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto max-w-4xl px-4 pb-28 pt-4 lg:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-lg",
					children: NAV.map((item) => {
						const active = pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors", active ? "text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex size-9 items-center justify-center rounded-xl transition-colors", active && "bg-primary-soft"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" })
							}), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
var LEAD_STATUSES = [
	{
		value: "new",
		label: "New"
	},
	{
		value: "contacted",
		label: "Contacted"
	},
	{
		value: "interested",
		label: "Interested"
	},
	{
		value: "follow_up",
		label: "Follow-up"
	},
	{
		value: "site_visit_scheduled",
		label: "Site Visit Scheduled"
	},
	{
		value: "visited",
		label: "Visited"
	},
	{
		value: "negotiation",
		label: "Negotiation"
	},
	{
		value: "booked",
		label: "Booked"
	},
	{
		value: "lost",
		label: "Lost"
	},
	{
		value: "hold",
		label: "Hold"
	}
];
var LEAD_SOURCES = [
	{
		value: "facebook",
		label: "Facebook"
	},
	{
		value: "instagram",
		label: "Instagram"
	},
	{
		value: "google",
		label: "Google"
	},
	{
		value: "whatsapp",
		label: "WhatsApp"
	},
	{
		value: "walk_in",
		label: "Walk-in"
	},
	{
		value: "reference",
		label: "Reference"
	},
	{
		value: "property_portal",
		label: "Property Portal"
	},
	{
		value: "others",
		label: "Others"
	}
];
var LEAD_PRIORITIES = [
	{
		value: "high",
		label: "High"
	},
	{
		value: "medium",
		label: "Medium"
	},
	{
		value: "low",
		label: "Low"
	}
];
var FOLLOWUP_STATUSES = [
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "completed",
		label: "Completed"
	},
	{
		value: "missed",
		label: "Missed"
	},
	{
		value: "rescheduled",
		label: "Rescheduled"
	}
];
var VISIT_STATUSES = [
	{
		value: "scheduled",
		label: "Scheduled"
	},
	{
		value: "completed",
		label: "Completed"
	},
	{
		value: "cancelled",
		label: "Cancelled"
	},
	{
		value: "no_show",
		label: "No Show"
	}
];
var PAYMENT_STATUSES = [
	{
		value: "pending",
		label: "Pending"
	},
	{
		value: "partial",
		label: "Partial"
	},
	{
		value: "completed",
		label: "Completed"
	},
	{
		value: "cancelled",
		label: "Cancelled"
	}
];
var ROLES = [
	{
		value: "admin",
		label: "Admin"
	},
	{
		value: "manager",
		label: "Sales Manager"
	},
	{
		value: "executive",
		label: "Sales Executive"
	}
];
function labelOf(list, value) {
	return list.find((item) => item.value === value)?.label ?? "—";
}
var STATUS_TONE = {
	new: "info",
	contacted: "neutral",
	interested: "primary",
	follow_up: "warning",
	site_visit_scheduled: "primary",
	visited: "info",
	negotiation: "warning",
	booked: "success",
	lost: "danger",
	hold: "neutral",
	pending: "warning",
	completed: "success",
	missed: "danger",
	rescheduled: "info",
	scheduled: "info",
	cancelled: "danger",
	no_show: "danger",
	partial: "warning",
	high: "danger",
	medium: "warning",
	low: "neutral"
};
var TONE_CLASS = {
	neutral: "bg-muted text-muted-foreground",
	info: "bg-info/12 text-info",
	success: "bg-success/14 text-success",
	warning: "bg-warning/18 text-warning",
	danger: "bg-destructive/12 text-destructive",
	primary: "bg-primary/12 text-primary"
};
function toneClassFor(value) {
	return TONE_CLASS[STATUS_TONE[value ?? ""] ?? "neutral"];
}
function formatCurrency(value) {
	if (value === null || value === void 0) return "—";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(value);
}
function formatDate(value) {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function formatDateTime(value) {
	if (!value) return "—";
	return new Date(value).toLocaleString("en-IN", {
		day: "2-digit",
		month: "short",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function startOfToday() {
	const d = /* @__PURE__ */ new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}
function endOfToday() {
	const d = /* @__PURE__ */ new Date();
	d.setHours(23, 59, 59, 999);
	return d;
}
function sanitizePhone(phone) {
	return phone.replace(/[^\d+]/g, "");
}
function telHref(phone) {
	return `tel:${sanitizePhone(phone)}`;
}
function whatsappHref(phone, message) {
	const digits = sanitizePhone(phone).replace(/^\+/, "");
	return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
function mapsHref(location) {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
function toCsv(rows) {
	if (rows.length === 0) return "";
	const headers = Object.keys(rows[0]);
	const escape = (v) => {
		const s = v === null || v === void 0 ? "" : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	return [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))].join("\n");
}
function downloadCsv(filename, rows) {
	const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { telHref as _, LEAD_STATUSES as a, VISIT_STATUSES as c, formatCurrency as d, formatDate as f, startOfToday as g, mapsHref as h, LEAD_SOURCES as i, downloadCsv as l, labelOf as m, FOLLOWUP_STATUSES as n, PAYMENT_STATUSES as o, formatDateTime as p, LEAD_PRIORITIES as r, ROLES as s, AppShell as t, endOfToday as u, toneClassFor as v, whatsappHref as y };
