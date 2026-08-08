import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SubmitSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(8).max(20),
  data: z.record(z.string(), z.string().max(2000)).default({}),
});

export const Route = createFileRoute("/api/public/enquiry/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("enquiry_forms")
          .select("id, title, description, fields, is_active")
          .eq("slug", params.slug)
          .maybeSingle();

        if (error) return Response.json({ error: "Could not load form" }, { status: 500 });
        if (!data || !data.is_active) return Response.json({ error: "Form not found" }, { status: 404 });

        return Response.json({
          title: data.title,
          description: data.description,
          fields: data.fields,
        });
      },

      POST: async ({ request, params }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const parsed = SubmitSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Please fill name and a valid mobile number" }, { status: 400 });
        }

        const { data: form } = await supabaseAdmin
          .from("enquiry_forms")
          .select("id, title, created_by, is_active")
          .eq("slug", params.slug)
          .maybeSingle();

        if (!form || !form.is_active) return Response.json({ error: "Form not found" }, { status: 404 });

        const answers = parsed.data.data;
        const notes = Object.entries(answers)
          .filter(([, value]) => value.trim().length > 0)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");

        const { data: lead, error: leadError } = await supabaseAdmin
          .from("leads")
          .insert({
            customer_name: parsed.data.customer_name,
            mobile: parsed.data.mobile,
            source: "others",
            status: "new",
            notes: notes ? `Enquiry form: ${form.title}\n${notes}` : `Enquiry form: ${form.title}`,
            created_by: form.created_by,
          })
          .select("id")
          .maybeSingle();

        if (leadError) {
          console.error("Enquiry lead insert failed", leadError);
          return Response.json({ error: "Could not submit right now" }, { status: 500 });
        }

        const { error: submissionError } = await supabaseAdmin.from("enquiry_submissions").insert({
          form_id: form.id,
          data: answers,
          customer_name: parsed.data.customer_name,
          mobile: parsed.data.mobile,
          lead_id: lead?.id ?? null,
        });

        if (submissionError) {
          console.error("Enquiry submission insert failed", submissionError);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
