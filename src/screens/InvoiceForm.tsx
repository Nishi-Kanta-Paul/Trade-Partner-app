import { ScreenHeader } from "@/components/ScreenHeader";
import { sendSubmission } from "@/lib/submit";
import { AccentProvider } from "@/lib/accents";
import { Field } from "@/components/form/Field";
import { MoneyInput, TextArea, TextInput } from "@/components/form/TextInput";
import { CheckboxGroup, RadioGroup } from "@/components/form/Choice";
import {
  StepCard,
  StepDots,
  SubmittedScreen,
  Summary,
  SummaryList,
  WizardActions,
  useWizard,
} from "@/components/form/Wizard";
import {
  EMPTY_INVOICE,
  INVOICE_CONTACT_EMAIL,
  PAYMENT_DETAIL,
  PAYMENT_METHODS,
  SERVICES_PROVIDED,
  type InvoiceValues,
  invoicePayload,
} from "@/data/invoice";

const STEPS = ["Invoice", "Billing", "Payment", "You", "Review"] as const;

/** This screen belongs to the "emerald" stage — it wears that colour. */
const ACCENT = "emerald" as const;

const REQUIRED: Record<number, string[]> = {
  0: ["date", "projectName", "street", "city", "state"],
  1: ["billingAmount", "services", "serviceStart", "serviceEnd", "billingNotes"],
  2: ["paymentMethod", "paymentDetail"],
  3: ["firstName", "lastName", "email", "phone"],
  4: [],
};

