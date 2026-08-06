import { t as supabase } from "./client-Cilnn9eP.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as formatCurrency, f as formatDate, m as labelOf, o as PAYMENT_STATUSES, t as AppShell } from "./crm-BJUNW1E2.mjs";
import { i as StatusChip, t as EmptyState } from "./crm-ui-BV9tP90-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookings-0oC7yei6.js
var import_jsx_runtime = require_jsx_runtime();
function BookingsPage() {
	const { data = [], isLoading } = useQuery({
		queryKey: ["bookings"],
		queryFn: async () => {
			const { data } = await supabase.from("bookings").select("id, booking_amount, received_amount, booking_date, payment_status, project_name, unit_number, lead_id, leads(customer_name)").order("booking_date", { ascending: false });
			return data ?? [];
		}
	});
	const total = data.reduce((sum, b) => sum + Number(b.booking_amount ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Bookings",
		subtitle: `${data.length} bookings · ${formatCurrency(total)}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2.5",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-sm text-muted-foreground",
				children: "Loading…"
			}) : data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No bookings yet",
				description: "Bookings appear here once a lead converts."
			}) : data.map((b) => {
				const lead = b.leads;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/leads/$leadId",
					params: { leadId: b.lead_id },
					className: "surface-card flex items-center justify-between gap-3 p-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold",
							children: lead?.customer_name ?? "Customer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								b.project_name ?? "Project",
								b.unit_number ? ` · ${b.unit_number}` : "",
								" · ",
								formatDate(b.booking_date)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: formatCurrency(b.booking_amount)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
							label: labelOf(PAYMENT_STATUSES, b.payment_status),
							value: b.payment_status
						})]
					})]
				}, b.id);
			})
		})
	});
}
//#endregion
export { BookingsPage as component };
