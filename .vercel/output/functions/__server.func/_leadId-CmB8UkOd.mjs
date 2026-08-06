import { i as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/client-Cilnn9eP.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as Route$1, r as useAuth } from "./_ssr/router-C6PQqzYT.mjs";
import { c as MessageCircle, l as MapPin, s as Phone } from "./_libs/lucide-react.mjs";
import { _ as telHref, a as LEAD_STATUSES, c as VISIT_STATUSES, d as formatCurrency, f as formatDate, h as mapsHref, i as LEAD_SOURCES, m as labelOf, n as FOLLOWUP_STATUSES, p as formatDateTime, t as AppShell, y as whatsappHref } from "./_ssr/crm-BJUNW1E2.mjs";
import { i as StatusChip, n as SectionCard } from "./_ssr/crm-ui-BV9tP90-.mjs";
import { t as Button } from "./_ssr/button-Bq5vK6RO.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-CCJRliUM.mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-Dg1urBTx.mjs";
import { i as leadToForm, n as Textarea, t as LeadForm } from "./_ssr/LeadForm-BB6H3wVB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_leadId-CmB8UkOd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LeadDetail() {
	const { leadId } = Route$1.useParams();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [note, setNote] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(null);
	const [followDate, setFollowDate] = (0, import_react.useState)("");
	const [followNote, setFollowNote] = (0, import_react.useState)("");
	const [visitDate, setVisitDate] = (0, import_react.useState)("");
	const [visitProject, setVisitProject] = (0, import_react.useState)("");
	const [visitLocation, setVisitLocation] = (0, import_react.useState)("");
	const refresh = () => queryClient.invalidateQueries();
	const { data, isLoading } = useQuery({
		queryKey: ["lead", leadId],
		queryFn: async () => {
			const [lead, notes, follows, visits, bookings, logs] = await Promise.all([
				supabase.from("leads").select("*").eq("id", leadId).maybeSingle(),
				supabase.from("lead_notes").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
				supabase.from("follow_ups").select("*").eq("lead_id", leadId).order("due_at", { ascending: false }),
				supabase.from("site_visits").select("*").eq("lead_id", leadId).order("visit_at", { ascending: false }),
				supabase.from("bookings").select("*").eq("lead_id", leadId).order("booking_date", { ascending: false }),
				supabase.from("activity_logs").select("*").eq("lead_id", leadId).order("created_at", { ascending: false })
			]);
			return {
				lead: lead.data ?? null,
				notes: notes.data ?? [],
				follows: follows.data ?? [],
				visits: visits.data ?? [],
				bookings: bookings.data ?? [],
				logs: logs.data ?? []
			};
		}
	});
	const lead = data?.lead ?? null;
	const saveLead = useMutation({
		mutationFn: async (values) => {
			const { error } = await supabase.from("leads").update({
				customer_name: values.customer_name.trim(),
				mobile: values.mobile.trim(),
				alternate_mobile: values.alternate_mobile.trim() || null,
				email: values.email.trim() || null,
				budget: values.budget ? Number(values.budget) : null,
				configuration: values.configuration.trim() || null,
				source: values.source,
				priority: values.priority,
				status: values.status,
				assigned_to: values.assigned_to || null,
				location: values.location.trim() || null,
				notes: values.notes.trim() || null
			}).eq("id", leadId);
			if (error) throw error;
			await supabase.from("activity_logs").insert({
				actor_id: user?.id ?? null,
				lead_id: leadId,
				action: "Lead updated",
				detail: `Status: ${labelOf(LEAD_STATUSES, values.status)}`
			});
		},
		onSuccess: () => {
			toast.success("Lead updated");
			setEditing(false);
			refresh();
		},
		onError: (e) => toast.error(e.message)
	});
	async function changeStatus(status) {
		const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
		if (error) {
			toast.error(error.message);
			return;
		}
		await supabase.from("activity_logs").insert({
			actor_id: user?.id ?? null,
			lead_id: leadId,
			action: "Status changed",
			detail: labelOf(LEAD_STATUSES, status)
		});
		toast.success("Status updated");
		refresh();
	}
	async function addNote() {
		if (!note.trim()) return;
		const { error } = await supabase.from("lead_notes").insert({
			lead_id: leadId,
			note: note.trim(),
			created_by: user.id
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		setNote("");
		refresh();
	}
	async function addFollowUp() {
		if (!followDate) {
			toast.error("Pick a date and time");
			return;
		}
		const { error } = await supabase.from("follow_ups").insert({
			lead_id: leadId,
			due_at: new Date(followDate).toISOString(),
			notes: followNote.trim() || null,
			created_by: user.id,
			assigned_to: lead?.assigned_to ?? user.id
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		setFollowDate("");
		setFollowNote("");
		toast.success("Follow-up scheduled");
		refresh();
	}
	async function completeFollowUp(id, status) {
		const { error } = await supabase.from("follow_ups").update({
			status,
			completed_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		refresh();
	}
	async function addVisit() {
		if (!visitDate) {
			toast.error("Pick a visit date and time");
			return;
		}
		const { error } = await supabase.from("site_visits").insert({
			lead_id: leadId,
			visit_at: new Date(visitDate).toISOString(),
			project_name: visitProject.trim() || null,
			location: visitLocation.trim() || null,
			created_by: user.id,
			assigned_to: lead?.assigned_to ?? user.id
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		setVisitDate("");
		setVisitProject("");
		setVisitLocation("");
		toast.success("Site visit scheduled");
		refresh();
	}
	async function setVisitStatus(id, status) {
		const { error } = await supabase.from("site_visits").update({ status }).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		refresh();
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Lead",
		back: "/leads",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Loading…"
		})
	});
	if (!lead) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Lead not found",
		back: "/leads",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "This lead may have been removed."
		})
	});
	if (editing && form) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Edit lead",
		subtitle: lead.customer_name,
		back: "/leads",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadForm, {
			value: form,
			onChange: setForm,
			onSubmit: () => saveLead.mutate(form),
			submitting: saveLead.isPending,
			submitLabel: "Save changes"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			className: "mt-3 w-full",
			onClick: () => setEditing(false),
			children: "Cancel"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: lead.customer_name,
		subtitle: `${labelOf(LEAD_SOURCES, lead.source)} · added ${formatDate(lead.created_at)}`,
		back: "/leads",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "secondary",
			className: "font-semibold",
			onClick: () => {
				setForm(leadToForm(lead));
				setEditing(true);
			},
			children: "Edit"
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-card space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
						label: labelOf(LEAD_STATUSES, lead.status),
						value: lead.status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
						label: `${labelOf(LEAD_STATUSES, lead.priority) || lead.priority} priority`,
						value: lead.priority
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Mobile",
							value: lead.mobile
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Alternate",
							value: lead.alternate_mobile ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Budget",
							value: formatCurrency(lead.budget)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Configuration",
							value: lead.configuration ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Location",
							value: lead.location ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Email",
							value: lead.email ?? "—"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "h-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: telHref(lead.mobile),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), " Call"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "h-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappHref(lead.mobile, `Hi ${lead.customer_name},`),
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " Chat"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "h-11",
							disabled: !lead.location,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: mapsHref(lead.location ?? ""),
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), " Map"]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Update status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: lead.status,
						onValueChange: changeStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-11",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAD_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s.value,
							children: s.label
						}, s.value)) })]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "notes",
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "notes",
							children: "Notes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "followups",
							children: "Follow-ups"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "visits",
							children: "Visits"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "timeline",
							children: "Timeline"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "notes",
					className: "mt-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Add note",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							maxLength: 1e3,
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Call summary, requirement, objection…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-2 h-11 w-full",
							onClick: addNote,
							disabled: !note.trim(),
							children: "Save note"
						})]
					}), (data?.notes ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: n.note
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: formatDateTime(n.created_at)
						})]
					}, n.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "followups",
					className: "mt-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Schedule follow-up",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "datetime-local",
									className: "h-11",
									value: followDate,
									onChange: (e) => setFollowDate(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									maxLength: 300,
									value: followNote,
									onChange: (e) => setFollowNote(e.target.value),
									placeholder: "What to discuss",
									className: "h-11"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "h-11 w-full",
									onClick: addFollowUp,
									children: "Schedule"
								})
							]
						})
					}), (data?.follows ?? []).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-2 p-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: formatDateTime(f.due_at)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
									label: labelOf(FOLLOWUP_STATUSES, f.status),
									value: f.status
								})]
							}),
							f.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: f.notes
							}) : null,
							f.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "flex-1",
									onClick: () => completeFollowUp(f.id, "completed"),
									children: "Mark done"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "flex-1",
									onClick: () => completeFollowUp(f.id, "missed"),
									children: "Missed"
								})]
							}) : null
						]
					}, f.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "visits",
					className: "mt-3 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Schedule site visit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "datetime-local",
									className: "h-11",
									value: visitDate,
									onChange: (e) => setVisitDate(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									maxLength: 120,
									className: "h-11",
									value: visitProject,
									onChange: (e) => setVisitProject(e.target.value),
									placeholder: "Project name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									maxLength: 160,
									className: "h-11",
									value: visitLocation,
									onChange: (e) => setVisitLocation(e.target.value),
									placeholder: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "h-11 w-full",
									onClick: addVisit,
									children: "Schedule visit"
								})
							]
						})
					}), (data?.visits ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card space-y-2 p-3.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: formatDateTime(v.visit_at)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
									label: labelOf(VISIT_STATUSES, v.status),
									value: v.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [v.project_name ?? "Project TBD", v.location ? ` · ${v.location}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: v.status,
								onValueChange: (s) => setVisitStatus(v.id, s),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-10 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: VISIT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s.value,
									children: s.label
								}, s.value)) })]
							})
						]
					}, v.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "timeline",
					className: "mt-3 space-y-3",
					children: [(data?.bookings ?? []).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Booking",
						children: [data.bookings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-1.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								b.project_name ?? "Booking",
								" · ",
								formatDate(b.booking_date)
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: formatCurrency(b.booking_amount)
							})]
						}, b.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bookings",
							className: "text-xs font-semibold text-primary",
							children: "Manage bookings"
						})]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Activity",
						children: (data?.logs ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No activity recorded yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5",
							children: data.logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-2 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: l.action
									}),
									l.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: l.detail
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: formatDateTime(l.created_at)
									})
								] })]
							}, l.id))
						})
					})]
				})
			]
		})]
	});
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "truncate font-medium",
		children: value
	})] });
}
//#endregion
export { LeadDetail as component };
