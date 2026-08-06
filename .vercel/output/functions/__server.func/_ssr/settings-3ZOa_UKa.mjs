import { t as supabase } from "./client-Cilnn9eP.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useAuth } from "./router-C6PQqzYT.mjs";
import { u as LogOut } from "../_libs/lucide-react.mjs";
import { m as labelOf, s as ROLES, t as AppShell } from "./crm-BJUNW1E2.mjs";
import { n as SectionCard } from "./crm-ui-BV9tP90-.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-3ZOa_UKa.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { profile, role, isManager } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: team = [] } = useQuery({
		queryKey: ["team-settings"],
		enabled: isManager,
		queryFn: async () => {
			const { data } = await supabase.from("profiles").select("id, full_name, email, phone").order("full_name");
			return data ?? [];
		}
	});
	async function signOut() {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		toast.success("Signed out");
		navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Settings",
		subtitle: "Profile and team",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Your profile",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Name",
								value: profile?.full_name || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Email",
								value: profile?.email || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Phone",
								value: profile?.phone || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Role",
								value: role ? labelOf(ROLES, role) : "—"
							})
						]
					})
				}),
				isManager ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Team",
					children: team.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No team members yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: team.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: t.full_name || t.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [t.email, t.phone ? ` · ${t.phone}` : ""]
							})]
						}, t.id))
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "h-12 w-full",
					onClick: signOut,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
				})
			]
		})
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "truncate font-medium",
			children: value
		})]
	});
}
//#endregion
export { SettingsPage as component };
