import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Cilnn9eP.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useAuth } from "./router-C6PQqzYT.mjs";
import { t as AppShell } from "./crm-BJUNW1E2.mjs";
import { r as emptyLead, t as LeadForm } from "./LeadForm-BB6H3wVB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-CYRp8dZI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewLead() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const [values, setValues] = (0, import_react.useState)(emptyLead());
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [duplicate, setDuplicate] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const mobile = values.mobile.trim();
		if (mobile.length < 8) {
			setDuplicate(null);
			return;
		}
		let cancelled = false;
		const t = setTimeout(async () => {
			const { data } = await supabase.from("leads").select("customer_name").eq("mobile", mobile).limit(1);
			if (cancelled) return;
			setDuplicate(data && data.length > 0 ? `A lead already exists for this number (${data[0].customer_name}).` : null);
		}, 400);
		return () => {
			cancelled = true;
			clearTimeout(t);
		};
	}, [values.mobile]);
	async function handleSubmit() {
		setSaving(true);
		const { data, error } = await supabase.from("leads").insert({
			customer_name: values.customer_name.trim(),
			mobile: values.mobile.trim(),
			alternate_mobile: values.alternate_mobile.trim() || null,
			email: values.email.trim() || null,
			budget: values.budget ? Number(values.budget) : null,
			configuration: values.configuration.trim() || null,
			source: values.source,
			priority: values.priority,
			status: values.status,
			assigned_to: values.assigned_to || user?.id || null,
			location: values.location.trim() || null,
			notes: values.notes.trim() || null,
			created_by: user.id
		}).select("id").single();
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		await supabase.from("activity_logs").insert({
			actor_id: user?.id ?? null,
			lead_id: data.id,
			action: "Lead created",
			detail: values.customer_name.trim()
		});
		queryClient.invalidateQueries();
		toast.success("Lead added");
		navigate({
			to: "/leads/$leadId",
			params: { leadId: data.id },
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Add lead",
		subtitle: "Capture a new enquiry",
		back: "/leads",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadForm, {
			value: values,
			onChange: setValues,
			onSubmit: handleSubmit,
			submitting: saving,
			submitLabel: "Save lead",
			duplicateWarning: duplicate
		})
	});
}
//#endregion
export { NewLead as component };
