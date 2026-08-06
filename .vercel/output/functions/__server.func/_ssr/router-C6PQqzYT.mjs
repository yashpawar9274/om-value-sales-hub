import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cilnn9eP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as redirect, _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C6PQqzYT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-C2mxYxHX.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var AuthContext = (0, import_react.createContext)({
	session: null,
	user: null,
	loading: true,
	profile: null,
	role: null,
	isManager: false,
	isAdmin: false
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const userId = session?.user?.id ?? null;
	const { data } = useQuery({
		queryKey: ["me", userId],
		enabled: !!userId,
		queryFn: async () => {
			const [profileRes, rolesRes] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
			const roles = (rolesRes.data ?? []).map((r) => r.role);
			const role = roles.includes("admin") ? "admin" : roles.includes("manager") ? "manager" : roles.includes("executive") ? "executive" : null;
			return {
				profile: profileRes.data ?? null,
				role
			};
		}
	});
	const value = (0, import_react.useMemo)(() => ({
		session,
		user: session?.user ?? null,
		loading,
		profile: data?.profile ?? null,
		role: data?.role ?? null,
		isManager: data?.role === "admin" || data?.role === "manager",
		isAdmin: data?.role === "admin"
	}), [
		session,
		loading,
		data
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$12 = () => import("./routes-D3Ajnwvi.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "OM Value Homes CRM — Real Estate Sales Workspace" },
		{
			name: "description",
			content: "Internal mobile-first CRM for OM Value Homes: capture leads, never miss a follow-up, schedule site visits and track bookings."
		},
		{
			property: "og:title",
			content: "OM Value Homes CRM — Real Estate Sales Workspace"
		},
		{
			property: "og:description",
			content: "Leads, follow-ups, site visits, bookings and daily reports in one mobile-first workspace."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./route-Di7iQBCH.mjs");
var Route$11 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./auth-CJ2PboGo.mjs");
var Route$10 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — OM Value Homes CRM" },
		{
			name: "description",
			content: "Secure sign-in for the OM Value Homes sales team."
		},
		{
			property: "og:title",
			content: "Sign in — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Secure sign-in for the OM Value Homes sales team."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./reset-password-BVf68WJe.mjs");
var Route$9 = createFileRoute("/reset-password")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Reset password — OM Value Homes CRM" },
		{
			name: "description",
			content: "Set a new password for your OM Value Homes CRM account."
		},
		{
			property: "og:title",
			content: "Reset password — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Set a new password for your OM Value Homes CRM account."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./bookings-0oC7yei6.mjs");
var Route$8 = createFileRoute("/_authenticated/bookings")({
	head: () => ({ meta: [
		{ title: "Bookings — OM Value Homes CRM" },
		{
			name: "description",
			content: "Confirmed bookings with amounts, payment and agreement status."
		},
		{
			property: "og:title",
			content: "Bookings — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Confirmed bookings with amounts, payment and agreement status."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard-CAiymSKC.mjs");
var Route$7 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — OM Value Homes CRM" },
		{
			name: "description",
			content: "Today's leads, follow-ups, site visits and bookings at a glance."
		},
		{
			property: "og:title",
			content: "Dashboard — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Today's leads, follow-ups, site visits and bookings at a glance."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./followups-CMrcWiSj.mjs");
var Route$6 = createFileRoute("/_authenticated/followups")({
	head: () => ({ meta: [
		{ title: "Follow-ups — OM Value Homes CRM" },
		{
			name: "description",
			content: "Track today's, upcoming and missed customer follow-ups."
		},
		{
			property: "og:title",
			content: "Follow-ups — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Track today's, upcoming and missed customer follow-ups."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./reports-WZi9i4vg.mjs");
var Route$5 = createFileRoute("/_authenticated/reports")({
	head: () => ({ meta: [
		{ title: "Reports — OM Value Homes CRM" },
		{
			name: "description",
			content: "Lead source performance, pipeline breakdown and booking revenue."
		},
		{
			property: "og:title",
			content: "Reports — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Lead source performance, pipeline breakdown and booking revenue."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./settings-3ZOa_UKa.mjs");
var Route$4 = createFileRoute("/_authenticated/settings")({
	head: () => ({ meta: [
		{ title: "Settings — OM Value Homes CRM" },
		{
			name: "description",
			content: "Your profile, team members and account controls."
		},
		{
			property: "og:title",
			content: "Settings — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Your profile, team members and account controls."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./visits-lxYCqSCV.mjs");
var Route$3 = createFileRoute("/_authenticated/visits")({
	head: () => ({ meta: [
		{ title: "Site visits — OM Value Homes CRM" },
		{
			name: "description",
			content: "Schedule and track customer site visits and their outcomes."
		},
		{
			property: "og:title",
			content: "Site visits — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Schedule and track customer site visits and their outcomes."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./leads-B5XqFsrs.mjs");
var Route$2 = createFileRoute("/_authenticated/leads/")({
	head: () => ({ meta: [
		{ title: "Leads — OM Value Homes CRM" },
		{
			name: "description",
			content: "Search, filter and manage every property enquiry in one place."
		},
		{
			property: "og:title",
			content: "Leads — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Search, filter and manage every property enquiry in one place."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_leadId-CmB8UkOd.mjs");
var Route$1 = createFileRoute("/_authenticated/leads/$leadId")({
	head: () => ({ meta: [
		{ title: "Lead details — OM Value Homes CRM" },
		{
			name: "description",
			content: "Full lead profile with notes, follow-ups, site visits and booking."
		},
		{
			property: "og:title",
			content: "Lead details — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Full lead profile with notes, follow-ups, site visits and booking."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./new-CYRp8dZI.mjs");
var Route = createFileRoute("/_authenticated/leads/new")({
	head: () => ({ meta: [
		{ title: "Add lead — OM Value Homes CRM" },
		{
			name: "description",
			content: "Capture a new property enquiry with source, budget and assignment."
		},
		{
			property: "og:title",
			content: "Add lead — OM Value Homes CRM"
		},
		{
			property: "og:description",
			content: "Capture a new property enquiry with source, budget and assignment."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AuthenticatedRouteRoute = Route$11.update({
	id: "/_authenticated",
	getParentRoute: () => Route$13
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$13
});
var ResetPasswordRoute = Route$9.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$13
});
var AuthenticatedBookingsRoute = Route$8.update({
	id: "/bookings",
	path: "/bookings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$7.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFollowupsRoute = Route$6.update({
	id: "/followups",
	path: "/followups",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportsRoute = Route$5.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedVisitsRoute = Route$3.update({
	id: "/visits",
	path: "/visits",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedLeadsIndexRoute = Route$2.update({
	id: "/leads/",
	path: "/leads/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedBookingsRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedFollowupsRoute,
	AuthenticatedReportsRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedVisitsRoute,
	AuthenticatedLeadsLeadIdRoute: Route$1.update({
		id: "/leads/$leadId",
		path: "/leads/$leadId",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedLeadsNewRoute: Route.update({
		id: "/leads/new",
		path: "/leads/new",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedLeadsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ResetPasswordRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$1 as n, useAuth as r, router_exports as t };
