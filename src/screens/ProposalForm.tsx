import { ScreenHeader } from "@/components/ScreenHeader";
import { AccentProvider } from "@/lib/accents";
import { Field } from "@/components/form/Field";
import { MoneyInput, TextArea, TextInput } from "@/components/form/TextInput";
import { CheckboxGroup, RadioGroup, YesNo } from "@/components/form/Choice";
import {
  AGREEMENTS,
  EMPTY_PROPOSAL,
  OPPORTUNITY_TYPES,
  SERVICES,
  type ProposalValues,
} from "@/data/proposal";
import {
  StepCard,
  StepDots,
  SubmittedScreen,
  Summary,
  SummaryList,
  WizardActions,
  useWizard,
} from "@/components/form/Wizard";

const STEPS = ["Opportunity", "About you", "The job", "Agreements", "Review"] as const;

/** This screen belongs to the "sky" stage — it wears that colour. */
const ACCENT = "sky" as const;

/** Which fields must be filled before a step will let you move on. */
const REQUIRED: Record<number, string[]> = {
  0: ["date", "opportunityNumber", "opportunityType"],
  1: ["firstName", "lastName", "phone", "smsOk", "email", "yourCity", "yourState"],
  2: ["jobCity", "jobState", "miles", "services", "scope", "price"],
  3: AGREEMENTS.map((a) => a.name),
  4: [],
};

