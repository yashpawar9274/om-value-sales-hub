import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cilnn9eP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Receipt, l as MapPin, n as ShieldCheck, t as Users, v as CalendarCheck, y as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D3Ajnwvi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		icon: Users,
		title: "Lead management",
		text: "Capture every enquiry with duplicate detection and full history."
	},
	{
		icon: CalendarCheck,
		title: "Follow-ups",
		text: "Today, upcoming and overdue — nothing slips through."
	},
	{
		icon: MapPin,
		title: "Site visits",
		text: "Schedule, navigate and record feedback on the move."
	},
	{
		icon: Receipt,
		title: "Bookings",
		text: "Units, payments, agreements and documents in one timeline."
	}
];
function Landing() {
	const navigate = useNavigate();
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "gradient-hero px-6 pb-20 pt-20 text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.25em] opacity-80",
							children: "OM Value Homes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl",
							children: "The sales CRM built for the field, not the desk."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-base opacity-90",
							children: "Every lead, follow-up, site visit and booking in one fast mobile workspace. Call, WhatsApp or navigate in two taps."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: "secondary",
								className: "h-12 px-6 text-base font-semibold",
								onClick: () => navigate({ to: signedIn ? "/dashboard" : "/auth" }),
								children: [signedIn ? "Open dashboard" : "Sign in to CRM", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 size-4" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 flex items-center gap-2 text-xs opacity-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), " Internal use only — access is role controlled."]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto -mt-10 grid max-w-3xl gap-3 px-4 pb-16 sm:grid-cols-2",
				children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-sm font-bold",
							children: f.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: f.text
						})
					]
				}, f.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border px-6 py-8 text-center text-xs text-muted-foreground",
				children: ["OM Value Homes CRM · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					children: "Team sign in"
				})]
			})
		]
	});
}
//#endregion
export { Landing as component };
