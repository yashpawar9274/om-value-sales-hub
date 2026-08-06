import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { v as toneClassFor } from "./crm-BJUNW1E2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-ui-BV9tP90-.js
var import_jsx_runtime = require_jsx_runtime();
function StatusChip({ label, value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", toneClassFor(value ?? label.toLowerCase()), className),
		children: label
	});
}
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card flex flex-col items-center gap-2 px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xs text-sm text-muted-foreground",
				children: description
			}) : null,
			action
		]
	});
}
function SectionCard({ title, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("surface-card p-4", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-bold tracking-tight text-foreground",
				children: title
			}), action]
		}), children]
	});
}
function StatTile({ label, value, hint, tone = "primary" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 text-2xl font-bold tabular-nums", {
					primary: "text-primary",
					success: "text-success",
					warning: "text-warning",
					danger: "text-destructive",
					info: "text-info"
				}[tone]),
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { StatusChip as i, SectionCard as n, StatTile as r, EmptyState as t };