export default function ProposalForm() {
  const { step, values, set, errorFor, stepComplete, next, back, submitted, submit } =
    useWizard<ProposalValues>(EMPTY_PROPOSAL, REQUIRED, STEPS.length);

  if (submitted)
    return (
      <SubmittedScreen
        accent={ACCENT}
        title="Proposal sent"
        message={`Thanks${values.firstName ? `, ${values.firstName}` : ""} — the Cleaning Connected office will review it and get back to you.`}
      />
    );

  return (
    <AccentProvider accent={ACCENT}>
      <div className="min-h-dvh bg-slate-50 dark:bg-[#0a1426]">
        <ScreenHeader
          title="Partner Proposal"
          subtitle={`Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`}
          accent={ACCENT}
          progress={(step + (stepComplete ? 1 : 0)) / STEPS.length}
          onBack={back}
        />

        <main className="mx-auto max-w-2xl px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] pb-40">
          <StepDots steps={STEPS} step={step} accent={ACCENT} />

          {step === 0 ? (
            <StepCard
              accent={ACCENT}
              title="Which opportunity?"
              blurb="Complete this form to be considered for any Cleaning Connected opportunity."
            >
              <Field label="Today's date" required error={errorFor("date")}>
                <TextInput
                  type="date"
                  value={String(values.date)}
                  invalid={!!errorFor("date")}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>

              <Field
                label="Opportunity #"
                hint="Listed on the advertisement — find it on the Cleaning Connected website."
                required
                error={errorFor("opportunityNumber")}
              >
                <TextInput
                  inputMode="numeric"
                  placeholder="e.g. 23"
                  value={String(values.opportunityNumber)}
                  invalid={!!errorFor("opportunityNumber")}
                  onChange={(e) => set("opportunityNumber", e.target.value)}
                />
              </Field>

              <Field
                label="Type of opportunity"
                hint="As mentioned in the advertisement."
                required
                error={errorFor("opportunityType")}
              >
                <RadioGroup
                  options={OPPORTUNITY_TYPES}
                  value={String(values.opportunityType)}
                  onChange={(v) => set("opportunityType", v)}
                />
              </Field>
            </StepCard>
          ) : null}

          {step === 1 ? (
            <StepCard
              accent={ACCENT}
              title="About you"
              blurb="How the office reaches you about this job."
            >
              <Field
                label="Your name"
                required
                error={errorFor("firstName") ?? errorFor("lastName")}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="First name"
                    autoComplete="given-name"
                    value={String(values.firstName)}
                    invalid={!!errorFor("firstName")}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                  <TextInput
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={String(values.lastName)}
                    invalid={!!errorFor("lastName")}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Your company name">
                <TextInput
                  autoComplete="organization"
                  value={String(values.company)}
                  onChange={(e) => set("company", e.target.value)}
                />
              </Field>

              <Field label="Your phone number" required error={errorFor("phone")}>
                <TextInput
                  type="tel"
                  inputMode="tel"
                  placeholder="(000) 000-0000"
                  autoComplete="tel"
                  value={String(values.phone)}
                  invalid={!!errorFor("phone")}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>

              <Field
                label="Is it okay to send you text messages?"
                required
                error={errorFor("smsOk")}
              >
                <YesNo value={String(values.smsOk)} onChange={(v) => set("smsOk", v)} />
              </Field>

              <Field label="Your email" required error={errorFor("email")}>
                <TextInput
                  type="email"
                  inputMode="email"
                  placeholder="example@example.com"
                  autoComplete="email"
                  value={String(values.email)}
                  invalid={!!errorFor("email")}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>

              <Field
                label="Your city & state"
                required
                error={errorFor("yourCity") ?? errorFor("yourState")}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="City"
                    value={String(values.yourCity)}
                    invalid={!!errorFor("yourCity")}
                    onChange={(e) => set("yourCity", e.target.value)}
                  />
                  <TextInput
                    placeholder="State / Province"
                    value={String(values.yourState)}
                    invalid={!!errorFor("yourState")}
                    onChange={(e) => set("yourState", e.target.value)}
                  />
                </div>
              </Field>
            </StepCard>
          ) : null}

          {step === 2 ? (
            <StepCard
              accent={ACCENT}
              title="The job"
              blurb="Where it is, what you will do, and your price."
            >
              <Field
                label="Opportunity location city & state"
                required
                error={errorFor("jobCity") ?? errorFor("jobState")}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <TextInput
                    placeholder="City"
                    value={String(values.jobCity)}
                    invalid={!!errorFor("jobCity")}
                    onChange={(e) => set("jobCity", e.target.value)}
                  />
                  <TextInput
                    placeholder="State / Province"
                    value={String(values.jobState)}
                    invalid={!!errorFor("jobState")}
                    onChange={(e) => set("jobState", e.target.value)}
                  />
                </div>
              </Field>

              <Field
                label="Miles you're located from this opportunity"
                required
                error={errorFor("miles")}
              >
                <TextInput
                  inputMode="numeric"
                  placeholder="e.g. 23"
                  value={String(values.miles)}
                  invalid={!!errorFor("miles")}
                  onChange={(e) => set("miles", e.target.value)}
                />
              </Field>

              <Field
                label="Select all services you agree to provide"
                hint={`${(values.services as string[]).length} selected`}
                required
                error={errorFor("services")}
              >
                <CheckboxGroup
                  options={SERVICES}
                  value={values.services as string[]}
                  onChange={(v) => set("services", v)}
                />
              </Field>

              <Field
                label="Outline the services in your own words"
                hint="All details are required — this is what the office reviews first."
                required
                error={errorFor("scope")}
              >
                <TextArea
                  value={String(values.scope)}
                  invalid={!!errorFor("scope")}
                  onChange={(e) => set("scope", e.target.value)}
                />
              </Field>

              <Field
                label="Total price you agree to for the scope of work"
                required
                error={errorFor("price")}
              >
                <MoneyInput
                  placeholder="0.00"
                  value={String(values.price)}
                  invalid={!!errorFor("price")}
                  onChange={(e) => set("price", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}

          {step === 3 ? (
            <StepCard
              accent={ACCENT}
              title="Agreements"
              blurb="Nine confirmations from the Opportunity Announcement."
            >
              {AGREEMENTS.map((agreement, i) => (
                <Field
                  key={agreement.name}
                  label={`${i + 1}. ${agreement.title}`}
                  hint={agreement.body}
                  required
                  error={errorFor(agreement.name)}
                >
                  <YesNo
                    value={String(values[agreement.name])}
                    onChange={(v) => set(agreement.name, v)}
                  />
                </Field>
              ))}
            </StepCard>
          ) : null}

          {step === 4 ? (
            <StepCard
              accent={ACCENT}
              title="Review & submit"
              blurb="Check the details before it goes in."
            >
              <SummaryList>
                <Summary label="Opportunity #" value={String(values.opportunityNumber)} />
                <Summary label="Type" value={String(values.opportunityType)} />
                <Summary
                  label="Name"
                  value={`${values.firstName} ${values.lastName}`.trim()}
                />
                <Summary label="Company" value={String(values.company)} />
                <Summary label="Phone" value={String(values.phone)} />
                <Summary label="Email" value={String(values.email)} />
                <Summary
                  label="Job location"
                  value={`${values.jobCity}, ${values.jobState}`}
                />
                <Summary label="Distance" value={`${values.miles} miles`} />
                <Summary
                  label="Services"
                  value={(values.services as string[]).join(", ")}
                />
                <Summary label="Total price" value={`$${values.price}`} />
              </SummaryList>

              <Field label="Any additional comments for our review?">
                <TextArea
                  value={String(values.comments)}
                  onChange={(e) => set("comments", e.target.value)}
                />
              </Field>
            </StepCard>
          ) : null}
        </main>

        <WizardActions
          step={step}
          lastStep={STEPS.length - 1}
          stepComplete={stepComplete}
          onBack={back}
          onNext={next}
          onSubmit={submit}
          accent={ACCENT}
          submitLabel="Submit proposal"
        />
      </div>
    </AccentProvider>
  );
}
