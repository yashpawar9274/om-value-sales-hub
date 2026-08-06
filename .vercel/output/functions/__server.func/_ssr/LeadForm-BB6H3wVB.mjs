import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cilnn9eP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as LEAD_STATUSES, i as LEAD_SOURCES, r as LEAD_PRIORITIES } from "./crm-BJUNW1E2.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LeadForm-BB6H3wVB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function emptyLead() {
	return {
		customer_name: "",
		mobile: "",
		alternate_mobile: "",
		email: "",
		budget: "",
		configuration: "",
		source: "others",
		priority: "medium",
		status: "new",
		assigned_to: "",
		location: "",
		notes: ""
	};
}
function leadToForm(lead) {
	return {
		customer_name: lead.customer_name,
		mobile: lead.mobile,
		alternate_mobile: lead.alternate_mobile ?? "",
		email: lead.email ?? "",
		budget: lead.budget !== null ? String(lead.budget) : "",
		configuration: lead.configuration ?? "",
		source: lead.source,
		priority: lead.priority,
		status: lead.status,
		assigned_to: lead.assigned_to ?? "",
		location: lead.location ?? "",
		notes: lead.notes ?? ""
	};
}
function LeadForm({ value, onChange, onSubmit, submitting, submitLabel, duplicateWarning }) {
	const [errors, setErrors] = (0, import_react.useState)({});
	const { data: team = [] } = useQuery({
		queryKey: ["team"],
		queryFn: async () => {
			const { data } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
			return data ?? [];
		}
	});
	const set = (patch) => onChange({
		...value,
		...patch
	});
	function handleSubmit(e) {
		e.preventDefault();
		const next = {};
		if (!value.customer_name.trim()) next["customer_name"] = "Customer name is required";
		if (!/^[\d+\-\s()]{8,15}$/.test(value.mobile.trim())) next["mobile"] = "Enter a valid mobile number";
		if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) next["email"] = "Enter a valid email";
		setErrors(next);
		if (Object.keys(next).length > 0) return;
		onSubmit();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Customer name",
						error: errors["customer_name"],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: value.customer_name,
							maxLength: 100,
							onChange: (e) => set({ customer_name: e.target.value }),
							placeholder: "e.g. Ramesh Patel"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Mobile number",
						error: errors["mobile"],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: value.mobile,
							inputMode: "tel",
							maxLength: 15,
							onChange: (e) => set({ mobile: e.target.value }),
							placeholder: "9876543210"
						}), duplicateWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-warning",
							children: duplicateWarning
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Alternate number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: value.alternate_mobile,
							inputMode: "tel",
							maxLength: 15,
							onChange: (e) => set({ alternate_mobile: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						error: errors["email"],
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							maxLength: 255,
							value: value.email,
							onChange: (e) => set({ email: e.target.value })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card grid gap-3 p-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Budget (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: value.budget,
							onChange: (e) => set({ budget: e.target.value.replace(/[^\d]/g, "") }),
							placeholder: "4500000"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Configuration",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: value.configuration,
							maxLength: 50,
							onChange: (e) => set({ configuration: e.target.value }),
							placeholder: "2 BHK"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lead source",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: value.source,
							onValueChange: (v) => set({ source: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAD_SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s.value,
								children: s.label
							}, s.value)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Priority",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: value.priority,
							onValueChange: (v) => set({ priority: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAD_PRIORITIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s.value,
								children: s.label
							}, s.value)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: value.status,
							onValueChange: (v) => set({ status: v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAD_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s.value,
								children: s.label
							}, s.value)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Assigned executive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: value.assigned_to || "unassigned",
							onValueChange: (v) => set({ assigned_to: v === "unassigned" ? "" : v }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "unassigned",
								children: "Unassigned"
							}), team.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t.id,
								children: t.full_name || t.email || "Team member"
							}, t.id))] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Location / area",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: value.location,
								maxLength: 160,
								onChange: (e) => set({ location: e.target.value })
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 4,
						maxLength: 1e3,
						value: value.notes,
						onChange: (e) => set({ notes: e.target.value })
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "h-12 w-full text-base font-semibold",
				disabled: submitting,
				children: submitting ? "Saving…" : submitLabel
			})
		]
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-destructive",
				children: error
			}) : null
		]
	});
}
//#endregion
export { leadToForm as i, Textarea as n, emptyLead as r, LeadForm as t };