export default function InvoiceForm() {
  const w = useWizard<InvoiceValues & Record<string, never>>(
    EMPTY_INVOICE as InvoiceValues & Record<string, never>,
    REQUIRED,
    STEPS.length,
    (values) => sendSubmission("invoice", values, invoicePayload(values)),
  );
  const v = w.values;
  const payment = PAYMENT_DETAIL[v.paymentMethod];

  if (w.submitted)
    return (
      <SubmittedScreen
        accent={ACCENT}
        title="Invoice submitted"
        message="Your payment request is with the office. They'll be in touch if anything is missing."
      />
    );

  return (
    <AccentProvider accent={ACCENT}>
      <div className="min-h-dvh bg-slate-50 dark:bg-[#0a1426]">
        <ScreenHeader
          title="Partner Invoice"
          subtitle={`Step ${w.step + 1} of ${STEPS.length} — ${STEPS[w.step]}`}
          accent={ACCENT}
          progress={(w.step + (w.stepComplete ? 1 : 0)) / STEPS.length}
          onBack={w.back}
        />

        <main className="mx-auto max-w-2xl px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-40">
          <StepDots steps={STEPS} step={w.step} accent={ACCENT} />

          {w.step === 0 ? (
            <StepCard
              accent={ACCENT}
              title="What are you billing for?"
              blurb="One invoice per payment request keeps things moving."
            >
              <Field label="Today's date" required error={w.errorFor("date")}>
                <TextInput
                  type="date"
                  value={v.date}
                  invalid={!!w.errorFor("date")}
                  onChange={(e) => w.set("date", e.target.value)}
                />
              </Field>

              <Field
                label="Project name"
                hint='If this was a "Caller" job, put CALLER here.'
                required
                error={w.errorFor("projectName")}
              >
                <TextInput
                  value={v.projectName}
                  invalid={!!w.errorFor("projectName")}
                  onChange={(e) => w.set("projectName", e.target.value)}
                />
              </Field>

              <Field
                label="Project address"
                required
                error={w.errorFor("street") ?? w.errorFor("city") ?? w.errorFor("state")}
              >
                <div className="space-y-2.5">
                  <TextInput
                    placeholder="Street address"
                    autoComplete="address-line1"
                    value={v.street}
                    invalid={!!w.errorFor("street")}
                    onChange={(e) => w.set("street", e.target.value)}
                  />
                  <TextInput
                    placeholder="Street address line 2 (optional)"
                    autoComplete="address-line2"
                    value={v.street2}
                    onChange={(e) => w.set("street2", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <TextInput
                      placeholder="City"
                      autoComplete="address-level2"
                      value={v.city}
                      invalid={!!w.errorFor("city")}
                      onChange={(e) => w.set("city", e.target.value)}
                    />
                    <TextInput
                      placeholder="State / Province"
                      autoComplete="address-level1"
                      value={v.state}
                      invalid={!!w.errorFor("state")}
                      onChange={(e) => w.set("state", e.target.value)}
                    />
                  </div>
                </div>
              </Field>
            </StepCard>
          ) : null}

          {w.step === 1 ? (
            <StepCard
              accent={ACCENT}
              title="Billing"
              blurb="The amount, the work, and the dates it covers."
            >
              <Field label="Billing amount" required error={w.errorFor("billingAmount")}>
                <MoneyInput
                  placeholder="0.00"
                  value={v.billingAmount}
                  invalid={!!w.errorFor("billingAmount")}
                  onChange={(e) => w.set("billingAmount", e.target.value)}
                />
              </Field>

              <Field
                label="Service provided"
                hint={`${v.services.length} selected`}
                required
                error={w.errorFor("services")}
              >
                <CheckboxGroup
                  options={SERVICES_PROVIDED}
                  value={v.services}
                  onChange={(value) => w.set("services", value)}
                />
              </Field>

              <Field
                label="Service start date"
                required
                error={w.errorFor("serviceStart")}
              >
                <TextInput
                  type="date"
                  value={v.serviceStart}
                  invalid={!!w.errorFor("serviceStart")}
                  onChange={(e) => w.set("serviceStart", e.target.value)}
                />
              </Field>

              <Field
                label="Service completion date"
                required
                error={w.errorFor("serviceEnd")}
              >
                <TextInput
                  type="date"
                  min={v.serviceStart || undefined}
                  value={v.serviceEnd}
                  invalid={!!w.errorFor("serviceEnd")}
                  onChange={(e) => w.set("serviceEnd", e.target.value)}
                />
              </Field>

              <Field
                label="What services and dates does this amount cover?"
                hint="In your own words — this is what the office checks the amount against."
                required
                error={w.errorFor("billingNotes")}
              >
                <TextArea
                  value={v.billingNotes}
                  invalid={!!w.errorFor("billingNotes")}
                  onChange={(e) => w.set("billingNotes", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}

          {w.step === 2 ? (
            <StepCard
              accent={ACCENT}
              title="How should we pay you?"
              blurb="Pick one — details follow."
            >
              <Field
                label="Payment preference"
                required
                error={w.errorFor("paymentMethod")}
              >
                <RadioGroup
                  options={PAYMENT_METHODS}
                  value={v.paymentMethod}
                  onChange={(value) => {
                    w.set("paymentMethod", value);
                    w.set("paymentDetail", "");
                  }}
                />
              </Field>

              {payment ? (
                <Field
                  label={payment.label}
                  hint={payment.hint}
                  required
                  error={w.errorFor("paymentDetail")}
                >
                  <TextInput
                    placeholder={payment.placeholder}
                    value={v.paymentDetail}
                    invalid={!!w.errorFor("paymentDetail")}
                    onChange={(e) => w.set("paymentDetail", e.target.value)}
                  />
                </Field>
              ) : null}
            </StepCard>
          ) : null}

          {w.step === 3 ? (
            <StepCard
              accent={ACCENT}
              title="Who's invoicing"
              blurb="So the payment reaches the right person."
            >
              <Field
                label="Your name"
                required
                error={w.errorFor("firstName") ?? w.errorFor("lastName")}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="First name"
                    autoComplete="given-name"
                    value={v.firstName}
                    invalid={!!w.errorFor("firstName")}
                    onChange={(e) => w.set("firstName", e.target.value)}
                  />
                  <TextInput
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={v.lastName}
                    invalid={!!w.errorFor("lastName")}
                    onChange={(e) => w.set("lastName", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Company name">
                <TextInput
                  autoComplete="organization"
                  value={v.company}
                  onChange={(e) => w.set("company", e.target.value)}
                />
              </Field>

              <Field label="Email address" required error={w.errorFor("email")}>
                <TextInput
                  type="email"
                  inputMode="email"
                  placeholder="example@example.com"
                  autoComplete="email"
                  value={v.email}
                  invalid={!!w.errorFor("email")}
                  onChange={(e) => w.set("email", e.target.value)}
                />
              </Field>

              <Field label="Phone number" required error={w.errorFor("phone")}>
                <TextInput
                  type="tel"
                  inputMode="tel"
                  placeholder="(000) 000-0000"
                  autoComplete="tel"
                  value={v.phone}
                  invalid={!!w.errorFor("phone")}
                  onChange={(e) => w.set("phone", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}

          {w.step === 4 ? (
            <StepCard
              accent={ACCENT}
              title="Review & submit"
              blurb="Check the amount before it goes in."
            >
              {/* The number is the whole point of this form, so lead with it. */}
              <div className="bg-navy rounded-2xl p-5 text-white dark:bg-white/[.06]">
                <p className="text-[13px] font-bold tracking-wide text-white/60 uppercase">
                  Billing amount
                </p>
                <p className="mt-1 text-4xl font-extrabold tabular-nums">
                  ${v.billingAmount || "0.00"}
                </p>
                <p className="mt-2 text-[14px] text-white/70">
                  {v.paymentMethod ? `via ${v.paymentMethod}` : "Payment method not set"}
                  {v.paymentDetail ? ` — ${v.paymentDetail}` : ""}
                </p>
              </div>

              <SummaryList>
                <Summary label="Project" value={v.projectName} />
                <Summary
                  label="Address"
                  value={[v.street, v.street2, v.city, v.state]
                    .filter(Boolean)
                    .join(", ")}
                />
                <Summary label="Services" value={v.services.join(", ")} />
                <Summary
                  label="Service dates"
                  value={[v.serviceStart, v.serviceEnd].filter(Boolean).join(" → ")}
                />
                <Summary
                  label="Invoiced by"
                  value={`${v.firstName} ${v.lastName}`.trim()}
                />
                <Summary label="Company" value={v.company} />
                <Summary label="Email" value={v.email} />
              </SummaryList>

              <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                Questions about invoicing?{" "}
                <a
                  href={`mailto:${INVOICE_CONTACT_EMAIL}`}
                  className="text-navy dark:text-brand font-bold underline"
                >
                  {INVOICE_CONTACT_EMAIL}
                </a>
              </p>
            </StepCard>
          ) : null}
        </main>

        <WizardActions
          step={w.step}
          lastStep={STEPS.length - 1}
          stepComplete={w.stepComplete}
          onBack={w.back}
          onNext={w.next}
          onSubmit={w.submit}
          accent={ACCENT}
          sending={w.sending}
          error={w.error}
          submitLabel="Submit invoice"
        />
      </div>
    </AccentProvider>
  );
}
